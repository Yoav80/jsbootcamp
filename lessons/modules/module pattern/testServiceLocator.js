/**
 * Created by y_mil on 2/28/2016.
 */
app.serviceLocator.register("logger",logger);
var mylogger = app.serviceLocator.resolve("logger");
mylogger.debug("debug debug debug");

var logger2 = null;
app.serviceLocator.register("logger2",logger2);
var mylogger2 = app.serviceLocator.resolve("logger2");
if (mylogger2){
    console.error("this is a bug, same name shouldnt exist");
}

var mylogger3 = app.serviceLocator.register();
if (mylogger3) {
    console.error("this is a bug, a name and anm object must be passed");
}