var iosDetect={iPhone:[{points_a:320,points_b:480,ratio:1,ppi:163,min_os:1,max_os:3,result:"iPhone 2G"},{points_a:320,points_b:480,ratio:1,ppi:163,min_os:2,max_os:4,result:"iPhone 3G"},{points_a:320,points_b:480,ratio:1,ppi:163,min_os:3,max_os:6,result:"iPhone 3GS"},{points_a:320,points_b:480,ratio:2,ppi:326,min_os:4,max_os:7,result:"iPhone 4"},{points_a:320,points_b:480,ratio:2,ppi:326,min_os:4,max_os:999,result:"iPhone 4s"},{points_a:320,points_b:568,ratio:2,ppi:326,min_os:6,max_os:999,result:"iPhone 5"},{points_a:320,points_b:568,ratio:2,ppi:326,min_os:7,max_os:999,result:"iPhone 5c"},{points_a:320,points_b:568,ratio:2,ppi:326,min_os:7,max_os:999,result:"iPhone 5s"},{points_a:375,points_b:667,ratio:2,ppi:326,min_os:8,max_os:999,result:"iPhone 6"},{points_a:414,points_b:736,ratio:3,ppi:401,min_os:8,max_os:999,result:"iPhone 6 Plus"},{points_a:375,points_b:667,ratio:2,ppi:326,min_os:9,max_os:999,result:"iPhone 6s"},{points_a:414,points_b:736,ratio:3,ppi:401,min_os:9,max_os:999,result:"iPhone 6s Plus"}],iPad:[{points_a:1024,points_b:768,ratio:1,ppi:132,min_os:3,max_os:5,result:"iPad"},{points_a:1024,points_b:768,ratio:1,ppi:132,min_os:4,max_os:999,result:"iPad 2"},{points_a:1024,points_b:768,ratio:2,ppi:264,min_os:5,max_os:999,result:"iPad 3"},{points_a:1024,points_b:768,ratio:2,ppi:264,min_os:6,max_os:999,result:"iPad 4"},{points_a:1024,points_b:768,ratio:2,ppi:163,min_os:6,max_os:999,result:"iPad Mini"},{points_a:1024,points_b:768,ratio:2,ppi:264,min_os:7,max_os:999,result:"iPad Air"},{points_a:1024,points_b:768,ratio:2,ppi:326,min_os:7,max_os:999,result:"iPad Mini 2"},{points_a:1024,points_b:768,ratio:2,ppi:264,min_os:8,max_os:999,result:"iPad Air 2"},{points_a:1024,points_b:768,ratio:2,ppi:326,min_os:8,max_os:999,result:"iPad Mini 3"},{points_a:1024,points_b:768,ratio:2,ppi:326,min_os:9,max_os:999,result:"iPad Mini 4"},{points_a:1366,points_b:1024,ratio:2,ppi:264,min_os:9,max_os:999,result:"iPad Pro"}],detect:function(i){return i.ppi=this.ppi(),"iPhone"==i.device?this.scan(this.iPhone,i):"iPad"==i.device?this.scan(this.iPad,i):i.device},ppi:function(){if(!window.matchMedia)return!1
var i=[401,326,264,163,132]
for(var o in i)if(window.matchMedia("(min-resolution: "+i[o]+"dpi)").matches)return i[o]
return!1},scan:function(i,o){var s=[]
for(var t in i)o.width!=i[t].points_a&&o.width!=i[t].points_b||o.height!=i[t].points_a&&o.height!=i[t].points_b||o.ratio==i[t].ratio&&(o.ppi&&o.ppi!=i[t].ppi||o.os_major_version<i[t].min_os||o.os_major_version>i[t].max_os||s.push(i[t].result))
return 0==s.length?o.device:s.join(", ")}}
