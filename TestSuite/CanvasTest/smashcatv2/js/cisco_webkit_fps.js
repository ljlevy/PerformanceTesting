window.addEventListener("load", function() {
	var tmpDiv = document.createElement('div');
	tmpDiv.id = "cisco_fps_overlay";
	tmpDiv.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
	tmpDiv.style.color = "#fff";
	tmpDiv.style.width = "180px";
	tmpDiv.style.height = "28px";
	tmpDiv.style.lineHeight = "28px";
	tmpDiv.style.textAlign = "center";
	tmpDiv.style.top = "40px";
	tmpDiv.style.left = "40px";
	tmpDiv.style.position = "absolute";

	document.body.appendChild(tmpDiv);

	window.setInterval(function() {
		var res = "";
		try {
			if (window.getFps) {
				res += "Compo: " + window.getFps(true);
				res += " || Window: " + window.getFps(false);
			} else {
				res = "Compo: -1 || Fps: -1";
			}
		} catch (e) {
		}

		tmpDiv.innerHTML = res;
	}, 1000, false);
}, true); 