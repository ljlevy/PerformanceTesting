    (function () {
        window.configLog = {
            getLogger: function (moduleName) {
                var log = log4javascript.getLogger(moduleName);

                var appender = new log4javascript.BrowserConsoleAppender();
                appender.setThreshold(log4javascript.Level.DEBUG);
                var layout = new log4javascript.PatternLayout("%p %c %m%n");
                appender.setLayout(layout);
                log.addAppender(appender);
                return log;
            }
        };
    })();