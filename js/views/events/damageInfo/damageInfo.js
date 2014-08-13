define(['text!templates/common/commonTemplate.html!strip','text!templates/events/damageInfo/damageInfo.html!strip','model/user/userModel','common'],
       function (commonTemplate,damageInfo,user,aem) {
    	   var common = $(commonTemplate).siblings('script');
    	   var html = $(damageInfo).siblings('script');
    	   var pictureSource=navigator.camera.PictureSourceType;
    	   var destinationType=navigator.camera.DestinationType;
    	   var UrlString=aem.commonUrl();
    	   var imageId=null,requestJSON,requestImgJSON,VIN=null;
    	   var standDamageLoc=[];
    	   var mainIndec=0, mainindeclength=0,subIndex=0,subindexlength=0;
    	   var mainIndecResume=0,mainindeclengthResume=0,subIndexResume=0,dObject=null;
           var damageInfoPageView = Backbone.View.extend({
      //  header:_.template(common.siblings("#all-header").text()),
	    content:_.template(html.siblings("#damageInfo").text()),
	    footer:_.template(common.siblings("#footer").text()),
	    initialize: function() {
       	_this = this;
       	VIN=user.get('vehInfoId');
       	
       },
       render: function(){
	    	 this.$el.append(this.content).append(this.footer);  
	       	 $(this.el).find("#headertext").html('Inspection');
	       	 if(user.get("nextDamagePageName")=="Other"){
   	    	 $(this.el).find("#CurrentdamagePage").html('Other');
   	         }
		    _this.homePageDisplay();
	       	_this.checkDamageDelayRecord(); 
	    	 return this;
	     },
	      events:{
		    	 'click .imageClick':'takePicture_clickHandler',
		    	 'click a#next':'next_clickHandler',
		    	 'click a#send':'send_clickHandler',
		    	 'click a#cancel':'cancelinspection_clickHandler',
		    	 'click #help':'displayHelpInfo'
		         },
		 homePageDisplay:function(){
	           //loading damage type 
		    	   aem.serviceCalls("","/damage/get-damage-types","GET",function (data){
		    		   if(typeof data =='object'){
		    		   $.each(data,function(index,val){
		      				$('#type').append('<option value="'+data[index].id+'">'+data[index].name+'</option>');
		  	     		});
		    		   }else{
		    			   $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Failed to load Damage Types.</h2></div>');
		    			   }
		    		   
		    	   });
		       //loading damage severity
		    	   aem.serviceCalls("","/damage/get-damage-severity-codes","GET",function (data){
		    		   if(typeof data =='object'){
		    		   $.each(data,function(index,val){
		      				$('#severity').append('<option value="'+data[index].id+'">'+data[index].name+'</option>');
		  	     		});
		    		   }else{
		    			   $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Failed to load Damage Severities.</h2></div>');
		    			   }
		    		   
		    	   });
		      
		         },
		  checkDamageDelayRecord:function(){
		     _this.clearDamageDetails();
		     var dmglocId;   	 
        	 if(standDamageLoc.length==0){	 
			   aem.serviceCalls("","/damage/get-standard-damage-locations","GET",function (data){
				   if(typeof data == 'object'){
				   standDamageLoc=data;
				   _this.locationfill(_this.staticDamageLocfind(user.get('nextDamagePageName')));
				   }else{
					   $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Failed to load Standard Damage Area.</h2></div>');
				    }
				});
			  }else{				 
				  _this.locationfill(_this.staticDamageLocfind(user.get('nextDamagePageName')));     	 
		     }
			
              /*var orderId=user.get("data").orderId;
			  var filepath;
			  aem.getRecentDamageDelayRecord(orderId,VIN,recentInsertedRecord);
	        	 function recentInsertedRecord(results) {
	        		if(results.rows.length!=0){
	        			filepath=$.parseJSON(results.rows.item(results.rows.length-1).requestJSON);
	        		    var img = document.getElementById('camera_image');
	     	     	    img.src=filepath.imagePath;
	     	     	  $("#CurrentdamagePage").html(filepath.damageInfo);
	     	     	   user.set("nextDamagePageName",filepath.damageInfo);
	        		}
	        	 }  	*/
		    },
		    staticDamageLocfind:function(stddmgloc){
		    	var theIndex=-1
		    	for (var i = 0; i < standDamageLoc.length; i++) {
		    		if (standDamageLoc[i].name == stddmgloc) {
		    			theIndex = i;
		    			break;
		    		}
		    	}
		    	return standDamageLoc[theIndex].id;
		    },
		    
		    
		  takePicture_clickHandler:function (event) {
        	  imageId="camera_image";
        	  var imgSrc=$("#camera_image").attr("src");
        	  if(imgSrc === ""){
        		  navigator.camera.getPicture(_this.onPhotoURISuccess, _this.onFail, { quality: 50,
    	              destinationType: destinationType.FILE_URI,saveToPhotoAlbum:true,correctOrientation: true});
        	  }else{
        		
        		 if(user.get('requestImgJSON')==undefined){    
	        		  navigator.notification.confirm(
		                         'Are you sure you want to delete image',  // message
		                         onConfirm,        // callback to invoke with index of button pressed
		                         'Delete',         // title
		                         'Ok,Cancel'       // buttonLabels
		                     );
			            function onConfirm(button){	
			               if(button==1){
						      //Delete image functionality
			                $parent =  $('#camera_image').parent();
				           	$parent.html($('#camera_image').attr("src","").detach());
			               }
			           }
			        }else{
			        	 aem.checkExistDamageDelayRecord(user.get("data").orderId,VIN,user.get('requestImgJSON'),chkexistingRecord);
				        	 function chkexistingRecord(results) {
				         		if(results.rows.length==0){
				         			navigator.notification.confirm(
			                         'Are you sure you want to delete image',  // message
			                         onConfirm,        // callback to invoke with index of button pressed
			                         'Delete',         // title
			                         'Ok,Cancel'       // buttonLabels
			                     );
				            function onConfirm(button){	
				               if(button==1){
							      //Delete image functionality
				                $parent =  $('#camera_image').parent();
					           	$parent.html($('#camera_image').attr("src","").detach());
				               }
				           }
	         			}
	         	    }
	        	}
        	  }
         },
         onFail :function(message) {
       	  alert(message);
         },
         onPhotoURISuccess :function(imageURI) {
        	 $('.container').find('img').each(function() {
        	        var imgClass = (this.width / this.height > 1) ? 'wide' : 'tall';
        	        $(this).addClass(imgClass);
        	  })
             var largeImage = document.getElementById(imageId);
             largeImage.style.display = 'block';
             largeImage.src = imageURI;
             $("#CurrentdamagePage").html(user.get("nextDamagePageName"));
             $("#CurrentdamagePage").css("margin-top","0px !important");
            
         },
         clearDamageDetails:function(){
        	 	 $('#location').val("").selectmenu("refresh", true);
				 $('#type').val("").selectmenu("refresh", true);
	        	 $('#severity').val("").selectmenu("refresh", true);
	          	 $('#inspectiondetails').val('');
       	 },
         send_clickHandler :function(event) {
        	 var userId=user.get("User");
        	 requestJSON=new Object();
        	 requestImgJSON=new Object();
	         var imageArray= [];
       	     var imgObj={};
	         var img = document.getElementById('camera_image');
	     	 var imageURI = img.src;
	     	 var x=imageURI;//imageURI.substr(imageURI.lastIndexOf('/')+1); 
	     	 var orderId=user.get("data").orderId;
	     	 var URL='';
	     	 var msg = 'Uploading Picture';
	     	 var alldetailspresent =false;
	     	 mainIndec=0;mainindeclength=0;subIndex=0;
	     	 
	     	 requestImgJSON.imagePath=imageURI;
	     	 requestImgJSON.damageInfo=user.get("nextDamagePageName");
	     	 requestImgJSON.vin=VIN;
	     	 
	     	 user.set('requestImgJSON',requestImgJSON);
	     	
	     	 if($('#location').val()!='' && $('#type').val()!='' && $('#severity').val()!=''){
	     		 alldetailspresent =true;
	     		 requestJSON.vehicleInfoId=VIN;
	     		 requestJSON.damageDetail=($('#inspectiondetails').val()=='')? "  " : $('#inspectiondetails').val();
	     	 
		     	 requestJSON.damageAreaCodeId=$('#location').val();
		     	 requestJSON.damageSeverityCodeId=$('#severity').val();
		     	 requestJSON.damageTypeCodeId=$('#type').val();
		     	 requestJSON.damageLocationId=_this.staticDamageLocfind(user.get("nextDamagePageName"));
		     	 
		     	 requestJSON.damageAreaCodeName=user.get("nextDamagePageName");
		     	 requestJSON.damageSeverityCodeName=$("#severity option:selected").text();
		     	 requestJSON.damageTypeCodeName=$("#type option:selected").text();
		     	 requestJSON.damageLocationName=$('#location option:selected').text();
		     }
        	
	     	 if(imageURI.substr(imageURI.lastIndexOf('/')+1)=='index.html' && JSON.stringify(requestJSON)=='{}'){
        		 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please provide Damage Picture.</h2></div>');
        	 }
        	 else if(imageURI.substr(imageURI.lastIndexOf('/')+1)=='index.html' && JSON.stringify(requestJSON)!='{}'){
        		 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please provide Damage Picture.</h2></div>');
        	 }
        	 else if(imageURI.substr(imageURI.lastIndexOf('/')+1)!='index.html' && ($('#location').val()!='' || $('#type').val()!='' || $('#severity').val()!='') && alldetailspresent == false){
        		 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please provide all required fields.</h2></div>');
        	 }
        	 else if(imageURI.substr(imageURI.lastIndexOf('/')+1)!='index.html' && JSON.stringify(requestJSON)=='{}' && $('#inspectiondetails').val().length!="0"){
        		 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please provide Damage Details.</h2></div>');
        	 }
	         else{
	        	 if(navigator.network.connection.type != "none"){ 
	        	 aem.getDamageImageTable(orderId,requestImgJSON,VIN,imageDisplay);
	        	 function imageDisplay(results) {
	        		if(results.rows.length==0){
	        			aem.insertDamageImageTable(orderId,URL,requestImgJSON,VIN,'N');
	        		}
	        	 aem.getDamageImageTable(orderId,requestJSON,VIN,recordDisplay);
		        	 function recordDisplay(results) {
		        		if(results.rows.length==0 && JSON.stringify(requestJSON)!='{}'){
		        			aem.insertDamageImageTable(orderId,URL,requestJSON,VIN,'N');
		        		}else if(results.rows.length > 0 ){
		        			$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Damage Details already existed.</h2></div>');
		        		}
	        	
		         aem.getAllDamageReocords(orderId,recordDisplay);
	        	 function recordDisplay(results) {
	        		 mainindeclength = results.rows.length;
	        		 dObject = results.rows;
	        		if(results.rows.length > 0){
	        				if(navigator.network.connection.type == "none"){
	        					$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>No Internet Connection.</h2></div>');
	        				//	aem.insertDamageImageTable(orderId,URL,requestJSON,VIN,'N');
	        				}else{
	        					 aem.checkExistDamageDelayRecord(orderId,VIN,requestImgJSON,chkexistingRecord);
	        		        	  function chkexistingRecord(results) {
	        		        	  if(results.rows.length==0){
	        		        		 /*uploading code*/ 
	        		        		if(navigator.network.connection.type == "wifi"){
	        		        		  _this.buildmainfunction();
	        		        		//_this.fileuploadfunc(orderId);	
	        		        		
	        		        		}else{
										  navigator.notification.confirm(
				                            'You are not in Wi-Fi ,Upload anyway or Store.',  // message
				                            onConfirm,        // callback to invoke with index of button pressed
				                            'Inspection',         // title
				                            'Upload,Store'       // buttonLabels
				                         );
					           		    function onConfirm(button){	
					     	               if(button==1){
					     	            	//  aem.insertDamageImageTable(orderId,URL,requestJSON,VIN,'N');
					     	            	 _this.buildmainfunction();
					     	            	// _this.fileuploadfunc(orderId);	
					     	                }else if (button==2){
					     	                	aem.UpdateDamageDelayRecord('L',orderId,VIN,requestImgJSON);
					     	                //	aem.insertDamageImageTable(orderId,URL,requestJSON,VIN,'N');
					     	                	_this.addDamageDetails();
					     	                	$('#msg').html('<div class="mbc-feedback mbc-feedback-success ui-corner-all"><h2>Damage Picture Stored,You can upload it later.</h2></div>');
					     	                	// _this.clearDamageDetails();
					     	                }else{
					     	                	aem.deleteDamageDelayRecord(orderId,VIN,requestJSON);
					     	                }
										  }
					     	           }
									  
	        		        		}
	        		        	  else{
	        		      				if(JSON.stringify(requestJSON)=='{}'){
	        		      					$.mobile.hidePageLoadingMsg ();
	        		      					$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please provide Damage Details.</h2></div>');
	        		      				}else{
	        		      				 _this.addDamageDetails();
	        		      				 }
	        		      				}
	        		        	  }
	        				}
	        			
	        			}else{
	        				 _this.addDamageDetails();
	        			}
	        		 
	        	 }
				}
	        	 }
			
		       }else{
		    	   $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>No Internet Connection.</h2></div>');
		       }
	         } 	 
         },
        buildmainfunction:function(){
        	 if(mainIndec < mainindeclength){
			 var imageURI=$.parseJSON(dObject.item(mainIndec).requestJSON).imagePath;
        	  var docName =$.parseJSON(dObject.item(mainIndec).requestJSON).damageInfo;
        	  VIN=dObject.item(mainIndec).VIN;	
        	 _this.fileuploadfunc(VIN,dObject.item(mainIndec).requestJSON);
        	 }else if(mainIndec >= mainindeclength){
        		 _this.addDamageDetails();
        	 }
         },
        fileuploadfunc:function(VIN,requestImgJSON){ 
    	  var msg;
		  var docName=encodeURI($.parseJSON(requestImgJSON).damageInfo);
		   imageURI=$.parseJSON(requestImgJSON).imagePath;
		//  requestImgJSON=$.parseJSON(results.rows.item(i).requestJSON);
		//  VIN=results.rows.item(i).VIN;	
		  requestImgJSON=$.parseJSON(requestImgJSON);
		
		//  msg='Uploading '+decodeURI(docName)+'  Picture';
		//  $.mobile.loading( 'show', {text: msg ,textVisible: true,theme: 'a',	html: ""});
		   var options = new FileUploadOptions();
		       options.fileKey="file";
		       options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
		       options.mimeType="image/jpg";
		       var ft = new FileTransfer();
			            var upload_url=aem.commonUrl()+"/damage/upload-document?docName="+docName+"&vehInfoId="+VIN;
		            	ft.upload(imageURI, upload_url, win, fail,options,true);
		            	ft.onprogress = function(progressEvent) {
		           		if (progressEvent.lengthComputable) {
		           			var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
		           			msg=perc+'% Uploaded '+decodeURI(docName)+'  Picture';
		           			$.mobile.loading( 'show', {text: msg ,textVisible: true,theme: 'a',	html: ""});
		           			//$("#status").html(perc + "% Uploaded.");
		           		} else {
		           			$('#msg').html("");
		
		           		}
		           	};
		    	  function win(r) {
		    		 $.mobile.hidePageLoadingMsg ();
		    		 if(r.response ==''){
		    			   aem.UpdateDamageDelayRecord('Y',user.get('data').orderId,VIN,requestImgJSON);			    			   
							$('#msg').html('<div class="mbc-feedback mbc-feedback-success ui-corner-all"><h2>'+decodeURI(docName)+' Damage Picture Uploaded Successfully.</h2></div>');
							//  _this.addDamageDetails();
						 _this.forIteration();	
					 }
		    	  }
		    	 function fail(error) {
		    		$.mobile.hidePageLoadingMsg ();
		    		 alert(decodeURI(docName)+" Upload failed: Code = "+error.code);
		    		 
		    	 }
         },
         forIteration :function(){
	    	   subIndex++;
		       mainIndec++;
		      _this.buildmainfunction();
        },
        addDamageDetails:function(){
         var orderId=user.get("data").orderId;
         aem.getAllDamageDetailReocords(orderId,recordsDisplay);
         function recordsDisplay(results){
         for (var i=0;i<results.rows.length;i++){
         requestJSON=$.parseJSON(results.rows.item(i).requestJSON);
         VIN=results.rows.item(i).VIN;
         if(JSON.stringify(requestJSON)!='{}'){
        
         if(navigator.network.connection.type == "none"){
					$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>No Internet Connection.</h2></div>');
				//	aem.insertDamageImageTable(orderId,URL,requestJSON,VIN,'N');
				}	 
         else{
          $.mobile.loading('show', {text: 'Please Wait',textVisible: true,theme: 'a',	html: ""});	 
		  $.ajax({
		        type: "POST",
		        url: UrlString+"/damage/add-damage-detail",
		        data: JSON.stringify(requestJSON),
		        cache:false,
		        contentType: "application/json",
		        success: function (response) {
		        $.mobile.hidePageLoadingMsg ();
		         aem.UpdateDamageDelayRecord('Y',orderId,VIN,requestJSON);
				   $('#msg').html('<div class="mbc-feedback mbc-feedback-success ui-corner-all" ><h2>Damage Details added Successfully.</h2></div>');
				   _this.clearDamageDetails();
		        	},
		        error: function(response) {
			          $.mobile.hidePageLoadingMsg ();
			          var errorMsg=jQuery.parseJSON(response.responseText).message;
			      	  $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Failed to upload Damage Details.</h2></div>');
			       }
		        });
         }
		       }
		  }
		 }
         },
         next_clickHandler:function(){
        	
        	var img = document.getElementById('camera_image');
	     	var imageURI = img.src;
        	var orderId=user.get("data").orderId;
        	requestImgJSON=new Object();
        	requestImgJSON.imagePath=imageURI;
	     	requestImgJSON.damageInfo=user.get("nextDamagePageName");
	     	requestImgJSON.vin=VIN;
	     	
        	aem.checkExistDamageDelayRecord(orderId,VIN,requestImgJSON,chkexistingsRecord);
       	    function chkexistingsRecord(results) {
       	    if(results.rows.length==0 && imageURI.substr(imageURI.lastIndexOf('/')+1) == 'index.html' ){
       	    	$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please provide Damage Picture.</h2></div>');
       	     }
       	    else if(results.rows.length==0 && imageURI.substr(imageURI.lastIndexOf('/')+1) != 'index.html'){
       	    	$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please upload Damage Picture.</h2></div>');
       	    }
       	    else if(results.rows.length!=0 && ($('#location').val()!=''|| $('#type').val()!='' || $('#severity').val()!=''|| $('#inspectiondetails').val().length!="0")){
       	    	navigator.notification.confirm(
                        'Unsaved data,Are you sure you want to proceed?',  // message
                        onConfirm,        // callback to invoke with index of button pressed
                        'Inspection',         // title
                        'Yes,No'       // buttonLabels
                     );
       		 function onConfirm(button){	
 	               if(button==1){
 	            	   _this.forwarNextPage();
 	                }
                }
       	     }
       	    else{
       	    	 _this.forwarNextPage();
       	     }
       	    
       	    } 
         },
         forwarNextPage:function(){
        	    user.set('requestImgJSON',undefined);
			if(user.get("nextDamagePageName")=="Left Front"){
			    // Move to Right Front
			 	   user.set("nextDamagePageName","Right Front");
			    }else if(user.get("nextDamagePageName")=="Right Front"){
			   // Move to Left Rear
			 	   user.set("nextDamagePageName","Left Rear");
			    }else if(user.get("nextDamagePageName")=="Left Rear"){
			   // Move to Right Rear	   
			 	   user.set("nextDamagePageName","Right Rear");
			 	   
			    }else if(user.get("nextDamagePageName")=="Right Rear"){
			   // Move to Other	   
			 	   user.set("nextDamagePageName","Other"); 
			    }else if(user.get("nextDamagePageName")=="Other"){
			   //  Move to Inspect Odometer
			    user.set("nextDamagePageName","Dash"); 
			 	   router.navigate("inspection",{trigger:'true',replace:true});
			    }
			   // Clearing single page data on next.
			 	 $('#msg').html('');
			 	 $parent =  $('#camera_image').parent();
				 $parent.html($('#camera_image').attr("src","").detach());
				 $(this.el).find("#CurrentdamagePage").html(user.get("nextDamagePageName"));				
				 if(user.get('nextDamagePageName')!='Dash'){
					 _this.clearDamageDetails();
				 _this.locationfill(_this.staticDamageLocfind(user.get('nextDamagePageName')));
				//_this.checkRecordExisting();
				 }
          },
         //loading Damage Location 
         locationfill:function(dmgstdlocId){
     	    $('#location').empty().append('<option value="">Select</option>').selectmenu("refresh", true);
          	 var requestloc={"stdDamageLocationId":dmgstdlocId};
      		 aem.serviceCalls(requestloc,"/damage/get-area-codes","GET",function (data){
      			if (typeof data == 'object'){
      			$.each(data,function(index,val){
      				$('#location').append('<option value="'+data[index].id+'">'+data[index].name+'</option>');
  	     		});
      			}else{
      				 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Failed to load Damage Locations.</h2></div>');
      			}
      		 });
     	},
     	cancelinspection_clickHandler:function(){
     		aem.cancelInspection();
     	},
     	displayHelpInfo:function(){
        	 $('#scannerhelptext').popup('open');
        }
            	
       });
      return damageInfoPageView;
});







