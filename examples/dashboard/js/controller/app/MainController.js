define(["controller/app/UsersController",
        "controller/app/ReportsController",
        "controller/app/ExportsController",
        "controller/app/AnalyticsController"], function(){
	return Firebrick.create("MyApp.controller.app.MainController", {
		extend:"Firebrick.controller.Base"
	});
});