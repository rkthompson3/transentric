define(['text!templates/common/commonTemplate.html!strip','text!templates/events/damageInfo/inspection.html!strip','model/user/userModel','common'],
       function (commonTemplate,inspection,user,aem) {
    	   var common = $(commonTemplate).siblings('script');
    	   var html = $(inspection).siblings('script');
    	   var pictureSource=navigator.camera.PictureSourceType;
    	   var destinationType=navigator.camera.DestinationType;
    	   var UrlString=aem.commonUrl(),VIN;
    	   var imageId=null,requestJSON;
       var inspectionPageView = Backbone.View.extend({
       // header:_.template(common.siblings("#all-header").text()),
	    content:_.template(html.siblings("#inspection").text()),
	    footer:_.template(common.siblings("#footer").text()),
	    initialize: function() {
    	nextins=0;
       	_this = this;
       	 VIN =user.get("vehInfoId");
       },
       render: function(){
	    	 this.$el.append(this.content).append(this.footer);  
	    	 $(this.el).find("#headertext").html('Inspection');
	    	return this;
	      },
	      events:{
		    	 'click a#next':'next_clickHandler',
		    	 'click .backtoDamage':'back_clickHandler',
		    	 'click a#send':'savedash_clickhandler',
		    	 'click .imageClick':'takePicture_clickHandler',
		    	 'click a#cancel':'cancelinspection_clickHandler',
		    	 'click #help':'displayHelpInfo'
		         },
		         takePicture_clickHandler:function (event) {
		        	  imageId="camera_ins_image";
		        	  var imgSrc=$("#camera_ins_image").attr("src");
		        	  if(imgSrc === ""){
		        		  navigator.camera.getPicture(_this.onPhotoURISuccess, _this.onFail, { quality: 50,
		    	              destinationType: destinationType.FILE_URI,saveToPhotoAlbum:true});
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
							           $parent =  $('#camera_ins_image').parent();
							          	$parent.html($('#camera_ins_image').attr("src","").detach());
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
							               $parent =  $('#camera_ins_image').parent();
								           	$parent.html($('#camera_ins_image').attr("src","").detach());
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
		                $("#CurrentdamagePage").css("margin-top","0px !important");
		         },
            next_clickHandler:function(){
            	var img = document.getElementById('camera_ins_image');
    	     	var imageURI = img.src;
            	var orderId=user.get("data").orderId;
            	requestImgJSON=new Object();
            	requestImgJSON.imagePath=imageURI;
    	     	requestImgJSON.damageInfo=user.get("nextDamagePageName");
    	     	requestImgJSON.vin=VIN;
    	     	requestJSON=new Object();    
     	     	requestJSON.odometer=$('#odometer').val();
            	// alert(JSON.stringify(requestImgJSON));
     	     	
     	     	aem.checkExistDamageDelayRecord(orderId,VIN,requestImgJSON,chkexistingsRecord);
           	    function chkexistingsRecord(results) {
           	    if(results.rows.length==0 && imageURI.substr(imageURI.lastIndexOf('/')+1) == 'index.html' && $('#odometer').val() == '' ){
           	    	$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please provide Dash Details.</h2></div>');
           	     }
           	    else if(results.rows.length==0 && imageURI.substr(imageURI.lastIndexOf('/')+1) == 'index.html' && $('#odometer').val() != ''){
        	    	$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please provide Dash Picture.</h2></div>');
        	    }
           	    else if(results.rows.length==0 && imageURI.substr(imageURI.lastIndexOf('/')+1) != 'index.html' && $('#odometer').val() == ''){
     	    	$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please provide Odometer reading.</h2></div>');
     	        }
           	    else if(results.rows.length==0 && imageURI.substr(imageURI.lastIndexOf('/')+1) != 'index.html'){
        	    	$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please upload Dash Details.</h2></div>');
        	    }
           	    else{
     	        	 _this.next_reportDamage_navigate();
     	        }
           	   }
             },
   	    	next_reportDamage_navigate:function(){
   	    	 //calling service for getting reported damages.	
   	    	  	var reportDamageArr=[];
                var vehInfoId=user.get("vehInfoId");
          	   aem.serviceCalls("","/damage/get-vehicle-info?vehInfoId="+vehInfoId,"GET",function (data){
 			    		 if(typeof data === "object")
 							{
 								//reportDamageArr.push(data[0]);
 			    			    if(nextins==0){
 							    data[0].vehInfoId=vehInfoId;					    
 								user.get('allreporteddamages').push(data[0]);
 								nextins++;
 			    			    }
 							    
 			    			 //  alert(JSON.stringify(user.get('allreporteddamages')));
 			    			  if(user.get('allPresentVinNumbers').length > 1){
 			    			   navigator.notification.confirm(
		                            'Do you want to do Inspection for another VIN?',  // message
		                            onConfirm,        // callback to invoke with index of button pressed
		                            'Inspection',         // title
		                            'Yes,No'       // buttonLabels
		                         );
			           		    function onConfirm(button){	
			     	               if(button==1){
			     	            	  router.navigate("openscannerscreen",{trigger:true,replace:true});
			     	                }else if(button==2){
			     	                	router.navigate("damageReview",{trigger:true,replace:true});
			     	                	}
			     	                
			                     }
			     	           }else{
			     	        	  router.navigate("damageReview",{trigger:true,replace:true});
			     	        	   }
			     	           
 							}
 			    		 else{
 			    			   // router.navigate("damageReview",{trigger:true,replace:true});
 							   $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>'+data+'</h2></div>');
 							}
 			        	});
   	    	},  	
            back_clickHandler:function(){
            	user.set({nextDamagePageName:"Other"}); 
                router.navigate("damageInfo",{trigger:true,replace:true});
                $(this.el).find("#CurrentdamagePage").html('Other');
                },
            savedash_clickhandler:function(){
            	 var orderId=user.get("data").orderId;
                 var img = document.getElementById('camera_ins_image');
     	     	 var imageURI = img.src;
     	     	 var requestImgJSON=new Object();
     	     	 requestJSON=new Object();    
     	     	 requestJSON.odometer=$('#odometer').val();
     	     	 requestImgJSON.imagePath=imageURI;
    	     	 requestImgJSON.damageInfo='Dash';
    	     	 requestImgJSON.vin=VIN;
    	     	 var URL='';
    	     	 var msg;
    	     	 mainIndec=0;mainindeclength=0;subIndex=0;

    	     	 if($('#odometer').val()!=''){
		     	 aem.getDamageImageTable(orderId,requestJSON,VIN,recordDisplay);
	        	 function recordDisplay(results) {
	        		if(results.rows.length==0){
	        			aem.insertDamageImageTable(orderId,URL,requestJSON,VIN,'N');
	        		}
	        	 }
	             }
    	     	 user.set('requestImgJSON',requestImgJSON);
    	     	 
     	     	 if($('#odometer').val() == '' && imageURI.substr(imageURI.lastIndexOf('/')+1)=='index.html' ){
		    		  $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please provide Dash Details.</h2></div>');
		    	 } 
     	     	 else if(imageURI.substr(imageURI.lastIndexOf('/')+1)!='index.html' && $('#odometer').val() == ''){
     	     		 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please provide Odometer reading.</h2></div>');
     	     	 }
     	     	 else if(imageURI.substr(imageURI.lastIndexOf('/')+1)=='index.html' && $('#odometer').val() != ''){
     	     		$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please provide Dash Picture.</h2></div>');
     	     	 }
     	     	 else if(imageURI.substr(imageURI.lastIndexOf('/')+1)!='index.html' && $('#odometer').val() != ''){
     	     		 aem.getDamageImageTable(orderId,requestImgJSON,VIN,imageDisplay);
    	        	 function imageDisplay(results) {
    	        		if(results.rows.length==0){
    	        			aem.insertDamageImageTable(orderId,URL,requestImgJSON,VIN,'N');
    	        		}
     	     		aem.getAllDamageReocords(orderId,chkexistingRecord);
  	        	  function chkexistingRecord(results) {
  	        		mainindeclength = results.rows.length;
  	        		 dObject = results.rows;
  	        	  if(results.rows.length > 0){
  	        		if(navigator.network.connection.type == "none"){
    					$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>No Internet Connection.</h2></div>');
    					}else if(navigator.network.connection.type == "wifi"){		
    					 _this.buildmainfunction();
		        		}else{
		        			 navigator.notification.confirm(
		        			    'You are not in Wi-Fi ,Upload anyway or Store.',  // message
	                            onConfirm,        // callback to invoke with index of button pressed
	                            'Inspection',         // title
	                            'Upload,Store'       // buttonLabels
	                         );
		           		    function onConfirm(button){	
		     	               if(button==1){
		     	            	  _this.buildmainfunction();
		     	                }else{
		     	                	aem.UpdateDamageDelayRecord('L',orderId,VIN,requestImgJSON);
		     	                	_this.odometerReading();  
		     	                	$('#msg').html('<div class="mbc-feedback mbc-feedback-success ui-corner-all"><h2>Dash Picture Stored,You can upload it later.</h2></div>');
		     	                	}
		     	            }
		        		}
  	        	  	}else{
					    	  if($('#odometer').val()!=''){
									 aem.getDamageImageTable(orderId,requestJSON,VIN,resDisplay);
							         function resDisplay(results) {
							          if(results.rows.length > 0){
							        	 if(results.rows.item(results.rows.length-1).Status != 'Y'){
										_this.odometerReading();  
							        	 }else{
							        	  $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all"><h2>Dash Details Already Uploaded.</h2></div>');
							        	 }
							         }
							          }
								}else{
									$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all"><h2>Dash Picture Already Uploaded.</h2></div>');
									}
								
					    	}
		            }
  	        	   }
			       }
     	     	else{
			    	  if($('#odometer').val()!=''){
			    	   setTimeout(function() { 
			    		   aem.getDamageImageTable(orderId,requestJSON,VIN,recDisplay);
					         function recDisplay(results){
					        	 if(results.rows.length > 0){
					        		 _this.odometerReading();  
					          }else{
					        	  $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all"><h2>Dash Details Already Uploaded.</h2></div>');
					        	  }
					         }
			    		},500);
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
               		if($('#odometer').val()!=''){
               		 _this.odometerReading();
               		}
               	 }
                },
                fileuploadfunc:function(VIN,requestImgJSON){ 
          	  var msg;
    		  var docName=encodeURI($.parseJSON(requestImgJSON).damageInfo);
    		   imageURI=$.parseJSON(requestImgJSON).imagePath;
    		//  requestImgJSON=$.parseJSON(results.rows.item(i).requestJSON);
    		//  VIN=results.rows.item(i).VIN;	
    		  requestImgJSON=$.parseJSON(requestImgJSON);
    		
    		  msg='Uploading '+decodeURI(docName)+'  Picture';
    		  $.mobile.loading( 'show', {text: msg ,textVisible: true,theme: 'a',	html: ""});
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
    							$('#msg').html('<div class="mbc-feedback mbc-feedback-success ui-corner-all"><h2>'+decodeURI(docName)+' Picture Uploaded Successfully.</h2></div>');
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
                
            odometerReading:function(){
				var mileage=$('#odometer').val();
				var vehicleInfoId=user.get("vehInfoId");
				requestJSON=new Object();    
    	     	requestJSON.odometer=$('#odometer').val();
				var dashOtherInfo=$('#dashOtherInfo').val();
				if(navigator.network.connection.type == "none"){
						 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>No Internet Connection.</h2></div>');
					}else{
				   $.mobile.loading( 'show', {text: 'Please Wait',textVisible: true,theme: 'a',	html: ""});
				   $.ajax({
						type : "POST",
						url:  UrlString+"/damage/add-mileage?mileage="+mileage+"&otherInfo="+dashOtherInfo+"&vehicleInfoId="+vehicleInfoId,
					    cache:false,
				    contentType: "application/json",
						success : function(response) {
									$.mobile.hidePageLoadingMsg ();
									aem.UpdateDamageDelayRecord('Y',user.get('data').orderId,VIN,requestJSON);
									$('#odometer').attr("disabled",true);
									$('#dashOtherInfo').attr("disabled",true);
								    $('#msg').html('<div class="mbc-feedback mbc-feedback-success ui-corner-all"><h2>Dash Details Uploaded Successfully.</h2></div>');
								},
								error : function(response) {
									$.mobile.hidePageLoadingMsg ();
								    $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Failed to Upload Dash Details.</h2></div>');
								}
					   });
					}
            },
            cancelinspection_clickHandler:function(){
         		aem.cancelInspection();
         	},
         	displayHelpInfo:function(){
            	 $('#scannerhelptext').popup('open');
            }

    	   
       });
      return inspectionPageView;
});

       