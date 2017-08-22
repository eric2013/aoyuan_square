define(function(require, exports, module) {
    'use strict';

    require('zepto');
    
    var AoDialog = {
    	/*cover 遮罩层 参数1为bg,2为zIndex*/
    	cover : function(bg,zIndex){
            var html = '<div class="ao-cover show"></div>';
            $('body').append(html);
    		var _len = $('body').find('.ao-cover').length;
			// 设置层级
			if(zIndex && parseInt(zIndex)){
				$('body').find('.ao-cover').eq(_len-1).css('zIndex',parseInt(zIndex));
			}
            console.log('bg:', bg);
			// 设置背景色
			if( bg && (typeof bg == 'string') ){
				$('body').find('.ao-cover').eq(_len-1).css('background-color',bg);
			}
    	},

        //loading
        loading: function(bg, zIndex){
            var _html = '<div class="ao-loading"><div class="typing_loader"></div></div>'
            $('body').append(_html);

            // 设置层级
            if(zIndex && parseInt(zIndex)){
                $('body').find('.ao-loading').eq(0).css('zIndex',parseInt(zIndex));
            }

            // 设置背景色
            if( bg && (typeof bg == 'string') ){
                $('body').find('.ao-loading').eq(0).css('background-color',bg);
            }
        },

        //移除loading
        removeLoading: function(){
            $('body').find('.ao-loading').remove();
        },

        /*显示弹窗*/
        showPop : function(_opt, str){
            var _self = this;

            //遮罩层显示
            if(_opt.cover){
                _self.cover(_opt.bgC, _opt.zIndexC);
            }; 

            var _class = _opt.classes.join(' '),
                _idAttr = _opt.id ? 'id="'+ _opt.id +'"' : '';

            //字符串拼接alert弹出层
            var selfCnt = '';
            if(str === 'confirm'){
                selfCnt = '<div class="msg">'+_opt.cnt+'</div>' 
                        + '<div class="btnbox"><a class="btn-no">'
                        + _opt.btn.no
                        + '</a><a class="btn-ok"><div>'
                        + _opt.btn.ok
                        + '</div></a></div>'
            }else if(str === 'pop'){
                var closeBtn = _opt.close ? '<div class="close"><i class="ao-icon ao-icon-cha"></i></div>' : ''; //关闭按钮叉
                selfCnt = '<div class="msg">'+_opt.cnt+'</div>' 
                        + '<div class="btnbox"><a class="btn-ok">'
                        + _opt.btn.ok
                        + '</a></div>'
                        + closeBtn
            }else if(str === 'prompt'){
                var closeBtn = _opt.close ? '<div class="close"><i class="ao-icon ao-icon-cha"></i></div>' : ''; //关闭按钮叉
                selfCnt = '<div class="msg">'+_opt.cnt+'</div>' 
                        + '<div class="btnbox"><a class="btn-ok">'
                        + _opt.btn.ok
                        + '</a></div>'
                        + closeBtn
            }else if(str === 'err'){
                selfCnt = '<i class="ao-icon ao-icon-err"></i>'+_opt.cnt
            }else if(str === 'ok'){
                selfCnt = '<i class="ao-icon ao-icon-ok"></i>'+_opt.cnt
            }else{
                selfCnt = _opt.cnt
            };

            var _html = '<div class="ao-dialog show ' + str + ' '+_class + '" '+ _idAttr +'>'
                        +   '<div class="inner">'
                        +       '<div class="cnt">'
                        +           selfCnt        
                        +       '</div>'
                        +   '</div>'
                        + '</div>';

            // var _len = $('body').find('.ao-dialog').length;

            // if(_len>0){
            //     $('body').find('.ao-dialog').remove();
            // };
            $('body').append(_html);

            var _len = $('body').find('.ao-dialog').length;

            // 设置alert层级
            if(_opt.zIndex && parseInt(_opt.zIndex)){
                $('body').find('.ao-dialog').eq(_len-1).css('zIndex',parseInt(_opt.zIndex));
            }

            // 设置背景色
            if( _opt.bg && (typeof _opt.bg == 'string') ){
                $('body').find('.ao-dialog').eq(_len-1).css('background-color',_opt.bg);
            }

            // 遮罩层，当time>0时 pop窗移除
            if(_opt.time>0){
                _self.hidePop(_opt.time,_opt.callback);
            }
        },

        /*隐藏弹窗*/
        hidePop : function(time,callback){
            var t = setTimeout(function(){
                var _len1 = $('body').find('.ao-dialog').length,
                    _len2 = $('body').find('.ao-cover').length;

                $('body').find('.ao-dialog').eq(_len1-1).remove();
                $('body').find('.ao-cover').eq(_len2-1).remove();

                (typeof callback == 'function') ? callback() : '';
            },time);
        },

    	/*alert*/
    	alert : function(opts, callback){
    		var _self = this;
    		var _opt = {
    			classes : [''],
    			id : '',
    			cnt : '',		// 弹出框内容，支持text和html
    			time : 3000,    // 0表示不自动隐藏
    			lock : false,	// 锁
    			zIndex : '',	// 层级
    			cover : true,   // 是否开启遮罩层
    			zIndexC : '',	// 遮罩层层级
    			bgC : 'transparent',  // 设置遮罩层背景色，字符串
    			callBack : function(){
					callback&&callback();
				} 
    		};

    		(typeof opts == 'string') ? _opt.cnt = opts : _opt = $.extend({}, _opt, opts);

    		_self.showPop(_opt, 'alert');
    	},

        /*toast*/
        toast : function(opts, callback){
            var _self = this;
            var _opt = {
                classes : [''],
                id : '',
                cnt : '',       // 弹出框内容，支持text和html
                time : 3000,    // 0表示不自动隐藏
                lock : false,   // 锁
                zIndex : '',    // 层级
                cover : true,   // 是否开启遮罩层
                zIndexC : '',   // 遮罩层层级
                bgC : 'transparent',  // 设置遮罩层背景色，字符串
                callBack : function(){
                    callback&&callback();
                } 
            };

            (typeof opts == 'string') ? _opt.cnt = opts : _opt = $.extend({}, _opt, opts);

            _self.showPop(_opt, 'toast');
        },

        /*ok*/
        ok : function(opts, callback){
            var _self = this;
            var _opt = {
                classes : [''],
                id : '',
                cnt : '',       // 弹出框内容，支持text和html
                time : 3000,    // 0表示不自动隐藏
                lock : false,   // 锁
                zIndex : '',    // 层级
                cover : true,   // 是否开启遮罩层
                zIndexC : '',   // 遮罩层层级
                bg : '',
                bgC : 'transparent',  // 设置遮罩层背景色，字符串
                callBack : function(){
                    callback&&callback();
                } 
            };

            (typeof opts == 'string') ? _opt.cnt = '<i class="ao-icon ao-icon-ok"></i>'+opts : _opt = $.extend({}, _opt, opts);

            _self.showPop(_opt, 'ok');
        },

        /*err*/
        err : function(opts, callback){
            var _self = this;
            var _opt = {
                classes : [''],
                id : '',
                cnt : '',       // 弹出框内容，支持text和html
                time : 3000,    // 0表示不自动隐藏
                lock : false,   // 锁
                zIndex : '',    // 层级
                cover : true,   // 是否开启遮罩层
                zIndexC : '',   // 遮罩层层级
                bg : '',
                bgC : 'transparent',  // 设置遮罩层背景色，字符串
                callBack : function(){
                    callback&&callback();
                } 
            };

            (typeof opts == 'string') ? _opt.cnt = opts : _opt = $.extend({}, _opt, opts);

            _self.showPop(_opt, 'err');
        },

        /*confirm*/
        confirm : function(opts, okFun, noFun){
            var _self = this;
            var _opt = {
                classes : [''],
                id : '',
                cnt : '',       // 弹出框内容，支持text和html
                time : 0,    // 0表示不自动隐藏
                lock : false,   // 锁
                zIndex : '',    // 层级
                cover : true,   // 是否开启遮罩层
                zIndexC : '',   // 遮罩层层级
                bgC : '',  // 设置遮罩层背景色，字符串
                btn : { ok:'确定', no:'取消' }
            };

            (typeof opts == 'string') ? _opt.cnt = opts : _opt = $.extend(true, {}, _opt, opts);

            _self.showPop(_opt, 'confirm');

            $('body')
            .off('tap','.btn-ok')
            .off('tap','.btn-no')
            .on('tap','.btn-ok',function(){
                _self.hidePop(10,okFun)
            }).on('tap','.btn-no',function(){
                _self.hidePop(10,noFun)
            })
        },

        /*pop*/
        pop : function(opts, okFun, noFun){
            var _self = this;
            var _opt = {
                classes : [''],
                id : '',
                cnt : '',       // 弹出框内容，支持text和html
                time : 0,       // 0表示不自动隐藏
                lock : false,   // 锁
                zIndex : '',    // 层级
                cover : true,   // 是否开启遮罩层
                zIndexC : '',   // 遮罩层层级
                bgC : '',  // 设置遮罩层背景色，字符串
                btn : { ok:'确定' },
                close : true
            };

            (typeof opts == 'string') ? _opt.cnt = opts : _opt = $.extend(true, {}, _opt, opts);

            _self.showPop(_opt, 'pop');

            $('body')
            .off('tap','.btn-ok')
            .off('tap','.close')
            .on('tap','.btn-ok',function(){
                _self.hidePop(10,okFun)
            })
            .on('tap','.close',function(){
                _self.hidePop(10,noFun)
            })
        },

        /*prompt*/
        prompt : function(opts, okFun, noFun){
            var _self = this;
            var _opt = {
                classes : [''],
                id : '',
                cnt : '',       // 弹出框内容，支持text和html
                time : 0,    // 0表示不自动隐藏
                lock : false,   // 锁
                zIndex : '',    // 层级
                cover : true,   // 是否开启遮罩层
                zIndexC : '',   // 遮罩层层级
                bgC : '',  // 设置遮罩层背景色，字符串
                btn : { ok:'确定' },
                close : true
            };

            (typeof opts == 'string') ? _opt.cnt = opts : _opt = $.extend(true, {}, _opt, opts);

            _self.showPop(_opt, 'prompt');

            $('body')
            .off('tap','.btn-ok')
            .off('tap','.close')
            .on('tap','.btn-ok',okFun)
            .on('tap','.close',function(){
                _self.hidePop(10,noFun)
            })
        }
    }

    return AoDialog;
})