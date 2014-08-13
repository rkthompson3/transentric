define(function(){
        var _this;
        var mainIndec=0, mainindeclength=0, subIndex=0,subindexlength=0;
	var mainIndecResume=0,mainindeclengthResume=0,subIndexResume=0;
	var oid=null;
	var stopId=null;
	var userId=null;
	var ordernumber=null;
        var dObject=null;
        var globalImagesArray=null;
        var AEMDB = window.openDatabase("AEM", "1.0", "AEMDB", 20000);
        document.addEventListener("backbutton", onBackKeyDown, false);

        
        function onBackKeyDown(e) {
        	if(Backbone.history.fragment == "login"){
        		navigator.app.exitApp();
        	}else{
        		 e.preventDefault();
        		/*window.history.back();
        		return false;*/
        	}
        }
        var aemCommon = function(){
                // Initialization Function
                _this = this;
                $('body').on('click','.back', function(event) {
                if(history.length==0 || history.length ==2){
                	router.navigate('home',{trigger:'true'});
                }else{   
                	window.history.back();
    			}
				
				return false;
        	});

	   /* resume event functionality */   
	      
	        document.addEventListener("resume", onResume, false);
                var fragments = {"login":"login","photoCapture":"photoCapture"};
	        function onResume() {
		     
		     if (fragments[Backbone.history.fragment] === undefined) {
		     
		       userId=user.get("User");
		      _this.loadFromDBuserId(userId,pendingImages);
                       
              function pendingImages(results) {

					if (results.rows.length > 0) {
						navigator.notification.confirm(
								'you have images to upload', // message
								 onConfirm, // callback to invoke with index of
											// button pressed
								'Document Upload', // title
								'Ok,Cancel' // buttonLabels
						);
						function onConfirm(button) {
							if (button == 1) {
								_this.resumesubmitPhotos();
							}
						}

					}

				}

			}
		}
        };
         aemCommon.prototype = {  // entire code
        		commonUrl :function () {
        		 // var url = "http://10.0.2.2:9080/aem/secure/jas";
        		 //	var url="http://69.58.243.12:9080/aem/secure/jas";
        		    var url = "https://m.transentric.com/aem/secure/jas";
        			return url;
        		},
        		buildevntObject :function (responseObj,Time,Zone){
        		  	  var eventObj = new Object();
        		  	  var obj=user.get('data').stops[user.get('subdata')];
        		  	 // alert(obj.stopId+"order"+user.get('data').orderId+"code"+user.get('event'));
					  var eqpnum;
					  var weight;
					  var pieces;
        		  	  if(responseObj.eqmtDetails.length>0){
        			 		if(responseObj.eqmtDetails[0].eqmtInitial!==null && responseObj.eqmtDetails[0].eqmtNumber!==null ){
        			     		 eqpnum=responseObj.eqmtDetails[0].eqmtInitial+responseObj.eqmtDetails[0].eqmtNumber;
        			     	}else{
        			     		 eqpnum='';
        			     	}
        			 	}else{
        			 		 eqpnum='';
        			 	}
        			  	if(responseObj.references.length>0 ){
							var bolNumber;
        			  		var bolFlag=false;
        		     		for(var i in responseObj.references){
        		     			if(responseObj.references[i].referenceCode == "BM"){
        		     			     bolNumber=responseObj.references[i].referenceValue;
        		     				bolFlag=true;
        		     			}
        		     		}
        		     		if(bolFlag === false){
        		 			        bolNumber='';
        					}
        		     	}else{
        		     				 bolNumber='';
        		     	}
        			  	if(responseObj.stops[0].weight!==null ){
        	         		 weight=responseObj.stops[0].weight;
        	         	}else{
        	         		 weight='';
        	         	}
        	         	if(responseObj.stops[0].pieces!==null ){
        	         		 pieces=responseObj.stops[0].pieces;
        	         	}else{
        	         		 pieces='';
        	         	}
        			 	eventObj.orderId = user.get('data').orderId;
        		  	    eventObj.eventId = user.get('eventid');
        		  	    eventObj.stopId	= obj.stopId;
        		  	    eventObj.latitude = null;
        		  	    eventObj.longitude = null;
        		  	    eventObj.bolNumber = bolNumber;
        		 	    eventObj.loadIndicator = 'NA';
        		  	    eventObj.driverId = null;
        		  	    eventObj.city = obj.address.city;
        		  	    eventObj.state = obj.address.state;
        		  	    eventObj.zip = obj.address.zip;
        		  	    eventObj.countryCode = obj.address.countryCode;
        		  	    eventObj.notes = null;
        		  	    eventObj.eventDate = Time;
        		  	    eventObj.timeZone = Zone;
        		  	    eventObj.equipmentNumber = eqpnum;
        		  	    eventObj.eventCode = user.get('event');
        		  	    eventObj.eventName = user.get('eventname');
        		  	    eventObj.lodeCondition = null;
        		  	    eventObj.delayReason = null;
        		  	    eventObj.delayDuration = null;
        		  	    eventObj.delayDurationUnit = null;
        		  	    eventObj.pieces=pieces;
        		  	    eventObj.weight=weight;
        		  	    eventObj.uomWeight=responseObj.stops[0].uomWeight;
        		  	    eventObj.seals=null;
        		  		return eventObj;
        		   
        		},
        		reportSubmit :function (user,eventObj){
        			if(navigator.network.connection.type == "none"){
              			 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>No Internet Connection.</h2></div>');
              			}else{
        			  $.mobile.loading( 'show', {text: 'Please Wait',textVisible: true,theme: 'a',	html: ""});
        			  var requestData = JSON.stringify(eventObj);
        			  // alert(requestData+"eventname"+user.get("eventname"));
        			   $.ajax({
        		        type: "POST",
        		        url: this.commonUrl()+"/event/report-event",
        		        data: requestData,
        		        cache:false,
        		        contentType: "application/json",
        		        success: function (response) {
        		        	$.mobile.hidePageLoadingMsg ();
        		        	if (response.responseCode == 200 || response.responseCode == 202) {
        		        		           var orderNumber=user.get("order");
  			               	               var requestData={"searchKey":orderNumber,"events":"true","documents":"true","vinsInspected":"true"};
  			                          	   requestData=JSON.stringify(requestData);
        			               	  _this.serviceCalls(requestData,"/order/get-order-info","POST",function (data){
        			    			    		 if(typeof data === "object")
        			    							{
        			    			    			 if(data !== null){
        			    			    				 for(var i in data.stops){
        			    				  	    				if(data.stops[i].arrivalDateTime!==null){
        			    				  	    					var x=data.stops[i].arrivalDateTime;
        			    				  	    					var newDate = x.substring(4,6)+"/"+x.substring(6,8)+"/"+x.substring(0,4)+" "+x.substring(8,10)+":"+x.substring(10,12);
        			    				  	    					data.stops[i].arrivalDateTime = newDate;
        			    				  	    				
        			    				  	    				}
        			    				  	    				if(data.stops[i].departureDateTime!==null){
        			    				  	    					var x=data.stops[i].departureDateTime;
        			    				  	    					var newDate = x.substring(4,6)+"/"+x.substring(6,8)+"/"+x.substring(0,4)+" "+x.substring(8,10)+":"+x.substring(10,12);
        			    				  	    					data.stops[i].departureDateTime = newDate;
        			    				  	    					}
        			    				  	    			}
        			    			    				  user.set({data:data});
        			    			    				  if (response.responseCode == 202) {
        			        			  			 		  if(response.errorMessage === ""){
        			        			  			 			response.errorMessage ="Event Created";
        			        			  			 		  }
        			        				  			 	$('#content #msg').html('<div class="mbc-feedback mbc-feedback-success ui-corner-all"><h2>'+response.errorMessage+'</h2></div>');
        			        				  			  	}
        			    			    				  else{
        			        				  			  	$('#content  #msg').html('<div class="mbc-feedback mbc-feedback-success ui-corner-all"><h2>Event Created</h2></div>');
        			        				  			  	}
        			    			    				  
        			    			    				  if(Backbone.history.fragment == "adninfo"){
        			    			    					  $('#addinfoSubmit').addClass('ui-disabled');
        			    			    					  user.set({additionalinfosubmit:"yes"});
        			    			    				  }else{
        			    			    					  $('#submitevent').addClass('ui-disabled');
        				    			    				  $('#reportaddinfo').addClass('ui-disabled'); 
        			    			    				  }
        			    			  	               }
        			    			    			 }
        			    			        	});
        		        	}else{
										var errorMsg=response.errorMessage;
										$('#content  #msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all"><h2>'+errorMsg+'</h2></div>');
							}
        		      	  
        		        },
        		        error: function(response) {
        		          $.mobile.hidePageLoadingMsg ();
        		          var errorMsg=jQuery.parseJSON(response.responseText).message;
        		      	  $('#content  #msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>'+errorMsg+'</h2></div>');
        		       }
        		    });
              	  }		   
        		},
        		
        		//Inspection cancel service.
        		cancelInspection:function(){
             		navigator.notification.confirm(
                            'Are you sure you want to cancel Inspection,It will delete entire data?',  // message
                            onConfirm,        // callback to invoke with index of button pressed
                            'Cancel Inspection',         // title
                            'Yes,No'       // buttonLabels
                         );
           		    function onConfirm(button){	
        	               if(button==1){
        	            	   _this.cancelingInspection();
        	                }
                    }
        		},
        		cancelingInspection:function(){
            		var vehInfoId;
            		var vincount;
            		var vinIds=[];
            		
            		for(var i in user.get('vin')){
                   		vinIds.push(user.get('vin')[i]);
                    }
                    if(navigator.network.connection.type == "none"){
            			 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>No Internet Connection.</h2></div>');
            		}else{
                      $.mobile.loading( 'show', {text: 'Please Wait',textVisible: true,theme: 'a',	html: ""});
                      for(var j=0;j<vinIds.length;j++){
                      $.ajax({
      			 		type : "POST",
      			 		url:  this.commonUrl()+"/damage/cancel-inspection-report?vehInfoId="+vinIds[j],
      			 	    cache:false,
    				    contentType: "application/json",
      			 		success : function(response) {
      			 					$.mobile.hidePageLoadingMsg ();
      			 				    _this.deleteDamageImageTable();
      			 				   if(j==vinIds.length) {
      			 					user.set('allreporteddamages',[]);
       			 				    user.set('vin',[]);
      			 				    router.navigate("openscannerscreen",{trigger:true,replace:true});
      			 				   
      			 				   }
      			 				   
      			 				},
      			 				error : function(response) {
      			 					$.mobile.hidePageLoadingMsg ();
      			 				    $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Failed to cancel Inspection.</h2></div>');
      			 				}
      			 	   });
            		} 
            		 }
        		},
        		/*getRaisedEvnt :function (stopId,dummy){
        			 var evnt = new Object();
        				if(dummy.stopId == stopId){
        					evnt.code=dummy.eventCode;
        					evnt.date=dummy.eventDate;
        					evnt.zone=dummy.timeZone;
        				}else{
        					evnt="false";
        				}
        				return evnt;
        		},*/
        		serviceCalls :function (requestData,url,reqType,callback){
        			if(navigator.network.connection.type == "none"){
           			 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>No Internet Connection.</h2></div>');
           			}else{
           			 $.mobile.loading( 'show', {text: 'Please Wait',textVisible: true,theme: 'a',	html: ""});	
        			 $.ajax({
        						type : reqType,
        						url: this.commonUrl()+url,
        						data: requestData,
        						cache:false,
        						contentType: "application/json",	
        						success : function(response) {
        							$.mobile.hidePageLoadingMsg ();
        							if( $(response).find('form#LOGINFORM').html() != null ){
        								var uname=user.get("User");
        								var password=user.get("Password");
        								_this.signFunction(uname,password,function (data){
        						    		 if(data === false)
        										{
        											$('#PASSWORD').val('');
        									 		$('#USER').val('');
        									 		alert("Your Session is Expired ! Login Again");
        									 		router.navigate("login",{trigger:'true'});
        										}
        						        	});
									}else{
										callback(response);
									}
        						},
        						error : function(response) {
        							$.mobile.hidePageLoadingMsg ();
        							 var errorMsg=jQuery.parseJSON(response.responseText).message;
        							callback(errorMsg);
        							
        						}
        					});
           			   }
        			},
        			getcurrentTime :function (){
        			var d = new Date();
        		    var dateNew =d.getFullYear()+'/'+(d.getMonth()+1)+'/'+d.getDate()+'/'+d.getHours()+'/'+d.getMinutes();
        		    var datearray = dateNew.split("/");
        		    for(var x=0;x<datearray.length;x++){
        		    	if(datearray[x]<10){
        		    		datearray[x]='0'+datearray[x];
        		    	}
        		    }
        		    var newdate=datearray[0]+ datearray[1]+datearray[2]+datearray[3]+datearray[4];
        		    return newdate;
        	    	},updateTheme : function (header,button,listviews){
        				//alert("In refresh");
        				var rmbtnClasses = '';
        				var rmhfClasses = '';
        				var rmbdClassess = '';
        				var arr = ["a", "b", "c", "d", "e", "f", "g", "h"];
        				$.each(arr,function(index, value){
        				    rmbtnClasses = rmbtnClasses + " ui-btn-up-"+value + " ui-btn-hover-"+value;
        				    rmhfClasses = rmhfClasses + " ui-bar-"+value;
        				    rmbdClassess = rmbdClassess + " ui-body-"+value;
        				});
        				var btntheme=" ui-btn-up-"+button + " ui-btn-hover-"+button;
        				// reset the header/footer widgets
       				 	$.mobile.activePage.find('.ui-header, .ui-footer').removeClass(rmhfClasses).addClass('ui-bar-' + header).attr('data-theme', header);
        				// reset all the buttons widgets
        				 $.mobile.activePage.find('.ui-btn').not('.ui-li-divider').removeClass(rmbtnClasses).addClass('ui-btn-up-' + button).attr('data-theme', button);
        				 $.mobile.activePage.find('.ui-header .ui-btn').not('.ui-li-divider').removeClass(rmbtnClasses).addClass('ui-btn-up-' + header).attr('data-theme', header);
        				 $.mobile.activePage.find('.ui-listview .ui-btn').removeClass(btntheme).addClass('ui-btn-up-' + listviews).attr('data-theme', listviews);
        				 var listtheme=" ui-btn-up-"+listviews + " ui-btn-hover-"+listviews;
        				 $.mobile.activePage.find('.eventsList-ul .ui-listview .ui-btn').removeClass(listtheme).addClass('ui-btn-up-' + button).attr('data-theme', button);
        				 // reset the page widget
        				 $.mobile.activePage.removeClass(rmbdClassess).addClass('ui-body-' + button).attr('data-theme', button);
        				 // target the list divider elements, then iterate through them and
        				 // change its theme (this is the jQuery Mobile default for
        				 // list-dividers)
        				 $.mobile.activePage.find('.ui-li-divider').each(function(index, obj) {
        				 $(this).removeClass(rmhfClasses).addClass('ui-bar-' + listviews).attr('data-theme',listviews);
        				 	});
        				 },
        		   deafualtloginfunc:function(username,password){
        			_this.signFunction(username,password,function (data){
        				 if(data === true)
        				 {
        					 user.set({ User: username});
        	    	 		 user.set({ Password: password});
        	    	 		 user.set(JSON.parse(window.localStorage.getItem('UserModel')));
        	    	 		// alert(window.localStorage.getItem('UserModel'));
        	    	 		 router.navigate(window.localStorage.getItem('page'),{trigger:'true'});
        				 }
        			});
        		 },
        				 
        		signFunction :function(x,y,callback){
        			if(navigator.network.connection.type == "none"){
        			 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>No Internet Connection.</h2></div>');
        			}else{
        			var LOGIN_PAGE_SECURITY_INDICATOR = 'Your login attempt failed. Please try again';
        			 $.mobile.loading( 'show', {text: 'Please Wait',textVisible: true,theme: 'a',	html: ""});
        			 $.ajax({
        				 type: "POST",
        				 url: "https://m.transentric.com/admin/login.fcc?TARGET=-SM-" + encodeURI("https://m.transentric.com/aem/secure/index.html "),
        				 data: { USER: x, PASSWORD: y }
        				 }).done(function(r) {
        					 $.mobile.hidePageLoadingMsg ();
        				 	if (r.search(LOGIN_PAGE_SECURITY_INDICATOR) >= 0) {
        				 		callback(false);
        				 	} else {
        				 		callback(true);
        				 	}
        				 });
        		   }
        		},
        	imageUploadDB : function(){
        	AEMDB.transaction(function (tx) {
            		   tx.executeSql("SELECT * FROM ImageTable", [], function (tx,results) {
            		   		}, function (tx, err) {
            		   			tx.executeSql('CREATE TABLE IF NOT EXISTS ImageTable (id TEXT , data TEXT ,ordernumber TEXT, userid TEXT,stopId TEXT,orderid TEXT);', []);
            		   			_this.prePopulate();
            		   		});
        		   		tx.executeSql("SELECT * FROM damageDelayTable", [], function (tx,results) {
        		   		}, function (tx, err) {
        		   			tx.executeSql('CREATE TABLE IF NOT EXISTS damageDelayTable ('
        		   						  +'seqNum INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,'
        		   						  +'orderId TEXT,'
        		   						  +'URL TEXT,'
        		   						  +'requestJSON TEXT,'
        		   						  +'VIN TEXT,'
        		   						  +'Status TEXT);', []);
        		   			_this.damagePrePopulate();
        		   		});
            	});
        	},
        	loadFromDB :function(ordernumber,userId,stopId,orderid,callback){
    			AEMDB.transaction(
    		            function(tx) {
    		                tx.executeSql("SELECT * FROM ImageTable WHERE ordernumber=? and userId=? and stopId=? and orderid=?", [ordernumber,userId,stopId,orderid], function(tx, results) {
    		                	callback(results);

    		                });
    		            }
    		    );
     		},
		    loadFromDBCount :function(doctype,ordernumber,userId,stopId,orderid,callback){
    			AEMDB.transaction(
    		            function(tx) {
    		                tx.executeSql("SELECT * FROM ImageTable WHERE id=? and ordernumber=? and userId=? and stopId=? and orderid=?", [doctype,ordernumber,userId,stopId,orderid], function(tx, results) {
    		                	callback(results);
    		                });
    		            }
    		    );
    		},
	       loadFromDBuserId :function(userId,callback){
    			AEMDB.transaction(
    		            function(tx) {
    		                tx.executeSql("SELECT * FROM ImageTable WHERE userId=? ", [userId], function(tx, results) {
    		                	callback(results);
    		                });
    		            }
    		    );
    		},
    		prePopulate :function() {
			var userId=null;
		        var ordernumber=null;
	                var docType=null;
			var data=null;
			var stopId=null;
			var orderid=null;

	        AEMDB.transaction(
	    		            function (tx) {
	    		                _this.insertImageTable(docType, data,ordernumber,userId,stopId,orderid);
	    		            }
	    		    );
	        },
	        damagePrePopulate:function(){
	    			var seqNum=null;
			        var orderId=null;
		            var URL=null;
					var requestJSON=null;
					var VIN=null;
					var Status=null;
		    	    AEMDB.transaction(
		            function (tx) {
		                _this.insertDamageImageTable(orderId,URL,requestJSON,VIN,Status);
		            }
		    	  );
	    	},
	    	insertImageTable :function(doctype, data ,ordernumber,userid,stopId,orderid) {
	    			AEMDB.transaction(function(tx) {
	    		        tx.executeSql("INSERT INTO ImageTable (id, data,ordernumber,userid ,stopId,orderid) VALUES ( ?, ?,?,?,?,?)", [doctype, data, ordernumber,userid,stopId,orderid]);

	    		    });
	    		},
    		insertDamageImageTable :function(orderId,URL,requestJSON,VIN,Status) {
    			AEMDB.transaction(function(tx) {
    		        tx.executeSql("INSERT INTO damageDelayTable (orderId,URL,requestJSON,VIN,Status) VALUES (?,?,?,?,?)", [orderId,URL,JSON.stringify(requestJSON),VIN,Status]);
    		    });
    		},
		    deleteImageTableAll :function(doctype,ordernumber,userId,stopId,orderid) {
	    			AEMDB.transaction(function(tx) {
	    		        tx.executeSql("DELETE FROM ImageTable WHERE id = ? and ordernumber=? and userId=? and stopId=? and orderid=?", [doctype, ordernumber,userId,stopId,orderid]);

	    		    });
	    		},
            deleteImageTableSingle :function(doctype,data,ordernumber,userId,stopId,orderid) {

	    			AEMDB.transaction(function(tx) {
	    		        tx.executeSql("DELETE FROM ImageTable WHERE id = ? and data=? and ordernumber=? and userId=? and stopId=? and orderid=?", [doctype,data, ordernumber,userId,stopId,orderid]);

	    		    });
	    		},
	        deleteDamageImageTable :function() {
	 				AEMDB.transaction(function(tx) {
	 				    tx.executeSql("DELETE FROM damageDelayTable ",[]);
	 				
	 				});
	 			},	
	    	getDamageImageTable :function(orderId,requestJSON,VIN,callback) {
    			AEMDB.transaction(
    		            function (tx) {
    		                tx.executeSql("SELECT * FROM damageDelayTable where orderId=? and requestJSON=? and VIN=?", [orderId,JSON.stringify(requestJSON),VIN], function(tx, results) {
    		                	callback(results);
    		                });
    		          }
    		    );
    		},
    		getAllDamageReocords :function(orderId,callback) {
    			AEMDB.transaction(
    		            function (tx) {
    		                tx.executeSql("SELECT * FROM damageDelayTable where orderId=?  and  Status <> 'Y' and requestJSON like ('%imagepath%')", [orderId], function(tx, results) {
    		                	callback(results);
    		                });
    		          }
    		    );
    		},
    		getAllDamageDetailReocords :function(orderId,callback) {
    			AEMDB.transaction(
    		            function (tx) {
    		                tx.executeSql("SELECT * FROM damageDelayTable where orderId=? and requestJSON not like ('%imagepath%') and Status <> 'Y'", [orderId], function(tx, results) {
    		                	callback(results);
    		                });
    		          }
    		    );
    		},
    		
    	/*	getAllReocords :function(orderId,callback) {
    			AEMDB.transaction(
    		            function (tx) {
    		                tx.executeSql("SELECT * FROM damageDelayTable where orderId=? ", [orderId], function(tx, results) {
    		                	callback(results);
    		                });
    		          }
    		    );
    		}, */
    		
    		getRecentDamageDelayRecord :function(orderId,VIN,callback) {
    			AEMDB.transaction(
    		            function (tx) {
    		                tx.executeSql("SELECT * FROM damageDelayTable where orderId=? and VIN=? and requestJSON like ('%imagepath%') order by seqNum asc", [orderId,VIN], function(tx, results) {
    		                	callback(results);
    		                });
    		          }
    		    );
    		},
    		checkExistDamageDelayRecord :function(orderId,VIN,requestImgJSON,callback) {
    			AEMDB.transaction(
    		            function (tx) {
    		                tx.executeSql("SELECT * FROM damageDelayTable where orderId=? and VIN=? and requestJSON like ('%imagepath%') and requestJSON=? and Status <> 'N' order by seqNum asc", [orderId,VIN,JSON.stringify(requestImgJSON)], function(tx, results) {
    		                	callback(results);
    		                });
    		          }
    		    );
    		},
    		deleteDamageDelayRecord:function(orderId,vehInfoId,requestJSON){
    			AEMDB.transaction(function (tx) {
  		          tx.executeSql("delete from damageDelayTable  where orderId=? and VIN=? and requestJSON =?", [orderId,vehInfoId,JSON.stringify(requestJSON)]); 
  		    });
    		},
    		UpdateDamageDelayRecord :function(flg,orderId,vehInfoId,requestJSON) {
    			AEMDB.transaction(function (tx) {
    		          tx.executeSql("UPDATE damageDelayTable set Status=? where orderId=? and VIN=? and requestJSON =?", [flg,orderId,vehInfoId,JSON.stringify(requestJSON)]); 
    		    });
    		},
	        getImageTable :function(doctype,ordernumber,userId,stopId,orderid,callback) {
	    			AEMDB.transaction(
	    		            function (tx) {
	    		                tx.executeSql("SELECT * FROM ImageTable WHERE id = ? and ordernumber=? and userId=? and stopId=? and orderid=?" , [ doctype,ordernumber,userId,stopId,orderid], function(tx, results) {
	    		                	callback(results);
	    		                });
	    		            }
	    		    );
	    		},
	        submitphotos: function(orderId,stopid,userid,orderNumber){
	    	    	oid=orderId;
		            stopId=stopid;
			        userId=userid;
			        ordernumber=orderNumber;
	    	     	mainIndec=0;mainindeclength=0;subIndex=0;
	    		     _this.loadFromDB(ordernumber,userId,stopId,oid,callback);
		             function callback(results) {
		            	 mainindeclength = results.rows.length;
		            	 dObject = results.rows;
		            	 if(results.rows.length>0){
		            	 if(navigator.network.connection.type != "wifi"){
				             	navigator.notification.confirm(
				                         'You are not in Wi-Fi ,Upload anyway?',  // message
				                          onConfirm,                             // callback to invoke with index of button pressed
				                         'Confirmation',                         // title
				                         'Ok,Cancel'                             // buttonLabels
				                     );
				                 function onConfirm(button) {
				                     if(button==1){
							         _this.buildmainfunction();
				                     }
				                 }
				             }else{
						        _this.buildmainfunction();
				             }
		            	 }else{
		                $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>There are no images to upload.</h2></div>');
		            	 }

		            	}
	    		},
		    buildmainfunction:function(){
		        	 if(mainIndec<mainindeclength){
					 var imagestr=dObject.item(mainIndec).data;
		        	         var type = dObject.item(mainIndec).id;
		        		 _this.buildsubfunction(type,imagestr);
		        	 }
			         else if(mainIndec >= mainindeclength){
		        		 _this.documentUploadSuccess();
		        	 }
		         },
	        buildsubfunction:function(type,imagestr){
	            	$("#status").html("");
	            var documentTypeId=user.get("docTypeId");
	           // alert(documentTypeId);
                var doctype=type;
	            var imageURI =imagestr;
		        var num=subIndex;
		        var x= ++num;
			    var msg = null;
			    msg = 'Uploading '+x+" of total "+ mainindeclength +" images";

				     $.mobile.loading( 'show', {text: msg ,textVisible: true,theme: 'a',	html: ""});
				     var options = new FileUploadOptions();
			             options.fileKey="file";
			             options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
			             options.mimeType="image/jpg";
			             var ft = new FileTransfer();
					            var upload_url=this.commonUrl()+"/file/upload-document?orderId="+oid+"&docTypeId="+documentTypeId+"&stopId="+stopId;
			                  	ft.upload(imageURI, upload_url, win, fail,options,true);
			                  	ft.onprogress = function(progressEvent) {
			                 		if (progressEvent.lengthComputable) {
			                 			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			                 			$("#status").html(perc + "% Uploaded.");
			                 		} else {
			                 				$("#status").html("");

			                 		}
			                 	};
	                  	  function win(r) {
		
					$.mobile.hidePageLoadingMsg ();
	                  	   	_this.deleteImageTableSingle(doctype,imagestr,ordernumber,userId,stopId,oid);
	                                _this.loadFromDBCount(doctype,ordernumber,userId,stopId,oid,callback);
	                                function callback(results) {
		                       $("#"+doctype).html(results.rows.length);
	                                 }
					 _this.forIteration();

	                  	 }
	                  	 function fail(error) {
	                  		$.mobile.hidePageLoadingMsg ();
	                  		 alert("Upload failed: Code = "+error.code);
	                  	 }

		},
		forIteration :function(){
		    	   subIndex++;
			       mainIndec++;
			      _this.buildmainfunction();
		 },

		documentUploadSuccess:function(){
			        $("#status").html("");
			         var documentTypeId=user.get("docTypeId");
			         var requestData = { "orderId":oid ,"stopId":stopId,"docTypeId":documentTypeId};
			        // alert("calling conclude document service");
			         _this.serviceCalls(requestData,"/file/conclude-document-upload?","GET",function (data){
			             var orderNumber=user.get("order");
			             var documentTypeName =localStorage.eventName;
			             var requestData={"searchKey":orderNumber,"events":"true","documents":"true","vinsInspected":"true"};
			             requestData=JSON.stringify(requestData);
		               	  _this.serviceCalls(requestData,"/order/get-order-info","POST",function (data){
			    			    		 if(typeof data === "object")
			    							{
			    			    			 if(data !== null){
			    			    				 for(var i in data.stops){
			    				  	    				if(data.stops[i].arrivalDateTime!==null){
			    				  	    					var x=data.stops[i].arrivalDateTime;
			    				  	    					var newDate = x.substring(4,6)+"/"+x.substring(6,8)+"/"+x.substring(0,4)+" "+x.substring(8,10)+":"+x.substring(10,12);
			    				  	    					data.stops[i].arrivalDateTime = newDate;
			    				  	    				}
			    				  	    				if(data.stops[i].departureDateTime!==null){
			    				  	    					var x=data.stops[i].departureDateTime;
			    				  	    					var newDate = x.substring(4,6)+"/"+x.substring(6,8)+"/"+x.substring(0,4)+" "+x.substring(8,10)+":"+x.substring(10,12);
			    				  	    					data.stops[i].departureDateTime = newDate;
			    				  	    					}
			    				  	    			}
			    			    				  user.set({data:data});
			    			    				  $('#msg').html('<div class="mbc-feedback mbc-feedback-success ui-corner-all"><h2>All images are Uploaded successfully</h2></div>');
			    			    				  $('#submitallPhotos').addClass('ui-disabled');
			    			    				  $('.submitallPhotosDoctype').html(documentTypeName).addClass('ui-disabled');;
			    			  	               }
			    			    			 }
			    			        	});
			    	});
		},
		resumesubmitPhotos:function(){
   	                
			if(navigator.network.connection.type != "wifi"){
                         navigator.notification.confirm(
                        'You are not in Wi-Fi ,Upload anyway?',  // message
                        onConfirm,        // callback to invoke with index of button pressed
                        'Confirmation',   // title
                        'Ok,Cancel'       // buttonLabels
                           );
                       function onConfirm(button) {
                       if(button==1){
                       _this.resumeSubmitStart();
                                    }
                         }
                        }else{
                        _this.resumeSubmitStart();
                        }   
   	           },
		
		resumeSubmitStart:function(){
                   var firstelement=0;
   	           _this.loadFromDBuserId(userId,items);
   	           function items(results) {
   	           if(results.rows.length !== 0)	{
   	           var ordr=results.rows.item(firstelement).orderid;
                   oid= parseInt(ordr,10);
                   var stopIdVal=results.rows.item(firstelement).stopId;
                   stopId=parseInt(stopIdVal,10);
                   ordernumber=results.rows.item(firstelement).ordernumber;	
                   _this.submitphotosResume(oid,stopId,userId,ordernumber);
   	           }
		   else if (results.rows.length === 0) {
		  // alert("cuming here lastly");
			  var orderNumber=user.get("order");
			 // var documentTypeName =localStorage.eventName;
			  var requestData={"searchKey":orderNumber,"events":"true","documents":"true","vinsInspected":"true"};
				 requestData=JSON.stringify(requestData);
	          	  _this.serviceCalls(requestData,"/order/get-order-info","POST",function (data){
	    			    		 if(typeof data === "object")
	    							{
	    			    			 if(data !== null){
	    			    				 for(var i in data.stops){
	    				  	    				if(data.stops[i].arrivalDateTime!==null){
	    				  	    					var x=data.stops[i].arrivalDateTime;
	    				  	    					var newDate = x.substring(4,6)+"/"+x.substring(6,8)+"/"+x.substring(0,4)+" "+x.substring(8,10)+":"+x.substring(10,12);
	    				  	    					data.stops[i].arrivalDateTime = newDate;
	    				  	    				
	    				  	    				}
	    				  	    				if(data.stops[i].departureDateTime!==null){
	    				  	    					var x=data.stops[i].departureDateTime;
	    				  	    					var newDate = x.substring(4,6)+"/"+x.substring(6,8)+"/"+x.substring(0,4)+" "+x.substring(8,10)+":"+x.substring(10,12);
	    				  	    					data.stops[i].departureDateTime = newDate;
	    				  	    					}
	    				  	    			}
	    			    				  user.set({data:data});
	    			    				  $('#msg').html('<div class="mbc-feedback mbc-feedback-success ui-corner-all"><h2>Images are Uploaded successfully for all Orders.</h2></div>');
	    			    				  //$('#submitallPhotos').addClass('ui-disabled');
	    			    				  //$('.submitallPhotosDoctype').html(documentTypeName);
	    			  	               }
	    			    			 }
	    			        	});	   
		   }
   	          }
   	        },
	        submitphotosResume:function(oid,stopId,userId,ordernumber){
			
	    		      mainIndecResume=0;mainindeclengthResume=0;subIndexResume=0;
	    		     _this.loadFromDB(ordernumber,userId,stopId,oid,callback);
		             function callback(results) {
		            	 mainindeclengthResume = results.rows.length;
		            	 dObject = results.rows;

		            	 if(results.rows.length>0){
	
				  _this.buildmainfunctionResume();
	
		            	 }else{
		                 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>There are no images to upload.</h2></div>');
				 _this.prePopulate();
		            	 }

		        }
		},
		buildmainfunctionResume:function(){
       	             
		if(mainIndecResume<mainindeclengthResume){
                     var imagestr=dObject.item(mainIndecResume).data;
       	             var type = dObject.item(mainIndecResume).id;
       	             _this.buildsubfunctionResume(type,imagestr);
       	        }
                else if(mainIndecResume >= mainindeclengthResume){
       	        _this.documentUploadSuccessResume();
       	        }

                },
	        buildsubfunctionResume:function(type,imagestr){
	            	$("#status").html("");
	            var documentTypeId=user.get("docTypeId");
	 	      //  alert(documentTypeId);
                var doctype=type;
	            var imageURI =imagestr;
		        var num=subIndexResume;
		        var x= ++num;
			var msg = null;
			msg = 'Uploading '+x+" of total "+ mainindeclengthResume +" images";

				     $.mobile.loading( 'show', {text: msg ,textVisible: true,theme: 'a',	html: ""});
				     var options = new FileUploadOptions();
			             options.fileKey="file";
			             options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
			             options.mimeType="image/jpg";
			             var ft = new FileTransfer();
				     var upload_url=this.commonUrl()+"/file/upload-document?orderId="+oid+"&docTypeId="+documentTypeId+"&stopId="+stopId;
			                  	ft.upload(imageURI, upload_url, win, fail,options,true);
			                  	ft.onprogress = function(progressEvent) {
			                 		if (progressEvent.lengthComputable) {
			                 			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
			                 			$("#status").html(perc + "% Uploaded.");
			                 		} else {
			                 				$("#status").html("");

			                 		}
			                 	};
	                  	  function win(r) {
					$.mobile.hidePageLoadingMsg ();
	                  	   	_this.deleteImageTableSingle(doctype,imagestr,ordernumber,userId,stopId,oid);
	                                _this.loadFromDBCount(doctype,ordernumber,userId,stopId,oid,callback);
	                                function callback(results) {
		                        $("#"+doctype).html(results.rows.length);
	                                 }
					 _this.forIterationResume();

	                  	 }
	                  	 function fail(error) {
	                  		$.mobile.hidePageLoadingMsg ();
	                  		alert("Upload failed: Code = "+error.code);
	                  	 }

		},
		forIterationResume :function(){
		       subIndexResume++;
		       mainIndecResume++;
		       _this.buildmainfunctionResume();
		 },
		documentUploadSuccessResume:function(){
			
			$("#status").html("");
			    var documentTypeId=user.get("docTypeId");
		        var requestData = { "orderId":oid ,"stopId":stopId,"docTypeId":documentTypeId};
		        _this.serviceCalls(requestData,"/file/conclude-document-upload?","GET",function (data){
		        	 _this.resumeSubmitStart();
			 });
			$('#msg').html('<div class="mbc-feedback mbc-feedback-success ui-corner-all"><h2>All images are Uploaded successfully for current Stop.</h2></div>');
               //_this.resumeSubmitStart();
		}
	       
	};
    return new aemCommon();
    }); 


