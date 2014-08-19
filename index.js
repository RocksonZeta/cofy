'use strict';
module.exports = function (object,prefix,ctx){
	if('function' == typeof object){
		return function(){
			var _this = this ||ctx || object;
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
	Object.keys(object).forEach(function(i){
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

