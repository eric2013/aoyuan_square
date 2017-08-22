define(function(require, exports, module) {
    'use strict';

    require('zepto');
    require('touch');
    var AoDialog = require('./plugins/Dialog');
    var Tabs = require('./plugins/Tabs');
    var Selector = require('./plugins/Selector');
    var inputClear = require('./plugins/inputClear');
    var regs = require('./plugins/validators');
    var template = require('template');
    var wx = require('http://res.wx.qq.com/open/js/jweixin-1.0.0.js');

    var urlObj  = {        //接口URL
            memberInfo : baseApiURL + 'user/info/index',
            wxcfg: 'http://wx.aomygod.com/wechat/getJssdkSign'
        };

    var isWeixin = function(){
        //判断是否是微信浏览器
        var ua = navigator.userAgent.toLowerCase();
        // ua.substring(ua.lastIndexOf("/") + 1)
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            //判断是否为微信浏览器并且版本6.0或以上
            return true;
        } else {
            return false;
        }
    };

    //wx config 参数获取
    if(isWeixin){
        $.ajax({
            url: urlObj.wxcfg,
            type: "GET",
            data: {
                callback : 123, //无意义，只是传个callback参数
                url : location.href
            },
            success: function(data){
                if(data.error == 0 && data.data){
                    //初始化微信接口配置
                    wx.config({
                        debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data.data.appId, // 必填，公众号的唯一标识
                        timestamp: data.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.data.nonceStr, // 必填，生成签名的随机串
                        signature: data.data.signature,// 必填，签名，见附录1
                        jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                    });
                }else{
                    AoDialog.alert(data.msg || '数据获取失败，请重试');
                }
            },
            error: function(data){
                AoDialog.alert(data.msg || '数据获取失败，请重试');
            }
        });
    }

    // wx接口检测
    wx.checkJsApi({
        jsApiList: ['scanQRCode'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function(res) {
            console.log('checkJsApi-res: ', res)
        }
    });
    
    // wx需ready调用操作
    wx.ready(function(){
        
    });

    // 错误输出
    wx.error(function(res){
        console.log(res);
    });


    // 渲染数据
    function getDateIn(){
        var _data = {
                form : ''
            };

        $.ajax({
            url: urlObj.memberInfo,
            type: "GET",
            data: _data,
            beforeSend : function(){
                AoDialog.loading();
            },
            success: function(data){
                if(data.code == 200 && data.data){
                    $('#mypoint').text(data.data.calUserPoint);
                    $('#mycard').text(data.data.couponCount)
                }else{
                    AoDialog.alert(data.msg || '数据获取失败，请重试');
                }
            },
            error: function(data){
                AoDialog.alert(data.msg || '数据获取失败，请重试');
            },
            complete:function(){
                AoDialog.removeLoading();
            }
        });
    };
    // getDateIn();

    //事件
    $('body').on('tap','#scanQRCode',function(){
        wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
                var result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                console.log('scanQRCode-res: ', res);
            }
        });
    })
})