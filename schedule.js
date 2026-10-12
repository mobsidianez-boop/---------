/* ====================================================================
 * schedule.js ― 「予定表」タブ(自分で作るマイスケジュール)の機能
 * ==================================================================== */
  /* ---------------- schedule (自分で作るマイスケジュール: 丸でつながるトレイル表示) ----------------
     月の丸をタップ → その月の週の丸が現れる → 週の丸の横の➕を押す → 追加したい週を選ぶ
     → その週専用の入力欄が出てきて「やること」を書き込める、という流れ。
     固定の入試・奨学金・オープンキャンパスのデータは廃止し、ユーザーが自分で予定を作る形にした。
     入力データはこの端末のブラウザ(localStorage)にのみ保存され、サーバーには送信されない。 */
  (function(){
    var trailEl = document.getElementById('schedule-trail');
    if(!trailEl) return;

    var COLORS = [
      {key:'sea', val:'#1C6FB5'},
      {key:'terra', val:'#FF9142'},
      {key:'olive', val:'#4F9D5C'},
      {key:'ink', val:'#41647E'}
    ];
    var STORAGE_KEY = 'kagawa-compass-my-schedule-v1';
    var GOALS_KEY = 'kagawa-compass-my-goals-v1';

    function loadEvents(){
      try{
        var raw = localStorage.getItem(STORAGE_KEY);
        var arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
      }catch(e){ return []; }
    }
    function saveEvents(list){
      try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); }catch(e){ /* no-op */ }
    }

    /* 月ごとの「大きな目標」(例: 期末テスト対策、オープンキャンパス前に基礎を固める、など)。
       { "2026-9": "定期テスト対策" } のように月キーで保持する。 */
    function loadGoals(){
      try{
        var raw = localStorage.getItem(GOALS_KEY);
        var obj = raw ? JSON.parse(raw) : {};
        return (obj && typeof obj === 'object' && !Array.isArray(obj)) ? obj : {};
      }catch(e){ return {}; }
    }
    function saveGoals(obj){
      try{ localStorage.setItem(GOALS_KEY, JSON.stringify(obj)); }catch(e){ /* no-op */ }
    }

    var MY_EVENTS = loadEvents();
    var MY_GOALS = loadGoals();

    var todayDate = new Date(); todayDate.setHours(0,0,0,0);
    function pad2(n){ return n < 10 ? '0'+n : ''+n; }
    function ymd(y, mZero, d){ return y+'-'+pad2(mZero+1)+'-'+pad2(d); }
    function uid(){ return 'e'+Date.now()+Math.floor(Math.random()*1000); }

    function escapeHtml(str){
      return (str||'').replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; });
    }

    function dday(s){
      var endDate = new Date((s.end||s.date)+'T00:00:00');
      var startDate = new Date(s.date+'T00:00:00');
      if(endDate < todayDate) return {label:'終了', cls:'ended', ended:true};
      var diffStart = Math.round((startDate - todayDate)/86400000);
      var diffEnd = Math.round((endDate - todayDate)/86400000);
      if(diffStart <= 0 && diffEnd >= 0) return {label:'進行中', cls:'soon', ended:false};
      if(diffStart > 0 && diffStart <= 14) return {label:'あと'+diffStart+'日', cls:'soon', ended:false};
      return {label:'', cls:'', ended:false};
    }

    /* ---- このアプリでの「1週間」の定義: 月曜日始まり・日曜日終わり。
       月をまたぐ週(例: 月曜日が先月)は、最後の日である日曜日が含まれる月のほうに表示する。 ---- */
    function mondayOf(d){
      var day = d.getDay(); /* 0=日,1=月,...6=土 */
      var diff = (day === 0) ? -6 : (1 - day);
      return addDays(d, diff);
    }
    function sundayOf(d){ return addDays(mondayOf(d), 6); }
    function slotForDate(dateStr){
      var d = new Date(dateStr+'T00:00:00');
      var mon = mondayOf(d), sun = sundayOf(d);
      return { start: dstr(mon), end: dstr(sun), ownerY: sun.getFullYear(), ownerM: sun.getMonth() };
    }

    function buildMonthList(){
      /* 常に「今月から最低6か月分」は表示する。予定がそれより先/前にあれば、その分だけ範囲を広げる。
         予定がどの月に表示されるかは、その週の日曜日が属する月(= slotForDateのownerY/ownerM)で決める。 */
      var minD = todayDate;
      var maxD = new Date(todayDate.getFullYear(), todayDate.getMonth()+5, 1);
      MY_EVENTS.forEach(function(s){
        var startSlot = slotForDate(s.date);
        var endSlot = slotForDate(s.end||s.date);
        var ownerStartD = new Date(startSlot.ownerY, startSlot.ownerM, 1);
        var ownerEndD = new Date(endSlot.ownerY, endSlot.ownerM, 1);
        if(ownerStartD < minD) minD = ownerStartD;
        if(ownerEndD > maxD) maxD = ownerEndD;
      });
      var months = [];
      var y = minD.getFullYear(), m = minD.getMonth();
      var endY = maxD.getFullYear(), endM = maxD.getMonth();
      while(y < endY || (y===endY && m<=endM)){
        months.push({year:y, month:m});
        m++; if(m>11){ m=0; y++; }
      }
      return months;
    }

    /* その月に「日曜日が含まれる週」を1週目,2週目...として並べる(月曜始まり・日曜終わり)。
       月の最初の方で月曜日が先月にまたがっていてもその週はこの月の1週目として含む。
       逆に月の終わりの方で日曜日が来月にずれ込む週は、来月側の週として扱う(=この月には含めない)。 */
    function weekSlotsForMonth(y,m){
      var daysInMonth = new Date(y,m+1,0).getDate();
      var slots = [];
      var idx = 0;
      for(var day=1; day<=daysInMonth; day++){
        var d = new Date(y,m,day);
        if(d.getDay() === 0){ /* 日曜日 */
          var mon = mondayOf(d);
          slots.push({idx:idx, start:dstr(mon), end:dstr(d)});
          idx++;
        }
      }
      return slots;
    }

    function eventsForMonth(y, m){
      return MY_EVENTS.filter(function(s){
        var slot = slotForDate(s.date);
        return slot.ownerY === y && slot.ownerM === m;
      });
    }

    function weekSlotIndexFor(dateStr, slots){
      var mon = dstr(mondayOf(new Date(dateStr+'T00:00:00')));
      for(var i=0;i<slots.length;i++){ if(slots[i].start === mon) return i; }
      return 0;
    }

    function groupByWeek(events, slots){
      var groups = {};
      events.forEach(function(s){
        var wk = weekSlotIndexFor(s.date, slots);
        groups[wk] = groups[wk] || [];
        groups[wk].push(s);
      });
      return groups;
    }

    function whenLabel(start, end){
      var sd = new Date(start+'T00:00:00');
      var label = (sd.getMonth()+1)+'月'+sd.getDate()+'日('+WEEKDAY_LABEL[sd.getDay()]+')';
      if(end && end!==start){
        var ed = new Date(end+'T00:00:00');
        label += '〜'+(ed.getMonth()+1)+'月'+ed.getDate()+'日('+WEEKDAY_LABEL[ed.getDay()]+')';
      }
      return label;
    }

    var COLOR_SOFT = { sea:'var(--sea-soft)', terra:'var(--terracotta-soft)', olive:'var(--olive-soft)', ink:'rgba(65,100,126,.16)' };

    function itemCardHtml(s){
      var d = dday(s);
      var dt = new Date(s.date+'T00:00:00');
      var color = (COLORS.filter(function(c){ return c.key===s.color; })[0] || COLORS[0]).val;
      var softBg = COLOR_SOFT[s.color] || COLOR_SOFT.sea;
      var isDone = !!s.done;
      var endDateStr = s.end || s.date;
      /* s.when は昔のデータだと曜日なしの文字列のことがあるので、表示は毎回その場で作り直す */
      var whenDisplay = whenLabel(s.date, endDateStr);
      return '<div class="scheditem'+(d.ended?' ended':'')+(isDone?' done':'')+'">'+
        '<div class="scheddate" style="background:'+softBg+'">'+
          '<div class="mo">'+(dt.getMonth()+1)+'月</div>'+
          '<div class="dy">'+dt.getDate()+'</div>'+
          '<div class="wd">'+WEEKDAY_LABEL[dt.getDay()]+'曜</div>'+
        '</div>'+
        '<div class="schedbody">'+
          '<div class="schedtop"><span class="colordot" style="background:'+color+'"></span>'+(d.label?'<span class="statuspill '+d.cls+'">'+d.label+'</span>':'')+(isDone?'<span class="statuspill done">完了</span>':'')+'</div>'+
          '<h4>'+escapeHtml(s.title)+'</h4>'+
          '<div class="when">'+whenDisplay+'</div>'+
          (s.memo?'<p>'+escapeHtml(s.memo)+'</p>':'')+
        '</div>'+
        '<div class="itemactions">'+
          '<button type="button" class="donebtn'+(isDone?' active':'')+'" data-done="'+s.id+'">'+(isDone?'完了を取り消す':'完了')+'</button>'+
          '<button type="button" class="delbtn" data-del="'+s.id+'">削除</button>'+
        '</div>'+
        '</div>';
    }

    function monthKey(y,m){ return y+'-'+m; }

    /* ---- 画面の状態 ----
       openMonthKey   : 開いている月(例 "2026-9")
       openWeekKey    : 予定を表示中の週(例 "2026-9-1")
       selectMonthKey : ➕を押して「週を選んでください」になっている月
       composeWeekKey : やることを書き込み中の週 */
    var openMonthKey = null, openWeekKey = null, selectMonthKey = null, composeWeekKey = null, goalEditKey = null, composeDayDate = null, composeDraftText = '';
    var WEEKDAY_LABEL = ['日','月','火','水','木','金','土'];
    function datesInRange(startStr, endStr){
      var out = [];
      var d = new Date(startStr+'T00:00:00');
      var end = new Date(endStr+'T00:00:00');
      while(d <= end){
        out.push(ymd(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setDate(d.getDate()+1);
      }
      return out;
    }

    function render(){
      var months = buildMonthList();
      var tY = todayDate.getFullYear(), tM = todayDate.getMonth();
      var html = '';

      if(MY_EVENTS.length===0 && !openMonthKey){
        html += '<div class="schedule-empty">まだ予定がありません。下の月の丸をタップして開き、週の横の「+」から追加してみましょう。</div>';
      }

      months.forEach(function(mo){
        var key = monthKey(mo.year, mo.month);
        var evs = eventsForMonth(mo.year, mo.month);
        var isToday = mo.year===tY && mo.month===tM;
        var isOpen = openMonthKey === key;
        var dots = evs.slice(0,4).map(function(s){
          var color = (COLORS.filter(function(c){ return c.key===s.color; })[0] || COLORS[0]).val;
          return '<i style="background:'+color+'"></i>';
        }).join('');

        html += '<div class="month-row'+(evs.length?'':' empty')+'">';
        html += '<button type="button" class="month-node'+(evs.length?' has-events':'')+(isToday?' is-today':'')+(isOpen?' open':'')+'" data-month="'+key+'">'+
                  '<span class="num">'+(mo.month+1)+'</span><span class="lbl">月</span>'+
                  (dots?'<span class="dotrow">'+dots+'</span>':'')+
                '</button>';
        var goalText = MY_GOALS[key] || '';
        var editingGoal = goalEditKey === key;
        var goalHtml;
        if(editingGoal){
          goalHtml = '<div class="goal-edit">'+
              '<input type="text" id="goal-input-'+key+'" maxlength="40" value="'+escapeHtml(goalText)+'" placeholder="例: 定期テスト対策">'+
              '<button type="button" class="goal-save" data-goalsave="'+key+'">保存</button>'+
              '<button type="button" class="goal-cancel" data-goalcancel="'+key+'">×</button>'+
            '</div>';
        } else if(goalText){
          goalHtml = '<button type="button" class="goal-pill" data-goaledit="'+key+'" title="タップして編集">'+
              '<span class="txt">🎯 '+escapeHtml(goalText)+'</span>'+
            '</button>';
        } else {
          goalHtml = '<button type="button" class="goal-add" data-goaledit="'+key+'">+ この月の目標を設定</button>';
        }

        html += '<div class="month-meta"><div class="yr">'+mo.year+'年</div>'+
                '<div class="goalrow">'+goalHtml+'</div>'+
                '<div class="summary">'+(evs.length ? evs.length+'件の予定' : '予定なし') + '</div>'+
                (isToday?'<span class="today-badge">今月</span>':'')+
                '</div>';
        html += '</div>';

        if(isOpen){
          var slots = weekSlotsForMonth(mo.year, mo.month);
          var groups = groupByWeek(evs, slots);
          var selecting = selectMonthKey === key;

          html += '<div class="weeks-wrap"><div class="weeks-row'+(selecting?' selecting':'')+'">';
          slots.forEach(function(slot){
            var wkey = key+'-'+slot.idx;
            var wEvs = groups[slot.idx] || [];
            var wOpen = openWeekKey === wkey;
            html += '<button type="button" class="week-node'+(wEvs.length?'':' empty')+(wOpen?' open':'')+'" data-week="'+wkey+'">'+
                      (wEvs.length ? '<span class="cnt">'+wEvs.length+'</span>' : '')+
                      '<span>'+(slot.idx+1)+'</span><span class="wk">週目</span>'+
                    '</button>';
          });
          html += '<button type="button" class="week-add-toggle'+(selecting?' active':'')+'" data-addtoggle="'+key+'" aria-label="この月に予定を追加">'+(selecting?'×':'+')+'</button>';
          html += '</div>';

          if(composeWeekKey && composeWeekKey.indexOf(key+'-')===0){
            var cParts = composeWeekKey.split('-');
            var cIdx = parseInt(cParts[2],10);
            var cSlot = slots[cIdx];
            var cTodayStr = ymd(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
            var cSlotDates = datesInRange(cSlot.start, cSlot.end);
            var cFirstSelectable = cSlotDates.filter(function(d2){ return d2 >= cTodayStr; })[0];
            var cDayDate = composeDayDate || cFirstSelectable || cSlot.start;
            var cDayChips = cSlotDates.map(function(dstr2){
              var dd = new Date(dstr2+'T00:00:00');
              var isSel = (cDayDate === dstr2);
              var isPast = dstr2 < cTodayStr;
              return '<button type="button" class="daychip'+(isSel?' active':'')+(isPast?' past':'')+'"'+
                       (isPast ? ' disabled aria-disabled="true" title="過ぎた日には追加できません"' : ' data-day="'+dstr2+'"')+'>'+
                       '<span class="d">'+dd.getDate()+'</span><span class="wd">'+WEEKDAY_LABEL[dd.getDay()]+'</span>'+
                     '</button>';
            }).join('');
            html += '<div class="compose-box">'+
                      '<div class="ctitle">'+(mo.month+1)+'月 第'+(cIdx+1)+'週 にやることを書く</div>'+
                      '<div class="daypick-label">曜日を選ぶ</div>'+
                      '<div class="daypick-row">'+cDayChips+'</div>'+
                      '<input type="text" id="compose-input" placeholder="例: 香川大学オープンキャンパスに行く" value="'+escapeHtml(composeDraftText)+'">'+
                      '<div class="composebtns">'+
                        '<button type="button" data-composecancel>キャンセル</button>'+
                        '<button type="button" class="primary" data-composesave="'+composeWeekKey+'">保存する</button>'+
                      '</div>'+
                    '</div>';
          } else if(openWeekKey && openWeekKey.indexOf(key+'-')===0){
            var oParts = openWeekKey.split('-');
            var oEvs = groups[parseInt(oParts[2],10)] || [];
            if(oEvs.length){
              html += '<div class="events-panel">';
              oEvs.forEach(function(s){ html += itemCardHtml(s); });
              html += '</div>';
            }
          }
          html += '</div>';
        }
      });

      trailEl.innerHTML = html;

      trailEl.querySelectorAll('.month-node').forEach(function(btn){
        btn.addEventListener('click', function(){
          var k = btn.dataset.month;
          openMonthKey = (openMonthKey === k) ? null : k;
          openWeekKey = null; selectMonthKey = null; composeWeekKey = null;
          render();
        });
      });

      trailEl.querySelectorAll('[data-addtoggle]').forEach(function(btn){
        btn.addEventListener('click', function(){
          var k = btn.dataset.addtoggle;
          selectMonthKey = (selectMonthKey === k) ? null : k;
          composeWeekKey = null;
          render();
        });
      });

      trailEl.querySelectorAll('.week-node').forEach(function(btn){
        btn.addEventListener('click', function(){
          var k = btn.dataset.week;
          var parts = k.split('-');
          var monthPart = parts[0]+'-'+parts[1];
          if(selectMonthKey === monthPart){
            /* ➕を押した直後 → この週に書き込む */
            composeWeekKey = k;
            selectMonthKey = null;
            composeDraftText = '';
            composeDayDate = null; /* render() 側で「今日以降で最初に選べる日」を自動選択する */
            render();
            setTimeout(function(){
              var el = document.getElementById('compose-input');
              if(el) el.focus();
            }, 30);
          } else {
            openWeekKey = (openWeekKey === k) ? null : k;
            render();
          }
        });
      });

      trailEl.querySelectorAll('[data-composecancel]').forEach(function(btn){
        btn.addEventListener('click', function(){
          composeWeekKey = null;
          composeDayDate = null;
          composeDraftText = '';
          render();
        });
      });

      trailEl.querySelectorAll('[data-day]').forEach(function(btn){
        btn.addEventListener('click', function(){
          var el0 = document.getElementById('compose-input');
          if(el0) composeDraftText = el0.value;
          composeDayDate = btn.dataset.day;
          render();
          setTimeout(function(){
            var el = document.getElementById('compose-input');
            if(el) el.focus();
          }, 30);
        });
      });

      trailEl.querySelectorAll('[data-composesave]').forEach(function(btn){
        btn.addEventListener('click', function(){
          saveComposedEvent(btn.dataset.composesave);
        });
      });
      var composeInput = document.getElementById('compose-input');
      if(composeInput){
        composeInput.addEventListener('keydown', function(e){
          if(e.key === 'Enter'){ saveComposedEvent(composeWeekKey); }
        });
      }

      trailEl.querySelectorAll('[data-done]').forEach(function(btn){
        btn.addEventListener('click', function(){
          var id = btn.dataset.done;
          var ev = MY_EVENTS.filter(function(e){ return e.id === id; })[0];
          if(ev){ ev.done = !ev.done; }
          saveEvents(MY_EVENTS);
          render();
        });
      });

      trailEl.querySelectorAll('[data-del]').forEach(function(btn){
        btn.addEventListener('click', function(){
          var id = btn.dataset.del;
          MY_EVENTS = MY_EVENTS.filter(function(e){ return e.id !== id; });
          saveEvents(MY_EVENTS);
          render();
        });
      });

      trailEl.querySelectorAll('[data-goaledit]').forEach(function(btn){
        btn.addEventListener('click', function(e){
          e.stopPropagation();
          goalEditKey = btn.dataset.goaledit;
          render();
          setTimeout(function(){
            var el = document.getElementById('goal-input-'+goalEditKey);
            if(el){ el.focus(); el.select(); }
          }, 30);
        });
      });
      trailEl.querySelectorAll('[data-goalcancel]').forEach(function(btn){
        btn.addEventListener('click', function(e){
          e.stopPropagation();
          goalEditKey = null;
          render();
        });
      });
      trailEl.querySelectorAll('[data-goalsave]').forEach(function(btn){
        btn.addEventListener('click', function(e){
          e.stopPropagation();
          saveGoalFor(btn.dataset.goalsave);
        });
      });
      if(goalEditKey){
        var goalInput = document.getElementById('goal-input-'+goalEditKey);
        if(goalInput){
          goalInput.addEventListener('click', function(e){ e.stopPropagation(); });
          goalInput.addEventListener('keydown', function(e){
            if(e.key === 'Enter'){ saveGoalFor(goalEditKey); }
            if(e.key === 'Escape'){ goalEditKey = null; render(); }
          });
        }
      }
    }

    function saveGoalFor(key){
      if(!key) return;
      var input = document.getElementById('goal-input-'+key);
      var text = input ? input.value.trim() : '';
      if(text){ MY_GOALS[key] = text; } else { delete MY_GOALS[key]; }
      saveGoals(MY_GOALS);
      goalEditKey = null;
      render();
    }

    function saveComposedEvent(wkey){
      if(!wkey) return;
      var parts = wkey.split('-');
      var y = parseInt(parts[0],10), m = parseInt(parts[1],10), idx = parseInt(parts[2],10);
      var slot = weekSlotsForMonth(y,m)[idx];
      var day = composeDayDate || slot.start;
      var todayStr = ymd(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
      if(day < todayStr){ alert('過ぎた日には予定を追加できません。今日以降の日を選んでください。'); return; }
      var input = document.getElementById('compose-input');
      var text = input ? input.value.trim() : '';
      if(!text){ alert('やることを入力してください'); return; }
      MY_EVENTS.push({
        id: uid(), title: text, date: day, end: day,
        when: whenLabel(day, day), memo: '', color: 'sea'
      });
      saveEvents(MY_EVENTS);
      composeWeekKey = null;
      composeDayDate = null;
      composeDraftText = '';
      openWeekKey = wkey;
      render();
    }

    /* 診断結果画面の「出願・奨学金のスケジュールを見る」ボタンから呼ばれる。
       固定カテゴリーが無くなったので、単純にスケジュールタブへ移動するだけにしている。 */
    window.jumpToSchedule = function(){
      goTab('schedule');
    };


    function addDays(base, n){
      var d = new Date(base);
      d.setDate(d.getDate() + n);
      return d;
    }
    function dstr(d){ return ymd(d.getFullYear(), d.getMonth(), d.getDate()); }

    render();
  })();
