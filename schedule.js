/* ====================================================================
 * schedule.js ― 「入試・奨学金スケジュール」タブのカレンダー機能
 * ==================================================================== */
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
