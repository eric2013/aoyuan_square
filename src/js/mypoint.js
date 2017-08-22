define(function(require, exports, module) {
	'use strict';

	require('zepto');
	require('touch');
	var AoDialog = require('./plugins/Dialog');
	var cookie = require('cookie');

	var urlObj = {     // 接口url
			pointLeft: baseApiURL + 'user/point/left'
		};

	function getDataIn() {
		var _data = {
				token: cookie('wxOpenid')
			};

		_data = {
            form : JSON.stringify(_data)
        };

		$.ajax({
			url: urlObj.pointLeft,
			type: "GET",
			data: _data,
			beforeSend : function(){
                AoDialog.loading();
            },
			success: function(data) {
				if(data.code == 200 && data.data) {
					var _leftPoint = data.data.leftPoint;

					$("#point").text(_leftPoint);
				}
			},
			error: function(data) {
				AoDialog.alert(data.msg || "获取积分失败，请重试");
			},
            complete:function(){
                AoDialog.removeLoading();
            }
		})
	};

	getDataIn();

})