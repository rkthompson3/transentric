define(['text!templates/common/commonTemplate.html!strip','text!templates/order/orderViewTemplate.html!strip','model/user/userModel',"common"],
       function (commonTemplate,orderViewTemplate,user,aem) {
  var common = $(commonTemplate).siblings('script');
  var html = $(orderViewTemplate).siblings('script');
  var UrlString=aem.commonUrl();
  var orderPageView = Backbone.View.extend({
	  header:_.template(common.siblings("#all-header").text()),
	  content:_.template(html.siblings("#summary").text()),
	  footer:_.template(common.siblings("#footer").text()),
	  render: function(){
		  this.disablingListviewRender();
		  this.$el.append(this.header).append(this.content(user)).append(this.footer).trigger("create");
		  $(this.el).find("#headertext").html('Order Summary');
	      return this;
	      },
	    events:{
	    	  'click #addedDetailsData':'addedDetailDatas_clickHandler',
	    	  'click #nextEvent':'nextevent_clickHandler'
	      },
	      addedDetailDatas_clickHandler:function (event) {
	    	 user.set("nextStoprequiredeventDetailCode",'undefined');
	    	 user.set("nextStoprequiredeventDetailType",'undefined');
	    	 var stopindex= $(event.currentTarget).index();
	    	 user.set({subdata:stopindex}); 
	    	 var data= user.get("data");
	    	 var GetstopReason = user.get('data').stops[stopindex].stopReason;
	    	 user.set({stopReason:GetstopReason});
	    	 localStorage.stopseqId=stopindex;
	    	 
	    	 // Finding First Required Event Of Next Stop.
	    	 user.set({"needToDisableFlag":false});
   		     var numberofStops = data.stops.length;
	    	 var NextStopIndex=stopindex+1;
	    	 if (NextStopIndex < numberofStops){
	    	 var GetNextStopReason = user.get('data').stops[NextStopIndex].stopReason;
	    	 var workflowarr=[];
	    	 workflowarr=user.get("workflowinfo");
  			 for (var i in workflowarr){ 
		     	     if(workflowarr[i].workflowType.name == "Order in the System"){ 
	     			  $.each(workflowarr[i].details, function(index,val) {
	     				  var str=val.stopType.codes + '';
	                             if (val.required === true) {
	                            	if(val.eventDetail !== null && val.workflowDetailType == "EVENT" && jQuery.inArray(GetNextStopReason, str.replace(/,\s+/g, ',').split(',')) != -1 ){
	                            	var StoprequiredeventDetailCode=val.eventDetail.eventCode;
	                            	var StoprequiredeventDetailType=val.workflowDetailType;
	                            	user.set({"nextStoprequiredeventDetailCode":StoprequiredeventDetailCode});
	                            	user.set({"nextStoprequiredeventDetailType":StoprequiredeventDetailType});
	                            	return false;
	                             }else if(val.eventDetail === null && val.workflowDetailType == "DOCUMENT"  && jQuery.inArray(GetNextStopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
	                            	 var StoprequiredeventDetailCode=val.documentDetail.documentType.id;
	                            	 var StoprequiredeventDetailType=val.workflowDetailType;
	                            	 user.set({"nextStoprequiredeventDetailCode":StoprequiredeventDetailCode});
	                            	 user.set({"nextStoprequiredeventDetailType":StoprequiredeventDetailType});
	                            	return false; 
	                             }else if(val.eventDetail === null && val.workflowDetailType == "SIGNATURE"  && jQuery.inArray(GetNextStopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
	                            	 var StoprequiredeventDetailCode="0";
	                            	 var StoprequiredeventDetailType=val.workflowDetailType;
	                            	 user.set({"nextStoprequiredeventDetailCode":StoprequiredeventDetailCode});
	                            	 user.set({"nextStoprequiredeventDetailType":StoprequiredeventDetailType});
		                             return false;
		                         }else if(val.eventDetail === null && val.workflowDetailType == "INSPECTION"  && jQuery.inArray(GetNextStopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
		                        	 var StoprequiredeventDetailType=val.workflowDetailType;
	                            	 user.set({"nextStoprequiredeventDetailType":StoprequiredeventDetailType});
		                             return false;
		                         }
	                           }
	                  });}}
  			 var GetNextStopFirstRequiredEvent=user.get("nextStoprequiredeventDetailCode");
  			 var GetNextStopFirstRequiredEventType=user.get("nextStoprequiredeventDetailType");
	    	 
	    	 var docIdsarray=[];
	    	 var NextRaisedeventcode=[];
	    	 var allPresentVinNumbers=[];
	    	 var getallnextRaisedVinNumber=[];
	    	
	    	 if(GetNextStopFirstRequiredEventType == "DOCUMENT" || GetNextStopFirstRequiredEventType == "SIGNATURE"){
	    	 for (var i in user.get('data').stops[NextStopIndex].docIds){
	    		 docIdsarray.push(user.get('data').stops[NextStopIndex].docIds[i]);
	    	 }
	    	 }else if(GetNextStopFirstRequiredEventType == "EVENT"){  
	    	 if(user.get('data').stops[NextStopIndex].raisedEvents !== null || user.get('data').stops[NextStopIndex].raisedEvents.length > 0){
    			    for(var i=0;i<user.get('data').stops[NextStopIndex].raisedEvents.length;i++){
    				   var nexteventcode=user.get('data').stops[NextStopIndex].raisedEvents[i].eventCode;
    				   NextRaisedeventcode.push(nexteventcode);
    			    }
    		  }
	    	 }else if(GetNextStopFirstRequiredEventType == "INSPECTION"){
    			  // get all vin numbers
    			    if(data.references !== null || data.references.length>0){
    			    for(var i=0;i<data.references.length;i++){
    			     if(data.references[i].referenceCode == "VT"){	
    				   var vinNumbers=data.references[i].referenceValue;
    				   allPresentVinNumbers.push(vinNumbers);
    			     }  
    			   }
    		     }
    		 // get all raised vin numbers
    			 var getallnextRaisedVinNumber=data.stops[NextStopIndex].vins;
	    		 
	    	 }
	    	 
			 if((jQuery.inArray(GetNextStopFirstRequiredEvent,docIdsarray) != -1) &&(GetNextStopFirstRequiredEventType == "DOCUMENT" || GetNextStopFirstRequiredEventType == "SIGNATURE")){
				 user.set({"needToDisableFlag":true});
			 }else if(jQuery.inArray(GetNextStopFirstRequiredEvent,NextRaisedeventcode) != -1 && GetNextStopFirstRequiredEventType == "EVENT"){
				 user.set({"needToDisableFlag":true});
			 }else if((allPresentVinNumbers.length == getallnextRaisedVinNumber.length) && GetNextStopFirstRequiredEventType == "INSPECTION"){
				 user.set({"needToDisableFlag":true});
			 }
			 
	    	}
		     router.navigate("selectevent",{trigger:'true'});
	      },
	      nextevent_clickHandler:function(event){
	    		 
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
     			  $.each(workflowarr[i].details, function(index,val) {
     				         var str=val.stopType.codes + '';
                             if (val.required === true) {
                             if(val.eventDetail !== null && val.workflowDetailType == "EVENT" && jQuery.inArray( val.eventDetail.eventCode, Raisedeventcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1 ){
                            	// alert("current stop index:"+user.get("subdata"));
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
		     	  $('#msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all" ><h2>There are no Required event for any stops.</h2></div>');
		     	 }
           },
           disablingListviewRender:function(event){
	    	     
		 		    		  var data= user.get("data");
				    		  var numberofStops = data.stops.length;
				    		  var stopflag=true;
				    		  var workflowarr=[];
	 		     	    	  workflowarr=user.get("workflowinfo");
	 		     	    	  user.set({"norequiredevent":false});
	 		     	    	  user.set({"requiredeventIndexCount":numberofStops});
	 		     	    	
	 		     	    	  for (var i in workflowarr){ 
	 		     	    	  if(workflowarr[i].workflowType.name == "Order in the System"){
	 		     	    	  if(workflowarr[i].details.length==0){
	 		     				 user.set({"requiredeventIndexCount":0});
	 		     				 user.set({"norequiredevent":false});
	 		     			  }else{
	 		     				  for(var subindex=0;subindex<numberofStops;subindex++){
		 		                   var data= user.get("data");
		 		     		       var subdata= subindex;
		 		     		       var GetstopReason = user.get('data').stops[subdata].stopReason;
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
		 		     			   if(data.raisedEvents.length>0){
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
		 		     			  $.each(workflowarr[i].details, function(index,val) {
		 		     				  var str=val.stopType.codes + '';
		 		                             if (val.required === true) {
		 		                            	if(val.eventDetail !== null && val.workflowDetailType == "EVENT" && jQuery.inArray(val.eventDetail.eventCode,Raisedeventcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1 ){
		 		                            	var requiredeventIndex=	subdata+1;  
		 		                            	user.set({"requiredeventIndexCount":requiredeventIndex});
		 		                            	user.set({"norequiredevent":true});
		 		                            	stopflag=false;
		 		                            	return false;
		 		                             }else if(val.eventDetail === null && val.workflowDetailType == "DOCUMENT"  && jQuery.inArray(val.documentDetail.documentType.id,RaisedDocumentcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
		 		                            	var requiredeventIndex=	subdata+1;  
		 		                            	user.set({"requiredeventIndexCount":requiredeventIndex});
		 		                            	user.set({"norequiredevent":true});
		 		                            	stopflag=false;
		 		                            	return false; 
		 		                             }else if(val.eventDetail === null && val.workflowDetailType == "SIGNATURE"  && jQuery.inArray('0',RaisedDocumentcode)==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
			 		                            var requiredeventIndex=	subdata+1;  
			 		                            user.set({"requiredeventIndexCount":requiredeventIndex});
			 		                            user.set({"norequiredevent":true});
			 		                            stopflag=false;
			 		                            return false; 
			 		                        }else if(val.eventDetail === null && val.workflowDetailType == "INSPECTION"  && (allPresentVinNumbers.length != getallRaisedVinNumber.length) && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
			 		                            var requiredeventIndex=	subdata+1;  
			 		                            user.set({"requiredeventIndexCount":requiredeventIndex});
			 		                            user.set({"norequiredevent":true});
			 		                            stopflag=false;
			 		                            return false; 
			 		                             }	
		 		                           }
		 		                  });}}
		 		     			if(!stopflag){
	                            	 break;
	                             }
		 				} 
	 		     } 
	 		 }}
	      }
      
	});
  
  return orderPageView;
});


