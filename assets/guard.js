/* Acurat login guard — loaded in <head> of every app page so signed-out visitors go to login.html before anything renders.
   Keeps the two demo views apart (ui_screens PortalGate):
   • taxpayer session — only portal-*.html; a return must be picked on portal-select.html first;
   • firm session — portal-*.html sends you back to the Clients page. */
(function(){
  function read(k){try{return JSON.parse(localStorage.getItem(k))||{};}catch(e){return null;}}
  var onTaxpayer=document.documentElement.getAttribute('data-portal')==='taxpayer';
  var onSelect=/portal-select\.html$/.test(location.pathname);
  function check(){
    var a=read('acurat.auth');
    if(!a)return; // storage blocked: don't trap the demo in a redirect loop
    if(!a.signedIn){location.replace('login.html');return;}
    if(a.portal==='taxpayer'){
      var picked=!!(read('acurat.tp')||{}).selectedId;
      if(!onTaxpayer)location.replace(picked?'portal-todo.html':'portal-select.html');
      else if(!picked&&!onSelect)location.replace('portal-select.html');
    }else if(onTaxpayer)location.replace('index.html');
  }
  check();
  // Back/forward cache can show a page after sign-out; re-check when it is restored.
  window.addEventListener('pageshow',function(e){if(e.persisted)check();});
})();
