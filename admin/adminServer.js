var app = require('http').createServer(handler),
	url = require('url'),
  	io = require('socket.io').listen(app),
  	YAML = require('yamljs'),
  	fs = require('fs');

// creating the server ( localhost:8000 ) 
app.listen(1337);

var scoreDb = __dirname + '/scores.yml';

// on server started we can load our client.html page
function handler(req, res) {
	var pathname = url.parse(req.url).pathname
	if(pathname.length < 2) pathname = '/index.html'
	fs.readFile(__dirname + pathname, function(err, data) {
	    if (err) {
	      console.log(err);
	      res.writeHead(500);
	      return res.end('Error loading ' + pathname + '. Check with Parag. He is really awesome!');
	    }
	    res.writeHead(200);
	    res.end(data);
	});
}

function readScoresFromFile(socket) {
    var json = YAML.load(scoreDb)
	json.accessed_at = new Date().getTime();
    socket.emit('getScores', json);
}

function writeScoresToFile(data, socket){
	data.updated_at = new Date()
	var yaml = YAML.stringify(data, 4)
	//json.time = new Date().getTime();
    fs.writeFile(scoreDb, yaml, function(err){
    	if(err) throw err
    })
}

// ====================================================================================
// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on('connection', function(socket) {
	  	// watching the yaml file
	  	fs.watch(scoreDb, function(curr, prev) {
		    // on file change we can read the new xml
		    var json = YAML.load(scoreDb)
		    //json.time = new Date().getTime();
		    // send the new data to the client
		    if(json && Object.prototype.toString.call(json) === '[object Object]')
		    	socket.emit('updateScores', json);
		});

		socket.on('scores', function(data){
			var message = typeof data === 'string'? data : data.msg
			switch(message){
				case 'read' : readScoresFromFile(socket); break;
				case 'write' : if(data && data.data && Object.prototype.toString.call(data.data) === '[object Object]'){
						writeScoresToFile(data.data, socket);
				} else  throw new Error('Invalid data. Could not write to file!')
					break;
				default: break;
			}
		})
		
		;(function(){
			var json = YAML.load(scoreDb)
			json.accessed_at = new Date().getTime();
			socket.emit('updateScores', json)
		})()
})

