define(function(require, exports, module) {
    'use strict';

    require('zepto');
    require('touch');
    var AoDialog = require('./plugins/Dialog');
    var Tabs = require('./plugins/Tabs');
    var template = require('template');
    var cookie = require('cookie');

    var urlObj  = {        //接口URL
            couponlist : baseApiURL + 'user/coupon/list'
        };

    // Tabs切换；
    new Tabs({
        optor : '.tabs',
        cntor : '.my-coupons',
        callback : function(i){
            getDateIn(i+1);
        }
    });

    var renderTpl = function(id,tpl,data){
        var _html = template.render(tpl,data);
        $('#'+id).html(html);
    }; 

    // 渲染数据
    function getDateIn(i){
        var _data = {
                token : cookie('wxOpenid'),
                state : i
            };

        _data = {
            form : JSON.stringify(_data)
        };

        $.ajax({
            url: urlObj.couponlist,
            type: "POST",
            data: _data,
            beforeSend : function(){
                AoDialog.loading();
            },
            success: function(data){
                if(data.code == 200 && data.data){
                    var _rs = data.data;
                    renderTpl('couponList'+i,'couponListTpl', _rs);
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
    getDateIn(1);
    	
})