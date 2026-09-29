/* ====================================================================
 * intro.js ― 起動時イントロ演出(コンパスのアニメーション)
 * ==================================================================== */
  /* ---------------- 起動時イントロ演出 ---------------- */
  (function(){
    var overlay = document.getElementById('intro-overlay');
    if(!overlay) return;
    var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    function finish(){
      overlay.style.display = 'none';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.removeEventListener('click', onSkip);
      overlay.removeEventListener('keydown', onKey);
    }

    function reveal(){
      if(overlay.dataset.revealing) return;
      overlay.dataset.revealing = '1';
      overlay.classList.add('closing');
      var w = window.innerWidth, h = window.innerHeight;
      var maxR = Math.hypot(w, h) * 0.55 + 40;
      var start = null;
      var dur = 620;
      function step(ts){
        if(start === null) start = ts;
        var t = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        var r = maxR * eased;
        var grad = 'radial-gradient(circle at 50% 50%, transparent 0px, transparent ' + r + 'px, #000 ' + (r + 1) + 'px, #000 100%)';
        overlay.style.maskImage = grad;
        overlay.style.webkitMaskImage = grad;
        if(t < 1){ requestAnimationFrame(step); } else { finish(); }
      }
      requestAnimationFrame(step);
    }

    function onSkip(){ reveal(); }
    function onKey(e){ if(e.key === 'Enter' || e.key === ' ' || e.key === 'Escape'){ e.preventDefault(); reveal(); } }

    if(reduceMotion){ finish(); return; }
    overlay.addEventListener('click', onSkip);
    overlay.addEventListener('keydown', onKey);
    setTimeout(reveal, 1500);
  })();

