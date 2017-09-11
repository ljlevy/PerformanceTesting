(function () {

    var log = configLog.getLogger("LaunchTests");

    var tests;

    var state = {};

    window.onload = function () {
        var selector = document.getElementById('deviceSelector');
        buildDeviceList(selector);
        selector.onkeydown = function (event) {
            switch (event.keyCode) {
                case 38:
                    if (selector.selectedIndex > 0) {
                        selector.selectedIndex--;
                        return false;
                    }
                    break;
                case 40:
                    if (selector.selectedIndex < selector.options.length - 1) {
                        selector.selectedIndex++;
                        return false;
                    }
                    break;
                case 37:
                    var tabables = document.getElementsByName('tabable');
                    for (var i = 0; i < tabables.length; i++) {
                        if (tabables[i] === selector) {
                            if (i === 0) {
                                tabables[tabables.length - 1].focus();
                            } else {
                                tabables[i - 1].focus();
                            }
                        }
                    }
                    break;
                case 39:
                case 13:
                    var tabables = document.getElementsByName('tabable');
                    for (var i = 0; i < tabables.length; i++) {
                        if (tabables[i] === selector) {
                            if (i === tabables.length - 1) {
                                tabables[0].focus();
                            } else {
                                tabables[i + 1].focus();
                            }
                        }
                    }
                    break;
                default:
                    log.debug(event.keyCode, ' not yet bound');
                    break;
            }
        };
    };

    function displayTests(selector, value) {
        $.ajax({
            url: 'datas/tests.json',
            dataType: 'json'
        }).done(function (response) {
                log.debug(response);
                tests = response;
                var testList = document.getElementById('testList');
                testList.innerHTML = '';
                var link;
                for (var i = 0; i < tests.length; i++) {
                    link = createLink(tests[i].name, tests[i].url, selector, value);
                    testList.appendChild(link);
                }
            });
    }

    function createLink(name, url, selector, value) {
        var link = document.createElement('a');
        var value = value;
        if (url.indexOf("?") !== -1) {
            link.href = url + '&device=' + value;
        } else {
            link.href = url + '?device=' + value;
        }
        link.innerHTML = name;
        return link;
    }

    function updateLink(deviceId) {
        var testList = document.getElementById('testList');
        var link;
        log.debug("updateLink");
        for (var i = 1; i < testList.childNodes.length; i++) {
            link = testList.childNodes[i];
            var url = tests[i - 1].url;
            if (url.indexOf("?") !== -1) {
                link.href = tests[i - 1].url + '&device=' + deviceId;
            } else {
                link.href = tests[i - 1].url + '?device=' + deviceId;
            }
            log.debug('updateLink : ', link.href);
        }
    }

    function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }


    function buildDeviceList(selector) {
        $.ajax({
            url: '/getTableContent?target=Device',
            dataType: 'json'
        }).done(function (response) {
                var itemsdevice = response;
                buildLinkList(itemsDevice, selector);
            });
    }
    ;

    /*
     Add the JSON data elements into a drop down list with a specific label
     */
    function buildLinkList(jsonData, selector) {
        var content = jsonData.content;
        var keys = jsonData.keys;
        var link, values;
        for (var i = 0; i < content.length; i++) {
            values = getItemTextAndValue(content[i], keys);
            link = document.createElement('a');
            link.isFocusable = true;
            link.innerHTML = values[0];
            link.setAttribute('data-device', values[1]);
            link.tabIndex = 4 + i;
            log.debug('text=' + link.text);
            link.onkeydown = function (event) {
                switch (event.keyCode) {
                    case 13:
                        var children = selector.children;
                        if (state.selected) {
                            //state.selected.classList.toggle('focused');
                        }
                        //event.srcElement.classList.toggle('focused');
                        state.selected = event.srcElement;
                        displayTests(selector, event.srcElement.dataset.device);
                        break;
                    default:
                        log.debug('Event not handled: ', event.keyCode);
                        break;
                }
            };
            link.onclick = function(event) {
	            var children = selector.children;
	            if (state.selected) {
	                //state.selected.classList.toggle('focused');
	            }
	            //event.srcElement.classList.toggle('focused');
	            state.selected = event.srcElement;
	            displayTests(selector, event.srcElement.dataset.device);
            };
            selector.appendChild(link);
        }
    }

    /*
     Return the expected item label and associated value for the combo box item
     */
    function getItemTextAndValue(content, keys) {
        var text = '';
        var id;
        for (var j = 0; j < keys.length; j++) {
            if (keys[j] === '_id') {
                id = content[keys[j]];
            } else if (keys[j] !== '__v') {
                text += content[keys[j]] + ' ';
            }
        }
        text = text.substring(0, text.length - 1);
        return [text, id];
    }

}());