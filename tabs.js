/* ====================================================================
 * tabs.js ― メインナビゲーション(タブ)の切り替え・キーボード操作
 * ==================================================================== */
(function(){
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
})();
