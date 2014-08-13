define(['text!templates/common/commonTemplate.html!strip','text!templates/events/damageInfo/damageReviewSign.html!strip','model/user/userModel','common'],
       function (commonTemplate,damageReviewSign,user,aem) {
    	   var common = $(commonTemplate).siblings('script');
    	   var html = $(damageReviewSign).siblings('script');
    	   var UrlString=aem.commonUrl();
    	   var mainIndec=0, mainindeclength=0,subIndex=0,subindexlength=0;
    	   var mainIndecResume=0,mainindeclengthResume=0,subIndexResume=0,dObject=null;
    	
       var damageReviewSignPageView = Backbone.View.extend({
      //  header:_.template(common.siblings("#all-header").text()),
	    content:_.template(html.siblings("#damageReviewSign").text()),
	    footer:_.template(common.siblings("#footer").text()),
	    initialize: function() {
       	_this = this;
       },
       render: function(){
	    	 this.$el.append(this.content).append(this.footer);  
	    	$(this.el).find("#headertext").html('Review');
	    	 $(window).trigger('resize'); setTimeout(function() { $(window).trigger('resize'); },500);
	    	return this;
	      },
	      events:{
		    	 'click a#prev':'prev_clickHandler',
		    	 'click a#back':'back_clickHandler',
		    	 'click a#send':'submitReview_clickHandler',
		    	 'click a#cancel':'cancelinspection_clickHandler',
		    	 'click #help':'displayHelpInfo'
		         },
		 
		         prev_clickHandler:function(){
            	     router.navigate("damageReview",{trigger:true,replace:true});
            	 },
            	 back_clickHandler:function(){
                     router.navigate("damageReview",{trigger:true,replace:true});
                 },
                 submitReview_clickHandler:function(){   
                	 mainIndec=0;mainindeclength=0;subIndex=0;
                    if(navigator.network.connection.type == "none"){
             			 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>No Internet Connection.</h2></div>');
             		}else{//here is the code
             		aem.getAllDamageReocords(user.get('data').orderId,allrecords);
             		function allrecords(results){
         			 mainindeclength = results.rows.length;
	            	 dObject = results.rows;
             	    if(results.rows.length>0){
             		 if(navigator.network.connection.type != "wifi"){
				             	navigator.notification.confirm(
				                         'You are not in Wi-Fi ,Upload anyway?',  // message
				                          onConfirm,                             // callback to invoke with index of button pressed
				                         'You have images to Upload',                         // title
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
				        	 _this.damagesignup();
				        	 }
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
		        		 _this.damagesignup();
		        	 }
		         },
                 fileuploadfunc:function(VIN,requestImgJSON){ 
             	  var msg;
             	  var successflg=0;
             	  var reslen;
     			  var docName=encodeURI($.parseJSON(requestImgJSON).damageInfo);
     			   imageURI=$.parseJSON(requestImgJSON).imagePath;
     			//  requestImgJSON=$.parseJSON(results.rows.item(i).requestJSON);
     			//  VIN=results.rows.item(i).VIN;	
     			   requestImgJSON=$.parseJSON(requestImgJSON);
     			  
     			 // msg='Uploading '+decodeURI(docName)+'  Picture';
     			 // $.mobile.loading( 'show', {text: msg ,textVisible: true,theme: 'a',	html: ""});
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
              cancelinspection_clickHandler:function(){
              	aem.cancelInspection();
              },
              damagesignup:function(){
            	  var driverSignature=user.get("driversSignature");
             	 var driversReason = user.get("driverreason");
             	 var driversOtherInfo =user.get("driverOtherInfo");
             	 var customerReason = $('#customerreason').val();
             	 var customerOtherInfo=$('#customerotherinfo').val();
             	 var vinIds=[];
             	 var $sig = $('.mbc-signature-field');
               	 var data = $sig.jSignature('getData', 'svg'); 
               	 var src = 'data:' + data[0] + ',' + data[1];
                  var customerSignature=data[1];     
                  var vehInfoId=user.get("vehInfoId");
                  var requestData = {"truckerReview": {"signature":driverSignature, "reason":driversReason,"otherInformation":driversOtherInfo},"customerReview":{"signature":customerSignature,"reason":customerReason,"otherInformation":customerOtherInfo}};
                
                 for(var i in user.get('allreporteddamages')){
                		vinIds.push(user.get('allreporteddamages')[i].vehInfoId);
                 }
				$.mobile.loading( 'show', {text: 'Please Wait',textVisible: true,theme: 'a',	html: ""});
				for(var j=0;j<vinIds.length;j++){
				$.ajax({
						type : "POST",
						url:  UrlString+"/damage/upload-review-document?vehInfoId="+vinIds[j],
					    cache:false,
				 contentType: "application/json",
					    data:JSON.stringify(requestData),
						success : function(response) {
							
						var orderNumber=user.get('data').orderNumber;
				   var requestData={"searchKey":orderNumber,"events":"true","documents":"true","vinsInspected":"true"};
				  	 requestData=JSON.stringify(requestData);
				  	 aem.serviceCalls(requestData,"/order/get-order-info","POST",function (data){
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
								  $.mobile.hidePageLoadingMsg ();
								      aem.deleteDamageImageTable();
								      router.navigate("openscannerscreen",{trigger:true,replace:true});
								      $('#msg').html('<div class="mbc-feedback mbc-feedback-success ui-corner-all"><h2>Review Details uploaded Successfully.</h2></div>');
							  }
							 user.set("allreporteddamages",[]);
							}
							});
				  	 
								},
								error : function(response) {
									$.mobile.hidePageLoadingMsg ();
								    $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Failed to upload Review Details.</h2></div>');
								}
					   });
					 }
              },
              displayHelpInfo:function(){
             	 $('#scannerhelptext').popup('open');
             }
       });
      return damageReviewSignPageView;
});

       