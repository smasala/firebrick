define(["store/UserStore"], function(store){
	return Firebrick.create("MyApp.controller.app.UsersController", {
		extend:"Firebrick.controller.Base",
		init:function(){
			var me = this;

			me.app.on({
				"#pagePrev":{
					click:me.prevPage
				},
				"#pageNext":{
					click:me.nextPage
				},
				".paginationItem":{
					click:me.goToPage
				},
				scope:me
			});

			me.app.listeners({
				"startview_app_Users": me.start,
				"viewReady": me.start,
				scope:me
			});
			
			me.callParent();
		},
		
		start: function(){
			var me = this;
			me.initView();
		},
		
		getUsers: function(){
			return Firebrick.get("MyApp.store.UserStore").data.users;
		},
		
		getCountries: function(){
			return ["UK", "DE", "IT"];
		},
		
		startPage:0,
		
		initPageData: function(){
			var me = this,
				pages = [];
			
			$.each(me.getUsers(), function(i, obj){
				pages.push({
					num:i+1, 
					userId:obj.id,
					active: i == me.activePage,
				});
			});
			return {activePage:me.startPage, pages:pages};
		},
		
		initView:function(){
			var me = this;

			Firebrick.createView("MyApp.view.app.Users", {
				store: {activePage:me.startPage, users: me.getUsers(), countries:me.getCountries()},
				target:"#main-content"
			});
			
			Firebrick.createView("MyApp.view.components.Pagination", {
				target:"pagination",
				store: me.initPageData()
			});
			
			Firebrick.fireEvent("updateBreadcrumb", "Users");
		},
		
		pageExist: function(num){
			return this.getUsers()[num];
		},
		
		goToPage:function(event, el){
			var me = this,
				parent = $(el).closest("li"),
				page = parent.val();
			
			if(me.pageExist(page)){
				me.updateBindingsForPage(page);
			}
		},
		
		prevPage: function(){
			var me = this, 
				ap = Firebrick.getView("MyApp.view.components.Pagination").getData().activePage() - 1;
			if(me.pageExist(ap)){
				me.updateBindingsForPage(ap);
			}
		},
		
		nextPage: function(){
			var me = this,
				ap = Firebrick.getView("MyApp.view.components.Pagination").getData().activePage() + 1;
			if(me.pageExist(ap)){
				me.updateBindingsForPage(ap);
			}
		},
		
		updateBindingsForPage:function(ap){
			Firebrick.getView("MyApp.view.app.Users").getData().activePage(ap);
			Firebrick.getView("MyApp.view.components.Pagination").getData().activePage(ap);
		}
		
		
	});
});