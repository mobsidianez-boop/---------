(function(){

  /* ---------------- data ---------------- */
  var CATS = {
    law:{label:'法律・公務員'}, econbiz:{label:'経済・経営・ビジネス'}, tourism:{label:'観光・地域・グローバル'},
    medical:{label:'医療・看護・臨床検査'}, psych:{label:'心理・カウンセリング'}, edu:{label:'教育・保育'},
    specialsupport:{label:'特別支援・福祉'}, welfarechild:{label:'子ども福祉'}, engineering:{label:'工学・ものづくり'},
    itai:{label:'情報・AI'}, design:{label:'デザイン・表現'}, architecture:{label:'建築・防災・まちづくり'},
    agri:{label:'農学・食品科学'}, lang:{label:'語学・歴史・国際'}, media:{label:'社会学・メディア'}, sports:{label:'スポーツ・健康'}
  };

  var FACULTIES = [
    {uni:'香川大学(国立)', name:'法学部', cats:['law'], desc:'司法書士インターンシップや公務員・自治体職員との交流など、法律を社会で活かす学びが充実。', cap:'入学定員: 160人(昼間コース150名+夜間主コース10名)', url:'https://www.kagawa-u.ac.jp/kagawa-u_jl/'},
    {uni:'香川大学(国立)', name:'経済学部(5コース)', cats:['econbiz','tourism'], desc:'経済・政策分析/会計・ファイナンス/経営・イノベーション/観光・地域振興/グローバル社会経済の5コースから選べる実学重視の学部。', cap:'入学定員: 250人(昼間コース240名+夜間主コース10名)', url:'https://www.ec.kagawa-u.ac.jp/'},
    {uni:'香川大学(国立)', name:'医学部(医学科・看護学科・臨床心理学科)', cats:['medical','psych'], desc:'医師・看護師・公認心理師を目指せる。国際交流や2026年開設予定の臨床心理学大学院も。', cap:'入学定員: 175人(医学科95名+看護学科60名+臨床心理学科20名)', url:'https://www.med.kagawa-u.ac.jp/'},
    {uni:'香川大学(国立)', name:'教育学部', cats:['edu','specialsupport'], desc:'幼児教育から小学校・中学校・特別支援教育まで、教職大学院と連携した実践的な教員養成。', cap:'入学定員: 160人', url:'https://www.ed.kagawa-u.ac.jp/'},
    {uni:'香川大学(国立)', name:'創造工学部(7コース)', cats:['engineering','itai','design','architecture'], desc:'造形・メディアデザイン/建築・都市環境/防災/情報・AI/機械/材料まで7コース。ものづくりと情報技術を横断的に学べる。', cap:'入学定員: 330人(7コース合計)', url:'https://www.kagawa-u.ac.jp/kagawa-u_ead/'},
    {uni:'香川大学(国立)', name:'農学部', cats:['agri'], desc:'希少糖研究や附属農場・庵治マリンステーションなど、食と生命科学を実地で学ぶ。', cap:'入学定員: 150人', url:'https://www.ag.kagawa-u.ac.jp/'},
    {uni:'四国学院大学(私立・善通寺市)', name:'現代教養学部', cats:['lang','sports','design'], desc:'19メジャー制で語学・歴史・哲学・平和学・スポーツ・舞台芸術などを自由に組み合わせて学べる。', cap:'定員: 80名(2027年度)', url:'https://www.sg-u.ac.jp/academics/majors/'},
    {uni:'四国学院大学(私立・善通寺市)', name:'社会福祉学部', cats:['specialsupport','psych','welfarechild'], desc:'福祉・心理・カウンセリング・子ども福祉・スクールソーシャルワークを学び、支援の専門家を目指す。', cap:'定員: 60名(2027年度)', url:'https://www.sg-u.ac.jp/academics/majors/'},
    {uni:'四国学院大学(私立・善通寺市)', name:'社会学部', cats:['media','tourism','econbiz'], desc:'社会学、メディア&サブカルチャー研究、観光学、国際文化マネジメントなど社会を読み解く視点を養う。', cap:'定員: 60名(2027年度)', url:'https://www.sg-u.ac.jp/academics/majors/'},
    {uni:'高松大学(私立)', name:'経営学部', cats:['econbiz','tourism','sports'], desc:'企業経営・経営情報・会計・スポーツマネジメント・グローバルビジネスの5トラック。インターンシップと資格取得を重視。', cap:'定員: 105名(2027年度)', url:'https://www.takamatsu-u.ac.jp/univ-jrcol/business/'},
    {uni:'高松大学(私立)', name:'発達科学部 子ども発達学科', cats:['edu','welfarechild','specialsupport'], desc:'児童教育・幼児教育・特別支援教育・子どもビジネスの4専攻。教員免許や保育士資格の取得が可能。', cap:'定員: 70名(2027年度)', url:'https://www.takamatsu-u.ac.jp/univ-jrcol/growth/'},
    {uni:'高松短期大学(私立)', name:'保育学科', cats:['edu','welfarechild'], desc:'子どもと共に学ぶ実践重視の保育者養成。', cap:'定員: 40名(2027年度)', url:'https://www.takamatsu-u.ac.jp/univ-jrcol/nursery/'},
    {uni:'高松短期大学(私立)', name:'ビジネスデザイン学科', cats:['econbiz','design','itai'], desc:'ビジネス実務とデザイン・情報スキルを2年間で身につける。', cap:'定員: 30名(2027年度)', url:'https://www.takamatsu-u.ac.jp/univ-jrcol/business-design/'},
    {uni:'香川県立保健医療大学(公立)', name:'看護学科', cats:['medical'], desc:'基礎看護学から地域生活支援まで学び、次代のチーム医療を担う看護師を養成。', cap:'定員: 70名(推薦35・一般前期30・一般後期5)', url:'https://www.kagawa-puhs.ac.jp/department/'},
    {uni:'香川県立保健医療大学(公立)', name:'臨床検査学科', cats:['medical','itai'], desc:'先端医療技術学や医療経済学など、検査のスペシャリストを育成。', cap:'定員: 20名(推薦10・一般前期8)', url:'https://www.kagawa-puhs.ac.jp/department/'}
  ];

  var INDUSTRIES = [
    {ico:'🏗️', name:'建設機械・ものづくり', desc:'クレーンなど大型建設機械で世界的に知られるメーカーが本社を置く。', co:'例: タダノ(高松市)', cats:['engineering'], url:'https://ja.wikipedia.org/wiki/タダノ'},
    {ico:'⚡', name:'電力・インフラ', desc:'四国の暮らしを支える電力会社が本社を置く、地域の基幹インフラ産業。', co:'例: 四国電力(高松市)', cats:['engineering','econbiz'], url:'https://ja.wikipedia.org/wiki/四国電力'},
    {ico:'🏦', name:'金融', desc:'県内企業のメインバンクシェア約45%を占める地方銀行など、地域経済を支える。', co:'例: 百十四銀行(高松市)', cats:['econbiz','law'], url:'https://ja.wikipedia.org/wiki/百十四銀行'},
    {ico:'💻', name:'情報通信・IT', desc:'通信インフラやITサービスを提供する企業が拠点を置く。県内でエンジニア職に就く道もある。', co:'例: STNet株式会社(高松市)', cats:['itai'], url:'https://ja.wikipedia.org/wiki/STNet'},
    {ico:'🏭', name:'重化学工業(坂出)', desc:'瀬戸内工業地域の一角、番の州臨海工業団地に石油・化学関連企業が集積。', co:'坂出市 番の州臨海工業団地一帯', cats:['engineering','agri'], url:'https://ja.wikipedia.org/wiki/番の州臨海工業団地'},
    {ico:'🧤', name:'手袋製造(東かがわ)', desc:'国内生産シェア約90%を占める、全国的にも珍しい産地。', co:'例: 中虎(東かがわ市)', cats:['design','econbiz'], url:'https://ja.wikipedia.org/wiki/東かがわ市'},
    {ico:'🪭', name:'うちわ(丸亀)', desc:'金刀比羅宮参拝土産に由来する丸亀市の地場産業・伝統工芸。', co:'丸亀市のうちわ生産者', cats:['design'], url:'https://ja.wikipedia.org/wiki/丸亀市'},
    {ico:'🫙', name:'醤油・食品(小豆島)', desc:'「醤の郷」と呼ばれる近代醤油蔵の日本最大級の集積地。オリーブ栽培も盛ん。', co:'例: マルキン醤油(小豆島)', cats:['agri'], url:'https://ja.wikipedia.org/wiki/小豆島町'},
    {ico:'🌾', name:'農業・水産業', desc:'稲作や野菜栽培に加え、ハマチ養殖発祥の地ともされる水産業がある。', co:'県内の農業・漁業事業者', cats:['agri'], url:'https://ja.wikipedia.org/wiki/香川県'},
    {ico:'🏥', name:'医療・福祉', desc:'県内各地の病院・福祉施設に加え、医療人材確保のための修学資金貸付制度もある。', co:'県内医療機関・福祉施設', cats:['medical','specialsupport','welfarechild'], url:'https://www.pref.kagawa.lg.jp/imu/iryoujinzai/index.html'},
    {ico:'🏛️', name:'公務員・地域行政', desc:'高松市は国の出先機関や大企業四国支社が集まる「支店経済都市」。自治体・公的機関の仕事も多い。', co:'県庁・市町村・JR四国 ほか', cats:['law','tourism'], url:'https://ja.wikipedia.org/wiki/高松市'}
  ];

  var VOICES = [
    {name:'Aさん', where:'香川大学 経済学部(モデルケース)', text:'得意科目がはっきりせず自信が持てなかったけれど、観光・地域振興コースで地元企業のインターンに参加して、香川でもやれることの幅広さを実感しました。'},
    {name:'Bさん', where:'香川県立保健医療大学 看護学科(モデルケース)', text:'看護師を目指して県外の大学ばかり調べていましたが、県内でも実習先が充実していると知り、地元で目指すことに決めました。'},
    {name:'Cさん', where:'四国学院大学 社会学部(モデルケース)', text:'「田舎だから発信の仕事はできない」と思っていましたが、メディア・観光学のゼミで地域の魅力を発信する企画に関わり、考えが変わりました。'},
    {name:'Dさん', where:'高松大学 発達科学部(モデルケース)', text:'保育士を目指し、地元の保育園でずっと実習を続けられたことが、香川に残る決め手になりました。'}
  ];

  var SUPPORT = [
    {badge:'就職支援', cls:'', name:'ワクサポかがわ', desc:'香川県が運営する就職・転職・インターンシップ支援サイト。求人検索、県外学生向け交通費補助、奨学金返還支援制度の窓口も。', url:'https://www.wskagawa.jp/'},
    {badge:'移住支援', cls:'olive', name:'かがわ暮らし', desc:'香川県の移住・定住総合ポータルサイト。「お試し」かがわ暮らしや移住体験談などを掲載。', url:'https://www.kagawalife.jp/'},
    {badge:'奨学金', cls:'terra', name:'香川県奨学金返還支援制度', desc:'県内登録企業に就職した場合、日本学生支援機構奨学金は企業が一部負担、香川県大学生等奨学金は県が免除+企業が上乗せ支援(制度の詳細・年度条件は要確認)。', url:'https://www.wskagawa.jp/'},
    {badge:'奨学金', cls:'terra', name:'香川県大学生等奨学金', desc:'経済的な理由で大学等への進学が困難な、意欲・能力の高い学生向けの県独自の奨学金制度。金額・条件は年度により異なるため要確認。', url:'https://www.pref.kagawa.lg.jp/chiiki/daigakurennkei/daigaku.html'},
    {badge:'移住支援', cls:'olive', name:'移住支援金制度', desc:'東京23区在住・通勤者が香川県へ移住し要件を満たす場合に支給(世帯・単身で金額が異なる)。将来Uターンする際にも参考になる制度。', url:'https://www.pref.kagawa.lg.jp/chiiki/iju/izyusienkin.html'},
    {badge:'就職支援', cls:'', name:'地方就職支援金制度', desc:'東京圏の大学等に在学し、卒業後1年以内に香川県内企業へ就職する学生向けの交通費・移住費用支援(対象市町村や条件あり)。', url:'https://www.pref.kagawa.lg.jp/chiiki/iju/chihoushuushokusienkin.html'},
    {badge:'医療人材', cls:'', name:'香川県医学生修学資金貸付制度', desc:'医療人材の地域定着を目的とした修学資金貸付制度。金額・義務年限などの詳細は要確認。', url:'https://www.pref.kagawa.lg.jp/imu/iryoujinzai/index.html'}
  ];

  /* 2027年度(令和9年度)入学者選抜・奨学金・オープンキャンパスの日程まとめ。
     date/end はソート・経過判定用(YYYY-MM-DD)。実際の告知文言は when に入れる。
     出典: 香川大学「2027年度入学者選抜要項」(出願期間・選抜期日・合格者発表の一覧表)。
     表の記載から確実に読み取れる日付のみを載せ、区分と学部の対応が資料の中で曖昧・
     矛盾していた箇所(例: 前期日程の医学部内での例外扱い)は具体的な日付を書かず、
     「学部により異なる場合がある」という注記にとどめている。 */
  var SCHEDULE = [
    {cat:'admission', badge:'総合型選抜Ⅰ', cls:'olive', title:'総合型選抜Ⅰ 出願期間', date:'2026-09-01', end:'2026-09-08', when:'2026年9月1日(火)〜9月8日(火)', desc:'大学入学共通テストを免除する選抜(教育学部・創造工学部・農学部で実施)。第2次選抜の日程は学部により異なります(教育学部10月17日・創造工学部10月3日・農学部10月17日を予定)。最終合格者発表は11月2日(月)を予定。', url:'https://www.kagawa-u.ac.jp/admission/'},
    {cat:'admission', badge:'学校推薦型選抜Ⅰ', cls:'olive', title:'学校推薦型選抜Ⅰ 出願期間', date:'2026-11-02', end:'2026-11-09', when:'2026年11月2日(月)〜11月9日(月)', desc:'大学入学共通テストを免除する学校推薦型選抜。選抜期日は11月21日(土)を予定(面接等は志願者数により翌日にわたる場合あり)。合格者発表は12月4日(金)を予定。', url:'https://www.kagawa-u.ac.jp/admission/'},
    {cat:'admission', badge:'学校推薦型選抜Ⅱ', cls:'olive', title:'学校推薦型選抜Ⅱ 出願期間', date:'2027-01-18', end:'2027-01-22', when:'2027年1月18日(月)〜1月22日(金)', desc:'大学入学共通テスト(2027年1月16日・17日実施)を課す学校推薦型選抜。個別試験は実施せず、共通テストの得点と書類等で選考。合格者発表は2月10日(水)を予定。', url:'https://www.kagawa-u.ac.jp/admission/'},
    {cat:'admission', badge:'社会人選抜', cls:'olive', title:'社会人選抜(夜間主コース) 出願期間', date:'2026-12-07', end:'2026-12-11', when:'2026年12月7日(月)〜12月11日(金)', desc:'夜間主コースを対象とした社会人選抜。選抜期日は1月23日(土)、合格者発表は2月10日(水)を予定。', url:'https://www.kagawa-u.ac.jp/admission/'},
    {cat:'scholarship', badge:'奨学金', cls:'terra', title:'香川県大学生等奨学金 予約申込', date:'2026-07-06', end:'2026-09-25', when:'2026年7月6日(月)〜9月25日(金)', desc:'経済的な理由で進学が困難な、意欲・能力の高い学生向けの県独自の奨学金。2027年度(令和9年度)入学者向けの予約申込期間です。', url:'https://www.pref.kagawa.lg.jp/chiiki/daigakurennkei/daigaku.html'},
    {cat:'opencampus', badge:'オープンキャンパス', cls:'', title:'香川大学オープンキャンパス2026', date:'2026-08-06', end:'2026-08-07', when:'2026年8月6日(木)医学部看護学科 / 8月7日(金)その他学部', desc:'2026年度分は終了しました。例年6〜7月頃にオンライン申込が始まり、8月上旬に開催される傾向があります。次回の日程は公式サイトでご確認ください。', url:'https://www.kagawa-u.ac.jp/admission/briefing/opencampusinfo/'},
    {cat:'admission', badge:'一般選抜(前期)', cls:'', title:'一般選抜 前期日程 出願期間', date:'2027-01-25', end:'2027-02-03', when:'2027年1月25日(月)〜2月3日(水)', desc:'大学入学共通テストを利用する一般選抜(前期日程)。個別試験は2月25日(木)を予定。合格者発表は3月6日(土)を予定。学部・学科により日程が異なる場合があるため、最新の募集要項でご確認ください。', url:'https://www.kagawa-u.ac.jp/admission/'},
    {cat:'admission', badge:'一般選抜(後期)', cls:'', title:'一般選抜 後期日程 出願期間', date:'2027-01-25', end:'2027-02-03', when:'2027年1月25日(月)〜2月3日(水) ※前期と同時出願', desc:'一般選抜(後期日程)。個別試験は3月12日(金)を予定(農学部は個別試験を実施せず、大学入学共通テストの得点による選抜)。合格者発表は3月22日(月)を予定。学部・学科により後期日程を実施しない場合があります。', url:'https://www.kagawa-u.ac.jp/admission/'}
  ];

  var QUESTIONS = [
    {reason:true, q:'香川県外への進学を考えるとしたら、一番近い理由は?', opts:[
      {t:'成績的に、県外の方が選べる大学の幅がある気がする', r:'grades'},
      {t:'やりたい勉強・仕事が香川では叶わない気がする', r:'notavailable'},
      {t:'なんとなく一度県外に出てみたい', r:'adventure'},
      {t:'特に強い理由はなく、周りがそうしているから', r:'peer'}
    ]},
    {q:'得意科目・好きな科目は?', opts:[
      {t:'国語・歴史・公民', c:['law','lang']},
      {t:'数学・物理', c:['engineering','itai']},
      {t:'生物・化学', c:['medical','agri']},
      {t:'美術・音楽・情報', c:['design','itai']}
    ]},
    {q:'休み時間や放課後、つい時間を使ってしまうのは?', opts:[
      {t:'部活動やスポーツ', c:['sports','econbiz']},
      {t:'動画編集・イラスト・ものづくり', c:['design','engineering']},
      {t:'友達の相談に乗ること', c:['psych','specialsupport']},
      {t:'ニュースやSNSでの情報収集', c:['media','lang']}
    ]},
    {q:'将来、仕事で大事にしたいことは?', opts:[
      {t:'人の役に立っている実感', c:['medical','edu']},
      {t:'安定した暮らし・地元での生活', c:['law','econbiz']},
      {t:'新しいものを生み出す創造性', c:['design','itai']},
      {t:'自然や食にかかわること', c:['agri','tourism']}
    ]},
    {q:'得意なことは?', opts:[
      {t:'人の話をじっくり聞くこと', c:['psych','welfarechild']},
      {t:'計画を立てて物事を進めること', c:['architecture','econbiz']},
      {t:'体を動かすこと・健康管理', c:['sports','medical']},
      {t:'文章や言葉で伝えること', c:['lang','media']}
    ]},
    {q:'興味がある社会テーマは?', opts:[
      {t:'まちづくり・防災', c:['architecture','engineering']},
      {t:'子育て・教育格差', c:['edu','welfarechild']},
      {t:'農業・食料問題', c:['agri','tourism']},
      {t:'国際情勢・観光', c:['lang','tourism']}
    ]},
    {q:'憧れる働き方は?', opts:[
      {t:'病院や福祉施設で人と向き合う', c:['medical','specialsupport']},
      {t:'オフィスでチームと事業を動かす', c:['econbiz','itai']},
      {t:'現場で図面やものと向き合う', c:['engineering','architecture']},
      {t:'学校や保育園で子どもと関わる', c:['edu','welfarechild']}
    ]},
    {q:'大学生活に求めるものは?', opts:[
      {t:'資格や専門スキルをしっかり身につけたい', c:['medical','law']},
      {t:'幅広く学んで進路の選択肢を広げたい', c:['lang','media']},
      {t:'実践的なプロジェクトやインターンをたくさんしたい', c:['econbiz','tourism']},
      {t:'表現やクリエイティブな活動をしたい', c:['design','sports']}
    ]},
    {q:'卒業後、香川で働くイメージが一番わくのは?', opts:[
      {t:'病院・介護福祉施設', c:['medical','specialsupport']},
      {t:'メーカー・建設・IT企業', c:['engineering','itai']},
      {t:'銀行・自治体・地域の会社', c:['law','econbiz']},
      {t:'学校・保育園・地域の子ども支援', c:['edu','welfarechild']}
    ]},
    {q:'香川についてどう思う?', opts:[
      {t:'海や自然、食べ物が好き', c:['agri','tourism']},
      {t:'人とのつながりや地元の安心感が好き', c:['welfarechild','psych']},
      {t:'まだよく知らないので、知りたい', c:['media','lang']},
      {t:'特に思い入れはない', c:[]}
    ]}
  ];

  var REASON_MSG = {
    grades:'成績に自信が持てなくても、県外に出れば選択肢が広がるとは限りません。学部との「興味・関心の相性」は、偏差値だけでは測れない大事な指標です。まずは下の診断結果と、香川県立保健医療大学・高松大学などの実践重視の学びも見てみてください。',
    notavailable:'「香川ではやりたいことができない」と感じている場合は、次の「香川で叶うキャリア」タブも合わせて見てみてください。うどん県のイメージ以上に、ものづくり・IT・デザインなど多様な仕事が県内にあります。',
    adventure:'一度県外に出てみたい気持ちも大切です。ただ、香川にいながらインターンや留学制度、地域プロジェクトを通じて「非日常」に触れる道もあります。診断結果を選択肢の一つとして眺めてみてください。',
    peer:'「周りがそうしているから」で決める前に、自分の興味・得意なことと照らし合わせてみましょう。診断結果が、進路を自分の言葉で考えるきっかけになれば幸いです。'
  };

  /* ---------------- tabs ---------------- */
  var tabButtons = document.querySelectorAll('nav.tabs button');
  window.goTab = function(id, focusTab){
    document.querySelectorAll('section.panel').forEach(function(p){ p.classList.toggle('active', p.id === 'panel-'+id); });
    tabButtons.forEach(function(b){
      var selected = b.dataset.tab === id;
      b.setAttribute('aria-selected', selected ? 'true' : 'false');
      b.tabIndex = selected ? 0 : -1;
      if(selected && focusTab) b.focus();
    });
    window.scrollTo({top: document.querySelector('nav.tabs').offsetTop - 8, behavior:'smooth'});
  };
  tabButtons.forEach(function(b, i){
    b.addEventListener('click', function(){ goTab(b.dataset.tab); });
    b.addEventListener('keydown', function(ev){
      var targetIndex = null;
      if(ev.key === 'ArrowRight') targetIndex = (i + 1) % tabButtons.length;
      else if(ev.key === 'ArrowLeft') targetIndex = (i - 1 + tabButtons.length) % tabButtons.length;
      else if(ev.key === 'Home') targetIndex = 0;
      else if(ev.key === 'End') targetIndex = tabButtons.length - 1;
      if(targetIndex !== null){
        ev.preventDefault();
        goTab(tabButtons[targetIndex].dataset.tab, true);
      }
    });
  });

  /* ---------------- quiz engine ---------------- */
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

  /* ---------------- career grid ---------------- */
  (function(){
    var g = document.getElementById('career-grid');
    g.innerHTML = INDUSTRIES.map(function(ind){
      return '<div class="indcard"><span class="icotop">'+ind.ico+'</span><h4>'+ind.name+'</h4><p>'+ind.desc+'</p><span class="co">'+ind.co+'</span>' +
        '<div class="cats">'+ind.cats.map(function(c){ return '<span>'+(CATS[c]?CATS[c].label:c)+'</span>'; }).join('') + '</div>' +
        '<a class="gosite" style="font-size:.8rem;font-weight:700;" href="'+ind.url+'" target="_blank" rel="noopener">詳しく見る →</a></div>';
    }).join('');
  })();

  /* ---------------- voices ---------------- */
  (function(){
    var g = document.getElementById('voice-grid');
    g.innerHTML = VOICES.map(function(v){
      return '<div class="voice"><div class="who"><span class="avatar">'+v.name.charAt(0)+'</span><div><div class="name">'+v.name+'</div><div class="where">'+v.where+'</div></div></div>' +
        '<blockquote>“'+v.text+'”</blockquote><span class="model-badge">架空のモデルケース</span></div>';
    }).join('');
  })();

  /* ---------------- support list ---------------- */
  (function(){
    var g = document.getElementById('support-list');
    g.innerHTML = SUPPORT.map(function(s){
      return '<div class="supitem"><span class="badge '+s.cls+'">'+s.badge+'</span><div><h4>'+s.name+'</h4><p>'+s.desc+'</p><a href="'+s.url+'" target="_blank" rel="noopener">公式サイトを見る →</a></div></div>';
    }).join('');
  })();

  /* ---------------- schedule (calendar) ----------------
     広い画面(PC等、760px以上)では月間カレンダーを表示し、狭い画面(スマホ)では
     カレンダーグリッドをCSSで非表示にして縦型の月別リストのみを表示する。
     どちらの表示も同じ「表示中の月」の状態を共有し、‹ › で月を移動する。 */
  (function(){
    var WEEKDAYS = ['日','月','火','水','木','金','土'];
    var FILTERS = [
      {key:'all', label:'すべて'},
      {key:'admission', label:'入試'},
      {key:'scholarship', label:'奨学金'},
      {key:'opencampus', label:'オープンキャンパス'}
    ];
    var current = 'all';
    var todayDate = new Date(); todayDate.setHours(0,0,0,0);
    var viewYear = todayDate.getFullYear();
    var viewMonth = todayDate.getMonth(); /* 0-11 */

    var listEl = document.getElementById('schedule-list');
    var filterEl = document.getElementById('sched-filter');
    var calEl = document.getElementById('sched-calgrid');
    var monthLabelEl = document.getElementById('sched-monthlabel');
    var prevBtn = document.getElementById('sched-prev');
    var nextBtn = document.getElementById('sched-next');

    var sorted = SCHEDULE.slice().sort(function(a,b){ return a.date < b.date ? -1 : 1; });

    function pad2(n){ return n < 10 ? '0'+n : ''+n; }
    function ymd(y, mZero, d){ return y+'-'+pad2(mZero+1)+'-'+pad2(d); }
    function todayStr(){ return ymd(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()); }

    function dday(s){
      var endDate = new Date((s.end||s.date)+'T00:00:00');
      var startDate = new Date(s.date+'T00:00:00');
      if(endDate < todayDate) return {label:'終了', cls:'ended', ended:true};
      var diffStart = Math.round((startDate - todayDate)/86400000);
      var diffEnd = Math.round((endDate - todayDate)/86400000);
      if(diffStart <= 0 && diffEnd >= 0) return {label:'受付中', cls:'soon', ended:false};
      if(diffStart > 0 && diffStart <= 14) return {label:'あと'+diffStart+'日', cls:'soon', ended:false};
      return {label:'', cls:'', ended:false};
    }

    function filtered(list){
      return list.filter(function(s){ return current === 'all' || s.cat === current; });
    }

    function itemsOverlappingMonth(y, mZero){
      var monthStart = ymd(y, mZero, 1);
      var lastDay = new Date(y, mZero+1, 0).getDate();
      var monthEnd = ymd(y, mZero, lastDay);
      return filtered(sorted).filter(function(s){
        var endD = s.end || s.date;
        return s.date <= monthEnd && endD >= monthStart;
      });
    }

    function itemsOnDate(dateStr, monthItems){
      return monthItems.filter(function(s){
        var endD = s.end || s.date;
        return s.date <= dateStr && endD >= dateStr;
      });
    }

    function findAdjacentMonthWithItems(direction){
      /* direction: 1 = 次に予定がある月を探す, -1 = 前に予定がある月を探す */
      var all = filtered(sorted);
      var monthStart = ymd(viewYear, viewMonth, 1);
      var monthEnd = ymd(viewYear, viewMonth, new Date(viewYear, viewMonth+1, 0).getDate());
      var best = null;
      for(var i=0;i<all.length;i++){
        var s = all[i];
        if(direction > 0 && s.date > monthEnd){ best = s; break; }
        if(direction < 0 && (s.end||s.date) < monthStart){ best = s; }
      }
      if(!best) return null;
      var dt = new Date(best.date+'T00:00:00');
      return {year: dt.getFullYear(), month: dt.getMonth()};
    }

    function renderCalendarGrid(monthItems){
      var y = viewYear, m = viewMonth;
      var firstWeekday = new Date(y, m, 1).getDay();
      var daysInMonth = new Date(y, m+1, 0).getDate();
      var tStr = todayStr();
      var html = '<div class="calweekrow">' + WEEKDAYS.map(function(w){ return '<span>'+w+'</span>'; }).join('') + '</div>';
      html += '<div class="calrows">';
      for(var i=0;i<firstWeekday;i++){ html += '<div class="calcell blank"></div>'; }
      for(var d=1; d<=daysInMonth; d++){
        var dateStr = ymd(y, m, d);
        var dayItems = itemsOnDate(dateStr, monthItems);
        var isToday = dateStr === tStr;
        var dots = dayItems.map(function(it){ return '<i class="'+it.cls+'"></i>'; }).join('');
        html += '<div class="calcell'+(isToday?' today':'')+'"><div class="dnum">'+d+'</div>' + (dots ? '<div class="dots">'+dots+'</div>' : '') + '</div>';
      }
      html += '</div>';
      calEl.innerHTML = html;
    }

    function itemCardHtml(s){
      var d = dday(s);
      var dt = new Date(s.date+'T00:00:00');
      return '<div class="scheditem'+(d.ended?' ended':'')+'">' +
        '<div class="scheddate"><div class="mo">'+(dt.getMonth()+1)+'月</div><div class="dy">'+dt.getDate()+'</div></div>' +
        '<div class="schedbody">' +
          '<div class="schedtop"><span class="badge '+s.cls+'">'+s.badge+'</span>' + (d.label ? '<span class="statuspill '+d.cls+'">'+d.label+'</span>' : '') + '</div>' +
          '<h4>'+s.title+'</h4>' +
          '<div class="when">'+s.when+'</div>' +
          '<p>'+s.desc+'</p>' +
          '<a href="'+s.url+'" target="_blank" rel="noopener">公式サイトを見る →</a>' +
        '</div></div>';
    }

    function renderList(monthItems){
      if(monthItems.length){
        listEl.innerHTML = monthItems.map(itemCardHtml).join('');
        return;
      }
      var html = '<p class="disclaimer">この月に該当する予定はありません。</p>';
      var prevHit = findAdjacentMonthWithItems(-1);
      var nextHit = findAdjacentMonthWithItems(1);
      if(prevHit || nextHit){
        html += '<div class="quiznav" style="margin-top:14px;">';
        html += prevHit ? '<button class="linklike" id="sched-jump-prev">← '+prevHit.year+'年'+(prevHit.month+1)+'月の予定へ</button>' : '<span></span>';
        html += nextHit ? '<button class="linklike" id="sched-jump-next">'+nextHit.year+'年'+(nextHit.month+1)+'月の予定へ →</button>' : '<span></span>';
        html += '</div>';
      }
      listEl.innerHTML = html;
      var jp = document.getElementById('sched-jump-prev');
      var jn = document.getElementById('sched-jump-next');
      if(jp){ jp.addEventListener('click', function(){ viewYear = prevHit.year; viewMonth = prevHit.month; render(); }); }
      if(jn){ jn.addEventListener('click', function(){ viewYear = nextHit.year; viewMonth = nextHit.month; render(); }); }
    }

    function render(){
      monthLabelEl.textContent = viewYear + '年' + (viewMonth+1) + '月';
      var monthItems = itemsOverlappingMonth(viewYear, viewMonth);
      renderCalendarGrid(monthItems);
      renderList(monthItems);
    }

    prevBtn.addEventListener('click', function(){
      viewMonth--; if(viewMonth < 0){ viewMonth = 11; viewYear--; }
      render();
    });
    nextBtn.addEventListener('click', function(){
      viewMonth++; if(viewMonth > 11){ viewMonth = 0; viewYear++; }
      render();
    });

    filterEl.innerHTML = FILTERS.map(function(f){
      return '<button data-f="'+f.key+'" class="'+(f.key==='all'?'active':'')+'">'+f.label+'</button>';
    }).join('');
    filterEl.querySelectorAll('button').forEach(function(btn){
      btn.addEventListener('click', function(){
        current = btn.dataset.f;
        filterEl.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b===btn); });
        render();
      });
    });

    /* 大学マッチング診断の結果から呼ばれる: スケジュールタブに移動し、
       「今日以降でまだ終わっていない一番近い予定」がある月を自動的に開く。 */
    window.jumpToSchedule = function(filterKey){
      if(filterKey){
        current = filterKey;
        filterEl.querySelectorAll('button').forEach(function(b){ b.classList.toggle('active', b.dataset.f === filterKey); });
      }
      var all = filtered(sorted);
      var tStr = todayStr();
      var target = null;
      for(var i=0;i<all.length;i++){
        var endD = all[i].end || all[i].date;
        if(endD >= tStr){ target = all[i]; break; }
      }
      if(target){
        var dt = new Date(target.date+'T00:00:00');
        viewYear = dt.getFullYear();
        viewMonth = dt.getMonth();
      } else {
        viewYear = todayDate.getFullYear();
        viewMonth = todayDate.getMonth();
      }
      render();
      goTab('schedule');
    };

    render();
  })();

  /* ---------------- future self: AI chat + profile card ---------------- */
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

})();
