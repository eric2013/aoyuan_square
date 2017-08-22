
#### 环境
 1. node v6.9.1
 2. cnpm 4.4.0
 3. npm 5.3.0
 4. requirejs 2.3.5
  
#### 技术栈

> [jquery](https://github.com/jquery/jquery)
> [requirejs](https://github.com/requirejs/requirejs)
> [gulp](https://github.com/gulpjs/gulp)

### 安装与运行

```bash
# 安装依赖模块
cnpm install

# 启动服务
gulp

```
### 目录结构
<pre>
.
├── README.md           
├── dist                     // 生成文件目录
│   ├── css                  // css文件
│   ├── images               // 图片文件资源
│   ├── js                   // js文件
├── package.json             // 项目配置文件
├── src                      // 生产目录
│   ├── css                  // css图片资源
│   ├── images               // 图片文件
│   ├── js                   // js文件
│   ├── sass                 // sass文件
│   ├── tpl                  // 模板
│   ├── index.html           // 首页
│   ├── login.html           // 登录
│   └── mybill.html          // 我的帐单
│   └── myself.html          // 个人中心       
│   └── ........             // 其它文件     
├── gulpfile.js              // 项目入口文件
.
</pre>