//引入gulp
const gulp = require('gulp');
const {src,dest,series,parallel,watch} = gulp;
//引入插件
const concat = require('gulp-concat');//合并js文件
const ugilfy = require('gulp-uglify');//压缩js文件
const rename = require('gulp-rename');//文件重命名
const concatCSS = require('gulp-concat-css');//合并css文件
const cleanCSS = require('gulp-clean-css');//压缩css文件
const liveReload = require("gulp-livereload");//监视文件
const htmlMin = require('gulp-htmlmin');//压缩HTML文件


//以下是老版本的
//注册任务
// gulp.task('js',function() {
//     //配置任务操作
//     return code...
// });
// //注册默认任务
// gulp.task('default',['js']);

//新版本
//创建任务
function buildJS() {
    //返回执行操作
    return src('./src/js/**/*.js')//查找源文件
    .pipe(concat('build.js'))//合并文件
    .pipe(ugilfy())//压缩js文件
    .pipe(rename({
        //目录
        // dirname: "main/text/ciao",
        //中缀名
        // basename: "aloha",
        //前缀名
        // prefix: "bonjour-",
        //后缀名
        suffix:".min",
        //扩展名
        // extname: ".md"
    }))//重命名
    .pipe(dest('./dist/js/'))//输出到目标文件
    .pipe(liveReload())//实时刷新
};
//创建合并压缩css任务
function buildCSS() {
    return src('./src/css/**/*.css')//查找源文件
    .pipe(concatCSS('build.css'))//合并css文件
    .pipe(cleanCSS())//压缩css文件
    .pipe(rename({//重命名css文件
        suffix:'.min'
    }))
    .pipe(dest('./dist/css/'))//输出到目录
    .pipe(liveReload())//实时刷新

}
//创建压缩HTML任务
function buildHTML() {
    return src('./index.html')
    .pipe(htmlMin({
        collapseWhitespace:true//清除空白
    }))
    .pipe(dest('./dist/'))
    .pipe(liveReload())//实时刷新

}
//创建监视任务
function Watch() {
    //开启监听
    liveReload.listen();
    //绑定监听文件和监听执行任务
    watch('./src/js/**/*.js',{events:'all'},buildJS);
    watch('./src/css/**/*.css',{events:'all'},buildCSS);
    watch('./index.html',{events:'all'},buildHTML);
}
//注册任务
exports.buildJS = buildJS;
exports.buildCSS = buildCSS;
exports.buildHTML = buildHTML;
exports.Watch = Watch;
//注册默认组合任务
//顺序组合任务(同步)
// exports.default =  series(buildCSS,buildJS);
//并行组合任务(异步)
exports.default = series(parallel(buildJS,buildCSS,buildHTML),Watch);