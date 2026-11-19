/* Acurat auth demo — mirrors ui_screens login flow with local mock data.
   Flow: login.html (email) → login-workspace.html → login-password.html → index.html
   Also: forgot-password.html (email | ?uid&token reset | broken link), set-password.html (?mode=invite|reset). */
(function(){
  var KEY='acurat.auth', FLASH='acurat.flash';
  var DEMO_EMAIL='demo@acurat.com', DEMO_PASSWORD='password123';

  // Same workspaces as ui_screens MOCK_TENANTS. Taxpayer portal signs in to portal-select.html (pick a return).
  var TENANTS=[
    {workspace:'acme',name:'Acme CPA Group',meta:'6 members · San Francisco, CA',tone:'indigo'},
    {workspace:'beacon',name:'Beacon Tax Advisors',meta:'4 members · Austin, TX',tone:'blue'},
    {workspace:'taxpayer-portal',name:'Taxpayer portal',meta:'John E Smith · client view',tone:'peach',portal:'taxpayer'}
  ];
  var selectable=function(){return TENANTS.filter(function(t){return !t.disabled;});};

  // ---------- storage (wrapped: may be blocked) ----------
  function read(){try{return JSON.parse(localStorage.getItem(KEY))||{};}catch(e){return {};}}
  function write(patch){var s=read();for(var k in patch)s[k]=patch[k];try{localStorage.setItem(KEY,JSON.stringify(s));}catch(e){}return s;}
  function setFlash(m){try{sessionStorage.setItem(FLASH,m);}catch(e){}}
  function takeFlash(){try{var m=sessionStorage.getItem(FLASH);sessionStorage.removeItem(FLASH);return m;}catch(e){return null;}}
  function go(url,replace){replace?location.replace(url):location.href=url;}
  function $(id){return document.getElementById(id);}
  function initials(s){if(!s)return '?';return s.split(/[\s@._-]+/).filter(Boolean).slice(0,2).map(function(w){return w[0].toUpperCase();}).join('');}
  function tenant(ws){for(var i=0;i<TENANTS.length;i++)if(TENANTS[i].workspace===ws)return TENANTS[i];return null;}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

  // ---------- validation: errors show after blur or submit, then update live ----------
  function field(name,rule){
    var wrap=document.querySelector('[data-field="'+name+'"]'), input=wrap.querySelector('input'), msg=wrap.querySelector('.ferr'), touched=false;
    function check(){
      var e=rule(input.value);
      wrap.classList.toggle('err',!!e);
      input.setAttribute('aria-invalid',e?'true':'false');
      if(e){msg.textContent=e;msg.hidden=false;input.setAttribute('aria-describedby',msg.id);}
      else{msg.hidden=true;input.removeAttribute('aria-describedby');}
      return !e;
    }
    input.addEventListener('blur',function(){touched=true;check();});
    input.addEventListener('input',function(){if(touched)check();});
    return {input:input,check:function(){touched=true;return check();}};
  }
  var EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function emailRule(v){v=v.trim();if(!v)return 'Email is required';if(v.length>255||!EMAIL_RE.test(v))return 'Must be a valid email';return '';}
  function newPwdRule(v){if(!v)return 'Password is required';if(v.length<8)return 'At least 8 characters';if(v.length>128)return 'Too long';if(!/[A-Za-z]/.test(v))return 'Must include a letter';if(!/\d/.test(v))return 'Must include a number';return '';}

  // Show/hide password buttons
  document.querySelectorAll('[data-eye]').forEach(function(b){
    b.addEventListener('mousedown',function(e){e.preventDefault();});
    b.addEventListener('click',function(){
      var inp=$(b.getAttribute('data-eye')), show=inp.type==='password';
      inp.type=show?'text':'password';
      b.setAttribute('aria-label',show?'Hide password':'Show password');b.title=b.getAttribute('aria-label');
      b.querySelector('.i-eye').toggleAttribute('hidden',!show);b.querySelector('.i-eyeoff').toggleAttribute('hidden',show);
    });
  });

  function busy(btn,label){btn.disabled=true;btn.dataset.label=btn.innerHTML;btn.textContent=label;}

  var page=document.body.getAttribute('data-page');

  // ---------- Step 1: email ----------
  if(page==='email'){
    // Landing on the sign-in screen starts a fresh session (no sign-out control exists yet).
    var st=write({signedIn:false});
    var f=$('form'), em=field('email',emailRule);
    em.input.value=st.email||DEMO_EMAIL;
    var m=takeFlash();if(m){$('flashText').textContent=m;$('flash').hidden=false;}
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(!em.check())return;
      var email=em.input.value.trim(), active=selectable();
      busy($('submit'),'Finding workspaces…');
      setTimeout(function(){
        if(active.length===1){write({email:email,schema:active[0].workspace});go('login-password.html');}
        else{write({email:email,schema:null});go('login-workspace.html');}
      },350);
    });
  }

  // ---------- Step 2: workspace ----------
  if(page==='workspace'){
    var s2=read();
    if(!s2.email){go('login.html',true);return;}
    if(selectable().length===1){write({schema:selectable()[0].workspace});go('login-password.html',true);return;}
    $('emailChipText').textContent=s2.email;$('emailChipAv').textContent=initials(s2.email);
    var list=$('wsList'), arrow=$('tplArrow').innerHTML;
    TENANTS.forEach(function(t){
      var b=document.createElement('button');
      b.type='button';b.className='wsc';
      if(t.disabled){b.setAttribute('aria-disabled','true');b.title='Taxpayer sign-in is coming soon';}
      b.innerHTML='<span class="wav '+t.tone+'" aria-hidden="true">'+initials(t.name)+'</span>'+
        '<span class="wtx"><b>'+esc(t.name)+'</b><span>'+esc(t.meta)+'</span></span>'+
        (t.disabled?'<span class="soon">Coming soon</span>':arrow);
      b.addEventListener('click',function(){if(t.disabled)return;write({schema:t.workspace});go('login-password.html');});
      list.appendChild(b);
    });
    $('diffEmail').addEventListener('click',function(){write({email:null,schema:null});go('login.html');});
  }

  // ---------- Step 3: password ----------
  if(page==='password'){
    var s3=read(), t3=tenant(s3.schema);
    if(!s3.email||!t3||t3.disabled){go('login.html',true);return;}
    $('title').textContent='Sign in to '+t3.name;
    $('wsAv').textContent=initials(t3.name);$('wsAv').className='wav '+t3.tone;
    $('wsName').textContent=t3.name;$('wsEmail').textContent=s3.email;
    $('change').hidden=selectable().length<2;
    var pw=field('password',function(v){return v?'':'Password is required';});
    pw.input.value=DEMO_PASSWORD;
    $('form').addEventListener('submit',function(e){
      e.preventDefault();
      if(!pw.check())return;
      busy($('submit'),'Signing in…');
      setTimeout(function(){var tp=t3.portal==='taxpayer';write({signedIn:true,portal:tp?'taxpayer':'firm'});go(tp?'portal-select.html':'index.html');},400);
    });
  }

  // ---------- Forgot password (3 modes from the URL) ----------
  if(page==='forgot'){
    var q=new URLSearchParams(location.search), fix=function(v){return v?v.replace(/ /g,'+'):'';};
    var uid=fix(q.get('uid')), token=fix(q.get('token'));
    var mode=(uid&&token)?'reset':(uid||token)?'broken':'email';
    $('v-'+mode).hidden=false;
    if(mode==='email'){
      var fe=field('email',emailRule);
      fe.input.value=read().email||DEMO_EMAIL;
      $('emailForm').addEventListener('submit',function(e){
        e.preventDefault();
        if(!fe.check())return;
        busy($('emailSubmit'),'Sending…');
        setTimeout(function(){setFlash('Reset link sent. Check your inbox.');go('login.html',true);},400);
      });
    }
    if(mode==='reset')wireNewPassword('resetForm','resetSubmit','Updating…',function(){$('v-reset').hidden=true;$('v-done').hidden=false;});
  }

  // ---------- Set password (?mode=invite | reset) ----------
  if(page==='set'){
    var invite=new URLSearchParams(location.search).get('mode')==='invite';
    var C=invite?{h:'Welcome aboard',s:'Set a password to activate your account.',b:'Activate account',dt:'Your account is ready',db:'You can now sign in with your new password — we’ve kept your email on file.'}
               :{h:'Choose a new password',s:'Pick something you haven’t used before — at least 8 characters.',b:'Update password',dt:'Password updated',db:'Your password was reset successfully. You can now sign in with the new one.'};
    document.title='Acurat — '+C.h;
    $('heading').textContent=C.h;$('sub').textContent=C.s;$('submitLabel').textContent=C.b;
    $('doneTitle').textContent=C.dt;$('doneBody').textContent=C.db;
    wireNewPassword('setForm','setSubmit',invite?'Activating…':'Updating…',function(){$('v-form').hidden=true;$('v-done').hidden=false;});
  }

  function wireNewPassword(formId,btnId,busyLabel,onDone){
    var p1=field('password',newPwdRule);
    var p2=field('confirm',function(v){if(!v)return 'Please confirm your password';return v===p1.input.value?'':'Passwords do not match';});
    p1.input.addEventListener('input',function(){if(p2.input.value)p2.check();});
    $(formId).addEventListener('submit',function(e){
      e.preventDefault();
      var a=p1.check(), b=p2.check();
      if(!a||!b)return;
      var btn=$(btnId);busy(btn,busyLabel);
      setTimeout(function(){btn.disabled=false;btn.innerHTML=btn.dataset.label;onDone();},400);
    });
  }
})();
