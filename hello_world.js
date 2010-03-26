var server = require('./lib/node-router').getServer();

server.get("/json", function (req, res, match) {
  return {hello: "World"};
});

server.get(new RegExp("^/(.*)$"), function hello(req, res, match) {
  return "Hello " + (match || "World") + "!";
});


server.listen(8080);