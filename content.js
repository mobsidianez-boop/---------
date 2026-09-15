/* ====================================================================
 * content.js ― 「香川で叶うキャリア」「先輩の声」「奨学金・支援制度」
 * タブの表示(静的データをカードとして描画するだけの部分)
 * ==================================================================== */
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
