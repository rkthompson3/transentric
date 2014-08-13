define(['text!templates/common/commonTemplate.html!strip','text!templates/events/eventReporting/eventreportingViewTemplate.html!strip','model/user/userModel','common'],
       function (commonTemplate,eventreportingViewTemplate,user,aem) {
  var common = $(commonTemplate).siblings('script');
  var html = $(eventreportingViewTemplate).siblings('script');
  var report=null;
  var eventObj=null;
  var UrlString=aem.commonUrl();
  var eventReportingPageView = Backbone.View.extend({
	  header:_.template(common.siblings("#all-header").text()),
	  content:_.template(html.siblings("#eventreport").text()),
	  footer:_.template(common.siblings("#footer").text()),
	  render: function(){
		  this.$el.append(this.header).append(this.content(user)).append(this.footer);
		  var additionalinfosubmit =user.get("additionalinfosubmit");
		  if(additionalinfosubmit == "yes"){
			  $(this.el).find('#submitevent').addClass('ui-disabled');
			  $(this.el).find('#reportaddinfo').addClass('ui-disabled'); 
			  user.set({additionalinfosubmit:"No"});
			  }
		  /*var disable= user.get("disable");
		  if(disable == "yes"){
			 $(this.el).find("a.actionbuttons").addClass('ui-disabled');
		  }else{
			  $(this.el).find("a.actionbuttons").removeClass('ui-disabled');
		  }*/
		  $(this.el).find("#headertext").html('Report Event');
		  return this;
		  
	      },
	      events:{
	    	  "change input[type=radio]": "onRadio_Click",
	    	  'click #submitevent':'onSubmit_clickHandler',
	    	  'click #reportaddinfo':'onreportaddinfo_ClickHandler'
	      },
	      forRadio : function(event){
	    	  if ($(window).width()<300){
	    		  $("label[for='reportap'] span.ui-btn-text").text("AT APPT");
	    	  }
	    	  var dt= user.get('date');
			  var tm= user.get('time');
			  if(dt!=="" && tm!== ""){
				  $(this.el).find('input[id="date"]').trigger('datebox', {'method':'set','value':dt});
				  $(this.el).find('input[id="time"]').trigger('datebox', {'method':'set','value':tm});
			  }
	      },
	      onRadio_Click:function (event) {
	    	  $('#msg').html('');
	    	  report= $(event.currentTarget).val();
		      if(report == "Reportat"){
	   	    	   $(" div #calender").show();
	   	       }else{
	   	    	   $(" div #calender").hide();
	   	       }
	      },
	      onreportaddinfo_ClickHandler:function (event) {
	    	  var sel=null;
	    	  var submitVar=null;
	    	  sel=$('input[name=radio-choice]:radio:checked').val();
	    	  submitVar=this.timeReturn(sel);
	    	  var dat= $('#date').val();
			  var tim= $('#time').val();
	    	  user.set({dummyObj:submitVar});
	    	  user.set({date:dat});
	    	  user.set({time:tim});  
	    	  if(submitVar !== false)
	    	  router.navigate("adninfo",{trigger:'true'});
	      },
	      onSubmit_clickHandler:function(){
	    	   var sel=null;
	    	   var submitVar=null;
	    	  sel=$('input[name=radio-choice]:radio:checked').val();
	    	  submitVar=this.timeReturn(sel);
	    	  if(submitVar !== false)
	    	  aem.reportSubmit(user,submitVar);
	      },
	      timeReturn:function(sel){
	    	  var responseObj=user.get('data');
			  var newdate;
			  var zone;
			  var datearray;
			  var timearray;
		  	  if(sel == "ReportNow"){
	    		     newdate=aem.getcurrentTime();
		    		 zone=null;
		    		eventObj= aem.buildevntObject(responseObj,newdate,zone);
		    	    return eventObj;
	    		   
	    	  }else  if(sel == "ReportatAppointment"){
	    		  var obj=user.get('data').stops[user.get('subdata')];
	    		  if(obj.arrivalDateTime !== null){
	    			  var actualtime = obj.arrivalDateTime.split(" ");
		    		   datearray = actualtime[0].split("/");
		    		   timearray = actualtime[1].split(":");
		    		   newdate =datearray[2]+ datearray[0]+datearray[1]+timearray[0]+timearray[1];
		    		  eventObj= aem.buildevntObject(responseObj,newdate,obj.arrivalTimeZone);
	    		  }else{
	    			   newdate=aem.getcurrentTime();
			    	   zone=null;
	    			  eventObj= aem.buildevntObject(responseObj,newdate,zone);
	    		  }
	    		  
	    		  
	    		  return eventObj;
	    		 
	    	  }else{
	    		  if($('#date').val()!== "" && $('#time').val()!== ""){
	    		   datearray = $('#date').val().split("/");
	    		   timearray = $('#time').val().split(":");
	    		   newdate =datearray[2]+datearray[0]+ datearray[1]+timearray[0]+timearray[1];
	    		   zone=null;
	    		  eventObj= aem.buildevntObject(responseObj,newdate,zone);
	    		  return eventObj;
	    		  }else{
	    			  $('#content  #msg').html('<div class="mbc-feedback mbc-feedback-error ui-corner-all"><h2>Enter the Date and Time</h2></div>');
	    			  return false;
	    		  }
	    		  
	    	  }
	    	  
	    	  
	      
	      }
	});
  
  return eventReportingPageView;
});


