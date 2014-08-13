define(['text!templates/common/commonTemplate.html!strip','text!templates/events/documentUpload/documentuploadTemplate.html!strip','model/user/userModel','common'],
function (commonTemplate,docUpload,user,aem) {
  var common = $(commonTemplate).siblings('script');
  var html = $(docUpload).siblings('script');
  var pictureSource=navigator.camera.PictureSourceType;
  var destinationType=navigator.camera.DestinationType;
  var i;
  var uploadFlag=false;
  var UrlString=aem.commonUrl();
  var mainIndec=0,
      mainindeclength=0,
      subIndex=0,
      subindexlength=0;
  var dObject=null;
  var globalImagesArray=null;
  var docView = Backbone.View.extend({
	  header:_.template(common.siblings("#all-header").text()),
	  content:_.template(html.siblings("#documentupload").text()),
	  footer:_.template(common.siblings("#footer").text()),
	  initialize: function() {
      	_this = this;
      },
	  render: function(){
		  this.$el.append(this.header).append(this.content(user)).append(this.footer);
		  $(this.el).find("#headertext").html('Document Upload');
		  return this;
		  },
	 imageCount : function(){
		  aem.imageUploadDB();
	      var obj=user.get('data').stops[user.get('subdata')];
	      var stopId=obj.stopId;
	      var userId=user.get("User");
	      var ordernumber=user.get("order");
	      var orderid=user.get("data").orderId;
	      var arr = [localStorage.eventName];
              jQuery.each( arr, function( i, doctype) {
	          aem.loadFromDBCount(doctype,ordernumber,userId,stopId,orderid,callback);
	          function callback(results) {
		      $("#"+doctype).html(results.rows.length);
	          }
              });
		
	 	},
	     events:{
	    	 'click a.docType':'docType_clickHandler',
	    	 'click a#submitallPhotos':'submitallPhotos_clickHandler',  
	         },
	         docType_clickHandler:function (event) {
	        	 var type=$(event.target).attr("value");
	        	 user.set({docType:localStorage.eventName});
	        	 if(type === localStorage.eventName){
	        		 user.set({count:localStorage.doccount});
	        	 }
	        	 router.navigate("photoCapture",{trigger:'true',replace:true});
		      },
		    submitallPhotos_clickHandler:function (event) {
		    
		    var obj=user.get('data').stops[user.get('subdata')];
	  	    var stopId=obj.stopId;
		    var userId=user.get("User");
	        var ordernumber=user.get("order");
		    var oid=user.get("data").orderId;
	            aem.submitphotos(oid,stopId,userId,ordernumber);
	         }
	});
  
  return docView;
});


