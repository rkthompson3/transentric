define(['text!templates/common/commonTemplate.html!strip','text!templates/events/damageInfo/openscannerscreenViewTemplate.html!strip','model/user/userModel','common'],
       function (commonTemplate,openscannerscreen,user,aem) {
    	   var common = $(commonTemplate).siblings('script');
    	   var html = $(openscannerscreen).siblings('script');
    	   var UrlString=aem.commonUrl();
    	
       var openscannerscreenPageView = Backbone.View.extend({
       // header:_.template(common.siblings("#all-header").text()),
	    content:_.template(html.siblings("#openscanner").text()),
	    footer:_.template(common.siblings("#footer").text()),
        render: function(){
	    	 this.$el.append(this.content).append(this.footer);  
	         $(this.el).find("#headertext").html('Screen');
	    	 return this;
	      },
	      events:{
	    	  
	    	  'click #openScanner':'openBarcodeScanner',
	    	  'click #nextBtn':'moveToInspection',
	    	  'change #availablevin':'displayInField',
	    	  'click #cancelBtn':'clearfields',
	    	  'click #help':'displayHelpInfo'
		 },
		 moveToInspection:function(){
			  if($('#currentvin').val() == ''){
	    		 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please provide VIN number.</h2></div>');
	    		}
			 else{
				  user.set("sigSrc","");
				  user.set("driversSignature","");
            	  user.set("driverreason","");
            	  user.set("driverOtherInfo","");				   
	              user.set("allPresentVinNumbers",undefined);
				  var vinNumber= $('#currentvin').val();
				  var orderid  =  user.get('data').orderId;
				  var data= user.get("data");
				  var allPresentVinNumbers=[];
				  var allExistingVinNumbers=[],vinNum=[];				  
				  _.each(user.get("allreporteddamages"),function(val,index){
						vinNum.push(user.get("allreporteddamages")[index].vinNumber);
					 });
		    			    if(data.references !== null || data.references.length>0){
		    			    for(var i=0;i<data.references.length;i++){
		    				   var vinNumbers=data.references[i].referenceValue;
		    				   allPresentVinNumbers.push(vinNumbers);
		    				   if(user.get('data').references[i].referenceCode == "VT"){
		    				   if (jQuery.inArray(user.get('data').references[i].referenceValue, user.get('data').stops[user.get("subdata")].vins) ==-1 && jQuery.inArray(user.get('data').references[i].referenceValue,vinNum)==-1){
		    					   allExistingVinNumbers.push(data.references[i].referenceValue);
		    					 }
		    				  }
		    				   
		    			   }
		    		  }
		    		  user.set("allPresentVinNumbers",allExistingVinNumbers);	    
	    			    
	    		  if(jQuery.inArray(vinNumber,allPresentVinNumbers )!=-1){
	    			 
	    			  /* user.set({"vehInfoId":undefined});
	    			   user.set({"vehInfoId":"28"});
	    			   user.set({CurrentDamagePageCount:1});
	    			   user.set({nextDamagePageName:"Left Front"});
	    			   router.navigate("damageInfo",{trigger:'true',replace:true});*/
	    			   user.set({"vehInfoId":undefined});
	    			   var data= user.get("data");
	    			   var subdata= user.get("subdata");
	    			   var stopId=data.stops[subdata].stopId;
	    			   aem.serviceCalls("","/damage/add-vin?orderId="+orderid+"&vin="+vinNumber+"&stopId="+stopId,"POST",function (data){
				    		 if(!isNaN(parseInt(data)))
								{
				    			   user.set({"vehInfoId":data});
				    			   user.get('vin').push(data);
				    			 //  user.get('allreporteddamages').push(data);
				    			   user.set({CurrentDamagePageCount:1});
				    			   user.set({nextDamagePageName:"Left Front"});
				    			   router.navigate("damageInfo",{trigger:'true',replace:true}); 
								}
				    		 else{
								   $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>'+data+'</h2></div>');
								}
				        	});
	    			  
	    		  }else{
	    			  $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Invalid VIN number.</h2></div>');  
	    		  }	    
			        	
	    	}
			 
		 },
		 openBarcodeScanner:function(){	
			  var localSuccess = function(data){
				   //  navigator.notification.beep();
				     navigator.notification.vibrate();
                     $('#currentvin').val(data);
              }
              var localFail = function(data){
                     alert("Scanning failed: " +data);
              }
             cordova.exec(localSuccess,localFail,"VINScanPlugin","scanVIN",[]);
        },
        displayInField:function(){
        	  var currentVal=$('#availablevin').val();
        	  $('#currentvin').val(currentVal);
        },
        clearfields:function(){
        	$('#availablevin').val("").selectmenu("refresh", true);
        	$('#currentvin').val("");
        },
        displayHelpInfo:function(){
        	 $('#scannerhelptext').popup('open');
        }
		 
       });
      return openscannerscreenPageView;
});

       