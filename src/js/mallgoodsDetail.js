define(function(require, exports, module) {
	'use strict';

	require('zepto');
	require('touch');
	var AoDialog = require('./plugins/Dialog');
	var cookie = require('cookie');
	
	var urlObj = {     //接口URL
			goodsDetail : baseApiURL + 'goods/page/detail',
			goodsExchange : baseApiURL + 'goods/page/exchange'
		};

	// location.href = location.href + '?number=456782152225';

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

	//商品兑换操作
	function exchange(){
		var _data = {
				number: GetQueryString('number'),
				token: cookie('wxOpenid')
			};

		_data = {
            form : JSON.stringify(_data)
        };

		$.ajax({
			url: urlObj.goodsExchange,
			type: 'POST',
			data: _data,
			beforeSend : function(){
                AoDialog.loading();
            },
			success: function(data) {
				if(data.code == 200) {
					AoDialog.alert(data.msg || '兑换成功');
					location.href=location.href; //刷新页面
				}else{
					AoDialog.alert(data.msg || '兑换失败，请重试');
				}
			},
			error: function(data) {
				AoDialog.alert(data.msg || '兑换失败，请重试');
			},
            complete:function(){
                AoDialog.removeLoading();
            }
		})
	};

	// 渲染数据
	function getDataIn() {
		var _data = {
	            form : ''
	        };

		$.ajax({
			url: urlObj.goodsDetail,
			type: "GET",
			data: _data,
			beforeSend : function(){
                AoDialog.loading();
            },
			success: function(data) {
				if(data.code == 200 && data.data) {
					var _result = data.data,
					    _buyNotes = _result.buyNotes,
					    _costPoint = _result._costPoint,
					    _effectiveEndDate = _result.effectiveEndDate,
					    _effectiveStartDate = _result._effectiveStartDate,
					    _imgUrl = _result.imgUrl,
					    _limitCount = _result.limitCount,
					    _name = _result.name,
					    _number = _result.number,
					    _storeCount = _result.storeCount;

					// 在页面中更新数据
					$(".goods-img img").src(_imgUrl);
					$(".g-name").text(_name);
					$(".g-date").text("使用有效期：" + _effectiveStartDate + "至" + _effectiveEndDate);
					$(".g-info .point").text(_costPoint);
					$(".g-info .num").text("剩" + _storeCount + "份");
					$(".mall-goods-rule ul").html(_buyNotes);
				}else{
					AoDialog.alert(data.msg || '加载数据失败，请重试');
				}
			},
			error: function(data) {
				AoDialog.alert(data.msg || '加载数据失败，请重试');
			},
            complete:function(){
                AoDialog.removeLoading();
            }
		});
	};
	getDataIn();

	$('body').on('tap', '.btn-def', function() {
		var _point = $('.g-info .point').text(),
		    _name =  $('.g-name').text(),
		    _popCnt = '<h3>兑换确认</h3>'
				    + '<p>您确定要花' + _point + '积分兑换'
				    + '<span class="goods-name">' + _name + '</span>吗？</p>'
				    + '<p class="g-tips">注：一旦积分抵扣成功，不能进行退分、兑现或退款等服务</p>';

		var _opt = {
                classes : ['goods-confirm'],   // 自定义类型，用于需要调整样式的时候
                id : '',
                cnt : _popCnt,  // 弹出框内容，支持text和html
                time : 0,       // 0表示不自动隐藏
                lock : false,   // 锁
                zIndex : '',    // 层级
                cover : true,   // 是否开启遮罩层
                zIndexC : '',   // 遮罩层层级
                bgC : 'rgba(0,0,0,.7)',  // 设置遮罩层背景色，字符串
                btn : { ok:'立即兑换' },
                close : true
            };

        AoDialog.pop(_opt, exchange);
	})
})