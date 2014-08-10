'use strict';
var co = require('co'),
cofy = require('../index.js');

function query(id ,cb){
	process.nextTick(function(){
		cb(null,"your id is "+id);
	});
}


var fns = {
	fn1 : function(cb){
		process.nextTick(function(){
			cb(null , "fn1");
		});
	},
	fn2 : function(opt,cb){
		process.nextTick(function(){
			cb(null , opt);
		});
	}
};

var Class = function(){
	this.name = "class1";
};
Class.prototype = {

	m1:function(opt ,cb){
		var _this = this;
		process.nextTick(function(){
			return cb(null,opt+_this.name);
		});
	},
	me:function(cb){
		process.nextTick(function(){
			return cb("error");
		});
	}
};


describe("cofy" , function(){
	it("co function should be ok" , function(done){
		co(function*(){
			var co_query = cofy(query);
			(yield co_query(123)).should.equal('your id is 123');
			done();
		})();
	});
	it("co class should be ok" , function(done){
		co(function*(){
			cofy(fns);
			// console.log(yield fns.co_fn3(1));
			(yield fns.co_fn1()).should.equal('fn1');
			(yield fns.co_fn2(1)).should.equal(1);
			done();
		})();
	});	
	it("co object should be ok" , function(done){
		co(function*(){
			cofy(Class.prototype);
			var o = new Class();
			(yield o.co_m1("hello ")).should.equal('hello class1');
			done();
		})();
	});
	it("co object should throw error" , function(done){
		co(function*(){
			cofy(Class.prototype);
			var o = new Class();
			try{
				(yield o.co_me()).should.equal('hello class1');
			}catch(e){
				e.should.equal('error');
			}
			done();
		})();
	});
});