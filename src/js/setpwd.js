define(function(require, exports, module) {
    'use strict';

    require('zepto');
    require('touch');
    var AoDialog = require('./plugins/Dialog');
    var Tabs = require('./plugins/Tabs');
    var inputClear = require('./plugins/inputClear');
    var regs = require('./plugins/validators');

    var timer  = null,    //验证码定时器
    	per    = 60,      //验证码倒计时
    	urlObj = {   	  //接口URL
    		reset : baseApiURL + 'user/password/reset', //重置密码
            smsCode : baseApiURL + 'user/mobile/verify/sendSms',  //获取短信验证码
            checkImage : baseApiURL + 'user/base/checkImage', //图形验证码验证接口
            getImage : baseApiURL + 'user/base/showCaptcha' //获取图形验证码
    	};

    //inputClear
    new inputClear();

    /*序列化获取参数对象 dependent on .serialize()*/
    var ArgumentObj = function (str) {
        var o = {},
            urlA = str.split('&') || window.location.search.replace(/^[?]/, '').split('&'),
            key = '',
            value = '';

        for (var ia = 0, len = urlA.length; ia < len; ia = ia + 1) {
            if (urlA[ia] !== '') {
                key = urlA[ia].split('=')[0];
                value = urlA[ia].split('=')[1];
                o[key] = decodeURIComponent(value);
            }
        }
        return o;
    };

    //图形验证码获取
    function getImgCode(ele){
        var _data = {
                type : 2  //类型,1:注册,2:忘记密码,3:密码登录,4:短信登录
            };

        _data = {
            form : JSON.stringify(_data)
        };

        $.ajax({
            url: urlObj.getImage,
            type: "GET",
            data: _data,
            beforeSend : function(){
                AoDialog.loading();
            },
            success: function(data){
                if(data.code == 200 && data.data.imageUrl){
                    $(ele).attr('src',data.data.imageUrl)
                }else{
                    AoDialog.err({
                        cnt : data.msg || '获取图形验证码失败，请重试',
                        zIndex : '650',
                        zIndexC : '630',
                        bg : '#fff',
                        bgC : 'rgba(0,0,0,.75)'
                    });
                }
            },
            error: function(data){
                AoDialog.err({
                    cnt : data.msg || '网络错误，请重试',
                    zIndex : '650',
                    zIndexC : '630',
                    bg : '#fff',
                    bgC : 'rgba(0,0,0,.75)'
                });
            },
            complete:function(){
                AoDialog.removeLoading();
            }
        });
    };

    // 图形验证码验证
    function checkImageCode(ele){
        var _v = $(ele).val();

        if(!_v){
            AoDialog.alert({
                cnt : '请输入图形验证码',
                zIndex : '650',
                zIndexC : '630'
            });
            return;
        }

        var _data = {
                captchaCode : _v,
                type : 2
            };

        _data = {
            form : JSON.stringify(_data)
        };

        $.ajax({
            url: urlObj.checkImage,
            type: "GET",
            data: _data,
            beforeSend : function(){
                AoDialog.loading();
            },
            success: function(data){
                if(data.code == 200){
                    var _len = $(body).find('.ao-dialog.prompt').length;
                    $('body').find('.ao-dialog.prompt').eq(_len-1).remove();
                }else{
                    getImgCode('imgCoder');
                    AoDialog.err({
                        cnt : data.msg || '验证码错误，请重试',
                        zIndex : '650',
                        zIndexC : '630',
                        bg : '#fff',
                        bgC : 'rgba(0,0,0,.75)'
                    });
                }
            },
            error: function(data){
                AoDialog.err({
                    cnt : data.msg || '网络错误，请重试',
                    zIndex : '650',
                    zIndexC : '630',
                    bg : '#fff',
                    bgC : 'rgba(0,0,0,.75)'
                });
            },
            complete:function(){
                AoDialog.removeLoading();
            }
        });
    };

    //短信验证码获取
    function getSmsCode(ele,mobile){
        var _data = {
                mobile : mobile,
                type : 2 //类型1:注册,2:忘记密码,4:短信登录
            };

        _data = {
            form : JSON.stringify(_data)
        };

        $.ajax({
            url: urlObj.smsCode,
            type: "GET",
            data: _data,
            beforeSend : function(){
                AoDialog.loading();
            },
            success: function(data){
                console.log('验证码获取成功'); 
            },
            error: function(data){
                AoDialog.alert(data.msg || '验证码获取失败，请重试');
                // $(ele).removeClass('disable').text('获取验证码');
                // clearInterval(timer);
            },
            complete:function(){
                AoDialog.removeLoading();
            } 
        });
    };

	// 验证提示语 
	var msgObj = {
		isPhone : '请输入11位有效手机号码',
		isCaptcha: '请输入6位数字验证码',
		isPassword: '请输入6-16位密码'
	};

	// 需验证对象
	var testObj = {
			form : 'setpwd',
			testor : [
				{
				    name : 'mobile',
				    reg : ['isPhone'],
				},
				{
				    name : 'smsCode',
				    reg : ['isCaptcha'],
				},
				{
				    name : 'password',
				    reg : ['isPassword'],
				}
			] 
	    };

	// 验证方法
    var regTest = function(opts,str){
    	var _arr = opts.testor,
    		_len = _arr.length,
    	    _form = opts.form;

    	for(var i=0;i<_len;i++){
    		var _input = _arr[i].name;
    		var v = $('form[name='+_form+']').find('input[name='+_input+']').val();
    		for (var j=0;j<_arr[i].reg.length;j++){
	    		if(!regs[_arr[i].reg[j]](v)){
	    			str === 'alert' ? AoDialog.alert(msgObj[_arr[i].reg[j]]) : '';
	    			return false;
	    		}
    		}
    	};
    	return true;
    };

    //密码交互
    $('body').on('tap','#eye', function(){
    	var _pwd = '<input type="password" name="password" class="jClear" placeholder="输入密码">',
    		_txt = '<input type="text" name="password" class="jClear" placeholder="输入密码">',
    		$input = $(this).parents('li').find('[name="password"]'),
    		_val = $input.val();

    	if($(this).hasClass('ao-icon-eye-on')){
    		$(this).removeClass('ao-icon-eye-on').addClass('ao-icon-eye-off');
    		$input.remove();
    		$(this).parents('li').find('.cont').append(_pwd);
    		$(this).parents('li').find('[name="password"]').val(_val);
    		
    	}else if($(this).hasClass('ao-icon-eye-off')){
    		$(this).removeClass('ao-icon-eye-off').addClass('ao-icon-eye-on');

    		$input.remove();
    		$(this).parents('li').find('.cont').append(_txt);
    		$(this).parents('li').find('[name="password"]').val(_val);
    	}
    })
    //按钮UI改变
    .on('keyup','input',function(){
    	if( regTest(testObj) ){
    		$('#submit').removeClass('disable')
    	}else{
    		$('#submit').addClass('disable')
    	}
    })
    //获取短信验证码操作
    .on('tap','#getCode',function(){
        if($(this).hasClass('disable')){
            return;
        };

        var _mobile = $('#setpwd [name="mobile"]').val();
        if(!regs.isPhone(_mobile)){
            AoDialog.alert('请先填写手机号码!')
            return;
        };

        //倒计时；
        $('#getCode').addClass('disable').text(per + 'S');
        timer = setInterval(function(){
            if(per<1){
                $("#getCode").removeClass('disable').text('获取验证码');
                clearInterval(timer);
                per = 60;
                return;
            };
            $("#getCode").text(--per + 'S');
        },1000);

        getSmsCode('#getCode',_mobile); //获取短信验证码
    })
    // 刷新验证码
    .on('tap','#imgCoder', function(){
        getImgCode('imgCoder');
    })
    //提交
    .on('tap', '#submit', function(){
    	var form  = $(this).attr('data-form');
    	var $form = $('#'+form);
    	var _data = ArgumentObj($form.serialize());

        _data.source = 'wx';
        // _data.token = '';
        _data.type = 1;

        _data = {
            form : JSON.stringify(_data)
        };

    	if(regTest(testObj,'alert')){
    		$.ajax({
				url: urlObj.reset,
				type: "GET",
				data: _data,
                beforeSend : function(){
                    AoDialog.loading();
                },
				success: function(data){
					if(data && data.code == 200){
                        $('body').find('.wrap').hide();
                        $('body').find('.login-fullbox').show();
                        setTimeout(function(){
                            window.location.href = window.location.host + '/index.html';
                        },3000)
                    }else{
                        if(data.data.sessionId>3){
                            AoDialog.prompt({
                                    classes : ['pic-coder'],
                                    cnt: '<div class="title">请输入下方的图形验证码</div><div class="coder"><input type="text" name="imgcoder"><img id="imgCoder" alt="图形验证码"></div>',
                                    bgC: 'rgba(0,0,0,.75)'
                                },function(){
                                    checkImageCode('input[name="imgcoder"]') //类型,1:注册,2:忘记密码,3:密码登录,4:短信登录
                                },function(){
                                    console.log('prompt 关闭')
                            });
                            getImgCode('#imgCoder'); //获取图形验证码
                        }else{
                            AoDialog.alert(data.msg || '密码重置失败，请重试');
                        }; 
                    }
				},
				error: function(data){
					AoDialog.alert(data.msg || '密码重置失败，请重试');  
				},
                complete:function(){
                    AoDialog.removeLoading();
                }
	        });
    	}

    });


})