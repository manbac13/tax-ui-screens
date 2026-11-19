/* Acurat client workspace header (smith-*.html): the "More actions" (⋯) menu.
   - Edit client      → the Add client dialog in edit mode (same as ui_screens AddClientDialog with `initial`)
   - New engagement   → the New engagement dialog (Engagements tab; opened there via ?new=1 from other tabs)
   - Add person       → the Add / assign dialog (People & access tab; opened there via ?add=person)
   Edited client details are kept in localStorage so every client tab shows them. Load after acurat.js. */
(function(){
  var A=window.Acurat, KEY='acurat.client.smith';
  var DEF={name:'Smith Family',contact:'John E Smith',email:'myfirm.client+1005@gmail.com',phone:'(951) 555-0190'};
  var EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function read(){var s={};try{s=JSON.parse(localStorage.getItem(KEY))||{};}catch(e){}for(var k in DEF)if(!s[k])s[k]=DEF[k];return s;}
  function write(s){try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}}
  var initials=function(n){return n.split(/\s+/).filter(Boolean).map(function(w){return w[0];}).join('').slice(0,2).toUpperCase();};

  /* ---------- Apply saved details to the header (name, avatar, breadcrumb, phone, title) ---------- */
  function apply(c){
    var h1=document.querySelector('.ws-name h1');if(!h1)return;
    var old=h1.textContent;h1.textContent=c.name;
    var avEl=document.querySelector('.ws-head .ws-av');if(avEl)avEl.textContent=initials(c.name);
    document.querySelectorAll('.ws-head .crumbs a, .ws-head .crumbs span[aria-current]').forEach(function(el){if(el.textContent===old||el.textContent===DEF.name)el.textContent=c.name;});
    var st=document.querySelectorAll('.ws-head .ws-id > .status > span');if(st.length>=2)st[st.length-1].textContent=c.phone||'No phone';
    document.title=document.title.replace(old,c.name);
    var sub=document.getElementById('neSub');if(sub)sub.textContent='For '+c.name+'. An engagement gets its own letter, request list and binder.';
  }

  /* ---------- Edit client dialog (shared dialog component) ---------- */
  var dlgApi=null,touched=false;
  function build(){
    var wrap=document.createElement('div');
    wrap.innerHTML=
      '<div class="dlg-back" id="ecDlg" hidden><div class="dlg" role="dialog" aria-modal="true" aria-labelledby="ecTitle" aria-describedby="ecSub">'+
        '<div class="dlg-h"><div><h2 id="ecTitle">Edit client</h2><p id="ecSub">Update the name and primary contact details.</p></div>'+
          '<button type="button" class="hb" data-dlg-close aria-label="Close" title="Close"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div>'+
        '<form id="ecForm" novalidate><div class="dlg-b">'+
          '<div class="dfld full" data-f="name"><label for="ecName">Client name <i aria-hidden="true">*</i></label><input id="ecName" placeholder="Smith Family" autocomplete="off" autofocus><p class="ferr" id="ecName-err" hidden></p></div>'+
          '<div class="dfld" data-f="email"><label for="ecEmail">Contact email <i aria-hidden="true">*</i></label><input id="ecEmail" type="email" placeholder="name@example.com" autocomplete="off"><p class="ferr" id="ecEmail-err" hidden></p></div>'+
          '<div class="dfld"><label for="ecPhone">Phone</label><input id="ecPhone" type="tel" placeholder="(555) 000-0000" autocomplete="off"></div>'+
        '</div><div class="dlg-f"><button type="button" class="dbtn sec" data-dlg-close>Cancel</button><button type="submit" class="dbtn">Save changes</button></div></form>'+
      '</div></div>';
    document.body.appendChild(wrap.firstChild);
    var $=function(id){return document.getElementById(id);};
    function errs(){return {name:$('ecName').value.trim()?'':'Enter a client name',email:EMAIL_RE.test($('ecEmail').value.trim())?'':'Enter a valid email'};}
    function show(){
      var e=errs();
      [['name','ecName'],['email','ecEmail']].forEach(function(p){
        var w=document.querySelector('#ecDlg [data-f="'+p[0]+'"]'),m=$(p[1]+'-err'),on=touched&&!!e[p[0]];
        w.classList.toggle('err',on);m.hidden=!on;m.textContent=on?e[p[0]]:'';$(p[1]).setAttribute('aria-invalid',on?'true':'false');
      });
      return !e.name&&!e.email;
    }
    ['ecName','ecEmail'].forEach(function(id){$(id).addEventListener('input',function(){if(touched)show();});});
    $('ecForm').addEventListener('submit',function(ev){
      ev.preventDefault();touched=true;
      if(!show()){(errs().name?$('ecName'):$('ecEmail')).focus();return;}
      var c=read();c.name=$('ecName').value.trim();c.email=$('ecEmail').value.trim().toLowerCase();c.phone=$('ecPhone').value.trim();
      write(c);apply(c);dlgApi.close();A.toast('Client updated: '+c.name);
    });
    dlgApi=A.dialog($('ecDlg'),{onOpen:function(){
      var c=read();touched=false;$('ecName').value=c.name;$('ecEmail').value=c.email;$('ecPhone').value=c.phone;show();
    }});
  }
  function editClient(){if(!dlgApi)build();dlgApi.open();}

  /* ---------- Wire the header menu ---------- */
  var menu=document.querySelector('.ws-head details.switch.more');
  if(menu){
    menu.querySelectorAll('.menu a').forEach(function(a){
      var t=a.textContent.trim();
      a.addEventListener('click',function(e){
        e.preventDefault();menu.removeAttribute('open');
        if(t==='Edit client')editClient();
        else if(t==='New engagement'){var b=document.getElementById('newEng');if(b)b.click();else location.href='smith-engagements.html?new=1';}
        else if(t==='Add person'){var p=document.getElementById('addAssign');if(p)p.click();else location.href='smith-people-access.html?add=person';}
      });
    });
    // keyboard: ↑/↓ inside the open menu, Esc closes and returns focus to the ⋯ button
    menu.addEventListener('toggle',function(){if(menu.open){var f=menu.querySelector('.menu a');if(f)f.focus();}});
    menu.addEventListener('keydown',function(e){
      if(!menu.open)return;
      var items=Array.prototype.slice.call(menu.querySelectorAll('.menu a')),i=items.indexOf(document.activeElement);
      if(e.key==='ArrowDown'){e.preventDefault();items[(i+1)%items.length].focus();}
      else if(e.key==='ArrowUp'){e.preventDefault();items[(i-1+items.length)%items.length].focus();}
      else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();menu.removeAttribute('open');menu.querySelector('summary').focus();}
    });
  }
  apply(read());
  window.AcuratClient={edit:editClient,get:read};
})();
