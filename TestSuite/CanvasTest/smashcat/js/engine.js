/**
 * Quick and dirty 3d engine - Scott Porter <scott@smashcat.org>
 *
 * Can handle multiple objects, transparency, reflectivity, unlimited light sources, object compositing, varying number of verticies per polygon (must lie in plane ofc)
 *
 */

/**
 * Lookup singleton - makes rotations faster than invoking Math.cos(), Math.sin() all the time.
 */
var tbl=(function(){
	var d={
		sin: [],
		cos: [],
		init: function(){
			for(var n=0;n<360;n++){
				d.sin[n]=(Math.sin(3.14159*n/180));
				d.cos[n]=(Math.cos(3.14159*n/180))
			}
		}
	}
	d.init();
	return d;
})();

/**
 * Scene object, contains 3d objects for render
 */
function Scene(outputSurface,numBuffers){
	this.object=[];
	this.light=[];
	this.distance=0;

	// Output surface data
	this.surface=false;
	this.surfaceWidth=0;
	this.surfaceHeight=0;
	this.surfaceBGColor='#000000';
	this.buffer=[];
	this.totalBuffers=0;
	this.bufferRotation=0;
	
	// Origin
	this.ox=0;
	this.oy=0;
	this.oz=0;
	
	// Zoom
	this.zoom=1;

	// Ambient light
	this.ambient=0.1;
	
	// Cull back-facing polygons
	this.cullBack=true;

	this.cullBackFacing=function(x){
		this.cullBack=x;
	}
	
	this.setSurface=function(s){
		var ob=document.getElementById(s);
		if(!s)
			return false;
		this.initialSurface=s;
		this.surfaceWidth=ob.width;
		this.surfaceHeight=ob.height;
	    this.surface=ob.getContext('2d');
		this.setOrigin(this.surfaceWidth/2,this.surfaceHeight/2,6);
		this.cls();
	}
	
	this.rotate=function(a){
		this.bufferRotation=a;
	}

	this.setBuffer=function(ix){
		if(ix==-1){
			this.setSurface(this.initialSurface);
			return;
		}
		this.surface=this.buffer[ix].surface;
	}
	
	this.setOrigin=function(x,y,z){
		this.ox=x;
		this.oy=y;
		this.oz=z;
	}
	
	this.setBGColor=function(c){
		this.surfaceBGColor=c;
	}
	
	this.setAmbient=function(x){
		this.ambient=x;
	}
	
	this.addLight=function(x,y,z,r,g,b){
		this.light.push(this.aLight(x,y,z,r,g,b));
	}
	
	this.moveLight=function(ix,x,y,z){
		this.light[ix].x=x;
		this.light[ix].y=y;
		this.light[ix].z=z;
	}
	
	this.removeLights=function(){
		this.light=[];
	}
	
	this.setZoom=function(z){
		this.zoom=z;
	}
	
	this.cls=function(){
		this.surface.fillStyle=this.surfaceBGColor;
		this.surface.fillRect(0,0,this.surfaceWidth, this.surfaceHeight);
	}
	
	this.addObject=function(o){
		this.object.push(o);
	}
	
	this.removeObjects=function(){
		this.object=[];
	}
	
	this.render=function(){
		var s=this.surface;
		var drawList=[];
		var obNum=this.object.length;
		var avDist=0;
		for(var obN=0;obN<obNum;obN++){
			var o=this.object[obN];
	
			var p=o.poly; // This will eventually be a sorted list base on distance from camera - furthest first
			var pNum=p.length,z0,z1,z2,x0,x1,x2,y0,y1,y2,r,g,b,opacity,reflectivity,c;
			var ox=this.ox,oy=this.oy,oz=this.oz,zoom=this.zoom;
			var xTrans=o.xTrans,yTrans=o.yTrans,zTrans=o.zTrans;
			var numLights=this.light.length;
			var pP=[],pX=[],pY=[],pZ=[],numVerts,pDist,i;
			var oZ=oz+(zTrans/64),
				orgX=ox+((xTrans*zoom)/oZ),
				orgY=oy+((yTrans*zoom)/oZ);
			var obZoom=o.zoom,
				isVisible;

			for(var n=0;n<pNum;n++){
				if(!p[n][6])
					continue; // Switched off

				numVerts=p[n][0].length;
				pX=[];
				pY=[];
				pZ=[];
				pDist=0;

				isVisible=false;
				for(i=0;i<numVerts;i++){
					pP[i]=o.point[ p[n][0][i] ];
					pZ[i]=((zTrans+(pP[i].zr*obZoom))/64)+oz;
					if(pZ[i]<1)
						pZ[i]=1;
					pX[i]=ox+(((xTrans+(pP[i].xr*obZoom))*zoom)/pZ[i]);
					pY[i]=oy+(((yTrans+(pP[i].yr*obZoom))*zoom)/pZ[i]);
					
					if(!isVisible && (
						pX[i]>0 && pX[i]<this.surfaceWidth && pY[i]>0 && pY[i]<this.surfaceHeight)
					)
						isVisible=true;
				}
				if(!isVisible)
					continue;
				if(!this.cullBack || (pX[1]-pX[0])*(pY[2]-pY[0]) - (pY[1]-pY[0])*(pX[2]-pX[0])<0 ){

					var vertList=[];
					for(i=0;i<numVerts;i++){
						pDist+=pZ[i];
						vertList[i*2]=pX[i];
						vertList[(i*2)+1]=pY[i];
					}
					avDist=pDist/numVerts;
					if(avDist>0){
						norm=this.getNormal(
							pP[0].xr,pP[0].yr,pP[0].zr,
							pP[1].xr,pP[1].yr,pP[1].zr,
							pP[2].xr,pP[2].yr,pP[2].zr
						);
						normLen=Math.sqrt(
							( (norm[0]/10)*(norm[0]/10) )+
							( (norm[1]/10)*(norm[1]/10) )+
							( (norm[2]/10)*(norm[2]/10) )
						);
	
						opacity=p[n][4];
						reflectivity=p[n][5];
	
						r=p[n][1]*(this.ambient+((1-reflectivity)/2));
						g=p[n][2]*(this.ambient+((1-reflectivity)/2));
						b=p[n][3]*(this.ambient+((1-reflectivity)/2));
	
	
						// Work the dot product to find angle diff from normals for lighting.
						// Bit heavier on the cpu, but looks nice ;-)
						for(i=0;i<numLights;i++){
							lightVec=this.getVector(
								this.light[i].x*zoom,
								this.light[i].y*zoom,
								this.light[i].z,
								(xTrans*zoom),
								(yTrans*zoom),
								zTrans
							);
							// Get diff between the vectors
							lLen=Math.sqrt(
								( (lightVec[0]/10)*(lightVec[0]/10) )+
								( (lightVec[1]/10)*(lightVec[1]/10) )+
								( (lightVec[2]/10)*(lightVec[2]/10) )
							);
							dp=((lightVec[0]/10)*(norm[0]/10))+((lightVec[1]/10)*(norm[1]/10))+((lightVec[2]/10)*(norm[2]/10));
							cAng=dp/(normLen*lLen);
	
							var distFade=1-(avDist/40);
							
							r+=(this.light[i].r*(cAng*reflectivity*distFade));
							g+=(this.light[i].g*(cAng*reflectivity*distFade));
							b+=(this.light[i].b*(cAng*reflectivity*distFade));
						}
	
						if(r>1)	r=1;
						if(g>1)	g=1;
						if(b>1)	b=1;
	
						drawList.push([vertList,avDist,'rgba('+Math.round(r*255)+','+Math.round(g*255)+','+Math.round(b*255)+','+opacity+')',numVerts*2]);
					}
				}
			}
		}
		num=drawList.length;
		
		var e,maxDist,maxDistIX=0;
		var iterations=0;
		qSort(drawList);

		for(n=0;n<num;n++){
			e=drawList[n];
			s.fillStyle=e[2];
			s.beginPath();
			s.moveTo(e[0][0],e[0][1]);
			for(var i=2;i<e[3];i+=2)
				s.lineTo(e[0][i],e[0][i+1]);
			s.fill();
		}

	}
	
	this.getVector=function(x0,y0,z0,x1,y1,z1){
		if(x0<0){
			x1+=-x0;
			x0=0;
		}
		if(y0<0){
			y1+=-y0;
			y0=0;
		}
		if(z0<0){
			z1+=-z0;
			z0=0;
		}

		return [x1-x0,y1-y0,z1-z0];
	}
	
	this.getNormal=function(
		x0,y0,z0,x1,y1,z1,x2,y2,z2
	){
		if(x0<0){
			x1+=-x0;
			x2+=-x0;
			x0=0;
		}
		if(y0<0){
			y1+=-y0;
			y2+=-y0;
			y0=0;
		}
		if(z0<0){
			z1+=-z0;
			z2+=-z0;
			z0=0;
		}

		var v0x=x1-x0,
			v0y=y1-y0,
			v0z=z1-z0;

		var v1x=x2-x0,
			v1y=y2-y0,
			v1z=z2-z0;

		// bit of vector math now, get the cross-product...
		i=(v0y*v1z)-(v1y*v0z);
		j=(v0x*v1z)-(v1x*v0z);
		k=(v0x*v1y)-(v1x*v0y);
		return [-i,j,-k];
	
	}

	/**
	 * A light source
	 */
	this.aLight=function(lx,ly,lz,lr,lg,lb){
		return {
			x : lx,
			y : ly,
			z : lz,
			r : lr,
			g : lg,
			b : lb
		}
	}
	
	/**
	 * Create display buffers
	 */
	this.addBuffers=function(x){
		this.totalBuffers=x;
		var b=document.getElementsByTagName('body')[0];
		var d=document.createElement('div');
		d.style.display='none';
		b.appendChild(d);
		var h='';
		for(var n=0;n<x;n++){
			var c=document.createElement('canvas');
				c.width=this.surfaceWidth;
				c.height=this.surfaceHeight;
				d.appendChild(c);
				this.buffer[n]={ob : c , surface : c.getContext('2d')};
		}
	}
	
	/**
	 * Blit buffer (ix) to current output surface
	 */
	this.blitBuffer=function(ix){

		this.surface.save();
		this.surface.translate(this.surfaceWidth/2,this.surfaceHeight/2);
		this.surface.rotate(this.bufferRotation);
		this.surface.translate(-this.surfaceWidth/2,-this.surfaceHeight/2);
		this.surface.drawImage(this.buffer[ix].ob,0,0);
		this.surface.restore();
	}
	
	this.setSurface(outputSurface);
	if(numBuffers && numBuffers>0)
		this.addBuffers(numBuffers);
}


