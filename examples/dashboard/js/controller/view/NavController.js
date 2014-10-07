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
				"#settings_colour_picker.colorPicker":{
					change: this.bgColourPicked
				},
				scope:this
			});
			
			Firebrick.addListener({
				"updateBreadcrumb": function(event, page){
					Firebrick.getView("MyApp.view.components.Breadcrumbs").store.getData().text(page);
				},
				scope:this
			});
			
			var popup = Firebrick.createView("MyApp.view.components.Popup", {
				target: "popup",
				store:{
					header: ""
				}
			});
			
			me.initPopovers();
			
			this.callParent();
		},
		
		initPopovers: function(){
			//init any popovers (bootstrap)
			$("[data-toggle=popover]").popover({html:true});

		},
		
		showProfilePanel: function(){
			
			Firebrick.getView("MyApp.view.components.Popup").getData().header("Profile");
			
			Firebrick.createView("MyApp.view.general.Profile", {
				target: "popup .modal-body",
				store: Firebrick.createStore("MyApp.store.ProfileStore")
			});
			
			//bootstrap command
			$('.modal').modal('show');
			
		},
		
		showSettingsPanel: function(){
			require(["jquery-minicolors"], function(){
				
				Firebrick.getView("MyApp.view.components.Popup").getData().header("Settings");
				
				Firebrick.createView("MyApp.view.general.Settings", {
					target: "popup .modal-body"
				});
				
				//colour picker
			    $('.colorPicker').minicolors({theme:null});
			    
			    //bootstrap command
				$('.modal').modal('show');
				
			});
		},
		
		bgColourPicked: function(event, el){
			$("body").css("background-color", el.value); 
		}
		
		
	});
});
