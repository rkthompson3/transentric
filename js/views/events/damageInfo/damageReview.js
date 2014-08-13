define(['text!templates/common/commonTemplate.html!strip','text!templates/events/damageInfo/damageReview.html!strip','model/user/userModel','common'],
       function (commonTemplate,damageReview,user,aem) {
    	   var common = $(commonTemplate).siblings('script');
    	   var html = $(damageReview).siblings('script');
    	   var UrlString=aem.commonUrl();
    	
       var damageReviewPageView = Backbone.View.extend({
     //   header:_.template(common.siblings("#all-header").text()),
	    content:_.template(html.siblings("#damageReview").text()),
	    footer:_.template(common.siblings("#footer").text()),
	    initialize: function() {
	       	_this = this;
	       },
        render: function(){
	    	this.$el.append(this.content).append(this.footer);  
	    	$(this.el).find("#headertext").html('Review');
	        $(window).trigger('resize'); setTimeout(function() { 
	        $(window).trigger('resize'); 
	        var newsrc=user.get("sigSrc");
	        if(newsrc != undefined && newsrc != ""){
	        $('#driverSignContainer').remove();
	        $('#output').css({"display":"block","border-top":"1px dashed black","border-bottom":"1px dashed black",
	        	"border-left":"1px solid black","border-right":"1px solid black","padding":"5px"});
	        $('#output img').attr('src', newsrc);
	        }
	        var dReason=user.get("driverreason");
	        if(dReason != undefined){
	        	$('select#driverreason').val(dReason).prop("selected",true).selectmenu("refresh");
		    }
	        var dotherInfo=user.get("driverOtherInfo");
	        if(dotherInfo != undefined){
	        	$('#driverotherinfo').text(dotherInfo);
		    }
	        },500);
	    	return this;
	      },
	    events:{
		    	 'click a#next':'next_clickHandler',
		    	 'click .backtoDash':'back_clickHandler',
		    	 'click a#cancel':'cancelinspection_clickHandler',
		    	 'click #help':'displayHelpInfo'
		         },
		 
       next_clickHandler:function(){
            	if($(".mbc-signature-field").get(0)){
            		var $sig = $('.mbc-signature-field');
            		var data = $sig.jSignature('getData', 'native');
            		 if ( data.length > 0){
                 		var data = $sig.jSignature('getData','svg'); 
                 		var src = 'data:' + data[0] + ',' + data[1];
                 		user.set({"driversSignature":data[1]});
                        user.set({"sigSrc":src});
                 		} 
                    }
            	var driverReason=$('#driverreason').val();
            	var driverOtherInfo=$('#driverotherinfo').val();
            	user.set({"driverreason":driverReason});
            	user.set({"driverOtherInfo":driverOtherInfo});
            	router.navigate("damageReviewSign",{trigger:true,replace:true});
            	},
       back_clickHandler:function(){
                router.navigate("inspection",{trigger:true,replace:true});
            },
       cancelinspection_clickHandler:function(){
         		aem.cancelInspection();
         	},
       displayHelpInfo:function(){
            	 $('#scannerhelptext').popup('open');
            }  	
    	   
       });
      return damageReviewPageView;
});

       