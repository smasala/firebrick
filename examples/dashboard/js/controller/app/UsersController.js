define(["store/UserStore", "typeahead"], function(userStore){
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
				"a.user-suggestion":{
					click:me.showUser
				},
				scope:me
			});

			me.app.listeners({
				"startview_app_Users": me.start,
				"viewReady": function(){
					
					var substringMatcher = function(strs) {
						return function findMatches(q, cb) {
							var matches, substrRegex;
							 
							// an array that will be populated with substring matches
							matches = [];
							 
							// regex used to determine if a string contains the substring `q`
							substrRegex = new RegExp(q, 'i');
							 
							// iterate through the pool of strings and for any string that
							// contains the substring `q`, add it to the `matches` array
							$.each(strs, function(i, user) {
								if (substrRegex.test(user.name)) {
									// the typeahead jQuery plugin expects suggestions to a
									// JavaScript object, refer to typeahead docs for more info
									matches.push({name: user.name, index:i});
								}
							});
							 
							cb(matches);
						};
					};

					$("#user_search").typeahead({
						 	hint: true,
						 	highlight: true,
						 	minLength: 1						
						},{
							source: substringMatcher(userStore.getRawData()),
							templates:{
								suggestion:function(obj){
									return "<p><a data-ta-index='" + obj.index + "' class='user-suggestion'> " + obj.name +"</a></p>"
								}
							}
					});
					me.start();
				},
				scope:me
			});
			me.callParent();
		},
		
		isOnShow:false,
		startPage:0,
		
		start: function(){
			var me = this;
			me.isOnShow = true;
			me.initView();
		},
		
		getUsers: function(){
			return Firebrick.get("MyApp.store.UserStore").getData();
		},
		
		getCountries: function(){
			return ["UK", "DE", "IT"];
		},
		
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
			var me = this,
				view = Firebrick.get("MyApp.view.app.Users");

			if(!view){
				Firebrick.createView("MyApp.view.app.Users", {
					store: {activePage:me.startPage, users: me.getUsers(), countries:me.getCountries()},
					target:"#main-content",
					init:function(){
						this.on("unbound", function(){
							me.isOnShow = false
						});
						this.callParent();
					},
					subViews: Firebrick.defineView("MyApp.view.components.Pagination", {
						target:"pagination",
						store: me.initPageData(),
						listeners:{
							"ready": function(){
								Firebrick.fireEvent("showLoadDone");
							}
						}
					})
				});
			}else{
				view.render();
				Firebrick.fireEvent("showLoadDone");
			}
			
			Firebrick.fireEvent("updateBreadcrumb", "users_title");
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
				ap = Firebrick.get("MyApp.view.components.Pagination").getData().activePage() - 1;
			if(me.pageExist(ap)){
				me.updateBindingsForPage(ap);
			}
		},
		
		nextPage: function(){
			var me = this,
				ap = Firebrick.get("MyApp.view.components.Pagination").getData().activePage() + 1;
			if(me.pageExist(ap)){
				me.updateBindingsForPage(ap);
			}
		},
		
		updateBindingsForPage:function(ap){
			Firebrick.get("MyApp.view.app.Users").getData().activePage(ap);
			Firebrick.get("MyApp.view.components.Pagination").getData().activePage(ap);
		},
		
		showUser: function(event, el){
			var me = this;
			if(!me.isOnShow){
				Firebrick.get("MyApp.view.components.Nav").getData().setActive("app_Users");
			}
			me.updateBindingsForPage( $(el).attr("data-ta-index") );
		}
		
	});
});