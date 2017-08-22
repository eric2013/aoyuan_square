define(function(require, exports, module) {
    'use strict';

	var regs = {
		// 为空
		isRequired : function(v){
			return v ? true : false; 
		},

		// 姓名
		isName : function(v){
			return /^[a-zA-Z\u4e00-\u9fa5 ·]{2,20}$/.test(v);
		},

		// 是身份证
		isIdCodeValid : function(code){
	        var pass = true;
	        var city = {11: 1, 12: 1, 13: 1, 14: 1, 15: 1, 21: 1, 22: 1, 23: 1, 31: 1, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 41: 1, 42: 1, 43: 1, 44: 1, 45: 1, 46: 1, 50: 1, 51: 1, 52: 1, 53: 1, 54: 1, 61: 1, 62: 1, 63: 1, 64: 1, 65: 1, 71: 1, 81: 1, 82: 1, 91: 1};
	        if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
	            // 身份证号格式错误
	            pass = false;
	        } else if (!city[code.substr(0, 2)]) {
	            // 地址编码错误
	            pass = false;
	        } else {
	            // 18位身份证需要验证最后一位校验位
	            if (code.length == 18) {
	                code = code.split('');
	                // ∑(ai×Wi)(mod 11)
	                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 加权因子
	                var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2]; // 校验位
	                var sum = 0, ai = 0, wi = 0;
	                for (var i = 0; i < 17; i++) {
	                    ai = code[i];
	                    wi = factor[i];
	                    sum += ai * wi;
	                }
	                var last = parity[sum % 11];
	                if (parity[sum % 11] != code[17]) {
	                    // 校验位错误
	                    pass = false;
	                }
	            }
	        }
	        return pass;
	    },

	    // 是电话号码
	    isTell : function(v){
	    	return /^(\d{3,4}-?)?\d{7,9}$/.test(v)	
	    },

	    // 是用户名->用户名为手机号码
	    isUsername : function(v){
	    	return /^(\d{3,4}-?)?\d{7,9}$/.test(v)	
	    },

	    // 是手机号码
	    isPhone : function(v){
	    	return /^1[0-9]{10}$/.test(v)
	    },

	    // 是邮箱
	    isEmail: function(text){
            return /^(\w)+(\W\w+)*@(\w)+(-\w+)*((\.\w+)+)$/.test(text)
        },

        //是数字
        isNum: function(v){
        	return /[0-9]*/g.test(v)
        	// return (typeof v === "number");
        },

        //6位数字验证码
        isCaptcha: function(v){
        	return /[0-9]*/g.test(v) && v.length === 6;
        },

        //长度验证(不考虑中文)
        isLong: function(){
        	var _len = arguments[0].length;

        	if(arguments.length == 2 && arguments[1] > 0){
        		return (_len < arguments[1])
        	}else if(arguments.length>2 && arguments[1] > 0 && arguments[2] > 0 ){
        		var min = arguments[1]>arguments[2] ? arguments[2] : arguments[1];
        		var max = arguments[1]>arguments[2] ? arguments[1] : arguments[2];

        		return ( _len>min && _len<max )
        	};
        },

        // 特殊字符
        isNoneMalformed : function(v){
        	return !/[`~!@#$^&*()=|{}'":;,.<>/?！￥…（）—|【】‘；：“”。，、？%+ 　\\]/.test(v);
        },

        // 是否为密码 6-16位数字，英文
        isPassword: function(text){
            return /^([a-zA-Z0-9_]+)$/.test(text) && text.length >= 6 && text.length <= 16 ;
        },
	};

	return regs;    
})