var http = require('http');
var fs = require('fs');
var fakeData = require('./fakedata.json');

var server = http.createServer(function(req, res){
	var headers = {};
	headers["Content-Type"] = "text/json";
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = true;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";

	res.writeHead(200, headers);

	res.write(JSON.stringify(fakeData));


	res.end();
});

server.listen(1337, function(){
	console.log("listening on port 1337")
})