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
    var cookie = require('cookie');

    var urlObj  = {        //接口URL
            couponDetail : baseApiURL + 'user/coupon/detail'
        };

    // 渲染数据
    function getDateIn(){
        var _data = {
                couponId : '',
                couponType : '',
                token : cookie('wxOpenid')
            };

        _data = {
            form : JSON.stringify(_data)
        };

        $.ajax({
            url: urlObj.couponDetail,
            type: "GET",
            data: _data,
            beforeSend : function(){
                AoDialog.loading();
            },
            success: function(data){
                if(data.code == 200 && data.data){
                    var _result = data.data,
                        _couponType = _result.couponType,
                        _endDate = _result.endDate,
                        _exchangeCode = _result.exchangeCode,
                        _name = _result.name,
                        _notes = _result.notes,
                        _state = _result.state;

                    $('.coupon-name').text(_name);
                    $('.coupon-expire').text('兑奖截止日期：'+_endDate);
                    $('#coupons-code span').text(_exchangeCode);
                    $('.rule-name').text(_name);
                    $('.rule-note').text(_notes);
                    $('.rule-expire').text(_endDate);
                    
                    var _t=_couponType+''+_state;
                    $('.my-coupons a').removeAttr('class');

                    if(_t == 11){
                        $('.my-coupons a').addClass('coupons-obj')
                    }else if(_t == 12){
                        $('.my-coupons a').addClass('coupons-obj-used')
                    }else if(_t == 13){
                        $('.my-coupons a').addClass('coupons-obj-over')
                    }else if(_t == 21){
                        $('.my-coupons a').addClass('coupons-ticket')
                    }else if(_t == 22){
                        $('.my-coupons a').addClass('coupons-ticket-used')
                    }else if(_t == 23){
                        $('.my-coupons a').addClass('coupons-ticket-over')
                    }
                }
            },
            error: function(data){
                AoDialog.alert(data.msg || '获取数据失败，请重试');
            },
            complete:function(){
                AoDialog.removeLoading();
            }
        });
    };

    getDateIn();
    	
})