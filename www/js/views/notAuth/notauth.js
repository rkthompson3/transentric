define(['text!templates/common/commonTemplate.html!strip','text!templates/notAuth/notauthTemplate.html!strip','model/user/userModel','common'],
       function (commonTemplate,notauthTemplate,user,aem) {
  var common = $(commonTemplate).siblings('script');
  var html = $(notauthTemplate).siblings('script');
  var UrlString=aem.commonUrl();
  var notAuthPageView = Backbone.View.extend({
	    header:_.template(common.siblings("#home-header").text()),
	    content:_.template(html.siblings("#notauth").text()),
	    footer:_.template(common.siblings("#footer").text()),
	     render: function(){
	       this.$el.append(this.header).append(this.content(user)).append(this.footer);
	       $(this.el).find("#headertext").html('Agilink </br> Event Manager');
	       return this;
           
	      },
	     events:{
			  
	         
	      }
	});
  
  return notAuthPageView;
});


