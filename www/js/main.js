//var router = require('router');
require.config({
    //path mappings for module names not found directly under baseUrl
    paths: {
        text:       'libs/require/text',
        templates:  '../templates',
        views:      'views',
        model:       'models',
        img:   '../img',
        router:		'router'
    }

});
var router;
require(['router'],function(Router) {
	'use strict';
		 router=new Router();
		 Backbone.history.start();
		 jQuery.extend(jQuery.mobile.datebox.prototype.options, {
		  		'overrideDateFormat': '%m/%d/%Y',
		  	    'overrideHeaderFormat': '%m/%d/%Y'

		  	});			 
});