/**
 * 3D object instance
 *
 * A 3D object is a collection of polygons, the object
 * contains its own rotation and translation data
 */
function Object3D(){

	this.poly=new Array();
	this.point=new Array();

	// Current rotation
	this.xRot=0;
	this.yRot=0;
	this.zRot=0;

	// Current translation
	this.xTrans=0;
	this.yTrans=0;
	this.zTrans=0;

	// Zoom level for this object
	this.zoom=1;

	/**
	 * Rotate points around x,y,z axis.
	 */
	this.rotate=function(xrot,yrot,zrot){
		var x,y,z,tp=this.point.length;
		if(xrot<0)
			xrot+=360;
		if(yrot<0)
			zrot+=360;
		if(zrot<0)
			zrot+=360;

		this.xRot=Math.round(xrot)%360;
		this.yRot=Math.round(yrot)%360;
		this.zRot=Math.round(zrot)%360;

		var num=this.point.length;
		for(var n=0;n<num;n++){

			x=this.point[n].x;
			y=this.point[n].y;
			z=this.point[n].z;

			crx=tbl.cos[this.xRot];
			srx=tbl.sin[this.xRot];
			cry=tbl.cos[this.yRot];
			sry=tbl.sin[this.yRot];
			crz=tbl.cos[this.zRot];
			srz=tbl.sin[this.zRot];
	
			y3=crx*y-srx*z;
			z3=srx*y+crx*z;
	
			x2=sry*z3-cry*x;
			z3=sry*x+cry*z3;
	
			x3=crz*x2-srz*y3;
			y3=crz*y3+srz*x2;
	
			this.point[n].xr=x3; //tbl.cos[zrot]*x-tbl.sin[zrot]*y;
			this.point[n].yr=y3; //tbl.cos[xrot]*y2-tbl.sin[xrot]*z;
			this.point[n].zr=z3; //tbl.sin[xrot]*y2+tbl.cos[xrot]*z;
		}
	}

	/**
	 * Set zoom level for this object
	 */
	this.setZoom=function(z){
		this.zoom=z;
	}

	/**
	 * Position the object in 3d space
	 */
	this.translate=function(x,y,z){
		this.xTrans=x;
		this.yTrans=y;
		this.zTrans=z;
	}

	/** 
	 * Set the points all in one go
	 *
	 * @param array pData Array of verticies and attributes
	 * index 0 is x, index 1 is y, index 2 is z, 
	 */
	this.setPoints=function(pData){
		var num=pData.length;
		this.point=[];
		for(var n=0;n<num;n++)
			this.addPoint(pData[n][0],pData[n][1],pData[n][2]);
	}
	
	/**
	 * Add a single point
	 */
	this.addPoint=function(x,y,z){
		this.point.push(this.aPoint(x,y,z));
	}

	/** 
	 * Set the polys all in one go
	 *
	 * @param array pData Array of polygon data
	 * @see addPoly 
	 */
	this.setPolys=function(pData){
		var num=pData.length;
		this.poly=[];
		for(var n=0;n<num;n++)
			this.addPoly(
				pData[n][0],
				pData[n][1],pData[n][2],pData[n][3],
				pData[n][4],pData[n][5],pData[n][6]
			);
	}

	/**
	 * Add a polygon to the 3d object.
	 *
	 * @param int p indexes in this.point array (either 3 or 4 points per poly)
	 * @param r red value (0 to 1) for this polygon
	 * @param g green value (0 to 1) for this polygon
	 * @param b blue value (0 to 1) for this polygon
	 * @param int opacity Opacity of the polygon, from 0 (totally transparent) to 1 (totally opaque)
	 * @param int reflectivity from 0 (absorbs all light) to 1 (reflects all light)
	 * @param boolean on If true, the polygon will be displayed if visible. If false, it's not included in the render
	 *
	 * Obviously the indexs in the this.point array must exist!
	 */
	this.addPoly=function(p, r,g,b, opacity,reflectivity,on){
		var c='rgba('+r+','+g+','+b+','+opacity+')';
		this.poly.push([p,r,g,b,opacity,reflectivity,on,c]);
	}

	this.aPoint=function(px,py,pz){
		return {
			x : px,
			y : py,
			z : pz,
			xr : px,
			yr : py,
			zr : pz
		};
	}
}

// Quicksort routine, used to depth-sort polys in drawList, prior to render.
function chgP(a,sIX,eIX,p){
	var pv=a[p][1];
	a.xchg(p,--eIX);
	var s=sIX;
	for(var ix=sIX;ix<eIX;++ix){
		if(a[ix][1]>=pv)
			a.xchg(s++,ix);
	}
	a.xchg(s,eIX);
	return s;
}

Array.prototype.xchg=function(a,b){
	var t=this[a];
	this[a]=this[b];
	this[b]=t;
}

function qSortR(a,sIX,eIX){
	if(eIX-1>sIX) {
		var p=sIX+Math.floor(Math.random()*(eIX-sIX));
		p=chgP(a,sIX,eIX,p);
		qSortR(a,sIX,p);
		qSortR(a,p+1,eIX);
	}
}
function qSort(a){
	iterations=0;
	qSortR(a,0,a.length);
}
