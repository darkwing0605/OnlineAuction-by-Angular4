# OnlineAuction-by-Angular4
本项目为基于 Angular 4 的在线竞拍应用

## 使用简介
- 将项目 clone 到本地

- 使用 npm 安装依赖包

- 启动服务器以及客户端，项目运行地址为 `127.0.0.1:4200`

	- 运行 `npm run start` 启动开发模式

	- 运行 `npm run startProd` 启动生产模式

- 代码热更新

- 构建

	- 运行 `ng build` 构建开发模式

	- 运行 `ng build --env=prod` 构建生产模式

## 目录简介
- (build) 如果构建项目将会出现在这个文件夹中

- e2e 端对端测试，本项目中没有使用

- src 项目源码位置

	- app 就是这里了

		- carousel 轮播图组件

		- footer 底部组件

		- home 主页组件

		- navbar 导航组件

		- pipe 管道

		- product-detail 商品详情组件（包括评价以及关注组件）

		- product 商品组件

		- search 搜索组件

		- shared product 服务以及 webSocket 服务

		- stars 星级评价组件

	- assets 静态资源目录，然而本项目图片都是在线的

	- environments 环境配置

**Ps: 本项目的关注后的出价系统为定时器，每两秒加个随机数，无上限**

**Pss: 由于个人经济原因，暂不支持在线预览**

**Psss: 如果谁有什么办法将  nodeJS 服务器运行在  Pages 上，也欢迎联系我~**

[返回 master 分支](https://github.com/darkwing0605/OnlineAuction-by-Angular4/tree/master)

*本项目部分参考 imooc ，图片均来源于网络，如有侵权请联系*
