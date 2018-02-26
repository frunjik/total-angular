const fs = require('fs');
const path = require('path');

exports.install = function() {
	F.route('api/files', put, ['post']);
	F.route('api/files', get);
	F.file('*.*', serve);
};

function getFile(name, cb) {
    fs.readFile(name, 'utf8', cb);
}

function putFile(name, data, cb) {
    fs.writeFile(name, data, 'utf8', cb);
}

function get() {
	var self = this;
	getFile(self.req.query.name, function(err, data) {
		if(err)
			self.res.throw400(err);
		else
			self.res.send(data);
	});
}

function put() {
	var self = this;
	putFile(self.req.name, self.req.body, function(err) {
		if(err)
			self.res.throw400(err);
		else
			self.res.send('');
	});
}

function serve(req, res) {

	var rootpath = '../client/dist/';
	var filename = rootpath + req.path.join('/');
	
	fs.exists(filename, function (exist) {
		if(!exist) {
			res.content(404, `File ${filename} not found!`, 'text/plain');
			return;
		}
	
		fs.readFile(filename, function(err, data) {
			if(err){
				res.content(500, `Error getting the file: ${err}.`, 'text/plain');
			} else {
				res.content(200, data, U.getContentType(path.parse(filename).ext));
			}
		});
	});
}

