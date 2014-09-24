'use strict';
module.exports = function (object,prefix,ctx,methods){
	if('function' == typeof object){
		return function(){
			var _this = ctx ||prefix||this;
			var args = Array.prototype.slice.call(arguments);
			return function(done){
				args[args.length] = function(){	//the callback
					var results = Array.prototype.slice.call(arguments);
					done.apply(null ,results);
				};
				object.apply(_this,args);
			};
		};
	}
	prefix = prefix || 'co_';
	if(!object){
		return;
	}else{
		module.exports(Object.getPrototypeOf(object) , prefix , ctx);
	}
	Object.keys(object).forEach(function(i){
		try{
			object[i];	//accessing property in prototype will trigger a error!
		}catch(e){
			return ;
		}
		if('function' != typeof object[i]){
			return;
		}
		if(methods && -1==methods.indexOf(i)){
			return;
		}
		object[prefix+i] = function(){
			var _this = this ||ctx || object;
			var args = Array.prototype.slice.call(arguments);
			return function(done){
				args[args.length] = function(){	//the callback
					var results = Array.prototype.slice.call(arguments);
					done.apply(null ,results);
				};
				object[i].apply(_this,args);
			};
		};
	});
};

