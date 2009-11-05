var server = require('./http_server')

var people = [
	{ name: "Bob", age: 47, programmer: false },
	{ name: "Tim", age: 27, programmer: true },
	{ name: "Jack", age: 3, programmer: false}
];

function on_change(id) {
	process.debug(id, JSON.stringify(people[id]));
}

server.resource("people", server.resourceController("people", people), on_change);
server.listen(8080);