define(['text!templates/common/commonTemplate.html!strip','text!templates/events/photoCapture/photocaptureTemplate.html!strip','model/user/userModel','common'],
function (commonTemplate,photoCapture,user,aem) {
  var common = $(commonTemplate).siblings('script');
  var html = $(photoCapture).siblings('script');
  var pictureSource=navigator.camera.PictureSourceType;
  var destinationType=navigator.camera.DestinationType;
  var imageId=null;
  var type = null,imgIndex=null;
  var uploadFlag=false;
  var UrlString=aem.commonUrl();
  var photoCaptureView = Backbone.View.extend({
	  //header:_.template(common.siblings("#all-header").text()),
	  content:_.template(html.siblings("#photocapture").text()),
	  footer:_.template(common.siblings("#footer").text()),
	  initialize: function() {
      	_this = this;      	
      },
	  render: function(){
		  this.$el.append(this.content(user)).append(this.footer);
		  $(this.el).find("#headertext").html('Photo Capture');
		  return this;		 
		  },
		  getPhotos : function(){
		    var obj=user.get('data').stops[user.get('subdata')];
		    var stopId=obj.stopId;
		    var userId=user.get("User");
	            var ordernumber=user.get("order");
	            var doctype=user.get("docType");
		    var orderid=user.get("data").orderId;
		    aem.getImageTable(doctype,ordernumber,userId,stopId,orderid,imagesDisplay);
		    function imagesDisplay(results) {
	      
		     var len = results.rows.length;
		     if(len<=0){
		       $('a#removeall').addClass('ui-disabled');
		          }
                    for (var i=0; i<len; i++){
		    var imagepath=results.rows.item(i).data;
		    var img = document.getElementById('camera_image'+i);
		    img.src= imagepath;	    
                    
		     } 
		  }
		 }, 
	 	
	     events:{
	    	 'click li .imageClick':'takePicture_clickHandler',
	    	 'click a#removeall':'remove_clickHandler',
	    	 'click a#ok':'ok_clickHandler',
	    	 'click .photoback':'backtodocument'
	         },
	         backtodocument:function(event){
	        	 router.navigate("documentUpload",{trigger:true});
	         },
	         takePicture_clickHandler:function (event) {
	        	  imageId=$(event.target).attr("id");
	        	  var imgSrc=$("#"+imageId).attr("src");
	        	  if(imgSrc === ""){
	        		  navigator.camera.getPicture(_this.onPhotoURISuccess, _this.onFail, { quality: 50,
	    	              destinationType: destinationType.FILE_URI,saveToPhotoAlbum:true});
	        	  }else{
	        		  imgIndex= $("#"+imageId).attr("name");
		        	  //var imageUri="file:///mnt/sdcard/TestFolder/"+imgSrc.substr(imgSrc.lastIndexOf('/')+1);
	        		  navigator.notification.confirm(
		                         'Are you sure you want to delete image',  // message
		                         onConfirm,        // callback to invoke with index of button pressed
		                         'Delete',         // title
		                         'Ok,Cancel'       // buttonLabels
		                     );
			            function onConfirm(button) {		      
			                     if(button==1){
					       var data=imgSrc;
					       var userId=user.get("User");
					       var obj=user.get('data').stops[user.get('subdata')];
					       var stopId=obj.stopId;
		                               var ordernumber=user.get("order");
                                               var doctype=user.get("docType");
					       var orderid=user.get("data").orderId;
					      $parent =  $('#camera_image'+imgIndex).parent();
			           	      $parent.html($('#camera_image'+imgIndex).attr("src","").detach());
	                                      aem.deleteImageTableSingle(doctype,data,ordernumber,userId,stopId,orderid);
			                    }
			                 }
	        	  }
	         },
	         onFail :function(message) {
	        	  alert(message);
	         },
	         remove_clickHandler :function(message) {
	        	 navigator.notification.confirm(
                         'Are you sure you want to delete all images',  // message
                         onConfirm,        // callback to invoke with index of button pressed
                         'Delete',         // title
                         'Ok,Cancel'       // buttonLabels
                     );
	          function onConfirm(button) {
	        	  if(button==1){
	          var obj=user.get('data').stops[user.get('subdata')];
	          var stopId=obj.stopId;
		  var userId=user.get("User");
	          var ordernumber=user.get("order");
	          var doctype=user.get("docType");
		  var orderid=user.get("data").orderId;
		  var count=user.get('count');
			  aem.deleteImageTableAll(doctype,ordernumber,userId,stopId,orderid);
			  for (var i=0;i<count;i++){
		        	$parent =  $('#camera_image'+i).parent();
			        $parent.html($('#camera_image'+i).attr("src","").detach());
		              }
			   $('a#removeall').addClass('ui-disabled');    
	                 }
	          }
	         },
	         ok_clickHandler :function(event) {
	        	 var obj=user.get('data').stops[user.get('subdata')];
		         var stopId=obj.stopId;
		         var userId=user.get("User");
		         var ordernumber=user.get("order");
	        	 var count=user.get('count');
	        	 var doctype=user.get("docType");
			     var orderid=user.get("data").orderId;
			 aem.deleteImageTableAll(doctype,ordernumber,userId,stopId,orderid);
	        	 		 
			    var imageArray= [];
	        	    var imgObj={};
	        	    for (var i=0,j=0;i<count;i++){
		        	var img = document.getElementById('camera_image'+i);
		     	        var imageURI = img.src;
		     	        var x=imageURI;//imageURI.substr(imageURI.lastIndexOf('/')+1);
		     	        if(imageURI.substr(imageURI.lastIndexOf('/')+1) !="index.html"){
				        aem.insertImageTable(doctype,imageURI,ordernumber,userId,stopId,orderid);
		     	          imageArray[j]=x;
		     	          j++;
		     	          }
		              }
	        	 router.navigate("documentUpload",{trigger:true,replace:true});
	         },
	         onPhotoURISuccess :function(imageURI) {
	             var largeImage = document.getElementById(imageId);
	             largeImage.style.display = 'block';
	             largeImage.src = imageURI;
		         $('a#removeall').removeClass('ui-disabled');
	           
	            }
	          
	         
	});
  
  return photoCaptureView;
});


