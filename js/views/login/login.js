define(['text!templates/common/commonTemplate.html!strip','text!templates/login/loginViewTemplate.html!strip','model/user/userModel','common'], 
function(commonTemplate,loginViewTemplate,user,aem){
	'use strict';
	var common = $(commonTemplate).siblings('script');
	var html = $(loginViewTemplate).siblings('script');
	var loginPageView = Backbone.View.extend({

    //initialize template
	  header:_.template(common.siblings("#header").text()),
	  content:_.template(html.siblings("#login").text()),
	  footer:_.template(common.siblings("#footer").text()),
    //render the content into div of view 
    render: function(){
	  this.$el.append(this.header).append(this.content(user)).append(this.footer);
	  $(this.el).find("#headertext").html('Agilink </br> Event Manager');
      return this;
      
    },
	 forgotpage: function(){
		 this.$el.append(this.header).append(_.template(html.siblings("#forgotpwd").text())).append(this.footer);
    	 return this;
	 },
	 events:{
	          'click #btnSignin':'btnSignin_clickHandler',
	          'click #btnSubmit':'btnSubmit_clickHandler' 
	         
	  },
	  btnLogin_clickHandler:function (event) {
		  // $.mobile.showPageLoadingMsg();
		   $.mobile.loading( 'show', {text: 'Please Wait',textVisible: true,theme: 'a',	html: ""});
		   
		   //	var urlstring= 'https://xdev.m.transentric.com/aem/secure/index.html';
		   	//var urlstring= 'http://173.229.166.33:9080/evl/secure/jas/order/rest-ping';
	  		var index=0;
      		var loc="";
      		 window.plugins.childBrowser.showWebPage(urlstring, { showLocationBar: true });
          	 loc="";
              window.plugins.childBrowser.onLocationChange= function(loc){
               	if((urlstring===loc) && (index!==0)) {
          			  	window.plugins.childBrowser.close();
          			  	router.navigate("home",{trigger:'true'});
          		  	loc="";
          		}else if((urlstring!==loc) && (index===0)){
          				loc="";	
          				index++;
          		}else if((urlstring!==loc) && (index!==0)){
          				loc="";
          				index++;
          		}
          		
               }; 
          
		  //router.navigate("home",{trigger:'true'});  
	  },
	 btnSignin_clickHandler:function (event) {
		 var username =$('#USER').val();
		 var pwd = $('#PASSWORD').val();
		 aem.signFunction(username,pwd,function (data){
    		 if(data === true)
				{
    			 user.set({ User: username});
    	 		 user.set({ Password: pwd});
    	 		 window.localStorage.setItem('username',username);
    	 		 window.localStorage.setItem('password',pwd);
    	 		 router.navigate("home",{trigger:'true'});
    	 		 aem.imageUploadDB();
        					
				}else{
					$('#PASSWORD').val('');
			 		$('#USER').val('');
			 		$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Either Username or password is incorrect</h2></div>');
				}
        	});
		 /*if(aem.signFunction(user,pwd)){
			 user.set({ User: x});
	 		 user.set({ Password: y});
	 		 router.navigate("home",{trigger:'true'});
		 }else{
			    $('#PASSWORD').val('');
		 		$('#USER').val('');
		 		$("#btnData").html("Either Username or password is incorrect");
		 }*/
	  },
	  btnSubmit_clickHandler:function (event) {
		  router.navigate("login",{trigger:'true'});
	  }
    
  });
  return loginPageView;
});




