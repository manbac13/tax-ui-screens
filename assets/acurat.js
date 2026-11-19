/* Acurat shared shell behaviour: rail collapse, focus mode, engagement switcher */
(function(){
  var root=document.documentElement, body=document.body;
  var ctx=body.getAttribute('data-ctx')||'list';
  function get(k,store){try{return (store||localStorage).getItem(k);}catch(e){return null;}}
  function set(k,v,store){try{(store||localStorage).setItem(k,v);}catch(e){}}
  function nudge(){setTimeout(function(){window.dispatchEvent(new Event('resize'));},200);}

  // Rail: wide on list pages, slim inside clients/engagements, remembered per context
  var rt=document.getElementById('railToggle');
  if(rt){
    var sync=function(){var w=root.classList.contains('rail-wide');rt.setAttribute('aria-expanded',w);rt.title=w?'Collapse menu':'Expand menu';rt.setAttribute('aria-label',rt.title);};
    sync();
    rt.addEventListener('click',function(){root.classList.toggle('rail-wide');set('acurat.rail.'+ctx,root.classList.contains('rail-wide')?'wide':'slim');sync();nudge();});
  }

  // Focus mode: hides rail + identity row, keeps section tabs. Stays on while moving between engagement tabs.
  var canFocus=!!document.querySelector('[data-focus]');
  function setFocus(on){if(!canFocus)return;body.classList.toggle('focus',on);set('acurat.focus',on?'1':'0',sessionStorage);nudge();}
  document.querySelectorAll('[data-focus]').forEach(function(b){b.addEventListener('click',function(){setFocus(b.getAttribute('data-focus')==='on');});});
  document.addEventListener('keydown',function(e){
    var t=e.target;if(/INPUT|TEXTAREA|SELECT/.test(t.tagName)||t.isContentEditable||e.metaKey||e.ctrlKey||e.altKey)return;
    if((e.key==='f'||e.key==='F')&&canFocus){setFocus(!body.classList.contains('focus'));e.preventDefault();}
    else if(e.key==='Escape'){
      var open=document.querySelector('details.switch[open]');
      if(open){open.removeAttribute('open');return;}
      if(body.classList.contains('focus')){setFocus(false);}
    }
  });

  // Engagement switcher: close on outside click
  document.addEventListener('click',function(e){document.querySelectorAll('details.switch[open]').forEach(function(d){if(!d.contains(e.target))d.removeAttribute('open');});});

  // ---------- Shared dialog + toast (use these for every modal so they behave the same) ----------
  // Acurat.dialog(el) → {open(), close()}; el is the .dlg-back. Closes on ×/[data-dlg-close], Esc, backdrop click; traps Tab; restores focus.
  var A=window.Acurat=window.Acurat||{};
  A.dialog=function(back,opts){
    opts=opts||{};var last=null;
    var api={
      open:function(){last=document.activeElement;back.hidden=false;document.body.style.overflow='hidden';
        if(opts.onOpen)opts.onOpen();
        setTimeout(function(){var f=back.querySelector('[autofocus]')||back.querySelector('input,select,textarea,button:not([data-dlg-close])');if(f)f.focus();},0);},
      close:function(){if(back.hidden)return;back.hidden=true;document.body.style.overflow='';if(opts.onClose)opts.onClose();if(last&&last.focus)last.focus();},
      isOpen:function(){return !back.hidden;}
    };
    back.addEventListener('mousedown',function(e){if(e.target===back)api.close();});
    back.querySelectorAll('[data-dlg-close]').forEach(function(b){b.addEventListener('click',api.close);});
    back.addEventListener('keydown',function(e){
      if(e.key==='Escape'){e.preventDefault();e.stopPropagation();api.close();return;}
      if(e.key!=='Tab')return;
      var f=Array.prototype.filter.call(back.querySelectorAll('button,input,select,textarea,a[href]'),function(x){return !x.disabled&&x.offsetParent!==null;});
      if(!f.length)return;var first=f[0],lastF=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();lastF.focus();}
      else if(!e.shiftKey&&document.activeElement===lastF){e.preventDefault();first.focus();}
    });
    return api;
  };
  var toastEl=null,toastT=null;
  // Flash toast carried across a redirect: sessionStorage['acurat.flash.toast']
  window.addEventListener('load',function(){try{var fl=sessionStorage.getItem('acurat.flash.toast');if(fl){sessionStorage.removeItem('acurat.flash.toast');A.toast(fl,'info');}}catch(e){}});
  // Row action menu: Acurat.menu(buttonEl, [{label, icon:'<svg…>', danger, sep, onClick}]). Toggles on the same button.
  var amenu=null, amenuBtn=null;
  function closeAmenu(refocus){if(!amenu||amenu.hidden)return;amenu.hidden=true;if(amenuBtn){amenuBtn.setAttribute('aria-expanded','false');if(refocus)amenuBtn.focus();}amenuBtn=null;}
  A.menu=function(btn,items){
    if(amenuBtn===btn){closeAmenu(true);return;}
    closeAmenu(false);
    if(!amenu){
      amenu=document.createElement('div');amenu.className='amenu';amenu.setAttribute('role','menu');amenu.hidden=true;document.body.appendChild(amenu);
      amenu.addEventListener('keydown',function(e){
        var b=Array.prototype.slice.call(amenu.querySelectorAll('button')),i=b.indexOf(document.activeElement);
        if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeAmenu(true);}
        else if(e.key==='ArrowDown'){e.preventDefault();b[(i+1)%b.length].focus();}
        else if(e.key==='ArrowUp'){e.preventDefault();b[(i-1+b.length)%b.length].focus();}
        else if(e.key==='Tab'){closeAmenu(false);}
      });
      document.addEventListener('mousedown',function(e){if(amenu&&!amenu.hidden&&!amenu.contains(e.target)&&!(amenuBtn&&amenuBtn.contains(e.target)))closeAmenu(false);});
      window.addEventListener('resize',function(){closeAmenu(false);});
      document.addEventListener('scroll',function(e){if(amenu&&!amenu.hidden&&!amenu.contains(e.target))closeAmenu(false);},true);
    }
    amenu.innerHTML='';
    items.forEach(function(it){
      if(it.sep){var s=document.createElement('div');s.className='msep';s.setAttribute('role','separator');amenu.appendChild(s);return;}
      var b=document.createElement('button');b.type='button';b.setAttribute('role','menuitem');if(it.danger)b.className='danger';
      b.innerHTML=(it.icon||'')+'<span></span>';b.lastChild.textContent=it.label;if(it.desc){b.classList.add('has-desc');var sm=document.createElement('small');sm.textContent=it.desc;b.lastChild.appendChild(sm);}
      b.addEventListener('click',function(){closeAmenu(true);if(it.onClick)it.onClick();});
      amenu.appendChild(b);
    });
    amenuBtn=btn;btn.setAttribute('aria-expanded','true');btn.setAttribute('aria-haspopup','menu');
    amenu.hidden=false;
    var r=btn.getBoundingClientRect(),h=amenu.offsetHeight,w=amenu.offsetWidth;
    amenu.style.left=Math.max(8,Math.min(r.right-w,window.innerWidth-w-8))+'px';
    amenu.style.top=(window.innerHeight-r.bottom<h+12&&r.top>h?r.top-h-6:r.bottom+6)+'px';
    var f=amenu.querySelector('button');if(f)f.focus();
  };
  A.toast=function(msg,tone){
    if(!toastEl){toastEl=document.createElement('div');toastEl.className='toast';toastEl.setAttribute('role','status');toastEl.setAttribute('aria-live','polite');toastEl.hidden=true;
      toastEl.innerHTML='<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg><span></span>';
      document.body.appendChild(toastEl);}
    toastEl.querySelector('span').textContent=msg;toastEl.classList.toggle('info',tone==='info');toastEl.classList.toggle('error',tone==='error');toastEl.hidden=false;
    clearTimeout(toastT);toastT=setTimeout(function(){toastEl.hidden=true;},3200);
  };

  // ---------- Shared dropdown: themes every native <select> (opt out with data-native) ----------
  // The <select> stays the source of truth: page code keeps reading/writing select.value and
  // listening for 'change'. Setting .value / .selectedIndex from code updates the pill too.
  var chevSvg='<svg class="chev" aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
  var ckSvg='<svg class="ck" aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';
  var findSvg='<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>';
  var acsN=0, openAcs=null;
  A.select=function(sel){
    if(sel._acs)return sel._acs;
    var id='acs'+(++acsN), wrap=document.createElement('span'), btn=document.createElement('button'), multi=sel.multiple;
    wrap.className='acs'+(sel.hasAttribute('data-filter')?' filter':'')+(multi?' multi':'');
    btn.type='button';btn.className='acs-btn';btn.id=id+'-btn';
    btn.setAttribute('role','combobox');btn.setAttribute('aria-haspopup','listbox');btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls',id+'-list');
    btn.innerHTML='<span class="acs-val"></span>'+chevSvg;
    // Accessible name: <label for>, wrapping <label>'s text, or aria-label on the select
    var lab=sel.id&&document.querySelector('label[for="'+sel.id+'"]'), wrapLab=sel.closest('label');
    var name=sel.getAttribute('aria-label')||(lab&&lab.textContent.replace('*','').trim())||(wrapLab&&(wrapLab.querySelector('.sr,span')||wrapLab).textContent.trim())||'';
    if(name)btn.setAttribute('aria-label',name);
    if(lab)lab.addEventListener('click',function(e){e.preventDefault();btn.focus();});
    sel.classList.add('acs-native');sel.setAttribute('tabindex','-1');sel.setAttribute('aria-hidden','true');
    sel.parentNode.insertBefore(wrap,sel.nextSibling);wrap.appendChild(btn);

    if(multi)btn.setAttribute('aria-multiselectable','true');
    var menu=document.createElement('div');menu.className='acs-menu'+(multi?' multi':'');menu.hidden=true;
    var many=sel.options.length>7||sel.hasAttribute('data-search');
    menu.innerHTML=(many?'<label class="acs-find">'+findSvg+'<input type="text" placeholder="Search" aria-label="Search options" autocomplete="off"></label>':'')+
      '<ul class="acs-list" role="listbox" id="'+id+'-list"'+(name?' aria-label="'+name.replace(/"/g,'&quot;')+'"':'')+'></ul>';
    document.body.appendChild(menu);
    var list=menu.querySelector('.acs-list'), find=menu.querySelector('.acs-find input'), active=-1, items=[];

    function sync(){
      var val=btn.querySelector('.acs-val');
      if(multi){
        // Chips for each chosen option (data-short shortens the chip label); × removes one.
        var chosen=Array.prototype.filter.call(sel.options,function(o){return o.selected;});
        val.innerHTML='';
        if(!chosen.length){var ph=document.createElement('span');ph.className='ph';ph.textContent=sel.getAttribute('data-placeholder')||'Select…';val.appendChild(ph);}
        chosen.forEach(function(o){
          var t=document.createElement('span');t.className='acs-tag';t.textContent=o.getAttribute('data-short')||o.text;
          var x=document.createElement('i');x.setAttribute('aria-hidden','true');x.textContent='×';x._opt=o;t.appendChild(x);val.appendChild(t);
        });
        wrap.classList.toggle('has-val',chosen.length>0);wrap.classList.toggle('is-ph',!chosen.length);
      }else{
        var o=sel.options[sel.selectedIndex];
        val.textContent=o?o.text:'';
        wrap.classList.toggle('has-val',!!sel.value);wrap.classList.toggle('is-ph',!sel.value);
      }
      btn.disabled=sel.disabled;
      if(!menu.hidden){build(find?find.value:'');place();}
    }
    function build(q){
      q=(q||'').trim().toLowerCase();list.innerHTML='';items=[];
      var keep=active;
      Array.prototype.forEach.call(sel.options,function(o,i){
        if(multi&&o.value==='')return; // no placeholder row in multi-selects
        var desc=o.getAttribute('data-desc')||'';
        if(q&&(o.text+' '+desc).toLowerCase().indexOf(q)<0)return;
        var li=document.createElement('li');
        li.className='acs-opt'+(o.value===''?' ph':'')+(desc?' has-desc':'');li.id=id+'-o'+i;li.setAttribute('role','option');
        li.setAttribute('aria-selected',(multi?o.selected:i===sel.selectedIndex)?'true':'false');
        if(o.disabled)li.setAttribute('aria-disabled','true');
        li.innerHTML=(multi?'<span class="box" aria-hidden="true">'+ckSvg.replace('class="ck" ','').replace('width="14" height="14"','width="11" height="11"')+'</span>':'')+'<span></span>'+ckSvg;
        var lbl=li.querySelector('span:not(.box)');lbl.textContent=o.text;
        if(desc){var sm=document.createElement('small');sm.textContent=desc;lbl.appendChild(sm);}
        li._i=i;list.appendChild(li);items.push(li);
        if(o.value===''&&!q&&sel.options.length>1){var s=document.createElement('li');s.className='acs-sep';s.setAttribute('role','presentation');list.appendChild(s);}
      });
      if(multi&&keep>=0&&items.length){items.forEach(function(li,k){li.classList.toggle('on',k===Math.min(keep,items.length-1));});}
      if(!items.length)list.innerHTML='<li class="acs-empty" role="presentation">No matches</li>';
    }
    function setActive(n){
      if(!items.length){active=-1;return;}
      active=(n+items.length)%items.length;
      items.forEach(function(li,k){li.classList.toggle('on',k===active);});
      var li=items[active];(find||btn).setAttribute('aria-activedescendant',li.id);
      var top=li.offsetTop,bot=top+li.offsetHeight;
      if(top<list.scrollTop)list.scrollTop=top-6;else if(bot>list.scrollTop+list.clientHeight)list.scrollTop=bot-list.clientHeight+6;
    }
    function place(){
      var r=btn.getBoundingClientRect(), h=menu.offsetHeight, below=window.innerHeight-r.bottom;
      menu.style.minWidth=Math.max(180,r.width)+'px';
      menu.style.left=Math.min(r.left,window.innerWidth-menu.offsetWidth-8)+'px';
      menu.style.top=(below<h+12&&r.top>below?r.top-h-6:r.bottom+6)+'px';
    }
    function open(){
      if(btn.disabled)return;
      if(openAcs&&openAcs!==api)openAcs.close();
      active=-1;build('');menu.hidden=false;place();btn.setAttribute('aria-expanded','true');openAcs=api;
      var cur=multi?0:items.findIndex(function(li){return li._i===sel.selectedIndex;});setActive(cur<0?0:cur);
      if(find){find.value='';find.focus();}
    }
    function close(refocus){
      if(menu.hidden)return;
      menu.hidden=true;btn.setAttribute('aria-expanded','false');(find||btn).removeAttribute('aria-activedescendant');
      if(openAcs===api)openAcs=null;
      if(refocus)btn.focus();
    }
    function fire(){sel.dispatchEvent(new Event('input',{bubbles:true}));sel.dispatchEvent(new Event('change',{bubbles:true}));}
    function choose(i){
      var o=sel.options[i];if(!o||o.disabled)return;
      if(multi){ // toggle and keep the menu open (like disableCloseOnSelect)
        var keepActive=active;o.selected=!o.selected;fire();
        if(!menu.hidden&&items.length)setActive(Math.min(keepActive,items.length-1));
        (find||btn).focus();return;
      }
      var changed=sel.selectedIndex!==i;
      sel.selectedIndex=i;close(true);
      if(changed)fire();
    }
    var typed='',typedT=null;
    function keys(e){
      var k=e.key;
      if(menu.hidden){
        if(k==='ArrowDown'||k==='ArrowUp'||k==='Enter'||k===' '){e.preventDefault();open();}
        return;
      }
      if(k==='Escape'){e.preventDefault();e.stopPropagation();close(true);}
      else if(k==='ArrowDown'){e.preventDefault();setActive(active+1);}
      else if(k==='ArrowUp'){e.preventDefault();setActive(active-1);}
      else if(k==='Home'){e.preventDefault();setActive(0);}
      else if(k==='End'){e.preventDefault();setActive(items.length-1);}
      else if(k==='Enter'||(k===' '&&!find)){e.preventDefault();if(items[active])choose(items[active]._i);}
      else if(k==='Tab'){close(false);}
      else if(!find&&k.length===1&&!e.metaKey&&!e.ctrlKey){ // type-ahead
        typed+=k.toLowerCase();clearTimeout(typedT);typedT=setTimeout(function(){typed='';},600);
        var n=items.findIndex(function(li){return li.textContent.toLowerCase().indexOf(typed)===0;});if(n>=0)setActive(n);
      }
    }
    btn.addEventListener('click',function(e){
      var x=e.target.closest('.acs-tag i');
      if(x&&x._opt){x._opt.selected=false;fire();return;} // remove one chip without toggling the menu
      menu.hidden?open():close(true);
    });
    if(multi)btn.addEventListener('keydown',function(e){ // Backspace removes the last chip
      if(e.key==='Backspace'&&menu.hidden){var c=Array.prototype.filter.call(sel.options,function(o){return o.selected;});if(c.length){c[c.length-1].selected=false;fire();}}
    });
    btn.addEventListener('keydown',keys);
    if(find){find.addEventListener('keydown',keys);find.addEventListener('input',function(){build(find.value);setActive(0);place();});}
    list.addEventListener('mousedown',function(e){e.preventDefault();}); // keep focus on search/button
    list.addEventListener('click',function(e){var li=e.target.closest('.acs-opt');if(li)choose(li._i);});
    list.addEventListener('mousemove',function(e){var li=e.target.closest('.acs-opt');if(li){var n=items.indexOf(li);if(n!==active)setActive(n);}});
    sel.addEventListener('change',sync);

    // Code that sets select.value / .selectedIndex directly (e.g. "Clear filters") must update the pill.
    // Done with a per-element prototype (not own properties): <select> is a legacy platform object and some
    // engines (e.g. jsdom's Proxy) skip own accessors on it, but always honour the prototype chain.
    var SP=HTMLSelectElement.prototype, proto=Object.create(SP);
    ['value','selectedIndex'].forEach(function(p){
      var d=Object.getOwnPropertyDescriptor(SP,p);
      Object.defineProperty(proto,p,{configurable:true,get:function(){return d.get.call(this);},set:function(v){d.set.call(this,v);if(this._acs)this._acs.sync();}});
    });
    Object.setPrototypeOf(sel,proto);
    var api={open:open,close:close,sync:sync,place:place,menu:menu,btn:btn};
    sel._acs=api;sync();
    return api;
  };
  A.enhanceSelects=function(root){(root||document).querySelectorAll('select:not([data-native])').forEach(function(s){A.select(s);});};
  document.addEventListener('mousedown',function(e){if(openAcs&&!openAcs.menu.contains(e.target)&&!openAcs.btn.contains(e.target))openAcs.close(false);});
  window.addEventListener('resize',function(){if(openAcs)openAcs.place();});
  document.addEventListener('scroll',function(e){if(openAcs&&!openAcs.menu.contains(e.target))openAcs.place();},true);
  A.enhanceSelects();

  // Profile menu on the rail account pill (same items as ui_screens). Only Logout is wired for now.
  var me=document.querySelector('.rail .me');
  if(me){
    var auth={};try{auth=JSON.parse(localStorage.getItem('acurat.auth'))||{};}catch(e){}
    var tp=auth.portal==='taxpayer'; // taxpayer view: name + Taxpayer, Settings / Switch return instead of Administration
    var email=tp?'John E Smith':(auth.email||'demo@acurat.com'), ini=email.charAt(0).toUpperCase();
    me.title=email;
    var meAv=me.querySelector('.av'), meName=me.querySelector('.who b');
    if(meAv)meAv.textContent=ini; if(meName)meName.textContent=email;
    me.setAttribute('role','button');me.setAttribute('tabindex','0');
    me.setAttribute('aria-haspopup','menu');me.setAttribute('aria-expanded','false');me.setAttribute('aria-label','Open profile menu');

    var ic=function(d){return '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>';};
    var esc=function(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
    var menu=document.createElement('div');
    menu.className='pmenu';menu.setAttribute('role','menu');menu.setAttribute('aria-label','Profile');menu.hidden=true;
    menu.innerHTML=
      '<button type="button" class="ph" role="menuitem" title="Switch workspace"><span class="av" aria-hidden="true">'+ini+'</span><span class="pt"><b>'+esc(email)+'</b><span>'+(tp?'Taxpayer':'Admin')+'</span></span>'+
        '<svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>'+
      '<div class="pl">'+
        '<button type="button" role="menuitem" data-act="profile">'+ic('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>')+'My Profile</button>'+
        '<button type="button" role="menuitem" data-act="admin">'+ic('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>')+(tp?'Settings':'Administration')+'</button>'+
        (tp?'<button type="button" role="menuitem" data-act="switch">'+ic('<path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/>')+'Switch return</button>':'')+
        '<button type="button" role="menuitem" data-act="logout">'+ic('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>')+'Logout</button>'+
      '</div>';
    document.body.appendChild(menu);

    var place=function(){var r=me.getBoundingClientRect();menu.style.left=(r.right+12)+'px';menu.style.bottom=Math.max(8,window.innerHeight-r.bottom)+'px';};
    var openMenu=function(){place();menu.hidden=false;me.setAttribute('aria-expanded','true');var f=menu.querySelector('.pl button');if(f)f.focus();};
    var closeMenu=function(back){if(menu.hidden)return;menu.hidden=true;me.setAttribute('aria-expanded','false');if(back)me.focus();};
    me.addEventListener('click',function(){menu.hidden?openMenu():closeMenu();});
    me.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();menu.hidden?openMenu():closeMenu();}});
    document.addEventListener('mousedown',function(e){if(!menu.hidden&&!menu.contains(e.target)&&!me.contains(e.target))closeMenu();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!menu.hidden){e.stopImmediatePropagation();closeMenu(true);}},true);
    window.addEventListener('resize',function(){if(!menu.hidden)place();});
    menu.addEventListener('click',function(e){
      var b=e.target.closest('button');if(!b)return;
      if(b.getAttribute('data-act')==='logout'){
        try{var s=JSON.parse(localStorage.getItem('acurat.auth'))||{};s.signedIn=false;s.schema=null;s.portal=null;localStorage.setItem('acurat.auth',JSON.stringify(s));}catch(err){}
        if(tp)try{var t=JSON.parse(localStorage.getItem('acurat.tp'))||{};t.selectedId=null;localStorage.setItem('acurat.tp',JSON.stringify(t));}catch(err){}
        try{sessionStorage.removeItem('acurat.focus');}catch(err){}
        location.replace('login.html');return;
      }
      var act=b.getAttribute('data-act');
      if(act==='switch'){location.href='portal-select.html';return;}
      if(tp&&(act==='profile'||act==='admin')){closeMenu(true);if(A.toast)A.toast('Settings is coming soon.','info');return;}
      if(act==='profile'){location.href='admin.html?tab=my-profile';return;}
      if(act==='admin'){location.href='admin.html';return;}
      closeMenu(true); // Switch workspace: not wired yet
    });
  }
})();
