require.config({
    baseUrl: 'js/',
    paths: {
        // 'jquery': 'common/jquery-1.11.3.min',
        'zepto': 'common/zepto.min',
        'fx': 'common/fx',
        'cookie': 'plugins/cookie',
        'touch': 'common/touch',
        'template': 'common/template' //artTemplate 模板引擎
    },
    shim: { // If the library does not support AMD
        // 'Swiper': {
        //     exports: 'Swiper'
        // }
    }
});
// if (!Function.prototype.bind) {
//     require(['lib/es5-shim/4.0.3/es5-shim']);
// }
// //头部隐藏
// require(['module/common/hideHeader']);

window.baseApiURL = 'http://ayapi.aomygod.com/ay_park_api/';

require(['cookie'], function(cookie){
    // var cookie = require('cookie');
    cookie('wxOpenid','o9_ZkwAgnus-hx5_JQbHkc3fZOgY',30)
});