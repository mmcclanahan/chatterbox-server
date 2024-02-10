/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is. It will now!

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var key = 0;
var { storage } = require('./data/storage.js')
var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the
  // INCOMING request, such as headers and URL,
  // AND about the
  // OUTGOING response, such as its status and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = undefined;
  var answer = undefined;
  var headers = defaultCorsHeaders;


  // Tell the client we are sending them application/json
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  if (request.url !== '/classes/messages') {
    statusCode = 404;
    answer = 'no way dude!'
  } else if (request.method === 'POST') {
    statusCode = 201;

    var chunkArray = [];
    var chunkObject = {};

    request.on('data', (chunk)=>chunkArray.push(chunk));
    request.on('end', () => {
      chunkObject = JSON.parse(chunkArray = Buffer.concat(chunkArray).toString())
      chunkObject['message_id'] = key++;
      chunkObject['createdAt'] = Date.now();
      storage.push(chunkObject)
    });
    console.log(storage)
    answer = ['nice'];
  } else if (request.method === 'GET') {
    statusCode = 200;
    answer = storage;
  } else if (request.method === 'OPTIONS') {
    statusCode = 204;
    anwser = 'option';
    // response.end();
  }
  //console.log(storage);
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(answer));
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.



  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': 'http://127.0.0.1:8080',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};
exports.requestHandler = requestHandler;