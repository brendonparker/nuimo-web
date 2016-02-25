var express = require('express');
var path = require('path');
var nuimo = require('nuimo-node');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Aggregator = require('./aggregator');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', function(socket){
  console.log('a user connected');
});

var aggregator = new Aggregator().withInterval(300).withCallback(amount => {
    io.emit('rotate', amount);
});

var handlers = {};

handlers[nuimo.CHARACTERISTICS.BUTTON_CLICK] = (nuimo, data) => {    
    if (data[0] === 1) {
        io.emit('click');
    }
};

handlers[nuimo.CHARACTERISTICS.SWIPE] = (nuimo, data) => {    
    io.emit('swipe', data[0]);
};

handlers[nuimo.CHARACTERISTICS.ROTATION] = (nuimo, data) => {
    if (data[1] === 255) {
        var velocity = Math.round((255 - data[0]) / 255 * 100);
        aggregator.onNext(-velocity);
    } else {
        var velocity = Math.round(data[0] / 255 * 100);
        aggregator.onNext(velocity);
    }
};

nuimo.init(handlers);

http.listen(3000, function(){
  console.log('listening on *:3000');
});