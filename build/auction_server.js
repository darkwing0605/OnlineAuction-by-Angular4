"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var path = require("path");
var app = express();
var Product = /** @class */ (function () {
    function Product(id, title, price, rating, desc, categories) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.rating = rating;
        this.desc = desc;
        this.categories = categories;
    }
    return Product;
}());
exports.Product = Product;
var Comment = /** @class */ (function () {
    function Comment(id, productId, timestamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
var products = [
    new Product(1, "第一个商品", 1.99, 2.5, "这是第一个商品", ["电子产品", "硬件"]),
    new Product(2, "第二个商品", 2.99, 1.5, "这是第二个商品", ["电子产品", "软件"]),
    new Product(3, "第三个商品", 5.99, 3.5, "这是第三个商品", ["硬件"]),
    new Product(4, "第四个商品", 10.99, 4.5, "这是第四个商品", ["食品"]),
    new Product(5, "第五个商品", 20.99, 4, "这是第五个商品", ["图书"]),
    new Product(6, "第六个商品", 80.99, 0.5, "这是第六个商品", ["猫粮"]),
    new Product(7, "第七个商品", 3000.99, 5, "这是第七个商品", ["电子产品", "图书"]),
    new Product(8, "第八个商品", 11.99, 3, "这是新增第八个商品", ["水杯", "日用商品"]),
    new Product(9, "第九个商品", 30000, 4.5, "这是新增第九个商品", ["化妆品"])
];
var comments = [
    new Comment(1, 1, "2017-01-01 11:11:11", "张一", 3, "东西不错*1"),
    new Comment(2, 1, "2017-02-02 22:22:22", "张二", 1, "东西不错*2"),
    new Comment(3, 1, "2017-03-03 22:22:33", "张三", 5, "东西不错*3"),
    new Comment(4, 1, "2017-04-04 11:11:44", "张四", 2, "东西不错*4"),
    new Comment(5, 2, "2017-05-05 11:55:11", "张五", 4, "东西不错*5")
];
app.use('/', express.static(path.join(__dirname, '..', 'client')));
app.get('/api/products', function (req, res) {
    var result = products;
    var params = req.query;
    if (params.title) {
        result = result.filter(function (p) { return p.title.indexOf(params.title) !== -1; });
    }
    if (params.price && result.length > 0) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price); });
    }
    if (params.category && result.length > 0) {
        if (params.category !== "-1") {
            result = result.filter(function (p) { return p.categories.indexOf(params.category) !== -1; });
        }
    }
    res.json(result);
});
app.get('/api/product/:id', function (req, res) {
    res.json(products.find(function (product) { return product.id == req.params.id; }));
});
app.get('/api/product/:id/comments', function (req, res) {
    res.json(comments.filter(function (comment) { return comment.productId == req.params.id; }));
});
var server = app.listen(4201, function () {
    console.log("服务器已启动，地址是：http://127.0.0.1:4201");
});
// 客户端, 商品ID
var subscriptions = new Map();
var wsServer = new ws_1.Server({ port: 4202 });
wsServer.on("connection", function (websocket) {
    websocket.on("message", function (message) {
        var messageObj = JSON.parse(message);
        var productIds = subscriptions.get(websocket) || [];
        subscriptions.set(websocket, productIds.concat([messageObj.productId]));
    });
});
// 商品ID, 价格
var currentBids = new Map();
// 为了例子简单，这里模拟出价
setInterval(function () {
    products.forEach(function (p) {
        var currentBid = currentBids.get(p.id) || p.price;
        var newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });
    subscriptions.forEach(function (productIds, ws) {
        if (ws.readyState === 1) {
            var newBids = productIds.map(function (pid) { return ({
                productId: pid,
                bid: currentBids.get(pid)
            }); });
            ws.send(JSON.stringify(newBids));
        }
        else {
            subscriptions.delete(ws);
        }
    });
}, 2000);
