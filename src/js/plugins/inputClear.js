define(function(require, exports, module) {
    'use strict';

    require('zepto');
    // require('touch');

    var inputClear = function(opt){
    	this.extentOpts(opt);
        this.init();
    };

    inputClear.prototype = {
    	opts : {
    		include : '.jClear',
    		exclude : 'data-noclear="true"',
    		callback : function(){}
    	},

        selector : [],

    	init : function(){
    		var _self = this;

            _self.getSelector();
    		_self.bindEvent();
    	},

        extentOpts: function(options) {
            var _self = this;
            _self.opts = $.extend(true, {}, _self.opts, options);
        },

        getSelector : function(){
            var _self = this;

            $(_self.opts.include).each(function(i){
                if($(this).attr('data-noclear') != 'true'){
                    _self.selector.push($(_self.opts.include)[i]);
                }
            });

            _self.plusEle();
        },

        plusEle : function(){
            var _self = this;

            for(var i=0,len=_self.selector.length; i<len; i++){
                if($(_self.selector[i]).parent().css('position') === 'static'){
                    $(_self.selector[i]).parent().addClass('p-r');
                }

                var _name = $(_self.selector[i]).attr('name');
                // console.log('_name: ', _name);
                $(_self.selector[i]).parent().append('<i class="ao-icon ao-icon-clear hide" data-orin="'+_name+'"></i>')
                
                // if($(_self.selector[i]).val()!=''){
                //     $(_self.selector[i]).siblings('.ao-icon-clear').removeClass('hide');
                // }
            }
        },

    	bindEvent : function(){
    		var _self = this;

    		$('body').on('focus','.jClear',function(){

                if($(this).attr('data-noclear') != 'true' ){
                    var _name = $(this).attr('name');

                    $(this).parent().find('[data-orin="'+ _name +'"]').removeClass('hide')

                    // if($(this).val() != ''){
                    //     $(this).parent().find('[data-orin="'+ _name +'"]').removeClass('hide')
                    // }else{
                    //     $(this).parent().find('[data-orin="'+ _name +'"]').addClass('hide')
                    // }
                }
            }).on('blur','.jClear',function(){

                if($(this).attr('data-noclear') != 'true' ){
                    var _name = $(this).attr('name');

                    $(this).parent().find('[data-orin="'+ _name +'"]').addClass('hide')
                }
            }).on('tap','.ao-icon-clear',function(){
                var _name = $(this).attr('data-orin');
                // $(this).parent().find('input[name="'+_name+'"]').val('');
                $(this).parent().find('.jClear').val('');
                $(this).addClass('hide'); 
            })
    	}

    };

    return inputClear;
    
})