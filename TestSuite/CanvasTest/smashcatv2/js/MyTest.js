var MyTest = (function() {
	// Junk test code
	var that = {}, initDelayedStuff, charsTab, stats, scene, yRot = 300, zRot = 0, xRot = 0, pRot = 0, pRot2 = 0, cTransX = 400, buffSurface = [], 
	totalBuffSurfaces = 10, buffSurfaceIX = 0, framesDrawn = 0, startTime = 0, fpsOb = null, sRot = 0, t0, paintIt, moveIt;

	that.init = function() {
		//Delay the init for MEL tests
		setTimeout(initDelayedStuff, 1000, false);
	};
	
	initDelayedStuff = function() {
		// Make a sphere...
		var sPoints = [], sPolys = [], tPoints = 0, size = 8, segs = 36, n, p, div, amp, i, i2, y, x, z, sphere;
		
		stats = new Stats();
		stats.setMode(0);

		stats.domElement.style.position = "absolute";
		stats.domElement.style.top = "0px";
		stats.domElement.style.left = "10px";
		document.body.appendChild(stats.domElement);

		charsTab = [];
		t0 = new Date().getTime();
		scene = new Scene('screen', totalBuffSurfaces);
		scene.setAmbient(0.3);
		scene.addLight(-250, 50, 3, 1, 0, 0);
		scene.addLight(250, 50, 3, 0, 0, 1);
		scene.addLight(0, -20, 50, 0, 0.3, 0);
		scene.setBGColor('#0000ff');
		scene.setBGColor('rgba(0,0,0,0.1)');
		scene.setZoom(10);

		for (n = 0; n <= Math.round(segs / 2); n++) {
			div = 360 / segs;
			amp = (tbl.sin[n * div]);
			
			for (i = 0; i < segs; i++) {
				i2 = (i * div);
				y = size * tbl.cos[n * div];
				x = size * amp * tbl.sin[i2];
				z = size * amp * tbl.cos[i2];
				sPoints.push([x, y, z]);
				if (n > 0 && i > 0 && (i + n) % 2) {
					sPolys.push([[tPoints, tPoints - 1, (tPoints - segs) - 1, tPoints - segs], 0.5, 0.5, 0.5, 1, 1, true]);
				}
				++tPoints;
			}
			
			if (n > 0) {
				sPolys.push([[tPoints - segs, tPoints - 1, (tPoints - segs) - 1, (tPoints - segs) - segs], 0.5, 0.5, 0.5, 1, 1, true]);
			}
		}

		sphere = new Object3D();
		sphere.setPoints(sPoints);
		sphere.setPolys(sPolys);
		sphere.translate(0, 0, 100);
		sphere.setZoom(30);
		scene.addObject(sphere);
		scene.setBGColor('#000000');
		scene.cullBackFacing(false);

		for (n = 0; n < totalBuffSurfaces; n++) {
			scene.setBuffer(n);
			sphere.translate(0, 0, 200);
			sphere.rotate(0, n * 2, 0);
			scene.render();
		}
		scene.removeObjects();
		// Don't need the sphere ob any more now we have a render
		scene.setBuffer(-1);
		// resets the renderer to point to the output buffer
		scene.setBGColor('rgba(0,0,0,0.1)');
		scene.cullBackFacing(true);

		// Set up chars
		preprocessChars(charsTab, scene);

		//setInterval(moveIt, 10);
		fpsOb = document.getElementById('fps');
		startTime = new Date().getTime();

		// ljl
		requestAnimationFrame(paintIt);
	};

	paintIt = function () {
		moveIt();
		stats.update();
		scene.cls();
		scene.rotate(sRot);
		scene.blitBuffer(buffSurfaceIX);
		scene.render();
		requestAnimationFrame(paintIt);
	};

	moveIt = function () {
		var t1 = new Date(), n;
		t1 = t1.getTime();
		for ( n = 0; n < charsTab.length; n++) {
			charsTab[n].translate(cTransX + (n * 200), 0, 100);
			charsTab[n].rotate(xRot, yRot + (10 * n), zRot + (20 * n));
		}

		sRot = (t1 - t0 ) / 800;

		buffSurfaceIX = (buffSurfaceIX + 1) % totalBuffSurfaces;

		yRot = (t1 - t0 ) / 50;
		zRot = (t1 - t0 ) / 15;
		xRot = (t1 - t0 ) / 10;
		cTransX = (t0 - t1) / 5.0 % -4200 + 400;
	};

	return that;
})();
