var startTime=0,counter=0,operationsCount=0,highResolutionTime=!1,SEED=Math.PI,gl,BasemarkWebEngine={ajax:function(e,t,n){if("string"==typeof t){var r={url:t,type:"",data:{},fresh:!0}
t=r}"undefined"!=typeof t.type&&"raw"!=t.type||(t.type=""),"undefined"==typeof t.data&&(t.data={}),"undefined"==typeof t.fresh&&(t.fresh=!0),e=e.toUpperCase(),t.type=t.type.toLowerCase()
var o="?"
if(t.fresh){-1!=t.url.indexOf("?")&&(o="&")
var a=new Date
t.url+=o+"_="+a.getTime(),o="&"}var i=new XMLHttpRequest
if("GET"==e&&t.data!={}){-1!=t.url.indexOf("?")&&(o="&")
for(var s in t.data)t.url+=o+encodeURIComponent(s)+"="+encodeURIComponent(t.data[s]),o="&"}switch(i.open(e,t.url),t.type){case"arraybuffer":i.responseType="arraybuffer"
break
case"blob":i.responseType="blob"
break
case"document":i.responseType="document"
break
case"json":i.responseType="json"
break
default:i.responseType=""}i.onreadystatechange=function(){4==i.readyState&&200==i.status&&n(i.response)},i.send(JSON.stringify(t.data))},getElapsedTime:function(){if(highResolutionTime)var e=performance.now()
else var t=new Date,e=t.getTime()
return e-startTime},increaseCounter:function(){counter++},increaseElapsedTime:function(e){e=parseFloat(e),startTime-=e},loadFile:function(e,t,n){e=String(e),t="undefined"==typeof t?"":String(t)
BasemarkWebEngine.ajax("GET",{url:e,type:t},function(e){n(e)})},logger:function(e){if("undefined"!=typeof console)try{for(prop in e)e.hasOwnProperty(prop)&&"object"==typeof e[prop]&&BasemarkWebEngine.logger(e[prop])}catch(t){}},median:function(e){if(!(e instanceof Array))return 0
if(e.sort(BasemarkWebEngine.numOrdA),e.length%2==1){var t=Math.floor(e.length/2)
return e[t]}var n=Math.floor(e.length/2),r=n-1
return(parseFloat(e[r])+parseFloat(e[n]))/2},nextPage:function(e,t){var n={url:"/api/tests/next",data:{current:e},type:"json"}
BasemarkWebEngine.ajax("GET",n,function(e){setTimeout(function(){e.next?window.location=location.protocol+"//"+location.host+e.next:window.location=location.protocol+"//"+location.host+"/results"},300)})},numOrdA:function(e,t){return e=parseFloat(e),t=parseFloat(t),e-t},openFullscreen:function(e){e.requestFullscreen?e.requestFullscreen():e.mozRequestFullScreen?e.mozRequestFullScreen():e.webkitRequestFullscreen?e.webkitRequestFullscreen():e.msRequestFullscreen&&e.msRequestFullscreen()},randFloat:function(){var e=156355,t=449671,n=16901,r=1/t
SEED=e*(1&SEED)-n*(SEED>>1)
var o=SEED*r
return o},randInt:function(){var e=158089,t=1,n=56258
return SEED=e*(SEED%t)-n*(SEED/t)},runTest:function(){if(guide=test.init(),"undefined"==typeof guide);else if(1==guide.isDoable){var e=document.querySelector("body > div.container")
if("undefined"!=typeof demoMode)document.getElementById("brand-header").style.display="none",e.style.width=window.innerWidth+"px",e.style.height=window.innerHeight+"px"
else{var t=window.innerWidth-e.offsetLeft-e.offsetLeft
e.style.width=t+"px"
var n=window.innerHeight-e.offsetTop
e.style.height=n+"px"}if(1==guide.isConformity)test.run(!0,1,0)
else{if(BasemarkWebEngine.startTimer(),null!=guide.time&&0!=guide.time)for(;BasemarkWebEngine.getElapsedTime()<guide.time;)test.run(!1,operationsCount,BasemarkWebEngine.getElapsedTime()),0==guide.internalCounter&&BasemarkWebEngine.increaseCounter(),operationsCount++
else for(operationsCount=0;operationsCount<guide.operations;operationsCount++)test.run(!1,operationsCount,BasemarkWebEngine.getElapsedTime()),0==guide.internalCounter&&BasemarkWebEngine.increaseCounter()
test.run(!0,operationsCount,BasemarkWebEngine.getElapsedTime())}}else BasemarkWebEngine.submitResult(0,guide,{},0,0,0),debug&&BasemarkWebEngine.logger({error:"Unable to do this test, skipping..."}),BasemarkWebEngine.nextPage(location.pathname)},roundFloat:function(e,t){return e=parseFloat(e),t=parseInt(t),Math.round(e*Math.pow(10,t))/Math.pow(10,t)},screenLogger:function(e,t,n,r,o){var a=t
for(var i in e)"object"==typeof e[i]?(a+=n+i+": object",a+=this.screenLogger(e[i],t,n,r,o),a+=r):a+=n+i+": "+e[i]+r
return a+=o},setSeed:function(e){e=parseFloat(e),SEED=e},startTimer:function(){if(void 0!==window.performance)highResolutionTime=!0,startTime=performance.now()
else{highResolutionTime=!1
var e=new Date
startTime=e.getTime()}},submitResult:function(e,t,n,r,o,a){if(e=parseFloat(e),"Object"!=typeof n){var i=n
n=[],n.push(i)}if(e>a&&a>0){var s=e
e=a-(e-a),n.push({error:"Basemark Web Engine has detected too high score: because of this, count is reduced from "+s+" to "+e})}n.push({raw:{score:e,time:r}})
var u={b:e,u:t,y:n,m:r,e:o},l={url:"/api/sessions/test",data:u,type:"json"}
BasemarkWebEngine.ajax("PUT",l,function(e){return e})},webgl:function(){var e=document.createElement("canvas"),t=function(e){gl=null
try{gl=e.getContext("webgl")||e.getContext("experimental-webgl")}catch(t){}return gl||(gl=null),gl}
return t(e)}}
