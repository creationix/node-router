var server = require('./lib/node-router').getServer();

server.get(new RegExp("^/(.*)$"), function hello(req, res, match) {
  res.simpleHtml(200, "Hello " + (match || "World") + "!");
});

server.listen(8080);