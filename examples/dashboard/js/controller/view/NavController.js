define(["store/ProfileStore", "jquery-minicolors"], function(){
	return Firebrick.create("MyApp.controller.NavController", {
		extend:"Firebrick.controller.Base",
		init:function(){
			var me = this;

			me.app.on({
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
			
			me.app.listeners({
				"showLoad": me.showLoad,
				"showLoadDone": me.showLoadDone,
				scope:me
			})
			
			Firebrick.createView("MyApp.view.components.Popup", {
				target: "popup",
				store:{
					header: ""
				}
			});
			
			me.initPopovers();
			
			//jQuery to return hex and not rgb
			$.cssHooks.backgroundColor = {
				    get: function(elem) {
				        if (elem.currentStyle)
				            var bg = elem.currentStyle["backgroundColor"];
				        else if (window.getComputedStyle) {
				            var bg = document.defaultView.getComputedStyle(elem,
				                null).getPropertyValue("background-color");
				        }
				        if (bg.search("rgb") == -1) {
				            return bg;
				        } else {
				            bg = bg.match(/\d+/g);
				            function hex(x) {
				                return ("0" + parseInt(x).toString(16)).slice(-2);
				            }
				            return "#" + hex(bg[0]) + hex(bg[1]) + hex(bg[2]);
				        }
				    }
				}
			
			this.callParent();
		},
		
		initPopovers: function(){
			//init any popovers (bootstrap)
			$("[data-toggle=popover]").popover({html:true});

		},
		
		showProfilePanel: function(){

			Firebrick.createView("MyApp.view.components.Popup").getData().header(fb.text("profile")());
			
			Firebrick.createStore("MyApp.store.ProfileStore").load({
				callback:function(store){
					console.info(arguments)
					Firebrick.createView("MyApp.view.general.Profile", {
						target: "popup .modal-body",
						store: store
					});
				}
			})
			
			
			//bootstrap command
			$('popup .modal').modal('show');
			
			
			
		},
		
		showSettingsPanel: function(){
			require(["jquery-minicolors"], function(){
				
				Firebrick.createView("MyApp.view.components.Popup").getData().header(fb.text("settings")());
				
				Firebrick.createView("MyApp.view.general.Settings", {
					target: "popup .modal-body",
					listeners:{
						"ready": function(){
							//colour picker
						    $('.colorPicker').minicolors({theme:null});
						}
					}
				});
				
				//bootstrap command
				$('popup .modal').modal('show');
				
			});
		},
		
		bgColourPicked: function(event, el){
			$("body").css("background-color", el.value); 
		},
		
		showLoad: function(){
			//bootstrap command
			$('.loading.modal').modal('show');
		},
		
		showLoadDone: function(){
			//bootstrap command
			$('.loading.modal').modal('hide');
		}
		
		
	});
});
