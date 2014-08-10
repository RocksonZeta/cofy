cofy
====

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