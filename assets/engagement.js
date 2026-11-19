/* Acurat engagement workspace (engagement-*.html): shared header menu + signature dialogs.
   Load after acurat.js. Exposes window.Engagement = { info, esc, ic, placeFields(opts), sendFromTemplate(opts), confirm(opts) }.
   Mirrors ui_screens pages/engagements/detail (PlaceFieldsDialog, SendForSignatureDialog). */
(function(){
  var A=window.Acurat;
  var esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
  var ic=function(d,s){s=s||16;return '<svg aria-hidden="true" width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+d+'</svg>';};
  var X='<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  var CLOSE='<button type="button" class="hb" data-dlg-close aria-label="Close" title="Close">'+X+'</button>';
  var INFO={client:'John E & Emily Smith',first:'John E',type:'1040',year:2025,joint:true,
    people:[{role:'Taxpayer',name:'John E Smith',email:'myfirm.client+1005@gmail.com'},{role:'Spouse',name:'Emily Smith',email:'emily.smith@example.com'},{role:'Dependent',name:'Lily Smith'}],
    team:[{i:'AS',name:'Ashok Sudeep',title:'CPA',canSign:true},{i:'RK',name:'Rita K.',title:'Senior preparer'},{i:'SM',name:'Sam M.',title:'Reviewer',canSign:true},{i:'AP',name:'Anika P.',title:'Preparer'},{i:'JL',name:'Jordan L.',title:'Staff accountant'}]};
  function mount(html){var w=document.createElement('div');w.innerHTML=html;var el=w.firstChild;document.body.appendChild(el);if(A.enhanceSelects)A.enhanceSelects(el);return el;}

  /* ---------- Confirm (shared small dialog) ---------- */
  var cf=null,cfApi=null,cfGo=null;
  function confirm(o){
    if(!cf){cf=mount('<div class="dlg-back" hidden><div class="dlg sm" role="alertdialog" aria-modal="true" aria-labelledby="cfT" aria-describedby="cfM"><div class="dlg-h"><div><h2 id="cfT"></h2><p id="cfM"></p></div>'+CLOSE+'</div>'+
      '<div class="dlg-b one" id="cfBody" hidden></div><div class="dlg-f"><button type="button" class="dbtn sec" data-dlg-close autofocus>Cancel</button><button type="button" class="dbtn" id="cfGo"></button></div></div></div>');
      cfApi=A.dialog(cf);cf.querySelector('#cfGo').addEventListener('click',function(){var r=cf.querySelector('#cfReason');if(r&&!r.value.trim())return;var v=r?r.value.trim():'';cfApi.close();if(cfGo)cfGo(v);});}
    cf.querySelector('#cfT').textContent=o.title;cf.querySelector('#cfM').textContent=o.message||'';
    var go=cf.querySelector('#cfGo');go.textContent=o.confirm||'Confirm';go.className='dbtn'+(o.danger?' danger':'');
    var body=cf.querySelector('#cfBody');body.hidden=!o.reason;
    body.innerHTML=o.reason?'<div class="dfld"><label for="cfReason">Reason <i aria-hidden="true">*</i></label><textarea id="cfReason" rows="3" placeholder="Reason (required)"></textarea></div>':'';
    go.disabled=!!o.reason;
    if(o.reason)body.querySelector('#cfReason').addEventListener('input',function(){go.disabled=!this.value.trim();});
    cfGo=o.onConfirm;cfApi.open();
    if(o.reason)setTimeout(function(){body.querySelector('#cfReason').focus();},0);
  }

  /* ---------- Header ⋯ menu: Edit engagement · Change preparer · Archive engagement ---------- */
  var cp=null,cpApi=null;
  function changePreparer(){
    if(!cp){cp=mount('<div class="dlg-back" hidden><div class="dlg sm" role="dialog" aria-modal="true" aria-labelledby="cpT"><div class="dlg-h"><div><h2 id="cpT">Change preparer</h2><p>Who prepares this return. The previous preparer keeps access as a team member.</p></div>'+CLOSE+'</div>'+
      '<form novalidate><div class="dlg-b one"><div class="dfld"><label for="cpWho">Preparer</label><select id="cpWho">'+INFO.team.map(function(t){return '<option value="'+t.i+'" data-desc="'+esc(t.title)+'">'+esc(t.name)+'</option>';}).join('')+'</select></div></div>'+
      '<div class="dlg-f"><button type="button" class="dbtn sec" data-dlg-close>Cancel</button><button type="submit" class="dbtn">Save</button></div></form></div></div>');
      cpApi=A.dialog(cp);
      cp.querySelector('form').addEventListener('submit',function(e){
        e.preventDefault();var s=cp.querySelector('#cpWho'),name=s.options[s.selectedIndex].text;cpApi.close();
        var st=document.querySelector('.ws-head .ws-id > .status');if(st)st.title=st.title.replace(/Preparer: [^·]*$/,'Preparer: '+name);
        document.querySelectorAll('[data-preparer]').forEach(function(el){el.textContent=name;});
        try{localStorage.setItem('acurat.eng.preparer',name);}catch(err){}
        A.toast('Preparer changed to '+name);
      });}
    var cur='Ashok Sudeep';try{cur=localStorage.getItem('acurat.eng.preparer')||cur;}catch(e){}
    var s=cp.querySelector('#cpWho');for(var i=0;i<s.options.length;i++)if(s.options[i].text===cur)s.value=s.options[i].value;
    cpApi.open();
  }
  var menu=document.querySelector('.ws-head details.switch.more');
  if(menu)menu.querySelectorAll('.menu a').forEach(function(a){
    var t=a.textContent.trim();
    a.addEventListener('click',function(e){
      e.preventDefault();menu.removeAttribute('open');
      if(t==='Edit engagement')A.toast('Editing engagement details — coming soon','info');
      else if(t==='Change preparer')changePreparer();
      else if(t==='Archive engagement')confirm({title:'Archive engagement',message:INFO.client+' · Form '+INFO.type+' · '+INFO.year+' moves to Archived. Its documents and history are kept, and the client can no longer see it.',confirm:'Archive engagement',danger:true,
        onConfirm:function(){try{sessionStorage.setItem('acurat.flash.toast','Engagement archived: '+INFO.client+' · '+INFO.type);}catch(err){}location.href='smith-engagements.html';}});
    });
  });
  // Saved preparer (from Change preparer) shows everywhere it's printed
  try{var savedPrep=localStorage.getItem('acurat.eng.preparer');if(savedPrep){document.querySelectorAll('[data-preparer]').forEach(function(el){el.textContent=savedPrep;});var st=document.querySelector('.ws-head .ws-id > .status');if(st)st.title=st.title.replace(/Preparer: [^·]*$/,'Preparer: '+savedPrep);}}catch(e){}

  /* ---------- Send for signature · from firm template (SendForSignatureDialog) ---------- */
  var TPL=[{id:'tpl-el',name:'2025 Individual engagement letter',version:'v4'},{id:'tpl-sow',name:'Statement of work',version:'v2'},{id:'tpl-7216',name:'7216 consent',version:'v3'}];
  var sf=null,sfApi=null,sfOpts=null,fees=[];
  var money=function(n){return '$'+Number(n||0).toLocaleString('en-US');};
  function sfRender(){
    var rows=sf.querySelector('#sfFees');
    rows.innerHTML=fees.map(function(f){return '<div class="feerow" data-id="'+f.id+'"><input aria-label="Service" value="'+esc(f.service)+'" data-k="service" placeholder="Service"><div class="affix"><span aria-hidden="true">$</span><input aria-label="Fee" value="'+esc(f.fee)+'" data-k="fee" inputmode="numeric"></div><button type="button" class="hb sm" data-rm aria-label="Remove row" title="Remove row">'+X+'</button></div>';}).join('');
    sfPreview();
  }
  function sfPreview(){
    var tpl=TPL.filter(function(t){return t.id===sf.querySelector('#sfTpl').value;})[0]||TPL[0];
    var signer=INFO.team.filter(function(t){return t.i===sf.querySelector('#sfSig').value;})[0];
    var total=fees.reduce(function(n,f){return n+Number(f.fee||0);},0);
    sf.querySelector('#sfTotal').textContent=money(total);
    sf.querySelector('#sfSend').disabled=!fees.length;
    var signers=INFO.people.filter(function(p){return p.role!=='Dependent';});
    sf.querySelector('#sfPrev').innerHTML=
      '<span class="lp-eyebrow">ACURAT TAX · '+esc(/letter/i.test(tpl.name)?'ENGAGEMENT LETTER':tpl.name.toUpperCase())+'</span>'+
      '<p>'+esc(sf.querySelector('#sfDate').value)+'</p><p>Dear <mark>'+esc(INFO.client)+'</mark>,</p>'+
      '<p style="line-height:1.8">Thank you for choosing us to prepare your <mark>'+INFO.year+'</mark> income tax return. This letter sets out the services we will provide and our fees.</p>'+
      '<p style="font-weight:600">Fees</p><div class="lp-fees">'+fees.map(function(f){return '<div><span>'+esc(f.service||'—')+'</span><span>'+money(f.fee)+'</span></div>';}).join('')+'<hr><div><b>Total</b><b>'+money(total)+'</b></div></div>'+
      '<p>Sincerely,<br><mark>'+esc(signer?signer.name:'')+', CPA</mark></p>'+
      '<div class="lp-sign">'+signers.map(function(p){return '<div><hr><span>'+esc(p.role==='Spouse'?'Spouse':p.name)+'</span><small>Signature and date</small></div>';}).join('')+'</div>';
  }
  function sendFromTemplate(o){
    sfOpts=o||{};
    if(!sf){
      sf=mount('<div class="dlg-back" hidden><div class="dlg xl" role="dialog" aria-modal="true" aria-labelledby="sfT"><div class="dlg-h"><div><h2 id="sfT">Send for signature</h2><p>'+esc(INFO.client)+' · '+INFO.type+' · Tax year '+INFO.year+'</p></div>'+CLOSE+'</div>'+
        '<div class="sf-body"><div class="sf-form">'+
          '<div class="sf-blk"><h3>Template</h3><p>Set by your firm admin. Client action: Sign.</p><div class="dfld"><select id="sfTpl" aria-label="Template">'+TPL.map(function(t){return '<option value="'+t.id+'">'+esc(t.name)+' · '+t.version+'</option>';}).join('')+'</select></div></div>'+
          '<div class="sf-blk"><h3>Details from the engagement</h3><p>Filled automatically. Change them on the engagement, not here.</p><div class="dgrid">'+
            [['Client',INFO.client],['Tax year',String(INFO.year)]].map(function(r){return '<div class="dfld"><label>'+r[0]+' <span class="spill-s">From engagement</span></label><input value="'+esc(r[1])+'" disabled></div>';}).join('')+'</div></div>'+
          '<div class="sf-blk"><h3>Fields you can edit</h3><p>Anything the template defines as a merge field.</p>'+
            '<div class="feehd"><span>Service</span><span>Fee</span><span></span></div><div id="sfFees" style="display:flex;flex-direction:column;gap:8px"></div>'+
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px"><button type="button" class="dbtn sec" id="sfAdd" style="height:32px">+ Add row</button><span style="font-size:14px;color:#64748B">Total <b id="sfTotal" style="color:#111827;font-weight:600"></b></span></div>'+
            '<div class="dgrid" style="margin-top:16px"><div class="dfld"><label for="sfSig">Signatory for the firm</label><select id="sfSig">'+INFO.team.filter(function(t){return t.canSign;}).map(function(t){return '<option value="'+t.i+'">'+esc(t.name)+', CPA</option>';}).join('')+'</select></div>'+
            '<div class="dfld"><label for="sfDate">Letter date</label><input id="sfDate" value="Oct 17, 2026"></div></div></div>'+
          '<div class="sf-blk"><h3>Who signs</h3><p>Signers are taken from the people on the return.</p><div style="display:flex;flex-direction:column;gap:8px">'+
            INFO.people.filter(function(p){return p.role!=='Dependent';}).map(function(p){return '<div class="signerrow"><b>'+esc(p.role==='Spouse'?'Spouse':p.name)+'</b><span>'+esc(p.email)+'</span></div>';}).join('')+
            '<p class="sf-cap">Counts as signed only when both have signed. You can accept it with the taxpayer only later.</p></div></div>'+
        '</div><div class="sf-prev"><span class="eyebrow-s">Preview</span><div class="lp" id="sfPrev"></div><p class="sf-cap"><mark>Highlighted</mark> text comes from fields. Edit them on the left and the letter updates.</p></div></div>'+
        '<div class="dlg-f"><button type="button" class="dbtn sec" data-dlg-close>Cancel</button><span class="sp"></span><button type="button" class="dbtn sec" id="sfDraft">Save draft</button><button type="button" class="dbtn" id="sfSend">Send for signature</button></div></div></div>');
      sfApi=A.dialog(sf,{onOpen:function(){fees=[{id:1,service:'Form 1040 preparation',fee:450},{id:2,service:'State return',fee:120},{id:3,service:'Schedule E (rental)',fee:150}];sf.querySelector('#sfTpl').value=(sfOpts.templateId||'tpl-el');sfRender();}});
      sf.querySelector('#sfFees').addEventListener('input',function(e){var r=e.target.closest('.feerow');if(!r)return;var f=fees.filter(function(x){return x.id==r.dataset.id;})[0];var k=e.target.dataset.k;
        if(k==='fee')e.target.value=e.target.value.replace(/[^0-9]/g,'');f[k]=e.target.value;sfPreview();});
      sf.querySelector('#sfFees').addEventListener('click',function(e){var b=e.target.closest('[data-rm]');if(!b)return;var id=b.closest('.feerow').dataset.id;fees=fees.filter(function(x){return x.id!=id;});sfRender();});
      sf.querySelector('#sfAdd').onclick=function(){fees.push({id:Date.now(),service:'',fee:''});sfRender();var r=sf.querySelectorAll('.feerow input[data-k=service]');r[r.length-1].focus();};
      ['#sfTpl','#sfSig'].forEach(function(s){sf.querySelector(s).addEventListener('change',sfPreview);});
      sf.querySelector('#sfDate').addEventListener('input',sfPreview);
      sf.querySelector('#sfDraft').onclick=function(){sfApi.close();A.toast('Draft saved','info');};
      sf.querySelector('#sfSend').onclick=function(){var t=TPL.filter(function(x){return x.id===sf.querySelector('#sfTpl').value;})[0];sfApi.close();if(sfOpts.onSend)sfOpts.onSend(t);};
    }
    sfApi.open();
  }

  /* ---------- Send for signature · upload & place fields (PlaceFieldsDialog) ---------- */
  var TONE={taxpayer:{bg:'#F0FDF4',c:'#15803D'},spouse:{bg:'#EFF6FF',c:'#1D4ED8'}};
  var TYPE={signature:'Signature',date:'Date',initials:'Initials'},SIZE={signature:{w:46,h:5},date:{w:26,h:5},initials:{w:12,h:5}};
  var pf=null,pfApi=null,P={};
  var who=function(s){return s==='taxpayer'?'John E':'Spouse';};
  function preset(){var f=[{id:1,signer:'taxpayer',type:'signature',page:1,x:8,y:71},{id:2,signer:'taxpayer',type:'date',page:1,x:62,y:71}];
    if(INFO.joint)f.push({id:3,signer:'spouse',type:'signature',page:1,x:8,y:83},{id:4,signer:'spouse',type:'date',page:1,x:62,y:83});
    return f.map(function(x){x.w=SIZE[x.type].w;x.h=SIZE[x.type].h;return x;});}
  function complete(){var s=INFO.joint?['taxpayer','spouse']:['taxpayer'];return s.every(function(k){return P.fields.some(function(f){return f.signer===k&&f.type==='signature';})&&P.fields.some(function(f){return f.signer===k&&f.type==='date';});});}
  var fileName='Form-8879-2025-John-E-Emily-Smith.pdf';
  function pfRender(){
    var st=function(n){return n<P.step?'done':n===P.step?'current':'todo';};
    pf.querySelector('#pfSteps').innerHTML=['Upload','Place fields','Review and send'].map(function(l,i){var s=st(i+1);return '<span class="pstep '+s+'"><i>'+(s==='done'?'✓':i+1)+'</i>'+l+'</span>';}).join('');
    var b=pf.querySelector('#pfBody');
    if(P.step===1){
      b.innerHTML='<div class="pf-drop"><div>'+ic('<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1z"/>',32)+'<h3>Drop the PDF to send for signature</h3><p>Form 8879, state e-file authorizations and other forms from your tax software. Several files become separate documents.</p><button type="button" class="dbtn" id="pfChoose">Choose file</button><input type="file" id="pfFile" accept="application/pdf" hidden></div></div>';
      b.querySelector('#pfChoose').onclick=function(){b.querySelector('#pfFile').click();};
      b.querySelector('#pfFile').addEventListener('change',function(){if(this.files[0]){fileName=this.files[0].name;P.name=fileName.replace(/\.pdf$/i,'');}P.step=2;pfRender();});
      var drop=b.querySelector('.pf-drop');
      ['dragover','dragenter'].forEach(function(t){drop.addEventListener(t,function(e){e.preventDefault();drop.classList.add('over');});});
      ['dragleave','drop'].forEach(function(t){drop.addEventListener(t,function(e){e.preventDefault();drop.classList.remove('over');});});
      drop.addEventListener('drop',function(e){var f=e.dataTransfer&&e.dataTransfer.files[0];if(f){fileName=f.name;P.name=f.name.replace(/\.pdf$/i,'');}P.step=2;pfRender();});
    }else if(P.step===2){
      var signers=INFO.joint?['taxpayer','spouse']:['taxpayer'];
      b.innerHTML='<div class="pf-thumbs">'+[1,2].map(function(p){var n=P.fields.filter(function(f){return f.page===p;}).length;return '<button type="button" class="pf-thumb'+(P.page===p?' on':'')+'" data-page="'+p+'"><span><i style="width:60%"></i><i style="width:40%"></i></span>Page '+p+(n?' · '+n+' fields':'')+'</button>';}).join('')+'</div>'+
        '<div class="pf-view"><div class="pf-meta"><span>'+esc(fileName)+' · Page '+P.page+' of 2</span><span>100%</span></div>'+
          '<div class="pf-page'+(P.pending?' placing':'')+'" id="pfPage">'+(P.page===1?'<h4>Form 8879</h4><small>E-file authorization · Tax year '+INFO.year+' · sample document</small>':'')+
            '<div class="pf-lines">'+[90,100,100,85,0,100,70,100,95,0,100,100,80].map(function(w){return w?'<i style="width:'+w+'%"></i>':'<b></b>';}).join('')+'</div>'+(P.page===1?'<p class="pf-decl">Declaration and signature authorization</p>':'')+
            P.fields.filter(function(f){return f.page===P.page;}).map(function(f){var t=TONE[f.signer],sel=P.selected===f.id;
              return '<div class="pf-field'+(sel?' sel':'')+'" data-f="'+f.id+'" style="left:'+f.x+'%;top:'+f.y+'%;width:'+f.w+'%;height:'+f.h+'%;background:'+t.bg+';border-color:'+t.c+';color:'+t.c+'">'+who(f.signer)+' · '+TYPE[f.type]+
                (sel?'<span class="pf-tip">'+who(f.signer)+' · '+TYPE[f.type]+' · Required<button type="button" data-del="'+f.id+'" aria-label="Delete field">'+ic('<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',12)+'</button></span>':'')+'</div>';}).join('')+
          '</div></div>'+
        '<div class="pf-side">'+
          '<section><h3>Document</h3><div class="dfld"><label for="pfName">Name shown to the client</label><input id="pfName" value="'+esc(P.name)+'" autofocus></div><div class="dfld"><label for="pfType">Type</label><select id="pfType"><option>E-file authorization</option><option>State e-file authorization</option><option>Other signature form</option></select></div><p class="sf-cap">Client action: <b>Needs signature</b>. It appears on the Signatures tab.</p></section>'+
          '<section><h3>Add a field</h3><span class="pf-lbl">For</span><div class="dseg" role="tablist" aria-label="Signer">'+signers.map(function(s){return '<button type="button" role="tab" data-signer="'+s+'" aria-selected="'+(P.signer===s)+'">'+(s==='taxpayer'?'John E Smith':'Spouse')+'</button>';}).join('')+'</div>'+
            '<div style="display:flex;flex-wrap:wrap;gap:8px">'+Object.keys(TYPE).map(function(t){return '<button type="button" class="dbtn'+(P.pending===t?'':' sec')+'" data-type="'+t+'" aria-pressed="'+(P.pending===t)+'" style="height:32px">'+(t==='date'?'Date signed':TYPE[t])+'</button>';}).join('')+'</div>'+
            '<p class="sf-cap">'+(P.pending?'Now click the page to place it.':'Click a field, then click the page to place it.')+'</p></section>'+
          '<section><h3>Placed fields · '+P.fields.length+'</h3><div class="pf-list">'+P.fields.map(function(f){return '<div><span><i style="background:'+TONE[f.signer].c+'"></i>'+who(f.signer)+' · '+TYPE[f.type]+'</span><span>Page '+f.page+'<button type="button" class="hb sm" data-del="'+f.id+'" aria-label="Delete '+who(f.signer)+' '+TYPE[f.type]+'">'+ic('<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/>',12)+'</button></span></div>';}).join('')+'</div>'+
            '<p class="pf-ok '+(complete()?'ok':'warn')+'">'+(complete()?'✓ Each signer has a signature and a date.':'Each signer needs a signature field and a date field.')+'</p></section>'+
          '<section><h3>Options</h3><label class="dchk"><input type="checkbox" id="pfRemember"'+(P.remember?' checked':'')+'> Remember these positions for Form 8879</label><p class="sf-cap">Accept without spouse: <b>Not allowed</b> for this document.</p></section>'+
        '</div>';
      A.enhanceSelects(b);
      b.querySelector('#pfName').addEventListener('input',function(){P.name=this.value;});
      b.querySelector('#pfRemember').addEventListener('change',function(){P.remember=this.checked;});
    }else{
      var sg=INFO.people.filter(function(p){return p.role!=='Dependent';});
      b.innerHTML='<div class="pf-review"><span class="eyebrow-s">Review and send</span><div class="dsum"><b>'+esc(P.name)+'</b><span>'+P.fields.length+' fields · '+esc(fileName)+'</span></div>'+
        '<div class="dfld"><label>Signers</label>'+sg.map(function(p){return '<div class="signerrow"><b>'+esc(p.name)+'</b><span>Email goes to '+esc(p.email)+'</span></div>';}).join('')+'</div>'+
        '<div class="dfld"><label for="pfMsg">Message to the client <small>(optional)</small></label><textarea id="pfMsg" rows="3" placeholder="Please sign by Oct 15 so we can e-file on time."></textarea></div></div>';
    }
    pf.querySelector('#pfBack').textContent=P.step>(P.fromReturn?2:1)?'← Back':'Cancel';
    var next=pf.querySelector('#pfNext');
    next.textContent=P.step===3?'Send':'Next: Review and send';
    next.disabled=P.step===1||(P.step===2&&!complete());
  }
  function placeFields(o){
    o=o||{};
    if(!pf){
      pf=mount('<div class="dlg-back" hidden><div class="dlg xl pf" role="dialog" aria-modal="true" aria-labelledby="pfT"><div class="dlg-h" style="align-items:center"><div><h2 id="pfT">Send for signature · Upload a document</h2><p>'+esc(INFO.client)+' · '+INFO.type+' · Tax year '+INFO.year+'</p></div><div class="psteps" id="pfSteps"></div>'+CLOSE+'</div>'+
        '<div class="pf-body" id="pfBody"></div>'+
        '<div class="dlg-f"><button type="button" class="dbtn sec" id="pfBack"></button><span class="sp"></span><button type="button" class="dbtn sec" id="pfDraft">Save draft</button><button type="button" class="dbtn" id="pfNext"></button></div></div></div>');
      pfApi=A.dialog(pf);
      pf.querySelector('#pfBack').onclick=function(){if(P.step>(P.fromReturn?2:1)){P.step--;pfRender();}else pfApi.close();};
      pf.querySelector('#pfDraft').onclick=function(){pfApi.close();A.toast('Draft saved','info');};
      pf.querySelector('#pfNext').onclick=function(){if(this.disabled)return;if(P.step<3){P.step=3;pfRender();return;}pfApi.close();if(P.onSend)P.onSend(P.name.trim()||'Signature document');};
      pf.querySelector('#pfBody').addEventListener('click',function(e){
        var t=e.target.closest('[data-page]');if(t){P.page=+t.dataset.page;pfRender();return;}
        var d=e.target.closest('[data-del]');if(d){var id=+d.dataset.del;P.fields=P.fields.filter(function(f){return f.id!==id;});if(P.selected===id)P.selected=null;pfRender();return;}
        var sg=e.target.closest('[data-signer]');if(sg){P.signer=sg.dataset.signer;pfRender();return;}
        var ty=e.target.closest('[data-type]');if(ty){P.pending=P.pending===ty.dataset.type?null:ty.dataset.type;pfRender();return;}
        var fl=e.target.closest('.pf-field');if(fl){P.selected=+fl.dataset.f;pfRender();return;}
        var pg=e.target.closest('#pfPage');
        if(pg&&P.pending){ // place the pending field where the page was clicked
          var r=pg.getBoundingClientRect(),sz=SIZE[P.pending];
          var x=r.width?Math.min(100-sz.w,Math.max(0,((e.clientX-r.left)/r.width)*100-sz.w/2)):10;
          var y=r.height?Math.min(100-sz.h,Math.max(0,((e.clientY-r.top)/r.height)*100-sz.h/2)):40;
          var id=Date.now();P.fields.push({id:id,signer:P.signer,type:P.pending,page:P.page,x:x,y:y,w:sz.w,h:sz.h});P.selected=id;P.pending=null;pfRender();
        }else if(pg){P.selected=null;pfRender();}
      });
    }
    P={step:o.fromReturn?2:1,fromReturn:!!o.fromReturn,page:1,fields:preset(),signer:'taxpayer',pending:null,selected:null,name:o.name||'2025 E-file authorization (Form 8879)',remember:true,onSend:o.onSend};
    fileName='Form-8879-2025-John-E-Emily-Smith.pdf';
    pfRender();pfApi.open();
  }

  window.Engagement={info:INFO,esc:esc,ic:ic,confirm:confirm,sendFromTemplate:sendFromTemplate,placeFields:placeFields};
})();
