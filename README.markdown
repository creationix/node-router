# node-router

Node-router is a small simple node.js http server that makes building simple web-services super simple.

## Node libraries

There are two ways to include this library in your node project.  You can either copy the node-router.js file in 
the same directory as your script and require it with a relative path:

    var NodeRouter = require('./node-router');
  
Or you can copy `node-router.js` to somewhere in your `require.paths` array. Then you can use a global require
like:

    var NodeRouter = require('node-router');
    
See the [node docs][] for more details.

[node docs]: http://nodejs.org/api.html#_modules

