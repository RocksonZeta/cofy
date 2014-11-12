cofy
====
[![Build Status](https://travis-ci.org/RocksonZeta/cofy.svg?branch=master)](https://travis-ci.org/RocksonZeta/cofy)
[![Coverage Status](https://coveralls.io/repos/RocksonZeta/cofy/badge.png?branch=master)](https://coveralls.io/r/RocksonZeta/cofy?branch=master)
[![NPM version](https://badge.fury.io/js/cofy.svg)](http://badge.fury.io/js/cofy)
[![Dependency Status](https://david-dm.org/RocksonZeta/cofy.svg)](https://david-dm.org/RocksonZeta/cofy)

[![NPM](https://nodei.co/npm/cofy.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cofy/)

Cofy is a bridge connecting callback style object to sequential style in [co](https://github.com/visionmedia/co) or [koa](https://github.com/koajs/koa) environment with one punch.

##Installation
```
$ npm install cofy --save
```

### NOTE: default prefix has changed to '$'.

## Some examples

use cofy in [redis](https://github.com/mranney/node_redis).
```javascript
'use strict';
var co = require("co");
var cofy = require("cofy");
var redis = require('redis');

//enable redis to has a co ablitiy.
cofy.class(redis.RedisClient);

//now we can use mysql in co 
var client = redis.createClient(6379,'localhost');
co(function * () {
	//use class.$fn
	var r1 = yield client.$set('a' ,1);
	var r2 = yield client.$get('a');
	var r3 = yield client.$hmset('h' , {k1:'v1' , k2:'v2'});
	var r4 = yield client.$hget('h' ,'k1');
	console.log(r1,r2);
	console.log(r3,r4);
})();
```

use cofy in [mysql](https://github.com/felixge/node-mysql).
```javascript
'use strict';
var co = require("co");
var cofy = require("cofy");
var mysql = require('mysql');

//(felixge/node-mysql) has no extends entrance. so we can do this.
var PoolConnection = require('mysql/lib/PoolConnection.js');
var Pool = require('mysql/lib/Pool.js');
var PoolCluster = require('mysql/lib/PoolCluster.js');

//enable mysql to has a co ablitiy.
cofy.class(PoolConnection);
cofy.class(Pool);
cofy.class(PoolCluster);

var pool = mysql.createPool({
	host: "localhost",
    database: "db",
    user: "root",
    password: "pass",
});
//now we can use mysql in co 
co(function * () {
	var con = yield pool.$getConnection();
	//pay attention on precedence of operator! yield < [] .
	var result = (yield con.$query("select 1+1"))[0]; 
	console.log(result);
	con.release();
})();


//use it in transaction
co(function*(){
	var con ;
	try{
		con = yield pool.$getConnection();
		yield con.$beginTransaction();
		yield con.$query("select some");
		yield con.$query("insert some");
		yield con.$query("update some");
		yield con.$commit();
	}catch(e){
		yield con.$rollback();
		console.error(e);
		//to do 
	}finally{
		if(con){
			con.release();
		}
	}
})();
```

use cofy in [request](https://github.com/mikeal/request).
```javascript
'use strict';
var request = require('request');
var cofy = require('cofy');
var co = require('co');

var $request = cofy.fn(request);

co(function*(){
	var r = yield $request({url:"http://www.google.com"});
	console.log(r);
})();
```

cofy `nodejs` [fs](http://nodejs.org/api/fs.html) api:
```js
'use strict';
var cofy = require('../');
var co = require('co');

var fs = require('fs');
cofy(fs);

//fs.exists callback function has no error. we call set `throwable` to false.
fs.$exists = cofy.object(fs.exists , false ,fs);	

co(function*(){
	var file = '/hello.txt';
	if(!(yield fs.$exists(file))){
		return;
	}
	var r = yield fs.$readFile(file,'utf8');
	console.log('fda' , r);
	//also you can use it in old way
	fs.readFile(file , 'utf8' , function(e,r){
		if(e){
			throw e;
		}
		console.log(r);
	});
})();
```


## cofy API

### class(constructor,[throwable],[methods],[prefix])

Enable a class or a object or a function to has [co](https://github.com/visionmedia/co) ability.
- `constructor` `{function}` - cofy target.the constructor of the class;
- `throwable` `{bool}` - if `throwable` is true the first argument of callback function arguments will be deemed as a exception.if `throwable` is false,no exception will be throwed ,all arguments will be returned. default is `true`.
- `methods` `{array}` - `Array`,if exists ,cofy will only cofy the methods in the target.
- `prefix` `{string}` - cofy will add function to the target(except target is function),the function name has a prefix. default is `$`.

### object(object,[throwable],[methods],[prefix],[context])

- `object` `{function}` - cofy target.the constructor of the class;
- `throwable` `{bool}` - if `throwable` is true the first argument of callback function arguments will be deemed as a exception.if `throwable` is false,no exception will be throwed ,all arguments will be returned. default is `true`.
- `context` `{object}` - the function execute context.
- `methods` `{array}` - `Array`,if exists ,cofy will only cofy the methods in the target.
- `prefix` `{string}` - cofy will add function to the target(except target is function),the function name has a prefix. default is `$`.


### fn(fn,[throwable],[context])
- `fn` `{function}` - cofy a function; `function(args , cb)` -> `yeild function(args)`
- `throwable` `{bool}` - if `throwable` is true the first argument of callback function arguments will be deemed as a exception.if `throwable` is false,no exception will be throwed ,all arguments will be returned. default is `true`.
- `context` `{object}` - the function execute context.