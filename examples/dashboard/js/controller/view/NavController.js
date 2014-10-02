define(["store/ProfileStore"], function(){
	return Firebrick.create("MyApp.controller.NavController", {
		extend:"Firebrick.controller.Base",
		init:function(){
			var me = this;

			this.app.on({
				"#settings":{
					click: this.showSettingsPanel
				},
				"#profile": {
					click: this.showProfilePanel
				},
				scope:this
			});
			
			Firebrick.addListener({
				"updateBreadcrumb": function(event, page){
					Firebrick.getView("MyApp.view.components.Breadcrumbs").store.getData().text(page);
				},
				scope:this
			});
			
			me.initPopovers();
			
			this.callParent();
		},
		
		initPopovers: function(){
			//init any popovers
			$("[data-toggle=popover]").popover({html:true});
		},
		
		showProfilePanel: function(){
			//get data from somewhere
			
			var popup = Firebrick.createView("MyApp.view.components.Popup", {
				target: "popup",
				store:{
					header: fb.text("profile")
				},
				subViews: Firebrick.defineView("MyApp.view.general.Profile", {
					target: "popup .modal-body",
					store: Firebrick.createStore("MyApp.store.ProfileStore")
				})
			});
			
			
			$('.modal').modal('show');
			
		},
		
		showSettingsPanel: function(){
			//get data from somewhere
			var data = {content: "Hello this is the popup data"};
		}
		
		
	});
});
