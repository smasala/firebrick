define(function(){
	return Firebrick.create("MyApp.controller.app.ExportsController", {
		extend:"Firebrick.controller.Base",
		init:function(){
			var me = this;

			Firebrick.addListener("startview_app_Exports", function(){
				me.start();
			});
			
			me.callParent();
		},
		
		start: function(){
			this.initView();
			Firebrick.fireEvent("updateBreadcrumb", "Exports");
		},
		
		initView:function(){
			var me = this;
			Firebrick.createView("MyApp.view.app.Exports", {
				target:"#main-content"
			});
		}
		
	});
});