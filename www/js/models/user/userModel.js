define([],
	       function (){

	User=Backbone.Model.extend({
    //default attributes 
		defaults:{
			id:"",
			photos:"",
			myinfo:"",
			disable:"",
			userinfo: "",
			order:"",
			data : "",
			ordersData:"",
			date:"",
			time:"",
			count : "",
			role:"",
			doctypeObject:"",
			workflowinfo:"",
			allreporteddamages:[],
			vin:[]
		},
		initialize: function(){
           //alert("initialized");
        }
	});
	user = new User();
	return user;
});

