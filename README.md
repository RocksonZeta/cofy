cofy
====
[![Build Status](https://travis-ci.org/RocksonZeta/cofy.svg?branch=master)](https://travis-ci.org/RocksonZeta/cofy)
[![Coverage Status](https://coveralls.io/repos/RocksonZeta/cofy/badge.png?branch=master)](https://coveralls.io/r/RocksonZeta/cofy?branch=master)
[![NPM version](https://badge.fury.io/js/cofy.svg)](http://badge.fury.io/js/cofy)
[![Dependency Status](https://david-dm.org/RocksonZeta/cofy.svg)](https://david-dm.org/RocksonZeta/cofy)

cofy is utility for convert you object or function in [co](https://github.com/visionmedia/co) style.

##Installation
```
$ npm install cofy
```

##Usage:

Enable class to has `co` ability
```javascript
var cofy = require('cofy');
function Class(){
	this.name = 'class';
}
Class.prototype.doIO1 = function(options , cb){
	var _this = this;
	setTimeout(function(){
		cb(null , [ options,_this.name]);
	},100);
};
Class.prototype.doIO2 = function(cb){
	var _this = this;
	setTimeout(function(){
		cb(null , _this.name);
	},100);
};

//cofy Class
cofy(Class.prototype);
var obj = new Class();
var co = require('co');
co(function*(){
	var r1 = yield obj.co_doIO1("co ");
	var r2 = yield obj.co_doIO2();
	console.log(r1,r2);
})();

```

Enable object to has `co` ability
```javascript
var cofy = require('cofy');
var obj = {
	doIO1 : function(options , cb){
		var _this = this;
		setTimeout(function(){
			cb(null , [ options,_this.name]);
		},100);
	},
	doIO2 : function(cb){
		var _this = this;
		setTimeout(function(){
			cb(null , _this.name);
		},100);
	}
}

//cofy object
cofy(obj);
var co = require('co');
co(function*(){
	var r1 = yield obj.co_doIO1("co ");
	var r2 = yield obj.co_doIO2();
	console.log(r1,r2);
})();

```

Enable function to has `co` ability
```javascript
var cofy = require('cofy');
function doIO1(cb){
	var _this = this;
	setTimeout(function(){
		cb(null , "hello");
	},100);
}


//cofy function
var co_doIO1 = cofy(doIO1);
var co = require('co');
co(function*(){
	var r1 = yield co_doIO1();
	console.log(r1);
})();

```

## API

### cofy(target, [prefix] , [context])

Enalbe a class or a object or a function to has [co](https://github.com/visionmedia/co) ability.
- `target` - cofy target.it can be a class.prototype or a object or a function.
- `prefix` - cofy will add function to the target(except target is function),the function name has a prefix. default is `co_`
- `context` - the function execute context

## Some examples
use cofy in redis.
```javascript
'use strict';
var co = require("co");
var cofy = require("cofy");
var redis = require('redis');

//enable redis to has a co ablitiy.
cofy(redis.RedisClient.prototype);

//now we can use mysql in co 
var client = redis.createClient(6379,'192.168.13.184');
co(function * () {
	var r1 = yield client.co_set('a' ,1);
	var r2 = yield client.co_get('a');
	var r3 = yield client.co_hmset('h' , {k1:'v1' , k2:'v2'});
	var r4 = yield client.co_hget('h' ,'k1');
	console.log(r1,r2);
	console.log(r3,r4);
})();
```

use cofy in mysql.
```
'use strict';
var co = require("co");
var cofy = require("cofy");
var mysql = require('mysql');

//(felixge/node-mysql) has no extends entrance. so we can to this.
var Connection = require('./node_modules/mysql/lib/Connection.js');
var PoolConnection = require('./node_modules/mysql/lib/PoolConnection.js');
var Pool = require('./node_modules/mysql/lib/Pool.js');
var PoolCluster = require('./node_modules/mysql/lib/PoolCluster.js');

//enable mysql to has a co ablitiy.
cofy(Connection.prototype);
cofy(PoolConnection.prototype);
cofy(Pool.prototype);
cofy(PoolCluster.prototype);

var pool = mysql.createPool({
	host: "192.168.13.184",
    database: "cad",
    user: "root",
    password: "yzkj2014",
});
//now we can use mysql in co 
co(function * () {
	var con = yield pool.co_getConnection();
	var result = yield con.co_query("select 1+1");
	console.log(result);
	con.release();
})();


//use it in transaction
co(function*(){
	var con ;
	try{
		con = yield pool.co_getConnection();
		yield con.co_beginTransaction();
		yield con.co_query("select some");
		yield con.co_query("insert some");
		yield con.co_query("update some");
		yield con.co_commit();
	}catch(e){
		yield con.co_rollback();
		console.error(e);
		//to do 
	}finally{
		if(con){
			con.release();
		}
	}
})();