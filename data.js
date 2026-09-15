/* ====================================================================
 * data.js ― 大学・産業・奨学金・診断データなど、アプリが表示する「中身」
 * ここを編集すればデータの追加・修正ができる(ロジックは他ファイル)。
 * ==================================================================== */

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
