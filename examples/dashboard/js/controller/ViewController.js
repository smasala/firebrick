define([
        "controller/view/NavController", 
        "controller/app/MainController", 
        "popover"], function(){
	
	return Firebrick.create("MyApp.controller.ViewController", {
		extend:"Firebrick.controller.Base",
		init:function(){
			var me = this;
			
			this.app.on({
				".langIcon":{
					click:function(event, el){
						Firebrick.languages.setLang(el.id);
					} 
				},
				scope:this
			})
			
			me.initView();
			
			me.initPopovers();
			
			me.callParent();
		},
		
		initPopovers: function(){
			//init any popovers
			$("[data-toggle=popover]").popover({html:true});
		},
		
		initView:function(){
			Firebrick.createView("MyApp.view.components.Nav",{
				target:"navigation",
				store:{
					links:[{
							id: "app_Users",
							text: "nav_item_users"
						},{
							id: "app_Reports",
							text: "nav_item_reports"
						},{
							id: "app_Analytics",
							text: "nav_item_analytics"
						},{
							id: "app_Exports",
							text: "nav_item_exports"
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
		}
		
		
	});
});