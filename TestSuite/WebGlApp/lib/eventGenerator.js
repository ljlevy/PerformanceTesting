/**
 * @module EventGenerator
 * This tool allows to perform automatic navigation into a page.
 * 
 */


window.EventGenerator  = function() {

// TODO Get the platform keycodes from the corresponding JSON keys definition file
    var keyCodes = { LEFT : 37, UP : 38, RIGHT : 39, DOWN : 40},
        delay,
        keyEvents = [],
        interval,
        times = 0,
        nbEvents,
        i;
        
    var log = configLog.getLogger("EventGenerator");

    function sendKey(keyCode) {
          var myEvent = new CustomEvent('scenarioKey',{detail : {keyCode:keyCode}});
          log.debug("[EventGenerator] Send : "+keyCode);
          window.setTimeout(function(){window.dispatchEvent(myEvent);},0);
          times++;
          if (times === nbEvents) {
              window.clearInterval(interval);
              if (i < keyEvents.length-1) {
                  i++;
                  doNextKeyCode();
              } else {
                  window.setTimeout(function(){window.dispatchEvent(new CustomEvent('scenarioDone',{}));},0);
              }
          }
    }
    
    function sendEvents(keyCode,nbTimes) {
        nbEvents = nbTimes;
        times = 0;
        interval = window.setInterval(function(){sendKey(keyCode);},delay);        
    }
    
    function doNextKeyCode() {
        var keyEvent = keyEvents[i];
        sendEvents(keyEvent.keyCode,keyEvent.nbEvents);
    }

    return {
        doScenario : function(scenario,aDelay) {
            delay = aDelay;    
            console.log(scenario);
            for (var j = 0; j < scenario.length; j++) {
                var keycode = keyCodes[scenario[j].KEY];
                var nbEvents = scenario[j].NB;
                keyEvents.push({keyCode:keycode,nbEvents:nbEvents});
            }
            i = 0;
            // Start the scenario
            doNextKeyCode();
        }
    };

}();

