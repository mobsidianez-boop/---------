/* ====================================================================
 * chat.js ― 「AI進路相談」タブ(Claudeとのチャット・プロフィールカード)
 * ==================================================================== */
  (function(){
    var root = document.getElementById('future-area');
    var LABEL_TO_KEY = {};
    Object.keys(CATS).forEach(function(k){ LABEL_TO_KEY[CATS[k].label] = k; });

    var RULES = 'あなたは「かがわ進路コンパス」というアプリの中で動く、香川県内の高校生のためのAI進路相談員です。あたたかく、信頼できる話し相手として接してください。\n\n' +
      'このアプリが調べた実データを検索できる3つの道具(ツール)を渡します。\n' +
      '・get_faculties: 香川県内の大学・学部の実データ(学部名/特色/定員/関心分野/公式サイトURL)\n' +
      '・get_scholarships: 香川県内の奨学金・移住/就職支援制度の実データ(制度名/説明/公式サイトURL)\n' +
      '・get_industries: 香川県内の産業・キャリア分野の実データ(分野名/説明/企業例/公式サイトURL)\n\n' +
      '厳守すること:\n' +
      '・大学/学部、奨学金/支援制度、香川の仕事/産業について聞かれたら、答える前に必ず対応するツールを呼び出し、返ってきたデータの範囲内だけで答えること。ツールにない大学名・学部名・偏差値・定員・金額・条件を推測やそれらしい創作で答えないこと。\n' +
      '・データに載っていないことを聞かれたら、正直に「アプリのデータには載っていない」と伝え、公式サイトで確認するよう案内すること。\n' +
      '・入試の合格可能性や偏差値を保証するような断定はしないこと。\n' +
      '・特定の進路や大学を押しつけたり、香川に残るよう説得したりしないこと。\n\n' +
      '一方で、進路の話ではなく「どんな暮らしがしたいか」「10年後どうなっていたいか」のような価値観・願望を尋ねるときは、ツールは使わず、一度に質問を1つだけにして、相手の答えを受け止めながら自然に会話を続けること。\n\n' +
      'このとき、キャリアカウンセリングでよく使われる考え方を参考にしてよい(ただし押しつけず、自然な会話の一部として):\n' +
      '・ジョハリの窓の発想: 自己理解を深めたいタイミングで、時々「もし友達や家族があなたのことを説明するとしたら、どんな言葉を使うと思う?」のように、他人から見た自分について尋ね、自分自身の見方とのズレに気づく手助けをする。\n' +
      '・他己分析の発想: 本人がまだ言葉にできていない強みや傾向に気づいたら、決めつけずに「そう聞くと、〇〇なところがありそうだね」くらいの軽い映し返しにとどめる。\n' +
      '・MBTIや性格診断の話題が出た場合: 会話のきっかけとして使うのは構わないが、MBTIは心理学的に正式な信頼性が確認されておらず(同じ人でも受けるたびに結果が変わりやすいと指摘されている簡易的な自己申告テストであり、性格を断定するものではない)と正直に伝えたうえで、話を本人自身の経験や気持ちに戻すこと。\n\n' +
      '話し方: 日本語で、2〜5文程度の短さ。説教くさくしないこと。\n' +
      '最初のメッセージでは、短い挨拶と、「大学のこと・奨学金のこと・香川での仕事のこと・10年後の自分のこと、何でも聞いてください」という案内だけを送ること。';

    var sampleFn = null;
    var downloadsFn = null;
    var turns = [];
    var userTurnCount = 0;
    var busy = false;
    var CARD_THRESHOLD = 3;
    var CHAT_STORAGE_KEY = 'kagawa-compass-chat-v1';

    function saveChatState(){
      try{
        localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ turns: turns, userTurnCount: userTurnCount }));
      }catch(e){ /* localStorageが使えない環境では何もしない */ }
    }

    function loadChatState(){
      try{
        var raw = localStorage.getItem(CHAT_STORAGE_KEY);
        if(!raw) return null;
        var saved = JSON.parse(raw);
        if(!saved || !Array.isArray(saved.turns) || saved.turns.length < 2) return null;
        return saved;
      }catch(e){ return null; }
    }

    function clearChatState(){
      try{ localStorage.removeItem(CHAT_STORAGE_KEY); }catch(e){ /* no-op */ }
    }

    var TOOLS = [
      {
        name: 'get_faculties',
        description: '香川県内の大学・学部の実データ一覧(学部名、特色、定員、関心分野タグ、公式サイトURL)を返す。大学・学部・進学先について聞かれたら必ず呼び出すこと。',
        execute: function(){ return FACULTIES; }
      },
      {
        name: 'get_scholarships',
        description: '香川県内で使える奨学金・移住/就職支援制度の実データ一覧(制度名、説明、公式サイトURL)を返す。奨学金やお金の支援について聞かれたら必ず呼び出すこと。',
        execute: function(){ return SUPPORT; }
      },
      {
        name: 'get_industries',
        description: '香川県内の産業・キャリア分野の実データ一覧(分野名、説明、企業例、公式サイトURL)を返す。香川での仕事や業界について聞かれたら必ず呼び出すこと。',
        execute: function(){ return INDUSTRIES; }
      }
    ];

    function leadTurn(){
      var extra = '';
      if(window.APP_STATE && window.APP_STATE.topCats && window.APP_STATE.topCats.length){
        extra = '\n\n参考情報(生徒には見せていない診断結果なので直接言及はしない): この生徒は「'+window.APP_STATE.topCats.join('・')+'」に関心が高い傾向がありました。会話が自然に触れたときだけ軽く踏まえてよい。';
      }
      return {role:'user', content: RULES + extra + '\n\nでは、最初の挨拶と案内だけを送ってください。'};
    }

    function escapeHtml(s){
      return String(s).replace(/[&<>"']/g, function(c){
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
      });
    }

    function renderIntro(){
      var saved = loadChatState();
      var buttonsHtml = saved
        ? '<button class="btn primary" id="fs-start" disabled>続きから話す ✨</button><button class="btn ghost" id="fs-restart" disabled>新しく話す</button>'
        : '<button class="btn primary" id="fs-start" disabled>AIに相談を始める ✨</button>';
      var noteText = saved
        ? 'AI(Claude)に、大学・学部のこと、奨学金や支援制度のこと、香川での仕事のことを何でも聞けます。大学名や制度名はこのアプリが調べた実データの中から答えます。前回の会話がこの端末に保存されているので、続きから話せます。他の人と共有する端末では「新しく話す」でリセットしてください。'
        : 'AI(Claude)に、大学・学部のこと、奨学金や支援制度のこと、香川での仕事のことを何でも聞けます。大学名や制度名はこのアプリが調べた実データの中から答えます。気が向いたら、「10年後の理想の自分」をチケット風のプロフィールカードにすることもできます。会話はこの端末のブラウザ内だけに保存され、次にこのページを開いたときも続きから話せます(共有の端末で使う場合は、会話画面の「会話をリセット」でいつでも消せます)。';
      root.innerHTML =
        '<div class="chatwrap">' +
        '<div class="fallbacknote">' + noteText + '</div>' +
        '<div class="chat-actions" id="fs-introbar"><span class="progresshint" id="fs-status">読み込んでいます…</span>' + buttonsHtml + '</div>' +
        '<div id="fs-body"></div>' +
        '</div>';
    }

    function setStatus(msg){
      var el = document.getElementById('fs-status');
      if(el) el.textContent = msg;
    }

    function showUnavailable(){
      var introBar = document.getElementById('fs-introbar');
      if(introBar) introBar.remove();
      var body = document.getElementById('fs-body');
      if(body) body.innerHTML = '<p class="chaterror" style="margin-top:14px;">この表示環境では、AIチャット機能をご利用いただけません。claude.ai上でこのページを開いている場合にご利用いただけます。ほかの4つの機能(診断・キャリア・先輩の声・支援制度)は引き続きお使いいただけます。</p>';
    }

    function initChatUI(){
      var body = document.getElementById('fs-body');
      body.innerHTML =
        '<div class="chatlog" id="fs-log" aria-live="polite"></div>' +
        '<form class="chatform" id="fs-form">' +
          '<textarea id="fs-input" rows="2" placeholder="大学のこと、奨学金のこと、香川の仕事のこと…" disabled></textarea>' +
          '<button class="btn primary" type="submit" id="fs-send" disabled>送信</button>' +
        '</form>' +
        '<div class="chat-actions">' +
          '<span class="progresshint" id="fs-hint">AIが最初のメッセージを考えています…</span>' +
          '<button class="btn ghost" id="fs-card-btn" style="display:none;">✨ プロフィールカードを作る</button>' +
        '</div>' +
        '<div id="fs-error"></div>' +
        '<div id="fs-card-area"></div>' +
        '<div style="margin-top:10px;"><button class="linklike" type="button" id="fs-reset">会話をリセットして最初から話す</button></div>';
      document.getElementById('fs-form').addEventListener('submit', function(ev){
        ev.preventDefault();
        submitUserMessage();
      });
      document.getElementById('fs-card-btn').addEventListener('click', generateCard);
      document.getElementById('fs-reset').addEventListener('click', function(){
        if(busy) return;
        clearChatState();
        start();
      });
    }

    function appendBubble(role, text){
      var log = document.getElementById('fs-log');
      var b = document.createElement('div');
      b.className = 'bubble ' + role;
      b.textContent = text;
      log.appendChild(b);
      log.scrollTop = log.scrollHeight;
      return b;
    }

    function setFormDisabled(disabled){
      var input = document.getElementById('fs-input');
      var send = document.getElementById('fs-send');
      if(input){ input.disabled = disabled; }
      if(send){ send.disabled = disabled; }
    }

    function updateHint(){
      var hint = document.getElementById('fs-hint');
      var cardBtn = document.getElementById('fs-card-btn');
      if(!hint) return;
      if(userTurnCount >= CARD_THRESHOLD){
        hint.textContent = '気が向いたら、10年後のプロフィールカードも作れます。会話はまだ続けられます。';
        if(cardBtn) cardBtn.style.display = 'inline-flex';
      } else {
        hint.textContent = '大学・奨学金・香川の仕事のことを、何でも聞いてみてください。';
      }
    }

    function errMessage(code){
      var map = {
        not_granted: 'この端末ではAIとの会話が許可されていません。',
        rate_limited: '少し利用が集中しています。しばらく待ってからもう一度お試しください。',
        session_expired: 'セッションの期限が切れたようです。ページを再読み込みしてください。',
        refused: 'この内容には返答できませんでした。別の言い方で試してみてください。',
        empty_completion: 'うまく返答が作れませんでした。もう一度お試しください。',
        invalid_json: 'カードの形式にうまくまとめられませんでした。もう一度お試しください。',
        prompt_too_large: '会話が長くなりすぎました。そのままプロフィールカードの作成をお試しください。',
        cancelled: ''
      };
      return map[code] || '通信中に問題が発生しました。少し時間をおいてもう一度お試しください。';
    }

    var PERMANENT_CODES = {not_granted:1, sampling_disabled:1, not_declared:1, capability_disabled:1, capability_removed:1};

    function showChatError(e){
      var box = document.getElementById('fs-error');
      if(!box) return;
      if(PERMANENT_CODES[e.code]){
        showUnavailable();
        return;
      }
      var msg = errMessage(e.code);
      box.innerHTML = msg ? '<p class="chaterror">' + escapeHtml(msg) + '</p>' : '';
    }

    async function requestReply(){
      busy = true;
      setFormDisabled(true);
      var bubble = appendBubble('assistant', '考え中…');
      bubble.classList.add('pending');
      document.getElementById('fs-error').innerHTML = '';
      var hint = document.getElementById('fs-hint');
      if(hint) hint.textContent = '考え中です。大学や制度のデータを調べているときは30秒ほどかかることがあります…';
      try{
        var res = await sampleFn(turns.slice(), {
          modelTier: 'default',
          cache: false,
          tools: TOOLS,
          onText: function(u){ bubble.classList.remove('pending'); bubble.textContent = u.text; document.getElementById('fs-log').scrollTop = 999999; }
        });
        bubble.classList.remove('pending');
        bubble.textContent = res.text;
        turns.push({role:'assistant', content: res.text});
        setStatus('');
        saveChatState();
      }catch(e){
        bubble.remove();
        showChatError(e);
      }
      updateHint();
      busy = false;
      setFormDisabled(false);
      var input = document.getElementById('fs-input');
      if(input) input.focus();
    }

    function submitUserMessage(){
      if(busy) return;
      var input = document.getElementById('fs-input');
      var text = input.value.trim();
      if(!text) return;
      turns.push({role:'user', content: text});
      appendBubble('user', text);
      input.value = '';
      userTurnCount++;
      updateHint();
      saveChatState();
      requestReply();
    }

    function transcriptText(){
      return turns.slice(1).map(function(t){
        return (t.role === 'user' ? '生徒: ' : 'メンター: ') + t.content;
      }).join('\n');
    }

    function matchedFacultiesFor(label){
      var key = LABEL_TO_KEY[label];
      if(!key) return [];
      return FACULTIES.filter(function(f){ return f.cats.indexOf(key) !== -1; }).slice(0,2);
    }

    function renderCard(data){
      var area = document.getElementById('fs-card-area');
      var matches = matchedFacultiesFor(data.matched_field);
      var html = '<div class="ticket">' +
        '<div class="tband"><b>🎫 みらい行き 搭乗券</b><span>KAGAWA COMPASS ・ 10 YEARS LATER</span></div>' +
        '<div class="catch">「' + escapeHtml(data.catchphrase || '') + '」</div>' +
        '<div class="tbody">' +
          field('PASSENGER', data.nickname) +
          field('OCCUPATION', data.job) +
          field('LOCATION', data.place) +
          field('VALUES', data.values) +
          fieldFull('A DAY IN THE LIFE', data.dailylife) +
        '</div>' +
        '<div class="stub">今のあなたへ: ' + escapeHtml(data.message || '') + '</div>' +
        '</div>';
      if(matches.length){
        html += '<p class="disclaimer" style="margin-top:14px;">関心の傾向が近い学部の例: ' +
          matches.map(function(f){ return escapeHtml(f.uni + ' ' + f.name); }).join(' / ') + '</p>';
      }
      html += '<p class="disclaimer">このカードはAIとの会話をもとに作成した創作的なイメージです。将来を予測・保証するものではありません。</p>';
      html += '<div class="cardactions">' +
        '<button class="btn ghost" id="fs-regen">もう一度作る</button>' +
        (downloadsFn ? '<button class="btn ghost" id="fs-save">テキストで保存する</button>' : '') +
        '<button class="btn primary" id="fs-godiag">大学マッチング診断を見る →</button>' +
        '</div>';
      area.innerHTML = html;
      document.getElementById('fs-regen').addEventListener('click', generateCard);
      document.getElementById('fs-godiag').addEventListener('click', function(){ goTab('diag'); });
      if(downloadsFn){
        document.getElementById('fs-save').addEventListener('click', function(){ saveCardAsText(data); });
      }
      function field(k,v){ return '<div class="field"><span class="k">'+k+'</span><span class="v">'+escapeHtml(v||'―')+'</span></div>'; }
      function fieldFull(k,v){ return '<div class="field full"><span class="k">'+k+'</span><span class="v">'+escapeHtml(v||'―')+'</span></div>'; }
    }

    async function saveCardAsText(data){
      if(!downloadsFn) return;
      var text = 'かがわ進路コンパス ― 10年後のあなた\n\n' +
        'キャッチコピー: ' + (data.catchphrase||'') + '\n' +
        '呼び名: ' + (data.nickname||'') + '\n' +
        '仕事: ' + (data.job||'') + '\n' +
        '暮らす場所: ' + (data.place||'') + '\n' +
        '大切にしていること: ' + (data.values||'') + '\n' +
        'ある1日: ' + (data.dailylife||'') + '\n' +
        '今の自分へのメッセージ: ' + (data.message||'') + '\n\n' +
        '※AIとの会話をもとに作成した創作的なイメージです。';
      try{
        await downloadsFn.save({filename:'mirai-profile.txt', data:text});
      }catch(e){ /* declined or unavailable: no-op */ }
    }

    async function generateCard(){
      var cardBtn = document.getElementById('fs-card-btn');
      var regenBtn = document.getElementById('fs-regen');
      [cardBtn, regenBtn].forEach(function(b){ if(b){ b.disabled = true; b.textContent = '作成中…'; } });
      document.getElementById('fs-error').innerHTML = '';
      var catList = Object.keys(CATS).map(function(k){ return CATS[k].label; }).join('、');
      var prompt = '以下は、香川県の高校生とキャリアメンターAIとの会話です。この会話から、生徒が思い描く「10年後の理想の自分」を1つのプロフィールとして日本語でまとめてください。会話にない事実を大げさに断定せず、自然に想像できる範囲でまとめてください。\n\n' +
        '--- 会話 ---\n' + transcriptText() + '\n--- 会話ここまで ---\n\n' +
        '次のJSON形式のオブジェクトのみを返してください(他の文章は不要):\n' +
        '{"nickname": "本名は使わない短い呼び名、例:海風さん", "catchphrase": "10年後の理想の自分を表す15字前後のキャッチコピー", "job": "10年後の仕事・肩書きのイメージ", "place": "暮らしている場所のイメージ", "dailylife": "ある1日の過ごし方を1〜2文で", "values": "大切にしていることを短いフレーズで", "message": "今の自分への一言メッセージ(1文)", "matched_field": "次のリストから会話に最も近いものを1つだけ選ぶ: ' + catList + '"}';
      try{
        var data = await sampleFn.json(prompt, {modelTier:'default', cache:false});
        renderCard(data || {});
      }catch(e){
        showChatError(e);
      }
      [cardBtn, regenBtn].forEach(function(b){ if(b){ b.disabled = false; b.textContent = (b===cardBtn ? '✨ プロフィールカードを作る' : 'もう一度作る'); } });
    }

    async function start(){
      var introBar = document.getElementById('fs-introbar');
      if(introBar) introBar.remove();
      initChatUI();
      turns = [leadTurn()];
      userTurnCount = 0;
      await requestReply();
    }

    function resume(saved){
      var introBar = document.getElementById('fs-introbar');
      if(introBar) introBar.remove();
      initChatUI();
      turns = saved.turns;
      userTurnCount = saved.userTurnCount || 0;
      for(var i=1;i<turns.length;i++){
        appendBubble(turns[i].role, turns[i].content);
      }
      updateHint();
      setFormDisabled(false);
      var input = document.getElementById('fs-input');
      if(input) input.focus();
    }

    async function init(){
      renderIntro();
      try{
        if(window.claude && window.claude.use){
          sampleFn = await window.claude.use('sample');
        }
      }catch(e){ sampleFn = null; }
      try{
        if(window.claude && window.claude.use){
          downloadsFn = await window.claude.use('downloads');
        }
      }catch(e){ downloadsFn = null; }

      if(!sampleFn){
        showUnavailable();
        return;
      }
      setStatus('');
      var saved = loadChatState();
      var startBtn = document.getElementById('fs-start');
      var restartBtn = document.getElementById('fs-restart');
      if(startBtn){
        startBtn.disabled = false;
        startBtn.addEventListener('click', function(){
          if(saved){ resume(saved); } else { start(); }
        });
      }
      if(restartBtn){
        restartBtn.disabled = false;
        restartBtn.addEventListener('click', function(){
          clearChatState();
          start();
        });
      }
    }

    init();
  })();
