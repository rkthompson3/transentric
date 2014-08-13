define(['text!templates/common/commonTemplate.html!strip','text!templates/events/selectEvent/selecteventViewTemplate.html!strip','model/user/userModel',"common"],
       function (commonTemplate,selecteventViewTemplate,user,aem) {
  var common = $(commonTemplate).siblings('script');
  var html = $(selecteventViewTemplate).siblings('script');
  var UrlString=aem.commonUrl();
  var selecteventPageView = Backbone.View.extend({
	  header:_.template(common.siblings("#all-header").text()),
	  content:_.template(html.siblings("#selectevent").text()),
	  footer:_.template(common.siblings("#footer").text()),
	  render: function(){
		  this.$el.append(this.header).append(this.content(user)).append(this.footer).trigger("create");
		  $(this.el).find("#headertext").html('Select Event');
		    var _this = this;
		    _(function() {
		        _this.requiredEventRender_clickHandler();
		        _this.optionalsequenceEvent_Render();
		        if(user.get("needToDisableFlag")==true){
		        	 $('ul#requiredListview>li').addClass('ui-disabled');
					 $('ul#damagerequiredListview').addClass('ui-disabled');
		        }
		    }).defer();
	      return this;
	      },
		 events:{
			 'click #requiredoptionalEvents':'requiredoptionalEvents_clickHandler' 
		  },
		 requiredoptionalEvents_clickHandler:function (event){
			  var currentEventType = $(event.currentTarget).find('.GetEventType').text();
			  if (currentEventType == "EVENT"){
				  var EventCode=$(event.currentTarget).find('.GetEventCode').text();
				  var EventName=$(event.currentTarget).find('.GetEventName').text();
				  var EventId=$(event.currentTarget).find('.GetEventId').text();
                  user.set({event:EventCode});
                  user.set({"eventname":EventName});
                  user.set({"eventid":EventId});
		    	  router.navigate("eventreporting",{trigger:'true'}); 
			  }
			  else if(currentEventType == "DOCUMENT"){
				  var doccount=$(event.currentTarget).find('.GetDoccount').text();
				  var currentEventName = $(event.currentTarget).find('.GetEventName').text();
				  var DocumentTypeId=$(event.currentTarget).find('.GetDocId').text();
				  user.set({"docTypeId":DocumentTypeId});
				  localStorage.eventName=currentEventName;
				  localStorage.doccount=doccount;
				  router.navigate("documentUpload",{trigger:'true'});
			  }
			  else if(currentEventType == "SIGNATURE"){
				  router.navigate("signatureUpload",{trigger:'true'}); 
			  }
			  else if(currentEventType == "INSPECTION"){
				  router.navigate("openscannerscreen",{trigger:'true'}); 
			  }
		  },
		  requiredEventRender_clickHandler:function(event){
			        var workflowarr=[];
		    	    workflowarr=user.get("workflowinfo");
		    	    var data= user.get("data");
	  			    var subdata= user.get("subdata");
	  			    var GetstopReason =user.get("stopReason");
	  			    var stopId=data.stops[subdata].stopId;
	  			    var orderid =user.get('data').orderId;
	  			    user.set({'requiredCurrentIndex':0});
	  			    user.set({'lastraisedrequiredIndex':0});
	  			  
	  			    var RaisedDocumentcode =[];
	  			    if(data.stops[subdata].docIds !== null){
					    for(var i=0;i<data.stops[subdata].docIds.length;i++){
						   var documentcode=data.stops[subdata].docIds[i];
						   RaisedDocumentcode.push(documentcode);
						   $(this.el).find('li#requiredoptionalEvents').find('.Tick'+documentcode).css({"display":"block"});
					   }
				    }
	  			    var Raisedeventcode=[];
	  			    if(data.raisedEvents !== null || data.raisedEvents.length > 0){
					    for(var i=0;i<data.raisedEvents.length;i++){
					       if(data.raisedEvents[i].stopId == stopId && data.raisedEvents[i].orderId == orderid ){	
						   var eventcode=data.raisedEvents[i].eventCode;
                           var eventDate=data.raisedEvents[i].eventDate;
                           var CurrentHtmlText = $(this.el).find('li#requiredoptionalEvents').find('.Event'+eventcode).text()+"</br>"+eventDate;
                           Raisedeventcode.push(eventcode);
                     	   $(this.el).find('li#requiredoptionalEvents').find('.Event'+eventcode).html(CurrentHtmlText);
                     	   $(this.el).find('li#requiredoptionalEvents').find('.Tick'+eventcode).css({"display":"block"});
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
	    			    
	    			if(allPresentVinNumbers.length != 0 && (allPresentVinNumbers.length == getallRaisedVinNumber.length)){
                            $(this.el).find('li#requiredoptionalEvents').find('.TickInspection').css({"display":"block"});
                    }   
	    			 
	  			  for (var i in workflowarr){
	  				if(workflowarr[i].workflowType.name == "Order in the System"){
	  				$.each(workflowarr[i].details,function(index,val){if(val.required === true){
	  					var str=val.stopType.codes + '';
	  					if(val.eventDetail !== null && val.workflowDetailType == "EVENT" && jQuery.inArray(val.eventDetail.eventCode,Raisedeventcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
	  						var requiredCurrentCount = val.sequenceNumber;
	  						user.set({'requiredCurrentIndex':requiredCurrentCount});
	  						$('ul#requiredListview>li[value='+index+']').removeClass('ui-disabled');
	  					return false;
	  					}
	  					else if(val.eventDetail === null && val.workflowDetailType == "DOCUMENT"  && jQuery.inArray(val.documentDetail.documentType.id,RaisedDocumentcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
	  						var requiredCurrentCount = val.sequenceNumber;
	  						user.set({'requiredCurrentIndex':requiredCurrentCount});
	  						$('ul#requiredListview>li[value='+index+']').removeClass('ui-disabled');
	  					return false;
	  					}
	  					else if(val.eventDetail === null && val.workflowDetailType == "SIGNATURE" && jQuery.inArray('0',RaisedDocumentcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
	  						var requiredCurrentCount = val.sequenceNumber;
	  						user.set({'requiredCurrentIndex':requiredCurrentCount});
	  						$('ul#requiredListview>li[value='+index+']').removeClass('ui-disabled');
	  					return false;
	  					}
	  					else if(val.eventDetail === null && val.workflowDetailType == "INSPECTION" && (allPresentVinNumbers.length != getallRaisedVinNumber.length) && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
	  						var requiredCurrentCount = val.sequenceNumber;
	  						user.set({'requiredCurrentIndex':requiredCurrentCount});
	  						$('ul#requiredListview>li[value='+index+']').removeClass('ui-disabled');
	  					return false;
	  					}
	  				}});
	  			   }else if(workflowarr[i].workflowType.name == "Damage/Delay"){
	  				 $.each(workflowarr[i].details,function(index,val){
	  				    var str=val.stopType.codes + '';
	  					if(val.eventDetail !== null && val.workflowDetailType == "EVENT" && jQuery.inArray(val.eventDetail.eventCode,Raisedeventcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
	  						$('ul#damagerequiredListview>li[value='+index+']').removeClass('ui-disabled');
	  					}
	  					else if(val.eventDetail === null && val.workflowDetailType == "DOCUMENT"  && jQuery.inArray(val.documentDetail.documentType.id,RaisedDocumentcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
	  						$('ul#damagerequiredListview>li[value='+index+']').removeClass('ui-disabled');
	  					}
	  					else if(val.eventDetail === null && val.workflowDetailType == "SIGNATURE" && jQuery.inArray('0',RaisedDocumentcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
	  						$('ul#damagerequiredListview>li[value='+index+']').removeClass('ui-disabled');
	  					}
	  					else if(val.eventDetail === null && val.workflowDetailType == "INSPECTION" && (allPresentVinNumbers.length != getallRaisedVinNumber.length) && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
	  						$('ul#damagerequiredListview>li[value='+index+']').removeClass('ui-disabled');
	  					}
	  				});	
	  			   }
	  			  }
	  			for (var i in workflowarr){	
	  				if(workflowarr[i].workflowType.name == "Order in the System"){
	  				$.each(workflowarr[i].details,function(index,val){if(val.required === true){ // REVERSE(FOUND ELEMENTS CHECK)
	  					var str=val.stopType.codes + '';
	  					if(val.eventDetail !== null && val.workflowDetailType == "EVENT" && jQuery.inArray( val.eventDetail.eventCode,Raisedeventcode )!=-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
	  						var lastraisedRequiredCount = val.sequenceNumber;
	  						user.set({'lastraisedrequiredIndex':lastraisedRequiredCount});
	  					}
	  					else if(val.eventDetail === null && val.workflowDetailType == "DOCUMENT" && jQuery.inArray( val.documentDetail.documentType.id,RaisedDocumentcode )!=-1  && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
	  						var lastraisedRequiredCount = val.sequenceNumber;
	  						user.set({'lastraisedrequiredIndex':lastraisedRequiredCount});
	  					}
	  					else if(val.eventDetail === null && val.workflowDetailType == "SIGNATURE" && jQuery.inArray('0',RaisedDocumentcode )!=-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
	  						var lastraisedRequiredCount = val.sequenceNumber;
	  						user.set({'lastraisedrequiredIndex':lastraisedRequiredCount});
	  					}
	  					else if(val.eventDetail === null && val.workflowDetailType == "INSPECTION" && (allPresentVinNumbers.length == getallRaisedVinNumber.length) && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
	  						var lastraisedRequiredCount = val.sequenceNumber;
	  						user.set({'lastraisedrequiredIndex':lastraisedRequiredCount});
	  					}
	  				}});
	  			  }
	  			}
		      },
		  optionalsequenceEvent_Render:function(){
		    	    var workflowarr=[];
		    	    workflowarr=user.get("workflowinfo");
		    	    var data= user.get("data");
	  			    var subdata= user.get("subdata");
	  			    var GetstopReason =user.get("stopReason");
	  			    var stopId=data.stops[subdata].stopId;
	  			    var orderid =user.get('data').orderId;
	  			    
	  			   //alert("here"+user.get("RaisedDocumentcode")+"and"+user.get("Raisedeventcode")));
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
					       if(data.raisedEvents[i].stopId == stopId && data.raisedEvents[i].orderId == orderid ){	
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
	    			 
		    	  var requiredCurrentCount = user.get('requiredCurrentIndex');
		    	  var lastrequiredCount = user.get('lastraisedrequiredIndex');
		    	  // alert("requiredCurrentCount"+requiredCurrentCount+"and"+"lastrequiredCount"+lastrequiredCount);
		    	  if(requiredCurrentCount==0){
                	//  alert("Enable all optional events which are not raised");
		    		  for (var i in workflowarr){
		    		if(workflowarr[i].workflowType.name == "Order in the System"){	  
                	  $.each(workflowarr[i].details,function(index,val){if(val.required === false){
  	  					var str=val.stopType.codes + '';
  	  					if(val.required === false && val.eventDetail !== null && val.workflowDetailType == "EVENT" && val.sequenceNumber>lastrequiredCount && jQuery.inArray( val.eventDetail.eventCode, Raisedeventcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
  	  					$('ul#requiredListview>li[value='+index+']').removeClass('ui-disabled');
  	  					}
  	  					else if(val.eventDetail === null && val.workflowDetailType == "DOCUMENT" && val.sequenceNumber>lastrequiredCount && jQuery.inArray(val.documentDetail.documentType.id,RaisedDocumentcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
  	  					$('ul#requiredListview>li[value='+index+']').removeClass('ui-disabled');
  	  					}
  	  					else if(val.eventDetail === null && val.workflowDetailType == "SIGNATURE" && val.sequenceNumber>lastrequiredCount && jQuery.inArray('0',RaisedDocumentcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
  	  					$('ul#requiredListview>li[value='+index+']').removeClass('ui-disabled');
  	  					}
  	  				    else if(val.eventDetail === null && val.workflowDetailType == "INSPECTION" && val.sequenceNumber>lastrequiredCount && (allPresentVinNumbers.length != getallRaisedVinNumber.length) && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
  	  					$('ul#requiredListview>li[value='+index+']').removeClass('ui-disabled');
  	  					}
  	  				}});
		    		}
		    	   }
                  }else if(requiredCurrentCount > 1 ){
                	//  alert("Enable b/w optional events which are not raised");
                	  for (var i in workflowarr){
                	   if(workflowarr[i].workflowType.name == "Order in the System"){
                	  $.each(workflowarr[i].details,function(index,val){
                		//    alert(val.sequenceNumber +">"+ lastrequiredCount+ "&&"+ val.sequenceNumber +"<"+ requiredCurrentCount);
    	  					var str=val.stopType.codes + '';
    	  					if(val.required === false && val.eventDetail !== null && val.workflowDetailType == "EVENT" && val.sequenceNumber>lastrequiredCount && val.sequenceNumber<requiredCurrentCount &&  jQuery.inArray( val.eventDetail.eventCode, Raisedeventcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1 ){
    	  						$('ul#requiredListview>li[value='+index+']').removeClass('ui-disabled');
    	  					}
    	  					else if(val.eventDetail === null && val.workflowDetailType == "DOCUMENT" && val.sequenceNumber>lastrequiredCount && val.sequenceNumber<requiredCurrentCount && jQuery.inArray( val.documentDetail.documentType.id, RaisedDocumentcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
    	  						$('ul#requiredListview>li[value='+index+']').removeClass('ui-disabled');
    	  					}
    	  					else if(val.eventDetail === null && val.workflowDetailType == "SIGNATURE" && val.sequenceNumber>lastrequiredCount && val.sequenceNumber<requiredCurrentCount && jQuery.inArray('0', RaisedDocumentcode )==-1 && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
    	  						$('ul#requiredListview>li[value='+index+']').removeClass('ui-disabled');
    	  					}
    	  					else if(val.eventDetail === null && val.workflowDetailType == "INSPECTION" && val.sequenceNumber>lastrequiredCount && val.sequenceNumber<requiredCurrentCount && (allPresentVinNumbers.length != getallRaisedVinNumber.length) && jQuery.inArray(GetstopReason, str.replace(/,\s+/g, ',').split(',')) != -1){
    	  						$('ul#requiredListview>li[value='+index+']').removeClass('ui-disabled');
    	  					}
                	  });
                	  }
                    }
                  }
		      }
		      
	});
  
  return selecteventPageView;
});


