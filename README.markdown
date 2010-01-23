# node-router

Node-router is a small simple node.js http server that makes building simple web-services super simple.

## Node libraries

There are two ways to include this library in your node project.  You can either copy the node-router.js file in 
the same directory as your script and require it with a relative path:

    var server = require('./node-router');
  
Or you can copy `node-router.js` to somewhere in your `require.paths` array. Then you can use a global require
like:

    var server = require('node-router');
    
See the [node docs][] for more details.

[node docs]: http://nodejs.org/api.html#_modules

## Hello World example

This example has a single get route that returns the string hello world.  If there is path after
the root, it will be put in place of hello world.

    var server = require('node-router');

    function hello(req, res, match) {
      res.simpleHtml(200, "Hello " + (match || "World") + "!");
    }

    server.get(new RegExp("^/(.*)$"), hello);
    server.listen(8080);

## RESTful Resources made easy

server.resource maps a group of the common routes for a RESTful resource.  There is also a 
controller generator that makes building a simple in-memory data controller easy.

    var server = require('node-router');

    var people = [
    	{ name: "Bob", age: 47, programmer: false },
    	{ name: "Tim", age: 27, programmer: true },
    	{ name: "Jack", age: 3, programmer: false}
    ];

    function on_change(id) {
    	node.debug(id, JSON.stringify(people[id]));
    }

    server.resource("people", server.resourceController("people", people), on_change);
    server.listen(8080);

## Backend for SproutCore Todos example application.

This is a node.js backend for the Todos example in the SproutCore documentation.
<http://wiki.sproutcore.com/Todos+01-Create+Your+SproutCore+Application>

    // This is a sample backend for the SproutCore todos demo using node-router.
    // It uses an in-memory data store and writes it to disk on change
    // for persistance.
    // This provides the same REST style api as the merb example and even hosts
    // on port 4000. It's a drop in replacement for the sample merb backend.

    var server = require('node-router');

    var tasks;

    // Simple utility that allows mapping over any object
    // as if it were a hash.  Calls fn(key, value) for each pair.
    Object.prototype.map_pairs = function (fn) {
    	var accum = [];
    	for (key in this) {
    		if (this.hasOwnProperty(key)) {
    			accum.push(fn(key, this[key]));
    		}
    	}
    	return accum;
    };

    // Convert raw data to part of REST response
    function json_for_task(id, task) {
    	task = task || {};
    	return {
    		guid: "/tasks/" + id,
    		description: task.description,
    		order: task.order,
    		isDone: task.is_done
    	};
    }

    function apply_json_to_task(task, json_hash) {
      task.description = json_hash['description'];
      task.order = json_hash['order'];
      task.is_done = json_hash['isDone'];
    }

    // Serialize the data to the disk
    function save_data() {
      var fd = node.fs.open("tasks.db", node.O_WRONLY, 0666).wait();
      node.fs.write(fd, JSON.stringify(tasks)).wait();
      node.fs.close(fd).wait();
    }

    // Load the data from the disk
    function load_data(callback) {
    	// Load the database from disk
    	var promise = node.fs.cat("tasks.db", "utf8");
    	promise.addCallback(function (json) {
    		tasks = JSON.parse(json);
    		callback(true);
    	});
    	promise.addErrback(function () {
    		tasks = [];
    		callback(false);
    	});
    }

    // This handles the REST requests and generates the responses
    var tasksController = {
    	index: function (req, res) {
    		res.simpleJson(200, {content: tasks.map_pairs(json_for_task), self: '/tasks'});
    	},
    	show: function (req, res, id) {
    		var task = tasks[id];
    		if (task) {
    			res.simpleJson(200, {content: json_for_task(id, task), self: '/tasks/' + id});
    		} else {
    			res.notFound();
    		}
    	},
    	create: function (req, res) {
    		req.jsonBody(function (json) {
    			var task = {}, id, url;
    			json = json && json.content;
    			if (!json) {
    				res.notFound();
    			} else {
    				apply_json_to_task(task, json);
    				id = tasks.length + 1;
    				tasks[id] = task;
    				tasks.length += 1;
    				save_data();
    				url = "/tasks/" + id;
    				res.simpleJson(201, {content: json_for_task(id, task), self: url}, [["Location", url]]);
    			}
    		});
    	},
    	update: function (req, res, id) {
    		puts("Update");
    		req.jsonBody(function (json) {
    			var task = {}, new_id, url;
    			json = json && json.content;
    			if (!json) {
    				res.notFound();
    			} else {
    				apply_json_to_task(task, json);
    				tasks[id] = task;
    				save_data();
    				res.simpleJson(200, {content: json_for_task(id, task), self: "/tasks/" + id});
    			}
    		});
    	},
    	destroy: function (req, res, id) {
    		delete(tasks[id]);
    		save_data();
    		res.simpleJson(200, "200 Destroyed");
    	}
    };

    // Mount our controller as a RESTful resource
    server.resource('tasks', tasksController);

    // Load the datastore
    puts("Loading data from file...");
    load_data(function (success) {
    	// Kickoff the server
    	if (success) {
    		puts("Loaded");
    	} else {
    		puts("Error, creating empty tasks array");
    		save_data();
    	}
    	// And start the server when done
    	server.listen(4000);
    });