define(['text!templates/common/commonTemplate.html!strip','text!templates/home/homeViewTemplate.html!strip','model/user/userModel','common'],
       function (commonTemplate,homeViewTemplate,user,aem) {
  var common = $(commonTemplate).siblings('script');
  var html = $(homeViewTemplate).siblings('script');
  var error='<div class="mbc-feedback mbc-feedback-error ui-corner-all"><h2>Please enter valid order number</h2></div>';
 var UrlString=aem.commonUrl();
 var ordervar;
 var _this;
 var homePageView = Backbone.View.extend({
	    header:_.template(common.siblings("#home-header").text()),
	    content:_.template(html.siblings("#homepage").text()),
	    footer:_.template(common.siblings("#footer").text()),
	    information:_.template(common.siblings("#unauthorisedMessage").text()),
	    initialize: function() {
        	_this = this;
        },
	     render: function(){
	    	 this.$el.append(this.header).append(this.content).append(this.footer);  
	    	 var userMetadata=user.get("userinfo");
	    	   // var userId=user.get("User");
	    		if(userMetadata === ""){
	    			$.ajax({
			            type: "GET",
			            url : UrlString+"/info/get-user-metadata",
			            dataType: "json",
			            cache:false,
			            success: function (data) {
			          	  $.mobile.hidePageLoadingMsg ();
			          	 if(typeof data === "object")
							{	
			        			 user.set({ userinfo: data});
			        			_this.homePageDisplay(data);
			        					
							}else	{
								 _this.$el.append('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>'+data+'</h2></div>').trigger("create");
							}
			            },
			            error: function(data) {
			          	  $.mobile.hidePageLoadingMsg ();
			              _this.$el.append(this.information);
			              $('#unauthorisedMessage').css('display','block');
			            }
					
			      	});
				}else{
					_this.homePageDisplay(userMetadata);
				}
	    	 
	    	//this.$el.append(this.footer);
	    	$(this.el).find("#headertext").html('Agilink </br> Event Manager');
	    	return this;
	      },
	      events:{
			  'focus #search'     : "focus_Handler",
	    	  'click .ordervent':'ordervent_clickHandler',
	    	  'click #btnMyinfo':'btnMyinfo_clickHandler',
	    	  'click #btnLogout':'logOut_clickHandler',
	    	  'click a.ordersNumber':'getOrderIndexNumber',
	    	  'click a.orders':'selectOrder',
	    	  'click a.stoplist':'selectStop'
	      },
	      selectStop:function (event){
	    	  localStorage.stopseqId=$(event.target).attr('name');
	    	  router.navigate("signature",{trigger:'true'});
	      },	      
	      selectOrder:function (event) {
	    	  var x=$(event.target).text();
	    	  $("div #searchDiv input").val(x);
	    	  $("#popupOrders").popup("close");
	    	  _this.ordervent_serviceCalls(x);
	      },
	      focus_Handler:function (event) {
	    	   $('#msg').html('');
	       	  $("div #searchDiv ul").removeClass("ui-screen-hidden");
	      },
	      ordervent_clickHandler:function (event) {
		    	ordervar=$(event.target).text();
		    	if($("#search").val()!==""){
		    	 var order= $("#search").val();
		    	_this.ordervent_serviceCalls(order);
		    	}
	  		else
	  			{
	  			ordervar=$(event.target).text();
	  			var driverid=user.get("userinfo").driverId;
	  			var requestData = { "drivId":driverid};
	  			aem.serviceCalls(requestData,"/driver/get-driver-assignments","GET",function (data){
		    		 if(typeof data === "object")
						{
		    		if(data.orders.length>0){
		    			 $('#CompleteorderList').children('ul').html('');
		            	  $.mobile.hidePageLoadingMsg ();
		                 for (var i = 0; i < data.orders.length; i++){
		                  $('#CompleteorderList').children('ul').append('<li data-icon="false"><a class="ordersNumber" >'+data.orders[i].orderNumber+'</a></li>').listview('refresh');
		                  }
		                 $('#popupAllOrders').popup('open');
		    		}else{
		    			$("#search").focus();
		    			$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>No Orders assigned for this UserId</h2></div>');
		    		}			
						}
		    		 else {
		    			 $("#search").focus();
					   _this.$el.append('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>'+data+'</h2></div>').trigger("create");
						}
		        });
	  			}
	      },
	     getOrderIndexNumber:function(event){
	    	 var order= $(event.target).text();
	    	 $("#search").val(order);
	    	 $('#popupAllOrders').popup('close');
	    	 _this.ordervent_serviceCalls(order);	
	     },
	     ordervent_serviceCalls:function(order){
	    	 
	    	var orderNum=order;
	        var requestData={"searchKey":orderNum,"events":"true","documents":"true","vinsInspected":"true"};
	        $.mobile.loading( 'show', {text: 'Please Wait',textVisible: true,theme: 'a',	html: ""});
	    	order = order.replace(/^\s+|\s+$/g,'');
	        user.set({ order: order});
	      	$.ajax({
           type: "POST",
           url : UrlString+"/order/get-order-info",
           data: JSON.stringify(requestData),
           contentType: "application/json",
           cache:false,
           success: function (response) {
         	  $.mobile.hidePageLoadingMsg ();
         	  if(response !== null){
         		  if( $(response).find('form#LOGINFORM').html() != null ){
						router.navigate("home");
						window.location.reload();
					}else{
						if(response !== undefined){
						user.set({id:response.orderNumber});
						var stopsArray = response;
						for(var i in stopsArray.stops){
							if(stopsArray.stops[i].arrivalDateTime!==null){
								stopsArray.stops[i].arrivalDateTime = this.convertToDisplayFormat(stopsArray.stops[i].arrivalDateTime);
							
							}
							if(stopsArray.stops[i].departureDateTime!==null){
								
								stopsArray.stops[i].departureDateTime = this.convertToDisplayFormat(stopsArray.stops[i].departureDateTime);
								}
						}
						user.set({data:stopsArray});
						if(ordervar == "VIEW ORDER"){
							 _this.callingWorkflowService();
						}else if(ordervar == "REPORT EVENT"){
							 _this.callingWorkflowService();
						}else if(ordervar == "SIGNATURE"){
							_this.stoplistfunc(stopsArray);
						}
					  }else{
						  $("#search").focus();
						 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Order not found</h2></div>');
					  }
					}
         		  }else{
         	      $("#search").focus();
         		  $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Order not found</h2></div>');
         	  }
           },
           error: function(response) {
        	  var errorMessage = $.parseJSON(response.responseText).message;
        	  if(errorMessage === undefined){
         	  $('#orderList').children('ul').html('');
         	  $.mobile.hidePageLoadingMsg ();
         	  var errorMsg=$.parseJSON(response.responseText).matchedOrderNumbers;
         	  $.each(errorMsg, function(index,field){
         		   $('#orderList').children('ul').append('<li data-icon="false"><a class="orders" >'+field+'</a></li>').listview('refresh');
               });
               $('#popupOrders').popup('open');
               //$("#popupOrders").css("width","80%")
        	  }else{
        		  $.mobile.hidePageLoadingMsg ();
        		  $("#search").focus();
        		  $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Order not found</h2></div>');
        	  }
               
          },
          convertToDisplayFormat:function(x){
  			var newDate = x.substring(4,6)+"/"+x.substring(6,8)+"/"+x.substring(0,4)+" "+x.substring(8,10)+":"+x.substring(10,12);
  			return newDate;
  		}
       });
	   },
	   stoplistfunc:function(stopsArray){
    	   localStorage.stopcount=stopsArray.stops.length;							
    	   if(stopsArray.stops.length > 2){
    		   $.each(stopsArray.stops, function(index,field){
    			   if(stopsArray.stops[index].stopReason=='CU' || stopsArray.stops[index].stopReason== 'PU' || stopsArray.stops[index].stopReason== 'UL'){  
    			   }
    			   else{
    				   localStorage.stopcount=localStorage.stopcount-1;
    			   }
    		   });
    	   }
		if(localStorage.stopcount > 2){
			$('#stopslist').children('ul').html('');
			  $.mobile.hidePageLoadingMsg ();
			  $.each(stopsArray.stops, function(index,field){
				  $('#stopslist').children('ul').append('<li data-icon="false" ><a class="stoplist" id="'+stopsArray.stops[index].stopId+'"><span id="sub-popup">Stop:'+stopsArray.stops[index].stopSequence+'</span><h4 name="'+stopsArray.stops[index].stopId+'" id="split-popup" >'+stopsArray.stops[index].address.entityName+'<br/>'+stopsArray.stops[index].address.addressLine1+'<br/>'+stopsArray.stops[index].address.city+','+stopsArray.stops[index].address.state+' '+stopsArray.stops[index].address.zip+'</h4></a></li>').listview('refresh').trigger("create");
	           // $('#stopslist').children('ul').append('<li data-icon="false"><a class="stoplist" >'+'stop'+stopsArray.stops[index].stopSequence+','+stopsArray.stops[index].address.entityName+','+stopsArray.stops[index].address.addressLine1+','+stopsArray.stops[index].address.city+','+stopsArray.stops[index].address.state+','+stopsArray.stops[index].stopReason+'</a></li>').listview('refresh');
			  });
		      $('#popupStops').popup('open');
		}else{
		router.navigate("signature",{trigger:'true'});
		}
       },
	     btnMyinfo_clickHandler:function (event) {
	    	  var userId=user.get("User");
	    	  $.mobile.loading( 'show', {text: 'Please Wait',textVisible: true,theme: 'a',	html: ""});
	    	  aem.serviceCalls("","/info/get-user-info?userId="+userId,"GET",function (data){
		    		 if(typeof data === "object")
						{
		    			  	user.set({myinfo:data});
		            	    router.navigate("myinfo",{trigger:'true'});
						}else {
							$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>'+data+'</h2></div>');

						}
		        	});
	 	 
	      },
	      homePageDisplay : function(data){
	    	  if(data.roles =="EVL-Tran-Super-Admin" || data.roles =="EVL-TruckFirm-Admin" || data.roles =="EVL-ThreePL-Admin" || data.roles =="EVL-Driver-User" || data.roles =="EVL-ThreePL-User" || data.roles =="EVL-TruckFirm-User"){
					if(data.roles =="EVL-Driver-User" || data.roles =="EVL-ThreePL-User" || data.roles =="EVL-TruckFirm-User"){
						if(data.roles =="EVL-ThreePL-User"){
							user.set({ role: "subuser"});
						}else{
							user.set({ role: "driver"});
						}
						
					}else if(data.roles =="EVL-TruckFirm-Admin"){
						user.set({ role: "admin"});
					}else if(data.roles =="EVL-ThreePL-Admin"){
						user.set({ role: "subadmin"});
					}else if(data.roles =="EVL-Tran-Super-Admin"){
						user.set({ role: "superadmin"});
					}
				}else{
					user.set({ role: "notauth"});
					router.navigate("notauth",{trigger:'true'});
				}
	    	  _this.$el.find("#main-content").html(_.template(html.filter("#homepage-content").html(),{user:user})).trigger("create");
				user.set({disable:""});
			},
			callingWorkflowService: function(data){
				 var senderid=user.get("data").senderId;
		 	     var recieverid=user.get("data").receiverId;
		 	  		 aem.serviceCalls("","/workflow/get-partner-workflows?senderId="+senderid+"&receiverId="+recieverid,"GET",function (data){
		 		    		 if(typeof data === "object")
		 						{
		 		    			 user.set({ workflowinfo: data});
		 		    			if(ordervar == "VIEW ORDER"){
		 		    				router.navigate("ordersummary",{trigger:'true'});
								}else if(ordervar == "REPORT EVENT"){
									_this.nexteventCheck_clickHandler(event);
								}
		 						} 
		 		    		 else {
		 			 aem.serviceCalls("","/workflow/get-default-workflow","GET",function (data){
			 		    	if(typeof data === "object")
			 						{
			 		    		    var workflowarrobject =[]; 
			 		    		    workflowarrobject.push(data);
			 		    			user.set({ workflowinfo: workflowarrobject});
			 		    			if(ordervar == "VIEW ORDER"){
			 		    				router.navigate("ordersummary",{trigger:'true'});
									}else if(ordervar == "REPORT EVENT"){
										_this.nexteventCheck_clickHandler(event);
									}
			 						} 
			 		        else {
			 		        	$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>'+data+'</h2></div>');
			 				 }
			 		       });
		 				}
		 		    });
			},
			logOut_clickHandler:function (event) {
				user.clear().set(user.defaults);
				localStorage.clear();
				$.mobile.loading( 'show', {text: 'Please Wait',textVisible: true,theme: 'a',	html: ""});
				$.ajax({
		            type: "GET",
		            url : UrlString+"/info/logout",
		            dataType: "json",
		            cache:false,
		            success: function (data) {
		          	  $.mobile.hidePageLoadingMsg ();
		          	document.cookie = 'SMSESSION=deleted; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
		          	document.cookie = 'SMUSRMSG=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
		          	 if(typeof data === "object")
						{	
						 window.localStorage.setItem('username','undefined');
						 window.localStorage.setItem('password','undefined');
		          		router.navigate("login",{trigger:'true'});
						}else{
						 window.localStorage.setItem('username','undefined');
						 window.localStorage.setItem('password','undefined');
						router.navigate("login",{trigger:'true'});
						}
		            },
		            error: function(data) {
		            	 $.mobile.hidePageLoadingMsg ();
		            	document.cookie = 'SMSESSION=deleted; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
		            	document.cookie = 'SMUSRMSG=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
		            	router.navigate("login",{trigger:'true'});
		            }
				
		      	});
		      },
		      nexteventCheck_clickHandler:function(event){
		    		 
			       var Nextflag = false;
		   		   var stopindex = 0;
		   		   var data= user.get("data");
		   		   var numberofStops = data.stops.length;
		   		   for(var index=stopindex;index<numberofStops;index++){
		            	   var workflowarr=[];
		     	    	   workflowarr=user.get("workflowinfo");
		                   var data= user.get("data");
		     			   var stopindex= index;
		     			   user.set({subdata:stopindex});
		     		       var subdata= user.get("subdata");
		     		       var GetstopReason = user.get('data').stops[stopindex].stopReason;
		   	    	       user.set({stopReason:GetstopReason});
		     		 	   var orderid =user.get('data').orderId;
		     			   var stopId=data.stops[subdata].stopId;
		     			  
		     			   var RaisedDocumentcode =[];
			  			    if(data.stops[subdata].docIds !== null){
							    for(var i=0;i<data.stops[subdata].docIds.length;i++){
								   var documentcode=data.stops[subdata].docIds[i];
								   RaisedDocumentcode.push(documentcode);
							   }
						    }
		     			   var Raisedeventcode=[];
		     			   if(data.raisedEvents !== null || data.raisedEvents.length > 0){
		     			    for(var i=0;i<data.raisedEvents.length;i++){
		     			       if(data.raisedEvents[i].stopId == stopId && data.raisedEvents[i].orderId == orderid){	
		     				   var eventcode=data.raisedEvents[i].eventCode;
		     				   Raisedeventcode.push(eventcode);
		     			       }
		     			    }
		     		       }
		     			   
		     			   // get all vin numbers
		     			  var allPresentVinNumbers=[];
		     			  if(data.references !== null || data.references.length>0){
			    			    for(var i=0;i<data.references.length;i++){
			    			       if(data.references[i].referenceCode == "VT"){	
			    				   var vinNumbers=data.references[i].referenceValue;
			    				   allPresentVinNumbers.push(vinNumbers);
			    			       }
			    			   }
			    		     }
		    			  // get all raised vin numbers
		     			 var getallRaisedVinNumber=data.stops[subdata].vins;
		     			 
		     			  for (var i in workflowarr){ 
		         		  if(workflowarr[i].workflowType.name == "Order in the System"){
		     			  $.each(workflowarr[0].details, function(index,val) {
		     				         var str=val.stopType.codes + '';
		                             if (val.required === true) {
		                             if(val.eventDetail !== null && val.workflowDetailType == "EVENT" && jQuery.inArray( val.eventDetail.eventCode, Raisedeventcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1 ){
		                            	 Nextflag=true;
		                            	 return false;
		                              }
		                             else if(val.eventDetail === null && val.workflowDetailType == "DOCUMENT"  && jQuery.inArray( val.documentDetail.documentType.id, RaisedDocumentcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
		                            	 Nextflag=true;
		                            	 return false; 
		                             }
		                             else if(val.eventDetail === null && val.workflowDetailType == "SIGNATURE"  && jQuery.inArray('0', RaisedDocumentcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
		                            	 Nextflag=true;
		                            	 return false; 
		                             }
		                             // If all vins are not raised and required is true,navigate to that stop.
		                             else if(val.eventDetail === null && val.workflowDetailType == "INSPECTION"  && (allPresentVinNumbers.length != getallRaisedVinNumber.length) && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
		                            	 Nextflag=true;
		                            	 return false; 
		                             }
		                           }
		                  });
		         		  }}
		     			  if(Nextflag){
		     				  break;
		     			  }
		            	 } 
		            	 if(Nextflag){
		                  router.navigate("nextevent",{trigger:'true'});
				     	 }else{
				     	//  $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Required events not found.</h2></div>');
				     	  router.navigate("ordersummary",{trigger:'true'});
				     	 }
		           }
	});
  
  return homePageView;
});


