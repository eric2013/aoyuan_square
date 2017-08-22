define(function(require, exports, module) {
    'use strict';

    require('zepto');
    require('touch');

    var Selector = function(opt){};

    Selector.prototype = {
    	opts : {
            v : 0, 
    		list : [
                {
                    info :'选项01',
                    value : '0',
                    select : true
                }
            ],
            zIndex : '',
            cover : true,
            bgC : '',
            zIndexC : '',
    		callback : function(){}
    	},

    	init : function(opt){
    		var _self = this;
            _self.extentOpts(opt);
            _self.showPop();
    		_self.bindEvent();
    	},

        extentOpts: function(options) {
            var _self = this;
            _self.opts = $.extend(true, {}, _self.opts, options);
        },

        // 遮罩层
        cover : function(){
            var _self = this,
                _len = $('body').find('.ao-cover').length,
                bg = _self.opts.bgC, 
                zIndex = _self.opts.zIndexC;

            if(_len>0){
                $('.ao-cover').eq(0).addClass('show');
            }else{
                var html = '<div class="ao-cover show"></div>';
                $('body').append(html);
            }

            // 设置层级
            if(zIndex && parseInt(zIndex)){
                $('body').find('.ao-cover').eq(0).css('zIndex',parseInt(zIndex));
            }

            // 设置背景色
            if( bg && (typeof bg == 'string') ){
                $('body').find('.ao-cover').eq(0).css('background-color',bg);
            }
        },

        /*显示selector弹窗*/
        showPop : function(){
            var _self = this;

            //遮罩层显示
            if(_self.opts.cover){
                _self.cover();
            }; 
            _self.addHtml();
            var _len = $('body').find('.ao-selector').length;
            // 设置alert层级
            if(_self.opts.zIndex && parseInt(_self.opts.zIndex)){
                $('body').find('.ao-selector').eq(_len-1).css('zIndex',parseInt(_self.opts.zIndex));
            }
        },

        /*隐藏弹窗*/
        hidePop : function(){
            var _len = $('body').find('.ao-selector').length;

            $('body').find('.ao-selector').eq(_len-1).remove();
            $('body').find('.ao-cover').eq(0).removeClass('show');

            (typeof callback == 'function') ? callBack() : '';
        },

        addHtml : function(){
            var _self = this,
                html  = null,
                cnt   = '';

            for(var i=0,len=_self.opts.list.length; i<len; i++){
                var _me = _self.opts.list[i],
                    _info = _me.info,
                    _value = _me.value,
                    _select = null;

                _select = _value === _self.opts.v ? 'select' : ''; //是否选中
                cnt += '<li class="'+ _select +'" data-value="'+_value+'">'+_info+'</li>'
            };

            html =  '<div class="ao-selector">'
                    +'  <div class="inner">'
                    +'      <div class="list">'
                    +'          <ul>'
                    +               cnt
                    +'          </ul>'
                    +'      </div>'
                    +'      <div class="box">'
                    +'          <span class="cancel">取消</span>'
                    +'      </div>'
                    +'  </div>'
                    +'</div>';

            $('body').append(html);
        },

    	bindEvent : function(){
    		var _self = this,
                t = null;
            $('body').on('tap','.ao-selector .cancel',function(){
                _self.hidePop(); 
            })
            // 选择
            .on('tap','.ao-selector li',function(){
                var i = $(this).index();
                $(this).siblings('li').removeClass('select');
                $(this).addClass('select');
                t = setTimeout(function(){
                    _self.opts.callback && _self.opts.callback(i);
                    _self.hidePop(); 
                },150)
            })
    	}
    };

    return Selector;
    
});