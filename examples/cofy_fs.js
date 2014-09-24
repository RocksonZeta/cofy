'use strict';
var cofy = require('../');
var co = require('co');

var fs = require('fs');
cofy(fs);

fs.co_exists = cofy(fs.exists , false ,fs);	//fs.exists callback function has no error.

co(function*(){
	var file = '/hello.txt';
	if(!(yield fs.co_exists(file))){
		return;
	}
	var r = yield fs.co_readFile(file,'utf8');
	console.log('fda' , r);
	//also you can use it in old way
	fs.readFile(file , 'utf8' , function(e,r){
		if(e){
			throw e;
		}
		console.log(r);
	});
})();