/* ====================================================================
 * quiz.js ― 大学マッチング診断のロジック(質問・採点・結果表示・保存)
 * ==================================================================== */
(function(){
  var QUIZ_STORAGE_KEY = 'kagawa-compass-quiz-v1';
  var qIndex = 0;
  var scores = {}; Object.keys(CATS).forEach(function(k){ scores[k]=0; });
  var reasonPicked = null;
  var answered = [];

  function saveQuizState(){
    try{
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify({
        qIndex: qIndex, scores: scores, reasonPicked: reasonPicked, answered: answered
      }));
    }catch(e){ /* localStorageが使えない環境では何もしない */ }
  }

  function loadQuizState(){
    try{
      var raw = localStorage.getItem(QUIZ_STORAGE_KEY);
      if(!raw) return false;
      var saved = JSON.parse(raw);
      if(typeof saved.qIndex !== 'number' || !saved.scores) return false;
      qIndex = saved.qIndex;
      Object.keys(scores).forEach(function(k){ scores[k] = saved.scores[k] || 0; });
      reasonPicked = saved.reasonPicked || null;
      answered = saved.answered || [];
      return true;
    }catch(e){ return false; }
  }

  function clearQuizState(){
    try{ localStorage.removeItem(QUIZ_STORAGE_KEY); }catch(e){ /* no-op */ }
  }

  function renderRoute(){
    var pct = Math.round((qIndex / QUESTIONS.length) * 100);
    return '<div class="quiz-progress"><div class="route"><div class="fill" style="width:'+pct+'%"></div><div class="boat" style="left:'+pct+'%">⛴️</div></div>' +
      '<div class="label"><span>Q'+Math.min(qIndex+1, QUESTIONS.length)+' / '+QUESTIONS.length+'</span><span>本州行きフェリー ⇄ 香川</span></div></div>';
  }

  function renderQuestion(){
    var qa = document.getElementById('quiz-area');
    if(qIndex >= QUESTIONS.length){ renderResults(); return; }
    var q = QUESTIONS[qIndex];
    var html = renderRoute();
    html += '<div class="qcard"><span class="qtag">'+(q.reason ? 'はじめに' : 'Question '+qIndex)+'</span><h3>'+q.q+'</h3>';
    html += '<div class="options">';
    var letters = ['A','B','C','D'];
    q.opts.forEach(function(o,i){
      html += '<button class="opt" data-i="'+i+'"><span class="letter">'+letters[i]+'</span><span>'+o.t+'</span></button>';
    });
    html += '</div>';
    html += '<div class="quiznav">' + (qIndex>0 ? '<button class="linklike" id="qback">← 前の質問に戻る</button>' : '<span></span>') + '</div>';
    html += '</div>';
    qa.innerHTML = html;
    qa.querySelectorAll('.opt').forEach(function(btn){
      btn.addEventListener('click', function(){
        var i = parseInt(btn.dataset.i, 10);
        var opt = q.opts[i];
        answered[qIndex] = i;
        if(q.reason){ reasonPicked = opt.r; }
        else { (opt.c||[]).forEach(function(c){ scores[c] = (scores[c]||0) + 1; }); }
        qIndex++;
        saveQuizState();
        renderQuestion();
      });
    });
    var back = document.getElementById('qback');
    if(back){ back.addEventListener('click', function(){
      qIndex--;
      var prevQ = QUESTIONS[qIndex];
      var prevAns = answered[qIndex];
      if(prevAns != null){
        if(prevQ.reason){ reasonPicked = null; }
        else { (prevQ.opts[prevAns].c||[]).forEach(function(c){ scores[c] = Math.max(0,(scores[c]||0) - 1); }); }
      }
      saveQuizState();
      renderQuestion();
    }); }
  }

  function renderResults(){
    var qa = document.getElementById('quiz-area');
    var topCats = Object.keys(scores).sort(function(a,b){ return scores[b]-scores[a]; }).filter(function(k){ return scores[k]>0; }).slice(0,4);
    window.APP_STATE = window.APP_STATE || {};
    window.APP_STATE.topCats = topCats.map(function(c){ return CATS[c] ? CATS[c].label : c; });
    window.APP_STATE.reasonPicked = reasonPicked;

    var ranked = FACULTIES.map(function(f){
      var s = f.cats.reduce(function(sum,c){ return sum + (scores[c]||0); }, 0);
      return {f:f, score:s};
    }).sort(function(a,b){ return b.score - a.score; });

    var maxScore = ranked[0] ? ranked[0].score : 1;
    if(maxScore <= 0) maxScore = 1;
    var top5 = ranked.slice(0,5);

    var printDate = new Date();
    var printDateStr = printDate.getFullYear()+'年'+(printDate.getMonth()+1)+'月'+printDate.getDate()+'日';

    var html = '<div class="results">';
    html += '<div class="print-header">' +
      '<div class="pf-title">かがわ進路コンパス ― 大学マッチング診断結果</div>' +
      '<div class="pf-fields">' +
        '<span>氏名: ______________________</span>' +
        '<span>学年・組: ______________</span>' +
        '<span>相談日: ______________</span>' +
      '</div>' +
      '<div class="pf-note">印刷日: ' + printDateStr + '。この診断は関心・興味の傾向に基づく参考情報です。定員・入試情報は各大学公式サイトで必ず最新情報をご確認ください。</div>' +
    '</div>';
    html += '<span class="eyebrow">診断結果</span><h3 style="margin-top:8px;font-family:\'Shippori Mincho\',serif;font-size:1.4rem;">あなたの興味の傾向</h3>';
    html += '<div class="tagchips">' + (topCats.length ? topCats.map(function(c){ return '<span class="chip">'+CATS[c].label+'</span>'; }).join('') : '<span class="chip">傾向がはっきり出ませんでした</span>') + '</div>';

    if(reasonPicked && REASON_MSG[reasonPicked]){
      html += '<div class="reasonbox"><p>'+REASON_MSG[reasonPicked]+'</p></div>';
    }

    html += '<h3 style="margin-top:26px;font-family:\'Shippori Mincho\',serif;font-size:1.2rem;">関心マッチ度が高い学部・学科</h3>';
    html += '<div class="matchlist">';
    top5.forEach(function(item){
      var pct = Math.max(8, Math.round((item.score / maxScore) * 100));
      html += '<div class="matchcard"><div class="top"><div><div class="uni">'+item.f.uni+'</div><h4>'+item.f.name+'</h4></div><div class="pct">'+pct+'%</div></div>';
      html += '<div class="barbg"><i style="width:'+pct+'%"></i></div>';
      html += '<p class="desc">'+item.f.desc+'</p>';
      html += '<div class="foot"><span class="cap">'+item.f.cap+'</span><a class="gosite" href="'+item.f.url+'" target="_blank" rel="noopener">公式サイトを見る →</a></div>';
      html += '</div>';
    });
    html += '</div>';
    html += '<p class="disclaimer">この診断は関心・興味の傾向をもとにした参考情報であり、入試の合格可能性や難易度を示すものではありません。学部名・定員・入試制度は変更されることがあるため、必ず各大学の公式サイトで最新情報をご確認ください。</p>';
    html += '<div class="quiznav noprint" style="margin-top:18px; flex-wrap:wrap; gap:10px;"><button class="btn ghost" onclick="restartQuiz()">もう一度診断する</button><button class="btn ghost" onclick="jumpToSchedule()">📅 出願・奨学金のスケジュールを見る</button><button class="btn ghost" onclick="window.print()">🖨 この結果を印刷する</button><button class="btn primary" onclick="goTab(\'career\')">香川のキャリアを見る →</button></div>';
    html += '</div>';
    qa.innerHTML = html;
  }

  window.restartQuiz = function(){
    qIndex = 0; answered = []; reasonPicked = null;
    Object.keys(scores).forEach(function(k){ scores[k]=0; });
    clearQuizState();
    renderQuestion();
  };

  loadQuizState();
  renderQuestion();
})();
