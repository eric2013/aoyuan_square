define(function(require, exports, module) {
    'use strict';

    require('zepto');
    var cookie = require('cookie');
    
    cookie('wxOpenid','o9_ZkwAgnus-hx5_JQbHkc3fZOgY',30);

    var wxOpenid=cookie('wxOpenid');  
    var mobile=cookie('mobile');
    var curURL=location.href;

    //获取URL中参数
    function GetQueryString(name){  
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
	    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
	    var context = "";  
	    if (r != null)  
	        context = r[2];  
	    reg = null;  
	    r = null;  
	    return context == null || context == "" || context == "undefined" ? "" : context;  
	};

	//获取用户信息，确认用户是否登录  
    function getlogininfo(wxOpenid){
        // alert('获取用户信息');
        console.log('获取用户信息');

    	if(mobile != null && mobile != ''){
    		cookie('mobile', cookie('mobile'), 30);
    		return;
    	};

    	var _data = { 
    			token : wxOpenid 
    		};
    	
    	_data = {
            form : JSON.stringify(_data)
        };

        $.ajax({
            url: baseApiURL + 'user/login',  
            data: _data,
            type:'GET',
            success: function(result){                     
                if (result.code==200){
                    cookie('mobile', result.data.userInfo.mobile, 30);
                    location.href = curURL; //跳转至首页(我的会员卡)
                }else if(result.code==5001){
                    location.href = 'http://aypark.aomygod.com/login.html'; //跳转至登录页
                }else if(result.code==5006){
                    location.href = 'http://aypark.aomygod.com/register.html'; //跳转至注册页
                }else{
                	alert(result.msg || '网络错误，请重试')
                }
            }
        });
    };

    if(wxOpenid==null || wxOpenid==''){
        console.log('wxOpenid为空');
        // alert('wxOpenid为空');

    	var access_code=GetQueryString('code');

        if(access_code==null || access_code==''){
            console.log('access_code为空');
            // alert('access_code为空');

            var url='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf182e91b5d8b8e6d&redirect_uri=' + encodeURIComponent(curURL) +'&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
            location.href=url;
        }else{
            console.log('access_code不为null');
            // alert('access_code不为空');

            $.ajax({  
                url: 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxf182e91b5d8b8e6d&secret=96e62568baf40b620b7522fe8652a816&code='+access_code+'&grant_type=authorization_code',   
                type:'GET',  
                success:function(result){                   
                    if (result!=null && result.openid!=""){
                        cookie('wxOpenid', result.openid, 30);                             
                        getlogininfo(result.openid);  
                    }else{  
                        location.href=location.href;  
                        alert('微信身份识别失败:'+result.errmsg);  
                    }  
                }
            });      
        }  
    }else{

        console.log('wxOpenid不为空'); 
        console.log('wxOpenid：',wxOpenid);
        // alert('wxOpenid不为空');

        getlogininfo(wxOpenid);  
    } 
})