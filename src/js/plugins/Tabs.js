

define(function(require, exports, module) {
    'use strict';

    require('zepto');
    // require('touch');

    var Tabs = function(opt){
    	this.extentOpts(opt);
        this.init();
    };

    Tabs.prototype = {
    	opts : {
    		optor : '.tab',
    		cntor : '.tabcont',
    		callback : function(){}
    	},

    	init : function(){
    		var _self = this;
    		_self.bindEvent();
    	},

    	extentOpts: function(options) {
    		var _self = this;
            _self.opts = $.extend(true, {}, _self.opts, options);
        },

    	checkTap : function(i){
    		var _self  = this,
    		$optor = $(_self.opts.optor),
    		$cntor = $(_self.opts.cntor);

    		$optor.find('li').removeClass('on');
    		$optor.find('li').eq(i).addClass('on');

    		$cntor.removeClass('show');
    		$cntor.eq(i).addClass('show');

    		if(_self.opts.callback && typeof(_self.opts.callback) === 'function'){
    			_self.opts.callback(i);
    		}
    	},

    	bindEvent : function(){
    		var _self =  this;
    		var _li = _self.opts.optor+ ' li';
    		$('body').on('tap', _li, function(){
    			var i = $(this).index();
    			_self.checkTap(i);
    		})
    	}

    };
    
    return Tabs;
})