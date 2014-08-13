define(['text!templates/common/commonTemplate.html!strip','text!templates/events/reportAdnInfo/reportadninfoViewTemplate.html!strip','model/user/userModel','common'],
       function (commonTemplate,reportadninfoViewTemplate,user,aem) {
  var common = $(commonTemplate).siblings('script');
  var html = $(reportadninfoViewTemplate).siblings('script');
  var UrlString=aem.commonUrl();
  var reportAdnInfoPageView = Backbone.View.extend({
	  header:_.template(common.siblings("#all-header").text()),
	  content:_.template(html.siblings("#report").text()),
	  footer:_.template(common.siblings("#footer").text()),
	  render: function(){
		  this.$el.append(this.header).append(this.content(user)).append(this.footer);
		  var disable= user.get("disable");
		  if(disable == "yes"){
				 $(this.el).find("a.actionbuttons").addClass('ui-disabled');
			  }else{
				  $(this.el).find("a.actionbuttons").removeClass('ui-disabled');
			  }
		  $(this.el).find("#headertext").html('Additional Information');
		  return this;
	       
	      },
	    events:{
	    	  'click a.seals':'seals_clickHandler',
	    	  'click a.notes':'notes_clickHandler',
	    	  'click #aboutDescription':'scroll_clickHandler',
	    	  'click #addinfoSubmit':'addinfoSubmit',
	    	  'click #addseal':'addSealHandler',
	    	  'click #addnotes':'addnotesHandler'
	         },
	      seals_clickHandler:function (event) {
	    	  $("#aboutDescription").attr("disabled", "disabled");
	    	  $('#popupSeals').popup('open');
	    	  
	      },
	      notes_clickHandler:function (event) {
	    	   $('#popupNotes').popup('open');
	    	  
	      },
	      scroll_clickHandler:function (event) {
	    	  $.mobile.silentScroll(8000);
	      },
	      addinfoSubmit:function(event){
	    	  var InfoObj=this.additionalInfo();
	    	  aem.reportSubmit(user,InfoObj);
	    	 },
	      additionalInfo:function(){
	    	  var addinfo= user.get('dummyObj');
	    	  	if(addinfo.pieces === ''){
		        	 addinfo.pieces=$("#pieces").val();
		         }
		         if(addinfo.weight === ''){
		        	 addinfo.weight=$("#weight").val();
		        }
		         if(addinfo.equipmentNumber === ''){
		        	 addinfo.equipmentNumber=$("#ordereqpnum").val();
		         }
		        if(addinfo.bolNumber === ''){
		        	 addinfo.bolNumber=$("#bol").val();
		         }
		         if(addinfo.loadIndicator === 'NA'){
		        	 addinfo.loadIndicator=$("#loadIndicator :selected").val();
		         }
		       
		       return addinfo;
	      },
	      addSealHandler:function(event){
	    	  var addinfo= user.get('dummyObj');
	    	  addinfo.seals=$("#popseal").val();
	    	  user.set({dummyObj:addinfo});
	    	  $("#popupSeals").popup("close");
	    	  $(".sealdata").html(addinfo.seals);
	      },
	      addnotesHandler:function(event){
	    	  var addinfo= user.get('dummyObj');
	    	  addinfo.notes=$("#popnote").val();
	    	  user.set({dummyObj:addinfo});
	    	  $("#popupNotes").popup("close");
	    	  $(".notedata").html(addinfo.notes);
	      }
	     
	      
	});
  
  return reportAdnInfoPageView;
});


