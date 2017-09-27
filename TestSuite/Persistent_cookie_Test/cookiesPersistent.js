function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else {
        var expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
var num = 60;
var val = 'x';
window.onload = function() {
    if (!document.getElementById) return;
    document.getElementById('cmdTestButton').onclick = function() {
        var field = document.getElementById('txtTestCreate');
        num = document.getElementById('txtNumber').value;
        val = document.getElementById('txtValue').value;
        for (var i = 0; i < num; i++) {
            createCookie('testCookie' + i, val, 1);
        }
    }
    document.getElementById('cmdTestButtonCheck').onclick = function() {
        var field = document.getElementById('txtTestCheck');
        field.value = '';
        var max = 0;
        for (var i = 0; i < num; i++) {
            var testFluff = readCookie('testCookie' + i);
            if (testFluff) {
                field.value += 'Cookie #' + i + ' set\n';
                max++;
            }
        }
    }
    document.getElementById('cmdRemoveCookies').onclick = function() {
        for (var i = 0; i < num; i++) {
            eraseCookie('testCookie' + i);
        }
    }
}
