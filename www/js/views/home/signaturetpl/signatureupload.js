define(['text!templates/common/commonTemplate.html!strip','text!templates/home/signaturetpl/signatureuploadViewTemplate.html!strip','model/user/userModel','common'],
       function (commonTemplate,signatureuploadViewTemplate,user,aem) {
  var common = $(commonTemplate).siblings('script');
  var html = $(signatureuploadViewTemplate).siblings('script');
  var UrlString=aem.commonUrl();
  var signatureUploadView = Backbone.View.extend({
	    header:_.template(common.siblings("#all-header").text()),
	    content:_.template(html.siblings("#signatureuploadtpl").text()),
	    footer:_.template(common.siblings("#footer").text()),
	     render: function(){
	       this.$el.append(this.header).append(this.content(user)).append(this.footer);
	       $(this.el).find("#headertext").html('Signature');
	       $(window).trigger('resize'); setTimeout(function() { $(window).trigger('resize'); },500);
	       return this;
           
	      },
        events:{
	    	'click a#uploadBtn':'uploadSignature',
	    	'click a.seals':'seals_clickHandler',
	    	'click a.notes':'notes_clickHandler',
	    	'click #addnotes':'addnotesHandler',
	    	'click #closeseal':'closenotesHandler'
	      
	     },   
	      seals_clickHandler:function (event) {
	    	  $("#aboutDescription").attr("disabled", "disabled");
	    	  $('#popupSeals').popup('open');
	    	  
	      },
	      notes_clickHandler:function (event) {
	    	   $('#popupNotes').popup('open');
	    	  
	      },
	      closenotesHandler:function (event) {
	    	   $('#popupSeals').popup('close');
	      },
	      addnotesHandler:function(event){
	    	  var commentsSig=$("#popnote").val();
	    	  $("#popupNotes").popup("close");
	    	  $(".notedata").html(commentsSig);
	      },
	     uploadSignature :function (event) { 
	    	 if($('#name').val()===''){
	    		 $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Please enter Name.</h2></div>');
	    		}
	    		else{
	    	  	$.mobile.loading( 'show', {text: "Uploading please wait" ,textVisible: true,theme: 'a',	html: ""});
	    		 var totaldata= user.get("data");
		     	 var subdata= user.get("subdata");
	    	  	 var oid=user.get("data").orderId;
	    	     var name=$('#name').val();
	    	     var sigPieces =user.get("data").stops[subdata].pieces;
				 var sigWeight =user.get("data").stops[subdata].weight;
				 var sigTseals  =user.get("data").eqmtDetails[0].sealNumbers;
	    	     var sigComments= $("#popnote").val();
	    	     var $sig = $('.mbc-signature-field');
	    	     var data = $sig.jSignature('getData', 'svg');
	    	     var src = 'data:' + data[0] + ',' + data[1];
		     	 var fd = new FormData();
		     	 fd.append("file",data[1]);
  			     var stopId=totaldata.stops[subdata].stopId;
  			  //   alert(UrlString+"/file/upload-signature?orderId="+oid+"&name="+name+'&stopId='+stopId+'&weight='+sigWeight+'&pieces='+sigPieces+'&seals='+sigTseals+'&comments='+sigComments);
		 	    $.ajax({
			 		type : "POST",
			 		url:  UrlString+"/file/upload-signature?orderId="+oid+"&name="+name+'&stopId='+stopId+'&weight='+sigWeight+'&pieces='+sigPieces+'&seals='+sigTseals+'&comments='+sigComments,
			 		processData:false,
			 		contentType:false,
			 	    cache:false,
			 	    data: fd,
			 				success : function(response) {
			 					$.mobile.hidePageLoadingMsg ();
			 					var orderNumber=user.get("order");
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
					    			    				  $('#msg').html('<div class="mbc-feedback mbc-feedback-success ui-corner-all"><h2>Upload successful</h2></div>');
					    				 				  $("#uploadBtn").addClass("ui-disabled");
					    			  	               }
					    			    			 }
					    			        	});
			 				},
			 				error : function(response) {
			 					$.mobile.hidePageLoadingMsg ();
			 					$('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>Upload Failed</h2></div>');
			 				}
			 			});
		 			
		      }
		   
		 }
	});
  
  return signatureUploadView;
});


