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