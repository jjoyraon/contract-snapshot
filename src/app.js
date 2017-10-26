const express = require('express');
const app = express();
const jsonfile = require('jsonfile');
const server = require('http').createServer(app);
const socketio = require('socket.io')(server);
const bodyParser = require('body-parser');
const firebase = require('firebase');

const screenshot = require('./screenshot-slack-uploader');

app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use('/scripts', express.static(__dirname + '/../node_modules/cytoscape/dist'));
app.use('/scripts', express.static(__dirname + '/../node_modules/socket.io-client/dist'));

app.set('socketio', socketio);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

const firebaseConfig = {
  apiKey: "AIzaSyCoi6wAUtO5AQeg4oG2UmIfCIWaZrVAguA",
  authDomain: "contractradiator-b4c46.firebaseapp.com",
  databaseURL: "https://contractradiator-b4c46.firebaseio.com",
  projectId: "contractradiator-b4c46",
  storageBucket: "contractradiator-b4c46.appspot.com",
  messagingSenderId: "1068960274144"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const load = () => {
  return database.ref('/contractResult').once('value')
    .then(snapshot => {
      return snapshot.val();
    });
}

const save = (json) => {
  database.ref('/contractResult').set(json);
}

app.put('/data', function (req, res) {

  load().then(dataList=>{
    const reqList = req.body;
    for(const data of dataList) {
      for(const req of reqList){
        if (data.from === req.from && data.to === req.to) {
          data.result = req.result;
        }
      }
    }
    save(dataList);
    app.get('socketio').emit('contracts', dataList);
    if(hasAnyFail(dataList)){
      screenshot.screenshot('http://localhost:3000', 'result.png');
    }
    res.sendStatus(200);
  });


});

const hasAnyFail = (dataList) => {
  for(const data of dataList){
    if(data.result == 'fail'){
      return true;
    }
  }
  return false;
}


server.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

socketio.on('connection', function (socket) {
  const contract = load();
  contract.then(data => {
    socket.emit('contracts', data);
  });

});

// const captureResult = () =>{
//   (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('http://localhost:3000/');
//     await page.screenshot({path: 'result.png'});
//
//     await browser.close();
//   })();
// }
