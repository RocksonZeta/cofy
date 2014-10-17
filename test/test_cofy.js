'use strict';

var cofy = require('../'),
util = require('util'),
co = require('co')
;
require('should');


function Parent(){

}
Parent.prototype.getName = function(cb){
	return cb(null ,'father');
};

function Child(){
	Parent.call(this);
}
util.inherits(Child , Parent);
Child.prototype.getName = function(cb){
	return cb(null ,'son');
};
Child.prototype.getAge = function(cb){
	return cb(null ,20);
};
Child.prototype.getWhat = function(cb){
	return cb(null ,'');
};
Object.defineProperty(Child.prototype,'p1' , {set:function(v){return v;}});
cofy.class(Child , true , ['getName' , 'getAge','p1']);

describe('cofy.class' , function(){
	it('cofy.class Child class should be ok' , function(done){
		co(function*(){
			var child = new Child();
			var parent = new Parent();
			(yield child.$getName()).should.equal('son');
			(yield parent.$getName()).should.equal('father');
			done();
		})();
	});
	it('cofy.class Child class has no $getWhat' , function(){
		(typeof Child.prototype.$getWhat).should.equal('undefined');
		Child.prototype.$getName.should.be.ok;
	});
});


//test for object
var object = {
	getName:function(cb){
		return cb(null ,'son');
	},
	name:"jim",
	getWhat : function(cb){
		return cb(null ,'');
	},
	getAge : function(cb){
		return cb(null ,20);
	},
	set p1(v){
		return v;
	}
};
// Object.defineProperty(object , "p1" , {set:function(){}});
cofy.object(object,true, ['getName' , 'getAge','p1']);

describe('cofy' , function(){
	it('.object should be ok' , function(done){
		co(function*(){
			(yield object.$getName()).should.equal('son');
			done();
		})();
	});
	it('.object has not $getWhat' , function(){
		(typeof object.$getWhat).should.equal('undefined');
		object.$getName.should.be.ok;
	});
});

function getName(cb){
	return cb(null , 'son');
}

var $getName = cofy.fn(getName);

describe('cofy' , function(){
	it('.fn Child class should be ok' , function(done){
		co(function*(){
			(yield $getName()).should.equal('son');
			done();
		})();
	});
});

