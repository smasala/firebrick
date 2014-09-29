define(function(){
	return Firebrick.create("MyApp.controller.ViewController", {
		extend:"Firebrick.controller.Base",
		init:function(){
			var me = this;
			
			Firebrick.addListener("updateBreadcrumb", function(event, page){
				Firebrick.getView("MyApp.view.components.Breadcrumbs").store.getData().text(page);
			});
			
			me.initView();
			
			me.callParent();
		},
		
		initView:function(){
			Firebrick.createView("MyApp.view.components.Nav",{
				target:"navigation",
				store:{
					links:[{
							id: "app_Users",
							text: "Users"
						},{
							id: "app_Reports",
							text: "Reports"
						},{
							id: "app_Analytics",
							text: "Analytics"
						},{
							id: "app_Exports",
							text: "Exports"
						}],
						currentActive: "app_Users",
						setActive: function(id){
							this.currentActive(id);
							Firebrick.fireEvent("startview_" + id);
						},
						isActive:function(id){
							return id == this.currentActive();
						}
					},
					
			});
			
			Firebrick.createView("MyApp.view.components.Breadcrumbs", {
				target:"breadcrumbs",
				store:{
					text:""
				}
			});
			
			Firebrick.fireEvent("viewReady");
		},
		
	});
});