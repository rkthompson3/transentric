define(['text!templates/common/commonTemplate.html!strip','text!templates/home/myinfo/myinfoViewTemplate.html!strip','model/user/userModel','common'],
       function (commonTemplate,myinfoViewTemplate,user,aem) {
  var common = $(commonTemplate).siblings('script');
  var html = $(myinfoViewTemplate).siblings('script');
  var UrlString=aem.commonUrl();
  var myinfoPageView = Backbone.View.extend({
	    header:_.template(common.siblings("#all-header").text()),
	    content:_.template(html.siblings("#myinfo").text()),
	    admincontent:_.template(html.siblings("#myinfoadmin").text()),
	    footer:_.template(common.siblings("#footer").text()),
	     render: function(){
	      var userrole=user.get("role");
	       if(userrole == "driver"){
	    	   this.$el.append(this.header).append(this.content(user)).append(this.footer);   
	       }else if(userrole == "admin" || userrole == "superadmin" || userrole == "subadmin" || userrole == "subuser"){
	    	   this.$el.append(this.header).append(this.admincontent(user)).append(this.footer);  
	       }
	       var mprovider=user.get("myinfo");
	       $(this.el).find('#mobileServiceProvider option[value='+mprovider.mobileServiceProvider+']').attr('selected', 'selected');
	     //  $(this.el).find("#signature").jSignature({color:"#00f",lineWidth:3});
			/*if(signData != null || signData !=''){
			$("#signature1").jSignature('importData',signData);
			}*/
	       $(this.el).find("#headertext").html('My Information');
	       return this;
           
	      },
	      events:{
	          'click #btnChangewd':'btnChangewd_clickHandler',
	          'click #btnSave':'btnSave_clickHandler'
	         
	      },
	      btnChangewd_clickHandler:function (event) {
	    	  router.navigate("changepwd",{trigger:'true'});
	      },
	      btnSave_clickHandler:function (event) {
	    	  var formResults = $("#userinfo").triggerHandler("submit");
	    	  if(formResults===true){
		    	  var myinfodata=user.get("myinfo");
		    	  var formarray=  $("form#userinfo").serializeArray();
		    	  for(var k in formarray){
		    		  var obj = formarray[k];
		    		  var name;
		    		  if(obj && (name = obj["name"])){
		    			  var value = obj["value"]||"";
		    			  if(name==="mobile"){
		    				  value = (value).split("-").join("");
		    			  }
		    			  myinfodata[name] = value;
		    		  }
		    	  }
		     	  var requestData = JSON.stringify(myinfodata);
		     	 var userRole=user.get("role");
				 var url;
		     	 if(userRole == "driver"){
		     		 	 url = "/driver/add-or-update-user";
			       }else if(userRole == "admin"){
			    	     url = "/trucking-firm/add-or-update-user"; 
			       }else if(userRole == "subadmin" || userRole == "subuser"){
			    	     url = "/subsidiary/add-or-update-user"; 
			       }else if(userRole == "superadmin"){
			    	     url = "/info/update-user-info"; 
			       }
	     	  
	     		 aem.serviceCalls(requestData,url,"POST",function (data){
		    		 if(typeof data !== "string")
						{
		    			    $('#msg').html('<div class="mbc-feedback mbc-feedback-success ui-corner-all"><h2>Updated successfully</h2></div>');
						}else {
							$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>'+data+'</h2></div>');

						}
		        	});
	     	  }
	     	 }
	});
  
  return myinfoPageView;
});


