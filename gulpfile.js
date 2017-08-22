var browserSync  = require('browser-sync').create();
var gulp         = require('gulp');
var fs           = require('fs');
// var sass         = require('gulp-sass');
var sass         = require('gulp-ruby-sass');
var del          = require('del');
// var RevAll       = require('gulp-rev-all');
var autoprefixer = require('gulp-autoprefixer');
// var imagemin     = require('gulp-imagemin');
// var pngquant     = require('imagemin-pngquant');
// var cssBase64    = require('gulp-css-base64');
// var gulpSequence = require('gulp-sequence');
var uglify       = require('gulp-uglify');
var minify       = require('gulp-minify-css');
var htmlmin      = require('gulp-htmlmin');
// var replace      = require('gulp-replace');
// var inlinecss    = require('gulp-inline-css');
// var es           = require('event-stream');
var clean        = require('gulp-clean');         //清空文件夹
var notify       = require('gulp-notify');        //提示信息
// var revCollector = require('gulp-rev-collector'); //路径替换
// var rev          = require('gulp-rev');           //对文件名加MD5后缀
var runSequence  = require('run-sequence');       //同步任务对列

// Static server
gulp.task('serve', serve);
gulp.task('default', ['serve']);
gulp.task('sass', sassEdit);
gulp.task('clear', cleanF);
gulp.task('dist', function(){
    /*************To md5 folder****************/
    //复制压缩html -> dist
    var opt_html = gulp.src('src/*.html')
        .pipe(htmlmin({
            removeComments: true,               //清除HTML注释
            collapseWhitespace: true,           //压缩HTML
            collapseBooleanAttributes: false,   //省略布尔属性的值 <input checked="true"/> ==> <input />
            removeEmptyAttributes: true,        //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,   //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
            minifyJS: true,                     //压缩页面JS
            minifyCSS: true                     //压缩页面CSS
        }))
        .pipe(gulp.dest('dist'))

    //复制压缩css -> dist
    var opt_css = gulp.src('src/css/**')
        .pipe(minify())
        .pipe(gulp.dest('dist/css'));

    //复制images -> dist
    var opt_images = gulp.src('src/images/**')
        .pipe(gulp.dest('dist/images'));

    //复制js -> dist
    var opt_js_c = gulp.src(['src/js/**','!src/js/*.js'])   //公共js
        .pipe(gulp.dest('dist/js'));
});
//js压缩
gulp.task('jsmin', function () {
    gulp.src('src/js/*.js')
        .pipe(uglify({
            mangle: {except: ['require' ,'exports' ,'module' ,'$']},//排除混淆关键字
            compress: true,//类型：Boolean 默认：true 是否完全压缩
            preserveComments: 'all' //保留所有注释
        }))
        .pipe(gulp.dest('dist/js'));
});

//task同步队列任务；
gulp.task('package', function(){
    runSequence('clear', 'dist', 'jsmin');
});

function serve(){
    browserSync.init({
        server: {
            baseDir: "./src",
            index: "login.html",
            online: true
        },
        port:3002
    });

    gulp.watch("./src/sass/**/*.scss", ['sass']).on('change', browserSync.reload);
    gulp.watch("./src/*.html").on('change', browserSync.reload);
    gulp.watch("./src/js/*.js").on('change', browserSync.reload);
}
function sassEdit(){
    return sass('./src/sass/**/*.scss')
       .on('error', sass.logError)
       // .pipe(postcss(processors))
       .pipe(gulp.dest('./src/css'));
}

function cleanF(){
    return gulp.src(['dist'], {read: false})
        .pipe(clean({force: true}))
        // .pipe(notify({ message: 'clean task ok' })); //提示信息
}



