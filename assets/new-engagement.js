/* Acurat · New engagement dialog (shared). Mirrors ui_screens pages/engagements/NewEngagementDialog.
   NewEngagement.open({ client:{id,name,partner,email} | null, clients:[{id,name,type,email,partner}],
                        engagements:[{id,client,name,form,year,status,team,email,fee}], onCreated(eng, draft) })
   - engagements: once a client is set, the people on its engagements fill an optional "Start from People You Know"
     picker that copies first/last name, email, fee and team into the form. The return is left for the user to pick.
   - With a client (opened from a client page) the Client field is hidden; otherwise the user picks one first.
   - allowNewClient (Engagements list only): adds "Create New client" to the Client field. No People You Know list then;
     on save eng.newClient = {id,name,type:'Individual',email,partner} for the page to add to its clients.
   - Two steps: details / portal access / team, then the engagement letter (template + mock editor). Load after acurat.js. */
(function(){
  var MARKUP="  <div class=\"dlg-back\" id=\"neDlg\" hidden>\n    <div class=\"dlg lg\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"neTitle\" aria-describedby=\"neSub\">\n      <div class=\"dlg-h\">\n        <div><h2 id=\"neTitle\">New engagement</h2><p id=\"neSub\">An engagement gets its own letter, request list and binder.</p></div>\n        <div class=\"dlg-ha\"><span class=\"dstep\" id=\"neStep\">Step 1 of 2 · Details</span><button type=\"button\" class=\"hb\" data-dlg-close aria-label=\"Close\" title=\"Close\"><svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 6L6 18M6 6l12 12\"/></svg></button></div>\n      </div>\n      <form id=\"neForm\" novalidate>\n        <div class=\"dlg-b one\">\n          <!-- Step 1 · Details -->\n          <div class=\"dsecs\" id=\"neS1\">\n            <div id=\"neClientSec\" hidden>\n              <h3 class=\"dsec-t\">Client</h3>\n              <div class=\"dfld\" data-f=\"client\"><label for=\"neClient\">Client <i aria-hidden=\"true\">*</i></label><select id=\"neClient\" data-search><option value=\"\">Select a client</option></select><p class=\"ferr\" id=\"neClient-err\" hidden></p><p class=\"hint\" id=\"neClient-hint\" hidden>A new client is created from the name and email below.</p></div>\n            </div>\n            <div id=\"nePrevSec\" hidden>\n              <div class=\"dfld\"><label for=\"nePrev\">Start from People You Know <small>(optional)</small></label><select id=\"nePrev\" data-search><option value=\"\">Start fresh</option></select><p class=\"hint\" id=\"nePrev-hint\">Pick one to fill in its details. Leave it empty to start a new one.</p></div>\n            </div>\n            <div>\n              <h3 class=\"dsec-t\">Engagement details</h3>\n              <div class=\"dgrid\">\n                <div class=\"dfld\" data-f=\"first\"><label for=\"neFirst\">First name <i aria-hidden=\"true\">*</i></label><input id=\"neFirst\" placeholder=\"John\" autocomplete=\"off\" autofocus><p class=\"ferr\" id=\"neFirst-err\" hidden></p></div>\n                <div class=\"dfld\" data-f=\"last\"><label for=\"neLast\">Last name <i aria-hidden=\"true\">*</i></label><input id=\"neLast\" placeholder=\"Smith\" autocomplete=\"off\"><p class=\"ferr\" id=\"neLast-err\" hidden></p></div>\n                <div class=\"dfld\" data-f=\"name\"><label for=\"neName\">Engagement name <i aria-hidden=\"true\">*</i></label><input id=\"neName\" placeholder=\"John Smith - 1040\" autocomplete=\"off\"><p class=\"ferr\" id=\"neName-err\" hidden></p></div>\n                <div class=\"dfld\" data-f=\"email\"><label for=\"neEmail\">Email <small>(optional)</small></label><input id=\"neEmail\" type=\"email\" placeholder=\"name@example.com\" autocomplete=\"off\"><p class=\"ferr\" id=\"neEmail-err\" hidden></p><p class=\"hint\" id=\"neEmail-hint\">Needed to give them portal access.</p></div>\n                <div class=\"dfld\" data-f=\"form\"><label for=\"neReturn\">Return <i aria-hidden=\"true\">*</i></label><select id=\"neReturn\" data-search><option value=\"\">Search returns</option></select><p class=\"ferr\" id=\"neReturn-err\" hidden></p></div>\n                <div class=\"dfld\"><label for=\"neYear\">Tax year</label><select id=\"neYear\"><option>2025</option><option>2024</option><option>2023</option></select></div>\n                <div class=\"dfld\"><label for=\"neDue\">Due date</label><input id=\"neDue\" placeholder=\"Apr 15, 2026\" autocomplete=\"off\"></div>\n                <div class=\"dfld\"><label for=\"neFee\">Fee</label><div class=\"affix\"><span aria-hidden=\"true\">$</span><input id=\"neFee\" inputmode=\"numeric\" placeholder=\"Your fee\" autocomplete=\"off\"></div></div>\n              </div>\n            </div>\n            <div class=\"trow\">\n              <div><b id=\"nePortalT\">Portal access</b><span id=\"nePortalTxt\">Add an email above to invite them to the portal.</span></div>\n              <button type=\"button\" class=\"tgl\" id=\"nePortal\" role=\"switch\" aria-checked=\"false\" aria-labelledby=\"nePortalT\" disabled></button>\n            </div>\n            <div>\n              <h3 class=\"dsec-t\">Team</h3>\n              <div class=\"dfld\" data-f=\"team\"><label for=\"neTeam\">Who has access to this <small>(optional)</small></label><select id=\"neTeam\" multiple data-placeholder=\"Add team members\"></select><p class=\"ferr\" id=\"neTeam-err\" hidden></p></div>\n            </div>\n            <div class=\"trow\">\n              <div><b id=\"neSendT\">Send an engagement letter</b><span id=\"neSendTxt\">Pick a template and edit the letter on the next step.</span></div>\n              <button type=\"button\" class=\"tgl\" id=\"neSend\" role=\"switch\" aria-checked=\"true\" aria-labelledby=\"neSendT\"></button>\n            </div>\n          </div>\n\n          <!-- Step 2 · Engagement letter -->\n          <div class=\"dsecs\" id=\"neS2\" hidden style=\"gap:16px\">\n            <div class=\"dfld\" data-f=\"letter\"><label for=\"neTpl\">Engagement letter template <i aria-hidden=\"true\">*</i></label><select id=\"neTpl\"><option value=\"\">Select a template</option></select><p class=\"ferr\" id=\"neTpl-err\" hidden></p></div>\n            <div id=\"neLetterWrap\">\n              <div class=\"dfld\">\n                <div class=\"lrow\"><label id=\"neLetterL\">Letter</label><button type=\"button\" class=\"lnk\" id=\"neReset\" hidden style=\"font-size:12px\">Reset to template</button></div>\n                <div class=\"fchips\" id=\"neFields\"><span>Insert field</span></div>\n                <div class=\"rte\">\n                  <div class=\"rte-bar\" role=\"toolbar\" aria-label=\"Formatting\">\n                    <button type=\"button\" data-cmd=\"bold\" title=\"Bold\" aria-label=\"Bold\"><b>B</b></button>\n                    <button type=\"button\" data-cmd=\"italic\" title=\"Italic\" aria-label=\"Italic\"><i style=\"font-family:Georgia,serif\">I</i></button>\n                    <button type=\"button\" data-cmd=\"underline\" title=\"Underline\" aria-label=\"Underline\"><u>U</u></button>\n                    <i aria-hidden=\"true\"></i>\n                    <button type=\"button\" data-cmd=\"insertOrderedList\" title=\"Numbered list\" aria-label=\"Numbered list\"><svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"><path d=\"M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1\"/></svg></button>\n                    <button type=\"button\" data-cmd=\"insertUnorderedList\" title=\"Bulleted list\" aria-label=\"Bulleted list\"><svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\"><path d=\"M9 6h12M9 12h12M9 18h12\"/><circle cx=\"4.5\" cy=\"6\" r=\"1\" fill=\"currentColor\"/><circle cx=\"4.5\" cy=\"12\" r=\"1\" fill=\"currentColor\"/><circle cx=\"4.5\" cy=\"18\" r=\"1\" fill=\"currentColor\"/></svg></button>\n                    <i aria-hidden=\"true\"></i>\n                    <button type=\"button\" data-cmd=\"createLink\" title=\"Link\" aria-label=\"Link\"><svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7\"/><path d=\"M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7\"/></svg></button>\n                    <i aria-hidden=\"true\"></i>\n                    <button type=\"button\" data-block=\"h2\" title=\"Heading 2\" aria-label=\"Heading 2\" style=\"width:auto;padding:0 6px\">H2</button>\n                    <button type=\"button\" data-block=\"h3\" title=\"Heading 3\" aria-label=\"Heading 3\" style=\"width:auto;padding:0 6px\">H3</button>\n                    <button type=\"button\" data-block=\"p\" title=\"Normal text\" aria-label=\"Normal text\">¶</button>\n                    <i aria-hidden=\"true\"></i>\n                    <button type=\"button\" data-cmd=\"removeFormat\" title=\"Clear formatting\" aria-label=\"Clear formatting\"><svg aria-hidden=\"true\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 7V5h11v2M9.5 5 7 19M5 19h5M15 14l6 6M21 14l-6 6\"/></svg></button>\n                  </div>\n                  <div class=\"rte-ed\" id=\"neLetter\" contenteditable=\"true\" role=\"textbox\" aria-multiline=\"true\" aria-labelledby=\"neLetterL\" data-placeholder=\"Write the letter…\"></div>\n                </div>\n                <p class=\"hint\">Edits apply to this engagement only — the template stays as it is. Fields like {{Client name}} are filled in when the letter is sent; hover a field to see its value.</p>\n              </div>\n            </div>\n            <div class=\"dempty\" id=\"neLetterEmpty\" hidden>Pick a template to preview and edit the letter.</div>\n          </div>\n        </div>\n        <div class=\"dlg-f\">\n          <button type=\"button\" class=\"dbtn sec\" id=\"neCancel\" data-dlg-close>Cancel</button>\n          <button type=\"button\" class=\"dbtn sec\" id=\"neBack\" hidden><svg aria-hidden=\"true\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M19 12H5\"/><path d=\"M12 19l-7-7 7-7\"/></svg>Back</button>\n          <span class=\"sp\"></span>\n          <button type=\"button\" class=\"dbtn sec\" id=\"neDraft\">Save as draft</button>\n          <button type=\"submit\" class=\"dbtn\" id=\"neNext\">Continue<svg aria-hidden=\"true\" width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M5 12h14\"/><path d=\"M12 5l7 7-7 7\"/></svg></button>\n        </div>\n      </form>\n    </div>\n  </div>\n";
  var mounted=false,OPTS={},CLIENT=null,NEWC=false,dlg=null,NEW_CLIENT='__new__'; // NEWC: "Create New client" picked
  var $=function(id){return document.getElementById(id);};
  function mount(){
    if(mounted)return;mounted=true;
    var w=document.createElement('div');w.innerHTML=MARKUP;document.body.appendChild(w.firstElementChild);
    init();window.Acurat.enhanceSelects($('neDlg'));
  }
  function init(){
  /* ---------- Reference data (same as ui_screens data/engagements.js, data/clients.js, data/letterTemplates.js) ---------- */
  var TAX_YEAR=2025;
  var TYPES=[
    {code:'1040',label:'Individual',who:'U.S. individuals'},{code:'1040-SR',label:'Individual – Senior',who:'Individuals age 65+'},
    {code:'1040-NR',label:'Individual – Nonresident',who:'Nonresident alien individuals'},{code:'1065',label:'Partnership',who:'Partnerships and most multi-member LLCs'},
    {code:'1120-S',label:'S Corporation',who:'S corporations'},{code:'1120',label:'C Corporation',who:'C corporations'},
    {code:'1041',label:'Trust & Estate Income',who:"Trusts and decedents' estates"},{code:'990',label:'Nonprofit',who:'Tax-exempt organizations'},
    {code:'990-EZ',label:'Nonprofit – Short Form',who:'Eligible smaller nonprofits'},{code:'990-PF',label:'Private Foundation',who:'Private foundations'},
    {code:'706',label:'Estate Transfer Tax',who:'Estates subject to estate tax reporting'},{code:'709',label:'Gift Tax',who:'Individuals reporting certain gifts'},
    {code:'941',label:'Employment Tax',who:'Employers reporting payroll taxes quarterly'},{code:'940',label:'Unemployment Tax',who:'Employers reporting federal unemployment tax'},
    {code:'720',label:'Excise Tax',who:'Businesses subject to certain federal excise taxes'},{code:'1042',label:'Foreign Withholding',who:'Withholding agents reporting U.S.-source income paid to foreign persons'}];
  var typeLabel=function(c){for(var i=0;i<TYPES.length;i++)if(TYPES[i].code===c)return TYPES[i].label;return c;};
  var DUE={'1040':'Apr 15','1040-SR':'Apr 15','1040-NR':'Apr 15','1065':'Mar 15','1120-S':'Mar 15','1120':'Apr 15','1041':'Apr 15','990':'May 15','990-EZ':'May 15','990-PF':'May 15','706':'Sep 30','709':'Apr 15','941':'Jan 31','940':'Jan 31','720':'Jan 31','1042':'Mar 15'};
  var FEES={'1040':850,'1040-SR':900,'1040-NR':1100,'1065':2400,'1120-S':2800,'1120':3500,'1041':1500,'990':2200,'990-EZ':1200,'990-PF':2600,'706':6000,'709':750,'941':300,'940':250,'720':400,'1042':1800};
  var TEAM=[{i:'AS',name:'Ashok Sudeep',title:'CPA'},{i:'RK',name:'Rita K.',title:'Senior preparer'},{i:'SM',name:'Sam M.',title:'Reviewer'},{i:'AP',name:'Anika P.',title:'Preparer'},{i:'JL',name:'Jordan L.',title:'Staff accountant'}];
  var TEMPLATES=[
    {id:'lt-1',name:'Standard 1040 engagement',description:'Individual return engagement letter with scope, fees and e-sign request.',body:'<p>Dear {{Client name}},</p><p>Thank you for engaging us to prepare your {{Filing status}} return for tax year {{Tax year}}. This letter outlines the scope of our engagement and the responsibilities of each party.</p><p><strong>Scope.</strong> We will prepare your federal and state income tax returns based on documents you provide. Bookkeeping, audit defense, and entity-level work are not included.</p><p>Please review and sign below to confirm. We look forward to working with you.</p><p>Sincerely,<br>{{Preparer name}}</p>'},
    {id:'lt-2',name:'Returning client',description:"Warmer, shorter copy for clients you've filed for before.",body:'<p>Hi {{Client name}},</p><p>Great to be working with you again for the {{Tax year}} tax season. This letter renews our engagement for your {{Filing status}} return on the same terms as last year.</p><p>Please review and sign below so we can get started — we will follow up shortly with your document checklist.</p><p>Thanks as always,<br>{{Preparer name}}</p>'},
    {id:'lt-3',name:'Business entity engagement',description:'Partnership, S-Corp and C-Corp returns — scope, fees and responsibilities.',body:'<p>Dear {{Client name}},</p><p>This letter confirms that we will prepare the {{Tax year}} federal and state income tax returns for your business.</p><p><strong>Your responsibilities.</strong> You are responsible for the accuracy of the books and records you provide, including year-end trial balance and payroll reports.</p><p>Sincerely,<br>{{Preparer name}}</p>'},
    {id:'lt-4',name:'Extension filing',description:'For clients filing Form 4868 with engagement deferred.',body:'<p>Hi {{Client name}},</p><p>To buy us more time on your {{Tax year}} return, we are filing Form 4868 for an automatic extension. This pushes your filing deadline to October 15.</p><p><strong>Important:</strong> the extension covers the filing deadline only. Any taxes you owe are still due April 15.</p><p>Talk soon,<br>{{Preparer name}}</p>'},
    {id:'lt-5',name:'Nonprofit 990 engagement',description:'Exempt organization returns (990, 990-EZ, 990-PF).',body:'<p>Dear {{Client name}},</p><p>We are pleased to prepare your organization’s {{Tax year}} information return. This letter sets out the scope of our work and what we need from your board.</p><p>Sincerely,<br>{{Preparer name}}</p>'},
    {id:'lt-7',name:'Blank letter',description:'Start from scratch and write your own copy.',body:'<p><br></p>'}]; // lt-6 (payroll) is inactive, so it isn't offered
  var LETTER_FIELDS=['Client name','Tax year','Filing status','Preparer name','Fee','Form'];


  var EMAIL_RE=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var F={first:$('neFirst'),last:$('neLast'),name:$('neName'),email:$('neEmail'),form:$('neReturn'),year:$('neYear'),due:$('neDue'),fee:$('neFee'),team:$('neTeam'),letter:$('neTpl')};
  var st={step:1,nameEdited:false,touched:false,portal:false,letterEdited:false,letterBody:''};
  // Options built from the reference data
  TYPES.forEach(function(t){var o=document.createElement('option');o.value=t.code;o.textContent=t.code+' · '+t.label;o.setAttribute('data-desc',t.who);F.form.appendChild(o);});
  TEAM.forEach(function(t){var o=document.createElement('option');o.value=t.i;o.textContent=t.name+' ('+t.i+')';o.setAttribute('data-desc',t.title);o.setAttribute('data-short',t.name);F.team.appendChild(o);});
  TEMPLATES.forEach(function(t){var o=document.createElement('option');o.value=t.id;o.textContent=t.name;o.setAttribute('data-desc',t.description);F.letter.appendChild(o);});

  var dueFor=function(form,year){return DUE[form]?DUE[form]+', '+(Number(year)+1):'';};
  var letterFor=function(form){if(/^990/.test(form))return 'lt-5';if(['1065','1120','1120-S','1041'].indexOf(form)>=0)return 'lt-3';return 'lt-1';};
  var tplBody=function(id){for(var i=0;i<TEMPLATES.length;i++)if(TEMPLATES[i].id===id)return TEMPLATES[i].body;return '';};
  var teamSel=function(){return Array.prototype.filter.call(F.team.options,function(o){return o.selected;}).map(function(o){return o.value;});};
  var portalEmail=function(){var v=F.email.value.trim();return EMAIL_RE.test(v)?v.toLowerCase():'';};
  var fmtFee=function(){return F.fee.value?'$'+Number(F.fee.value).toLocaleString('en-US'):'';};
  function letterFields(){
    var lead=TEAM.filter(function(t){return t.i===teamSel()[0];})[0];
    return {'Client name':(F.first.value+' '+F.last.value).trim()||(CLIENT?CLIENT.name:''),'Tax year':String(F.year.value),'Preparer name':lead?lead.name:'','Fee':fmtFee(),'Form':F.form.value?'Form '+F.form.value:''};
  }
  function errors(){
    return {
      client:CLIENT||NEWC?'':'Pick a client',
      first:F.first.value.trim()?'':'Enter a first name',
      last:F.last.value.trim()?'':'Enter a last name',
      name:F.name.value.trim()?'':'Enter an engagement name',
      email:F.email.value.trim()&&!EMAIL_RE.test(F.email.value.trim())?'Enter a valid email':'',
      form:F.form.value?'':'Pick a return',
      team:'', // optional
      letter:!st.send||F.letter.value?'':'Pick a letter template'};
  }
  var FIELD_EL={client:'neClient',first:'neFirst',last:'neLast',name:'neName',email:'neEmail',form:'neReturn',team:'neTeam',letter:'neTpl'};
  function showErrors(){
    var e=errors();
    Object.keys(FIELD_EL).forEach(function(k){
      var wrap=$('neDlg').querySelector('[data-f="'+k+'"]'),m=$(FIELD_EL[k]+'-err'),on=st.touched&&!!e[k];
      wrap.classList.toggle('err',on);m.hidden=!on;m.textContent=on?e[k]:'';
      if(k==='email')$('neEmail-hint').hidden=on;
      if(k==='client')$('neClient-hint').hidden=on||!NEWC;
    });
    return e;
  }
  function autoName(){
    if(st.nameEdited)return;
    var who=(F.first.value+' '+F.last.value).trim();
    F.name.value=who&&F.form.value?who+' - '+F.form.value:who;
  }
  function syncPortal(){
    var pe=portalEmail(),on=st.portal&&!!pe,t=$('nePortal');
    t.disabled=!pe;t.setAttribute('aria-checked',on?'true':'false');
    $('nePortalTxt').textContent=!pe?'Add an email above to invite them to the portal.'
      :on?(F.first.value.trim()||'They')+' can see this engagement in the portal. Invite goes to '+pe+'.':'Only your team sees this engagement.';
  }
  function syncFields(){ // tooltip shows what each {{Field}} will become
    $('neDlg').querySelectorAll('#neFields .fchip').forEach(function(b){var v=letterFields()[b.dataset.field];b.title=v?'Becomes “'+v+'”':'Filled in when the letter is sent';});
  }
  function syncLetter(){
    var has=!!F.letter.value;
    $('neLetterWrap').hidden=!has;$('neLetterEmpty').hidden=has;$('neReset').hidden=!st.letterEdited;
    syncFields();
  }
  function setStep(n){
    st.step=n;$('neS1').hidden=n!==1;$('neS2').hidden=n!==2;
    foot();
    if(n===2)syncLetter();
    setTimeout(FOCUS_STEP,30);
  }
  function foot(){ // step label + footer buttons (the letter switch decides if there is a step 2)
    var n=st.step;
    $('neStep').textContent=st.send?'Step '+n+' of 2 · '+(n===1?'Details':'Engagement letter'):'Details';
    $('neCancel').hidden=n!==1;$('neBack').hidden=n!==2;
    $('neNext').innerHTML=n===1&&!st.send?'Create engagement':n===1?'Continue<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>':'Create &amp; send letter';
  }
  function FOCUS_STEP(){var n=st.step;(function(){(n===1?(OPTS.client?F.first:($('neClient')._acs?$('neClient')._acs.btn:F.first)):F.letter._acs?F.letter._acs.btn:F.letter).focus();})(); // after the dialog's own autofocus
  }
  function reset(){
    ['first','last','name','email','due','fee'].forEach(function(k){F[k].value='';});
    F.form.value='';F.year.value=String(TAX_YEAR);F.letter.value='';
    CLIENT=OPTS.client||null;NEWC=false;
    $('neClientSec').hidden=!!OPTS.client;
    var cs=$('neClient');while(cs.options.length>1)cs.remove(1);
    if(OPTS.allowNewClient&&!OPTS.client){var on=document.createElement('option');on.value=NEW_CLIENT;on.textContent='Create New client';on.setAttribute('data-desc','Made from the name and email below');cs.appendChild(on);}
    (OPTS.clients||[]).forEach(function(c){var o=document.createElement('option');o.value=c.id;o.textContent=c.name;o.setAttribute('data-desc',(c.type||'')+(c.email?' · '+c.email:''));cs.appendChild(o);});
    cs.value=CLIENT?CLIENT.id:'';
    fillPrev();
    $('neSub').textContent=(CLIENT&&OPTS.client?'For '+CLIENT.name+'. ':'')+'An engagement gets its own letter, request list and binder.';
    Array.prototype.forEach.call(F.team.options,function(o){o.selected=o.value===((CLIENT&&CLIENT.partner)||'AS');});
    F.team.dispatchEvent(new Event('change'));
    F.fee.placeholder='Your fee';
    st={step:1,nameEdited:false,touched:false,portal:false,letterEdited:false,letterBody:'',send:true};
    syncSend();
    $('neLetter').innerHTML='';
    showErrors();syncPortal();setStep(1);
  }
  /* ---------- Start from People You Know: once a client is known, list the people on its engagements (one row per
     name, newest engagement wins); picking one fills in their details. The return is never copied. ---------- */
  var PREV=$('nePrev');
  var prevOf=function(){
    var seen={};
    return (CLIENT?(OPTS.engagements||[]).filter(function(x){return !x.client||x.client===CLIENT.id;}):[])
      .slice().sort(function(a,b){return (b.year||0)-(a.year||0);})
      .filter(function(x){var k=String(x.name).toLowerCase();if(seen[k])return false;seen[k]=1;return true;});
  };
  function fillPrev(){
    while(PREV.options.length>1)PREV.remove(1);
    prevOf().forEach(function(x){var o=document.createElement('option');o.value=x.id;o.textContent=x.name;PREV.appendChild(o);});
    PREV.value='';$('nePrevSec').hidden=!CLIENT||PREV.options.length<2;
  }
  function splitName(n){var p=String(n||'').trim().split(/\s+/);return p.length<2?{first:p[0]||'',last:''}:{first:p.slice(0,-1).join(' '),last:p[p.length-1]};}
  function setTeam(ids){Array.prototype.forEach.call(F.team.options,function(o){o.selected=ids.indexOf(o.value)>=0;});F.team.dispatchEvent(new Event('change'));}
  PREV.addEventListener('change',function(){
    var x=prevOf().filter(function(y){return y.id===PREV.value;})[0],nm=splitName(x?x.name:'');
    F.first.value=nm.first;F.last.value=nm.last;st.nameEdited=false;
    F.email.value=x?(x.email||(CLIENT&&CLIENT.email)||''):'';st.hadEmail=false;F.email.dispatchEvent(new Event('input'));
    F.fee.value=x&&x.fee?String(x.fee):'';
    autoName();syncFields();if(st.touched)showErrors();
    setTeam(x&&x.team&&x.team.length?x.team:[(CLIENT&&CLIENT.partner)||'AS']);
    if(x)window.Acurat.toast('Filled in from '+x.name,'info');
  });

  var dlg=null;
  function dlgApi(){if(!dlg)dlg=window.Acurat.dialog($('neDlg'),{onOpen:reset});return dlg;}

  // Field behaviour (same rules as ui_screens)
  [F.first,F.last].forEach(function(el){el.addEventListener('input',function(){autoName();syncPortal();syncFields();if(st.touched)showErrors();});});
  F.name.addEventListener('input',function(){st.nameEdited=true;if(st.touched)showErrors();});
  F.email.addEventListener('input',function(){
    var valid=EMAIL_RE.test(F.email.value.trim());
    st.portal=valid?(st.hadEmail?st.portal:true):false; // turn on the first time a valid email appears
    st.hadEmail=valid;syncPortal();if(st.touched)showErrors();
  });
  $('nePortal').addEventListener('click',function(){if(this.disabled)return;st.portal=this.getAttribute('aria-checked')!=='true';syncPortal();});
  F.form.addEventListener('change',function(){
    var f=F.form.value;
    F.due.value=dueFor(f,F.year.value);
    F.fee.placeholder=f&&FEES[f]?String(FEES[f]):'Your fee';
    if(f){F.letter.value=letterFor(f);if(!st.letterEdited){st.letterBody='';$('neLetter').innerHTML='';}} // reload the matching template on Continue
    autoName();syncFields();if(st.touched)showErrors();
  });
  F.year.addEventListener('change',function(){F.due.value=dueFor(F.form.value,F.year.value);syncFields();});
  F.fee.addEventListener('input',function(){F.fee.value=F.fee.value.replace(/[^\d]/g,'');syncFields();});
  F.team.addEventListener('change',function(){syncFields();if(st.touched)showErrors();});
  F.letter.addEventListener('change',function(){ // picking a template replaces the letter
    $('neLetter').innerHTML=tplBody(F.letter.value);st.letterBody=$('neLetter').innerHTML;st.letterEdited=false;
    syncLetter();if(st.touched)showErrors();
  });
  $('neReset').addEventListener('click',function(){$('neLetter').innerHTML=tplBody(F.letter.value);st.letterEdited=false;syncLetter();});

  // Mock rich-text editor: contenteditable + execCommand (stands in for React Quill)
  var ed=$('neLetter'),savedRange=null;
  document.addEventListener('selectionchange',function(){var s=window.getSelection();if(s.rangeCount&&ed.contains(s.anchorNode))savedRange=s.getRangeAt(0).cloneRange();});
  function restore(){ed.focus();var s=window.getSelection();if(savedRange&&ed.contains(savedRange.startContainer)){s.removeAllRanges();s.addRange(savedRange);}else{var r=document.createRange();r.selectNodeContents(ed);r.collapse(false);s.removeAllRanges();s.addRange(r);}}
  ed.addEventListener('input',function(){st.letterEdited=true;st.letterBody=ed.innerHTML;$('neReset').hidden=false;});
  $('neDlg').querySelector('.rte-bar').addEventListener('mousedown',function(e){if(e.target.closest('button'))e.preventDefault();}); // keep the caret
  $('neDlg').querySelector('.rte-bar').addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;restore();
    if(b.dataset.block)document.execCommand('formatBlock',false,b.dataset.block);
    else if(b.dataset.cmd==='createLink'){var url=window.prompt('Link URL','https://');if(url)document.execCommand('createLink',false,url);}
    else document.execCommand(b.dataset.cmd,false,null);
    ed.dispatchEvent(new Event('input'));
  });
  LETTER_FIELDS.forEach(function(f){
    var b=document.createElement('button');b.type='button';b.className='fchip';b.dataset.field=f;b.textContent=f;
    b.addEventListener('mousedown',function(e){e.preventDefault();});
    b.addEventListener('click',function(){restore();document.execCommand('insertText',false,'{{'+f+'}}');ed.dispatchEvent(new Event('input'));});
    $('neFields').appendChild(b);
  });

  // Steps + submit
  var STEP_ONE=['client','first','last','name','email','form','team'];
  function next(){
    st.touched=true;var e=showErrors();
    if(STEP_ONE.some(function(k){return e[k];})){focusFirstError(e);return;}
    if(!st.letterEdited&&!ed.innerHTML.trim()){ed.innerHTML=tplBody(F.letter.value);}
    st.touched=false;showErrors();setStep(2);
  }
  function focusFirstError(e){
    for(var k in FIELD_EL){if(e[k]){var el=$(FIELD_EL[k]);(el._acs?el._acs.btn:el).focus();return;}}
  }
  function submit(draft){
    st.touched=true;var e=showErrors();
    var blocking=draft?['client','first','last','email']:Object.keys(e);
    var bad=blocking.filter(function(k){return e[k];});
    if(bad.length){if(bad.some(function(k){return STEP_ONE.indexOf(k)>=0;})&&st.step!==1){setStep(1);showErrors();}focusFirstError(e);return;}
    var who=(F.first.value.trim()+' '+F.last.value.trim());
    // "Create New client": the client is made only now, once everything checks out
    var nc=NEWC?{id:'c-new-'+Date.now(),name:who.trim(),type:'Individual',email:portalEmail(),partner:'AS'}:null,owner=nc||CLIENT;
    var eng={id:'e-'+Date.now(),isNew:true,newClient:nc,client:owner?owner.name:'',clientId:owner?owner.id:'',title:F.name.value.trim()||who,sub:who+(draft?' · Draft':''),form:F.form.value||'1040',year:Number(F.year.value),
      letter:draft?'draft':st.send?'awaiting':'notsent',sendLetter:!draft&&st.send,docs:null,binder:['Empty','0 items'],stage:'Not started',team:teamSel(),fee:F.fee.value?Number(F.fee.value):null,
      due:F.due.value,portal:st.portal&&!!portalEmail(),email:portalEmail(),letterTemplateId:st.send?F.letter.value:'',letterBody:st.send?ed.innerHTML:''};
    dlgApi().close();
    if(OPTS.onCreated)OPTS.onCreated(eng,draft);
    window.Acurat.toast(draft?'Draft saved: '+(F.name.value.trim()||who):(st.send?'Engagement created and letter sent: ':'Engagement created: ')+(F.name.value.trim()||who));
  }
  $('neForm').addEventListener('submit',function(e){e.preventDefault();st.step===1&&st.send?next():submit(false);});
  // Engagement letter is optional: switch on → step 2 (template + editor); off → create straight from step 1
  function syncSend(){
    $('neSend').setAttribute('aria-checked',st.send?'true':'false');
    $('neSendTxt').textContent=st.send?'Pick a template and edit the letter on the next step.':'Create the engagement now. You can send a letter later.';
    foot();
  }
  $('neSend').addEventListener('click',function(){st.send=!st.send;syncSend();});
  $('neDraft').addEventListener('click',function(){submit(true);});
  $('neBack').addEventListener('click',function(){st.touched=false;showErrors();setStep(1);});
    $('neClient').addEventListener('change',function(){
      NEWC=$('neClient').value===NEW_CLIENT; // no People You Know list for a new client (CLIENT stays null)
      var c=(OPTS.clients||[]).filter(function(x){return x.id===$('neClient').value;})[0]||null;CLIENT=c;
      Array.prototype.forEach.call(F.team.options,function(o){o.selected=o.value===((c&&c.partner)||'AS');});F.team.dispatchEvent(new Event('change'));
      fillPrev();syncFields();if(st.touched)showErrors();
    });
    window.NewEngagement._open=function(){dlgApi().open();};
  }
  window.NewEngagement={open:function(opts){OPTS=opts||{};mount();window.NewEngagement._open();}};
})();
