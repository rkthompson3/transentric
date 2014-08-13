define(['views/login/login','views/home/home','views/notAuth/notauth','views/home/signaturetpl/signatureupload','views/events/documentUpload/documentupload',
        'views/events/photoCapture/photocapture','views/home/myinfo/myinfo','views/order/order','views/events/nextEvent/nextevent','views/events/selectEvent/selectevent','views/events/optionalselectEvent/optionalselectevent','views/events/damagedelayEvent/damagedelayevent',             
        'views/events/eventReporting/eventreporting','views/events/reportAdnInfo/reportadninfo','views/events/damageInfo/openscannerscreen','views/events/damageInfo/damageInfo','views/events/damageInfo/inspection','views/events/damageInfo/damageReview','views/events/damageInfo/damageReviewSign',"common"], 
	function(loginPageView,homePageView,notAuthPageView,signatureUploadView,docView,photoCaptureView,myinfoPageView,orderPageView,nexteventPageView,selecteventPageView,optionalselecteventPageView,damagedelayeventPageView,eventReportingPageView,reportAdnInfoPageView,openscannerscreenPageView,damageInfoPageView,inspectionPageView,damageReviewPageView,damageReviewSignPageView,aem) {

    'use strict';
    var Router = Backbone.Router.extend({
    //define routes and mapping route to the function
        routes: {
        	'':    'login',
        	"login":"login",//home view
        	"notauth":'notauth',
            "home":"home",
            "signatureUpload":"signatureUpload",
            "documentUpload":"documentUpload",
            "photoCapture" : "photoCapture",
            "myinfo":'myinfo',
            "changepwd":"changepwd",
            "ordersummary":"ordersummary",
            "nextevent":"nextevent",
            "selectevent":"selectevent",
            "optionalselectevent":"optionalselectevent",
            "damagedelayevent":"damagedelayevent",
            "eventreporting":'eventreporting',
            "adninfo":'adninfo',
            "openscannerscreen":"openscannerscreen",
            "damageInfo":"damageInfo",
            "inspection":"inspection",
            "damageReview":"damageReview",
            "damageReviewSign":"damageReviewSign",
            '*actions': 'defaultAction' //default action,mapping "/#anything"       	
        },
        initialize:function () {
        	if(typeof window.localStorage == 'undefined'){
        	 this.firstPage = true;
        	}
        	else if(window.localStorage.getItem('username')!='undefined' && window.localStorage.getItem('password')!='undefined'){
				if(window.localStorage.getItem('username')!=null && window.localStorage.getItem('password')!=null){
					aem.deafualtloginfunc(window.localStorage.getItem('username'),window.localStorage.getItem('password'));
				}
				else{
					this.firstPage = true;
				}
			  }
        	 else{
        		 this.firstPage = true; 
			 }
        	
        },
	    defaultAction: function(){
	    	this.login();
	    },
	    login:function () {
	    	if(typeof window.localStorage == 'undefined'){
	    		var logview=new loginPageView();
	    		logview.render();
	    		this.changePage(logview);
	    	}else if(window.localStorage.getItem('username')!='undefined' && window.localStorage.getItem('password')!='undefined'){
	    		 if(window.localStorage.getItem('username')!=null && window.localStorage.getItem('password')!=null){
            		aem.deafualtloginfunc(window.localStorage.getItem('username'),window.localStorage.getItem('password'));
        		  }else{
        			  var logview=new loginPageView();
      	    		   logview.render();
      	    		   this.changePage(logview);
        			  }
              }else{
            	  var logview=new loginPageView();
  	    		  logview.render();
  	    		  this.changePage(logview);  
              }
	    },
	    home:function () {
	    	var homeview=new homePageView();
	    	homeview.render();
	         this.changePage(homeview);
	    },
	    signatureUpload:function(){
	    	var signatureUploadObj=new signatureUploadView();
	    	signatureUploadObj.render();
	        this.changePage(signatureUploadObj);
	    },
	    documentUpload:function () {
	    	var doc=new docView();
	    	doc.render();
	        this.changePage(doc);
	        doc.imageCount();
	    },
	    photoCapture:function () {
	    	var photocap=new photoCaptureView();
	    	photocap.render();
	        this.changePage(photocap);
	        photocap.getPhotos();
	    },
	    notauth:function () {
	    	var notauthview=new notAuthPageView();
	    	notauthview.render();
	         this.changePage(notauthview);
	    },
	    myinfo:function () {
	    	var myinfoview=new myinfoPageView();
	    	myinfoview.render();
	         this.changePage(myinfoview);
	    },
	    changepwd:function () {
	    	var cpinview=new ChangePwdPageView();
	    	cpinview.render();
	         this.changePage(cpinview);
	    },
	    ordersummary:function () {
	    	var osummary=new orderPageView();
	    	 	osummary.render();
	          this.changePage(osummary);
	    },
	    events:function () {
	    	var eventsView=new eventsPageView();
	    	eventsView.render();
	        this.changePage(eventsView);
	    },
	    nextevent:function(){
	    	var nexteventView=new nexteventPageView();
	    	nexteventView.render();
	    	this.changePage(nexteventView);
	    },
	    selectevent:function(){
	    	var selecteventView=new selecteventPageView();
	    	selecteventView.render();
	    	this.changePage(selecteventView);
	    },
	    optionalselectevent:function(){
	    	var optionalselecteventView=new optionalselecteventPageView();
	    	optionalselecteventView.render();
	    	this.changePage(optionalselecteventView);
	    },
	    damagedelayevent:function(){
	    	var damagedelayeventView=new damagedelayeventPageView();
	    	damagedelayeventView.render();
	    	this.changePage(damagedelayeventView);
	    },
	    eventreporting:function () {
	    	var eventreportingView=new eventReportingPageView();
	    	eventreportingView.render();
	        this.changePage(eventreportingView);
	    	eventreportingView.forRadio();

	    },
	    adninfo:function () {
	    	var reportView=new reportAdnInfoPageView();
	    	reportView.render();
	        this.changePage(reportView);
	    },
	    openscannerscreen:function(){
	    	var openscannerscreenView=new openscannerscreenPageView();
	    	openscannerscreenView.render();
	        this.changePage(openscannerscreenView);
	    },
	    damageInfo:function(){
	    	var damageInfo=new damageInfoPageView();
	    	damageInfo.render();
	    	this.changePage(damageInfo);
	    },
	    inspection:function(){
	    	var inspection=new inspectionPageView();
	    	inspection.render();
	    	this.changePage(inspection);
	    },
	    damageReview:function(){
	    	var damageReview=new damageReviewPageView();
	    	damageReview.render();
	    	this.changePage(damageReview);
	    },
	    damageReviewSign:function(){
	    	var damageReviewSign=new damageReviewSignPageView();
	    	damageReviewSign.render();
	    	this.changePage(damageReviewSign);
	    },
	   // init:true,

        //1. changePage will insert view into DOM and then call changePage to enhance and transition
        //2. for the first page, jQuery mobile will present and enhance automatically
        //3. for the other page, we will call $.mobile.changePage() to enhance page and make transition
        //4. argument 'view' is passed from event trigger
        changePage:function (view) {        	
        	//add the attribute 'data-role="page" ' for each view's div
    		view.$el.attr('data-role', 'page');
    		aem.updateTheme("f","g","h");
    		$('div[data-role="page"]').on('pagehide', function (event, ui) {
				$(event.currentTarget).remove();
				aem.updateTheme("f","g","h");
			});
            //append to dom
        	$('body').append(view.$el);  

            //if(!this.init){   
                $.mobile.changePage($(view.el), {changeHash:false});
          //  }else{   
            //    this.init = false;
           // }  
          // alert(JSON.stringify(user.get('data')));
        //   if(window.localStorage.getItem('UserModel')
        // alert(user.get('id'));
        //alert(JSON.stringify(user));
          if(user.get('id')!=''){
             window.localStorage.setItem('UserModel',JSON.stringify(user));
          	 // alert(window.localStorage.getItem('UserModel'));
          }
          	
          window.localStorage.setItem('page',Backbone.history.fragment);      
    	}       
    });
   // commonObj['url'] = 'https://xdev.oriss.www.transentric.com/';
    return Router;
    
});




