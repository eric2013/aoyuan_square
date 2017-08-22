define(function(require, exports, module) {
    'use strict';

    require('zepto');
    require('touch');
    var AoDialog = require('./plugins/Dialog');
    var Tabs = require('./plugins/Tabs');
    var Selector = require('./plugins/Selector');
    var inputClear = require('./plugins/inputClear');
    var regs = require('./plugins/validators');
    var laytpl = require('layTpl');

    var urlObj  = {        //接口URL
            userInfo : baseApiURL + 'user/info/detail',
            userInfoEdit : baseApiURL + 'user/info/save',
        };

    var tool = new Selector();

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

    // 渲染数据
    function getDateIn(){
        var _data = {
                token : cookie('wxOpenid')
            };

        _data = {
            form : JSON.stringify(_data)
        };

        $.ajax({
            url: urlObj.userInfo,
            type: "GET",
            data: _data,
            beforeSend : function(){
                AoDialog.loading();
            },
            success: function(data){
                if(data.code == 200 && data.data){
                    var _bz = data.data.bz,
                        _name = data.data.name,
                        _sex = data.data.sex,
                        _sfid = data.data.sfid,
                        _username = data.data.username;

                    $('#myself').find('input[name="name"]').val(_name);
                    $('#myself').find('input[name="username"]').val(_username);
                    $('#myself').find('input[name="sex"]').val(_sex);
                    $('#myself').find('input[name="sfid"]').val(_sfid);
                    $('#myself').find('input[name="bz"]').val(_bz);

                    if(_sex == 1){
                        $('#myself').find('.sex').text('男');
                    }else if(_sex == 2){
                        $('#myself').find('.sex').text('女');
                    }else{
                        $('#myself').find('.sex').text('');
                    }
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

    $('body')
    //按钮UI改变
    .on('keyup','input',function(){
        // 输入身份证时 x -> X;
        if($(this).attr('name') === 'sfid'){
            $(this).val($(this).val().replace('x','X'));
        };

    	if( regTest(testObj) ){
    		$('#submit').removeClass('disable')
    	}else{
    		$('#submit').addClass('disable')
    	}
    })
    //性别选择
    .on('tap', '.sex', function(){
        var _v = $('[name="sex"]').val();

        tool.init({
            v : _v,
            list : [
                {
                    info :'男',
                    value : '1',
                },
                {
                    info :'女',
                    value : '2',
                }
            ],
            callback : function(i){
                var _list = this.list;
                $('.sex').text(_list[i].info);
                $('[name="sex"]').val(_list[i].value);
            }
        });
    })
    //提交
    .on('tap', '#submits', function(){
        var _data = null;

        var _sfid = $('#myself').find('input[name="sfid"]').val();

        if( _sfid != '' && !regs.isIdCodeValid(_sfid)){
            AoDialog.alert('请输入18位有效身份证号码');
            return;
        }

        _data = {
            bz : $('#myself').find('input[name="bz"]').val(),
            sex: $('#myself').find('input[name="sex"]').val(),
            sfid : $('#myself').find('input[name="sfid"]').val(),
            token : cookie('wxOpenid')
        };
        
        _data = {
            form : JSON.stringify(_data)
        };

		$.ajax({
			url: urlObj.userInfoEdit,
			type: "POST",
			data: _data,
            beforeSend : function(){
                AoDialog.loading();
            },
			success: function(data){
                if(data && data.code==200){
				    window.location.href = window.location.href
                }else{
                    AoDialog.alert(data.msg || '保存失败，请重试');
                }
			},
			error: function(data){
				AoDialog.alert(data.msg || '保存失败，请重试');
			},
            complete:function(){
                AoDialog.removeLoading();
            }
        })
    });

})