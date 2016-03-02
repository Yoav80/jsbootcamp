/**
 * Created by y_mil on 2/28/2016.
 */
var app = app || {};

app.serviceLocator = (function(){
    var services = {};

    function register(name, service){
        if (!name || !service) {
            throw Error("name or service are empty");
        }

       if (services[name]){
           throw Error("a service is already registered with the name: " + name);
       }

        services[name] = service;
    }

    function resolve(name){

        if (!name){
            throw Error("name is empty");
        }

        if (!services[name]){
            throw Error("no service with the name " + name + " exists");
        }
        return services[name];
    }

    return {
        register:register,
        resolve:resolve
    };

})();