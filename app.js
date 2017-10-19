var express = require('express');
var app = express();

app.use(express.static('public'));
app.use('/scripts', express.static(__dirname + '/node_modules/cytoscape/dist'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.put('/data', function (req, res) {
  res.send(200);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
