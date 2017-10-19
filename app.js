const express = require('express');
const app = express();
const jsonfile = require('jsonfile');
const server = require('http').createServer(app);
const socketio = require('socket.io')(server);
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/scripts', express.static(__dirname + '/node_modules/cytoscape/dist'));
app.use('/scripts', express.static(__dirname + '/node_modules/socket.io-client/dist'));

app.set('socketio', socketio);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.put('/data', function (req, res) {

  const dataList = jsonfile.readFileSync('data.json');
  const reqList = req.body;
  for(const data of dataList) {
    for(const req of reqList){
      if (data.from === req.from && data.to === req.to) {
        data.result = req.result;
      }
    }
  }
  jsonfile.writeFileSync('data.json', dataList);
  app.get('socketio').emit('contracts', dataList);
  res.send(200);
});

server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

socketio.on('connection', function (socket) {
    socket.emit('contracts', jsonfile.readFileSync('data.json'));
});
