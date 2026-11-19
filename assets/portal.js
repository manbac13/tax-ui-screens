/* Taxpayer portal: demo data and store (mirrors ui_screens src/data/taxpayer.js).
   Shared by portal-*.html. Load after acurat.js. Exposes window.Portal.
   Changes persist in localStorage['acurat.tp'] (selected return + per-return progress). */
(function(){
  var TAXPAYER={
    name:'John E Smith',firstName:'John',email:'john.smith@example.com',phone:'(951) 555-0190',
    address:'1824 Larkspur Lane, Riverside, CA 92507',year:2025,
    firm:{name:'Acme CPA Group',preparer:'Ashok Sudeep',preparerTitle:'CPA',initials:'AS',
      address:'200 SW Market St, Suite 900, Portland, OR 97201',email:'hello@acmecpa.com',phone:'(503) 555-0142',replies:'within one business day'}
  };

  function questionnaire(){return {title:'2025 Individual tax organizer',sent:'Nov 16',sections:[
    {id:'s-1',title:'Income and work',questions:[
      {id:1,text:'Did you change jobs or have more than one employer in 2025?',help:'Each employer sends its own W-2.',answer:'no'},
      {id:2,text:'Did you have any freelance, gig or self-employment income?',help:'Ride-share, consulting and side work count too.',answer:'no'},
      {id:3,text:'Did you buy, sell or rent out any property?',help:'Including a second home or a room you rent out.',answer:'yes',details:'Rented out a condo starting March 2025.'}]},
    {id:'s-2',title:'Family',questions:[
      {id:4,text:'Did you have a baby, adopt, or start supporting someone new?',help:'You may qualify for credits that lower your tax.',answer:null},
      {id:5,text:'Did you pay for childcare so you could work?',help:'Daycare, after-school programs and summer camps can count.',answer:'no'}]},
    {id:'s-3',title:'Deductions and credits',questions:[
      {id:6,text:'Did you pay mortgage or student loan interest?',help:'This interest can often be deducted.',answer:null},
      {id:7,text:'Did you give money or goods to charity?',help:'Cash or items given to a registered charity.',answer:null},
      {id:8,text:'Did you contribute to an IRA or HSA outside of work?',help:'Contributions you made yourself, not through payroll.',answer:null}]},
    {id:'s-4',title:'Refund',questions:[
      {id:9,text:'Do you want your refund by direct deposit?',help:"It's the fastest way to get your refund.",answer:null}]}
  ]};}

  // Steps the taxpayer goes through, in order, on every return.
  var STEPS=['Engagement letter',"Last year's return",'Questionnaire','Documents','E-signature'];
  var STEP_TODO=['sign your engagement letter',"upload last year's tax return",'fill in your questionnaire','upload your documents','sign your documents'];

  // Sections every engagement letter shares; scope and fee differ per return.
  function letter(o){
    var year=o.year||2025;
    var sections=[
      {heading:'Scope of services',paragraphs:o.scope},
      {heading:'Your responsibilities',paragraphs:[
        'You are responsible for giving us complete and accurate information for '+o.what+', including all income, deductions and credits, and for keeping the records that support them.',
        'You will review the finished return before it is filed. Signing the e-file authorization confirms that, to the best of your knowledge, the return is true, correct and complete.']},
      {heading:'Our responsibilities',paragraphs:[
        'We will prepare the return from the information you provide. We will not audit or verify it, though we may ask questions or request documents where something is unclear or incomplete.',
        'Where the tax law is open to interpretation, we will explain the options and the position we recommend, and resolve any doubt in your favour where it is reasonable to do so.']},
      {heading:'Fees and billing',paragraphs:o.feeTerms},
      {heading:'Records and privacy',paragraphs:['We keep your information confidential and use it only to prepare your returns, as federal law (Internal Revenue Code §7216) requires. Your original records are yours; we keep copies for seven years.']},
      {heading:'Term of this engagement',paragraphs:['This engagement ends when the '+year+' return is filed and accepted, or if either of us ends it in writing. If you end it early, you pay only for work already done.']}
    ].map(function(s,i){return {heading:(i+1)+'. '+s.heading,paragraphs:s.paragraphs};});
    var l={status:'to_sign',date:'November 16, 2026',sentOn:'Nov 16',subject:o.subject,intro:o.intro,fee:o.fee,
      pages:[sections.slice(0,1),sections.slice(1,4),sections.slice(4)],readTime:'about 4 minutes',
      service:o.service,whatWeDo:o.whatWeDo,notIncluded:o.notIncluded,yourPart:o.yourPart,feeDetail:o.feeDetail,agreement:o.agreement};
    return l;
  }

  function seed(){
    var biz=letter({
      subject:'Engagement for preparation of the 2025 partnership return of Smith Design LLC',
      intro:'Thank you for choosing Acme CPA Group for Smith Design LLC. This letter confirms the services we will provide, the responsibilities of each of us, and our fees.',
      service:'Prepare and e-file Form 1065',whatWeDo:'Prepare and e-file the 2025 Form 1065 and partner K-1s for Smith Design LLC',
      notIncluded:'Bookkeeping, payroll filings, audit representation',yourPart:'Give complete books for the year and review the return before signing',
      what:'the 2025 partnership return',fee:'$1,400 fixed fee',feeDetail:'$1,400 fixed, due when the return is ready',
      scope:['We will prepare the 2025 federal partnership return (Form 1065) of Smith Design LLC and the Schedule K-1 for each partner, using the books and records you provide.',
        'This engagement does not include bookkeeping, payroll filings, or representation before the IRS in an examination or appeal.'],
      feeTerms:['Our fee for this engagement is $1,400, fixed. It is due when the completed return is ready for your review.'],
      agreement:'I have read the engagement letter for the 2025 Smith Design LLC return and I agree to its terms, including the $1,400 fee.'
    });
    biz.date='September 28, 2026';biz.sentOn='Sep 28';biz.status='signed';biz.signedOn='Oct 2';biz.signedAt='Oct 2, 2026 at 10:14 AM';biz.signedBy='John E. Smith';
    return [
      {id:'tp-1040-2025',year:2025,kind:'Individual',title:'2025 Individual Tax Return',form:'Federal Form 1040',step:1,lastActivity:'Nov 16',
        letter:letter({
          subject:'Engagement for preparation of your 2025 individual income tax return',
          intro:'Thank you for choosing Acme CPA Group. This letter confirms the services we will provide, the responsibilities of each of us, and our fees. Please read it carefully and sign it electronically if it reflects your understanding.',
          service:'Prepare and e-file Form 1040',whatWeDo:'Prepare and e-file your 2025 Form 1040, filing jointly with Emily',
          notIncluded:'California return (separate letter), tax planning, bookkeeping, audit representation',
          yourPart:'Give complete, accurate information and review the return before signing',
          what:'your 2025 federal return',fee:'$850 fixed fee',feeDetail:'$850 fixed, due when your return is ready',
          scope:['We will prepare your 2025 federal individual income tax return (Form 1040), filing jointly with Emily, and the supporting schedules and forms it requires, using information you provide to us. We will file the return electronically once you have reviewed it and signed IRS Form 8879.',
            'This engagement does not include your California return, which is covered by a separate letter, tax planning, bookkeeping, or representation before the IRS in an examination or appeal. We can provide those services under a separate agreement.'],
          feeTerms:['Our fee for this engagement is $850, fixed. It is due when your completed return is ready for your review, and you can pay it in the portal.',
            'If we find something that needs significantly more work than expected, such as a new business or several rental properties, we will tell you and agree a revised fee before doing it.'],
          agreement:'I have read the engagement letter for my 2025 individual tax return and I agree to its terms, including the $850 fee.'
        }),questionnaire:questionnaire()},
      {id:'tp-540-2025',year:2025,kind:'State',title:'2025 California State Return',form:'Form 540',step:1,lastActivity:'Nov 16',
        letter:letter({
          subject:'Engagement for preparation of your 2025 California income tax return',
          intro:'Thank you for choosing Acme CPA Group for your California return as well. This letter covers that return only. Please read it and sign it electronically if it reflects your understanding.',
          service:'Prepare and e-file Form 540',whatWeDo:'Prepare and e-file your 2025 California Form 540',
          notIncluded:'Federal return (separate letter), other states, audit representation',
          yourPart:'Tell us about any California-only income or credits and review the return before signing',
          what:'your 2025 California return',fee:'$250 fixed fee',feeDetail:'$250 fixed, due when your return is ready',
          scope:['We will prepare your 2025 California resident income tax return (Form 540) alongside your federal return, using the answers and documents you already gave us for that return. We will file it electronically once you have reviewed it and signed California Form 8879.',
            'This engagement does not include your federal return, which is covered by a separate letter, returns for any other state, or representation before the Franchise Tax Board.'],
          feeTerms:['Our fee for this engagement is $250, fixed. It is due when your completed return is ready for your review.'],
          agreement:'I have read the engagement letter for my 2025 California return and I agree to its terms, including the $250 fee.'
        }),questionnaire:null},
      {id:'tp-1065-2025',year:2025,kind:'Business',title:'2025 Business Tax Return',form:'Smith Design LLC · Form 1065',step:5,lastActivity:'Nov 10',
        waiting:"We're preparing your return. We'll let you know when it's ready for you to review.",letter:biz,questionnaire:null}
    ];
  }

  // ---------- store ----------
  var KEY='acurat.tp';
  var state=(function(){
    var VER=2,sel=null;
    try{var s=JSON.parse(localStorage.getItem(KEY));if(s&&s.engagements&&s.v===VER)return s;if(s)sel=s.selectedId||null;}catch(e){}
    return {v:VER,selectedId:sel,engagements:seed()};
  })();
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
  function current(){for(var i=0;i<state.engagements.length;i++)if(state.engagements[i].id===state.selectedId)return state.engagements[i];return null;}
  function update(fn){var c=current();if(c){fn(c);save();}}

  var TZ={timeZone:'America/Los_Angeles'};
  function shortDate(d){return d.toLocaleDateString('en-US',{month:'short',day:'numeric',timeZone:TZ.timeZone});}
  function time(d){return d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',timeZone:TZ.timeZone});}

  // What's left for the taxpayer on a return: the current step, unless the firm is working on it.
  function todosOf(e){return e.waiting?[]:[{key:'step-'+e.step,label:STEP_TODO[e.step-1]}];}
  function questionsOf(q){return q?q.sections.reduce(function(a,s){return a.concat(s.questions);},[]):[];}

  var P=window.Portal={
    TAXPAYER:TAXPAYER,STEPS:STEPS,todosOf:todosOf,questionsOf:questionsOf,
    engagements:function(){return state.engagements;},
    current:current,
    select:function(id){state.selectedId=id;save();},
    clearSelection:function(){state.selectedId=null;save();},
    signLetter:function(by){var n=new Date();update(function(e){
      e.step=Math.max(e.step,2);e.lastActivity=shortDate(n);
      e.letter.status='signed';e.letter.signedOn=shortDate(n);
      e.letter.signedAt=n.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:TZ.timeZone})+' at '+time(n);
      e.letter.signedBy=by;});},
    submitPriorReturn:function(files){var n=new Date(),on=shortDate(n),at=on+' at '+time(n);update(function(e){
      e.step=Math.max(e.step,3);e.lastActivity=on;
      e.priorReturn={uploadedOn:on,files:files.map(function(f){return {name:f.name,size:f.size,uploadedAt:at};})};});},
    // Demo only: move past a step that isn't built yet (questionnaire, documents).
    skipStep:function(n){update(function(e){e.step=Math.max(e.step,n+1);e.skipped=e.skipped||{};e.skipped[n]=true;});},
    // Questionnaire tab: answers save as they're given; submit moves step 3 on.
    answer:function(id,patch){update(function(e){P.questionsOf(e.questionnaire).forEach(function(q){if(q.id===id)for(var k in patch)q[k]=patch[k];});});},
    submitQuestionnaire:function(){var on=shortDate(new Date());update(function(e){if(e.step===3)e.step=4;e.lastActivity=on;e.questionnaire.submitted=on;});},
    reset:function(){state={v:2,selectedId:state.selectedId,engagements:seed()};save();},
    esc:function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});},
    toast:function(m,t){if(window.Acurat&&Acurat.toast)Acurat.toast(m,t);}
  };

  // ---------- rail: To-do count badge + items not built yet ----------
  function badge(){
    var a=document.querySelector('.rail a[data-nav="todo"]');if(!a)return;
    var c=current(),n=c?todosOf(c).length:0,b=a.querySelector('.nb');
    if(!n){if(b)b.remove();return;}
    if(!b){b=document.createElement('span');b.className='nb';a.appendChild(b);}
    b.textContent=n;b.title=n+' '+(n===1?'thing needs':'things need')+' you';b.setAttribute('aria-label',b.title);
  }
  P.refreshBadge=function(){badge();tabs();};
  function tabs(){
    var c=current();if(!c)return;
    var t=document.getElementById('engTitle');if(t)t.textContent=c.title;
    var g=document.getElementById('engForm');if(g)g.textContent=c.form;
    var q=c.questionnaire, open=q&&!q.submitted?questionsOf(q).filter(function(x){return !x.answer;}).length:0;
    var ct=document.querySelector('.ws-tabs [data-tab="questionnaire"] .ct');if(ct){ct.textContent=open;ct.hidden=!open;}
  }
  tabs();
  badge();
  document.querySelectorAll('.rail a[data-soon]').forEach(function(a){
    a.addEventListener('click',function(e){e.preventDefault();P.toast(a.getAttribute('data-soon')+' is coming soon.','info');});
  });
})();
