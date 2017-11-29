import * as express from 'express';
import {Server} from 'ws';
import * as path from 'path';

const app = express();

export class Product {

	constructor(
		public id: number,
		public title: string,
		public price: number,
		public rating: number,
		public desc: string,
		public categories: Array<string>
	){}
}

export class Comment {
	constructor(
		public id: number,
		public productId: number,
		public timestamp: string,
		public user: string,
		public rating: number,
		public content: string
	){}
}

const products: Product[] = [
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

const comments: Comment[] = [
	new Comment(1, 1, "2017-01-01 11:11:11", "张一", 3, "东西不错*1"),
	new Comment(2, 1, "2017-02-02 22:22:22", "张二", 1, "东西不错*2"),
	new Comment(3, 1, "2017-03-03 22:22:33", "张三", 5, "东西不错*3"),
	new Comment(4, 1, "2017-04-04 11:11:44", "张四", 2, "东西不错*4"),
	new Comment(5, 2, "2017-05-05 11:55:11", "张五", 4, "东西不错*5")
];

app.use('/', express.static(path.join(__dirname, '..', 'client')));

app.get('/api/products', (req, res) => {
	let result = products;
	let params = req.query;
	if (params.title) {
		result = result.filter((p) => p.title.indexOf(params.title) !== -1);
	}
	if (params.price && result.length > 0) {
		result = result.filter((p) => p.price <= parseInt(params.price));
	}
	if (params.category && result.length > 0) {
		if (params.category !== "-1") {
			result = result.filter((p) => p.categories.indexOf(params.category) !== -1);
		}
	}

	res.json(result);
});

app.get('/api/product/:id', (req, res) => {
	res.json(products.find((product) => product.id == req.params.id));
});

app.get('/api/product/:id/comments', (req, res) => {
	res.json(comments.filter((comment: Comment) => comment.productId == req.params.id));
});

const server = app.listen(4201, () => {
	console.log("服务器已启动，地址是：http://127.0.0.1:4201");
});

// 客户端, 商品ID
const subscriptions = new Map<any, number[]>();

const wsServer = new Server({port: 4202});
wsServer.on("connection", websocket => {
	websocket.on("message", message => {
		let messageObj = JSON.parse(message);
		let productIds = subscriptions.get(websocket) || [];
		subscriptions.set(websocket, [...productIds, messageObj.productId]);
	});
});

// 商品ID, 价格
const currentBids = new Map<number, number>();

// 为了例子简单，这里模拟出价
setInterval(() => {
	products.forEach(p => {
		let currentBid = currentBids.get(p.id) || p.price;
		let newBid = currentBid + Math.random() * 5;
		currentBids.set(p.id, newBid);
	})

	subscriptions.forEach((productIds: number[], ws) => {
		if(ws.readyState === 1) {		
			let newBids = productIds.map(pid => ({
				productId: pid,
				bid: currentBids.get(pid)
			}));
			ws.send(JSON.stringify(newBids));
		} else {
			subscriptions.delete(ws);
		}
	});
}, 2000);