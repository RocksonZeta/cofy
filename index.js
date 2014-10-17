'use strict';
exports.fn = function(fn,throwable,ctx) {
	throwable = ('undefined' == typeof throwable ? true:throwable);
	return function(){
		var _this = ctx ||this;
		var args = Array.prototype.slice.call(arguments);
		return function(done){
			args[args.length] = function(){	//the callback
				var results = Array.prototype.slice.call(arguments);
				if(!throwable){
					results.splice(0,0,null);
				}
				done.apply(null ,results);
			};
			fn.apply(_this,args);
		};
	};
};
exports.object = function(object,throwable,methods,prefix,ctx) {
	throwable = ('undefined' == typeof throwable ? true:throwable);
	prefix = prefix || '$';
	ctx = ctx || object;
	
	Object.keys(object).forEach(function(i){
		var target ;
		try{
			target = object[i];	//accessing property in prototype will trigger a error!
		}catch(e){
			return ;
		}
		if('function' != typeof target || target && target.constructor && 'GeneratorFunction' == target.constructor.name ){
			return;
		}
		if(methods && -1==methods.indexOf(i)){
			return;
		}
		object[prefix+i] = exports.fn(target,throwable , ctx);
	});
};

exports.class = function(constructor,throwable,methods,prefix) {
	throwable = ('undefined' == typeof throwable ? true:throwable);
	function _class(prototypeObject,throwable,methods,prefix){
		if(!prototypeObject){
			return;
		}else{
			// cofy parent class
			_class(Object.getPrototypeOf(prototypeObject),throwable,methods,prefix);
		}
		prefix = prefix || '$';
		Object.keys(prototypeObject).forEach(function(i){
			var target ;
			try{
				target = prototypeObject[i];	//accessing property in prototype will trigger a error!
			}catch(e){
				return ;
			}
			if('function' != typeof target || target && target.constructor && 'GeneratorFunction' == target.constructor.name ){
				return;
			}
			if(methods && -1==methods.indexOf(i)){
				return;
			}
			prototypeObject[prefix+i] = function(){
				var _this = this;
				var args = Array.prototype.slice.call(arguments);
				return function(done){
					args[args.length] = function(){	//the callback
						var results = Array.prototype.slice.call(arguments);
						if(!throwable){
							results.splice(0,0,null);
						}
						done.apply(null ,results);
					};
					prototypeObject[i].apply(_this,args);
				};
			};
		});
	}
	_class(constructor.prototype,throwable,methods,prefix);
};