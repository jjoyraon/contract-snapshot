const express = require('express');
const app = express();
const jsonfile = require('jsonfile');
const server = require('http').createServer(app);
const socketio = require('socket.io')(server);
const bodyParser = require('body-parser');
const request = require('request');
const fs = require('fs');
const puppeteer = require('puppeteer');

const firebase = require('firebase');


app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/scripts', express.static(__dirname + '/node_modules/cytoscape/dist'));
app.use('/scripts', express.static(__dirname + '/node_modules/socket.io-client/dist'));

app.set('socketio', socketio);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

const firebaseConfig = {
  //FIXME set config
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
    // jsonfile.writeFileSync('data.json', dataList);
    app.get('socketio').emit('contracts', dataList);
    if(hasAnyFail(dataList)){
      const token = 'xoxb-';
      console.log('received has-fail');
      captureResult();
      uploadImage(token,  'result.png', 'te-private');
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

const captureResult = () =>{
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/');
    await page.screenshot({path: 'result.png'});

    await browser.close();
  })();
}

const uploadImage = (token, fileName, channels) => {
  const imageStream = fs.createReadStream(fileName);
  const uploadApiUrl = 'https://slack.com/api/files.upload';

  console.log('upload image');
  request.post({
    url: uploadApiUrl,
    formData: {
      token: token,
      channels: channels,
      file: imageStream
    }}, function(err, res, body){
      console.log(err);
    }
  );

}
