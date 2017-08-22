define(function(require, exports, module) {
    'use strict';

    require('zepto');
    require('touch');
    var AoDialog = require('./plugins/Dialog');
    var Tabs = require('./plugins/Tabs');
    var Selector = require('./plugins/Selector');
    var inputClear = require('./plugins/inputClear');
    var regs = require('./plugins/validators');
    var dataPicker = require('./plugins/datePicker');
    var template = require('template');
    var cookie = require('cookie');

    var urlObj  = {        //接口URL
            pointList : baseApiURL + 'user/point/list',
        };

    //Tabs；
    new Tabs({
        optor : '.tabs',
        cntor : '.my-points',
        callback : function(i){
            
        }
    });

    // 时间选择
    var calendar = new datePicker();
    calendar.init({
        'trigger': '#datePicker', /*按钮选择器，用于触发弹出插件*/
        'type': 'ym',/*模式：date日期；datetime日期时间；time时间；ym年月；*/
        'minDate':'1900-1-1',/*最小日期*/
        'maxDate':'2100-12-31',/*最大日期*/
        'onSubmit':function(){/*确认时触发事件*/
            var theSelectData = calendar.value;
            var _arr = theSelectData.split('-');
            $('#jDate').text(_arr[0] + '年' + parseInt(_arr[1]) + '月');
            getDateIn(); //渲染时间段内数据
        },
        'onClose':function(){/*取消时触发事件*/
        }
    });

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

    //模板渲染
    var renderTpl = function(id,tpl,data){
        var _html = template.render(tpl,data);
        $('#'+id).html(_html);
    }; 

    // 渲染数据
    function getDateIn(){
        var _data = {
                tradeDate : $('#datePicker').val(),
                token : cookie('wxOpenid')
                // tradeType : 1,  //类型: 1 获取, 2 支出 不传则查询全部
            };

        _data = {
            form : JSON.stringify(_data)
        };

        $.ajax({
            url: urlObj.pointList,
            type: "GET",
            data: _data,
            beforeSend : function(){
                AoDialog.loading();
            },
            success: function(data){
                if(data.code == 200 && data.data){
                    var _tradeList = data.data.tradeList,
                        _arr1 = [],  //tradeType == 1
                        _arr2 = [],  //tradeType == 2
                        _total1 = 0,
                        _total2 = 0,
                        _date1 = {},
                        _data2 = {};
                    
                    for(var i=0;i<_tradeList.length;i++){
                        if(_tradeList[i].tradeType == 1){
                            _arr1.push(_tradeList[i]);
                            _total1 += _tradeList[i].tradePoint;
                        }else if($(this).tradeType == 2){
                            _arr2.push(_tradeList[i]);
                            _total2 += _tradeList[i].tradePoint;
                        }
                    };

                    $('#pIn').val(_total1); //总收获积分
                    $('#pOut').val(_total2); //总支出积分

                    _date1.list = _arr1;
                    _date2.list = _arr2;

                    renderTpl('poinsIn','pointListTpl',_date1); 
                    
                    renderTpl('poinsout','pointListTpl',_date2); 
                }else{
                    AoDialog.alert(data.msg || '获取数据失败，请重试');
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
    
    // getDateIn();

    // 绑定事件
    $('body')
    //按钮UI改变
    .on('tap','#datePicker',function(){
        var t=setTimeout(function(){
            $('#datePicker').blur();
        },1);

        $('#datePicker').blur();
    })

})