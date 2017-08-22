define(function(require, exports, module) {
	'use strict';

	require('zepto');
	require('touch');
	var AoDialog = require('./plugins/Dialog');
	var template = require('template');

	var urlObj = {      // 接口URL
		    typeList: baseApiURL + 'goods/page/list'
	    };

	var renderTpl = function(tpl, data) {
		var _html = template.render(tpl, data);
		$('.mall-box').html(_html);
	}
	
	// 渲染页面数据
	function getDataIn() {
		var _data = {
	            form : ''
	        };

		$.ajax({
			url: urlObj.typeList,
			type: "GET",
			data: _data,
			beforeSend : function(){
                AoDialog.loading();
            },
			success: function(data) {
				if(data.code == 200 && data.data) {
					var _typeList = data.data.typeList;
                    console.log("_typeList" + _typeList);
					for(var i=0; i < _typeList.length; i++) {
						renderTpl('typeListTpl', _typeList[i]);
					}
				}else{
					AoDialog.alert(data.msg || "加载数据失败，请重试");
				}
			},
			error: function(data) {
				AoDialog.alert(data.msg || "加载数据失败，请重试");
			},
            complete:function(){
                AoDialog.removeLoading();
            }
		})
	};

	getDataIn();
	
})