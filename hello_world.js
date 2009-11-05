var server = require('./http_server')

function hello(req, res, match) {
  res.simpleHtml(200, "Hello " + (match || "World") + "!");
}

server.get(new RegExp("^/(.*)$"), hello);
server.listen(8080);