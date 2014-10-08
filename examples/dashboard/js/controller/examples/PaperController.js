define(function(){
	return Firebrick.create("MyApp.controller.examples.PaperController", {
		extend:"Firebrick.controller.Base",
		init:function(){
			//do something

			Firebrick.addListener("startview_paper_example", function(){
				
				Firebrick.createView("MyApp.view.examples.Paper", {
					target:"#main-content"
				});
				
				Firebrick.fireEvent("updateBreadcrumb", "paper_examples");
				
			});
			
			
			this.callParent();
		}
	});
});