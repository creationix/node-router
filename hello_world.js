var server = require('http_server.js');

function hello(req, res, match) {
  res.simpleHtml(200, "Hello " + (match || "World") + "!");
}

function onLoad() {
	server.get(new RegExp("^/(.*)$"), hello);
	server.listen(8080);
}