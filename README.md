## 一个简单的图片处理网站

![Language:JavaScript](https://img.shields.io/badge/Language-Javascript-yellow.svg?style=flat)
![Language:Node](https://img.shields.io/badge/Language-Node-green.svg?style=flat)
![Database:MongoDB](https://img.shields.io/badge/Database-MongoDB-green.svg?style=flat)
![License:GPL](https://img.shields.io/badge/License-GPL-blue.svg?style=flat)


![home](https://github.com/luosijie/Front-end-Blog/blob/master/img/a.PNG?raw=true)


## 提交日志
2017-6-18 9：25 修复网站只能注册一个用户的问题


## 安装
1. 安装MongoDB并成功启动
2. git clone "https://github.com/luosijie/card"
3. npm install
4. npm start
5. 访问 localhost:3000

## 实现功能
```
通过管理员编辑上传名片模板
可以让用户在线编辑并下载png格式图片直接打印
```
1. 登录注册
2. 图片简单处理
3. 名片模板的上传和保存
4. 名片图片的打包和下载
4. 名片模板收藏
5. MongoDB数据增删改查

## 使用到的插件
1. html2Canvas 用于将html解析为图片
2. jsZip 用于图片打包
3. fileSaver 用于导出打包后的zip文件

## 网站的不足
1. 代码组织比较乱 ———— 哪天心情好再来整理
2. 没有兼容浏览器，目前只谷歌 火狐可以正常访问 ———— 人生苦短，我不兼容
3. 没有管理后台 ———— 这是一个比较大的问题

## 项目结构

![structure](https://github.com/luosijie/Front-end-Blog/blob/master/img/structure.PNG?raw=true)

## 项目部分截图
#### 首页
模板列表用hbs模板渲染

![structure](https://github.com/luosijie/Front-end-Blog/blob/master/img/home.PNG?raw=true)

#### 用户编辑页
看起来简单的页面结果花的时间最多

![structure](https://github.com/luosijie/Front-end-Blog/blob/master/img/edit.PNG)

#### 管理员上传模板
注意：这个页面的权限只有 **用户名为admin** 才可以访问，没办法就是这么不科学

![structure](https://github.com/luosijie/Front-end-Blog/blob/master/img/upload.PNG?raw=true)

#### 个人中心
我的收藏列表和基本账户设置

![personal](https://github.com/luosijie/Front-end-Blog/blob/master/img/personal.PNG?raw=true)


> 欢迎star

