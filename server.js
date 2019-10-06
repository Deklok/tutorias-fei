const express = require('express');
const bodyParser = require('body-parser');
const miuvws = require('./server/miuvws/miuv.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/miuv/test', (req,res) =>{
  res.send(miuvws.test());
});0

app.post('/api/miuv/login', (req,res) => {
  var user = req.body["user"];
  var pass = req.body["pass"];
  miuvws.login(user,pass).then(function(response){
    res.send(response);
  });
});

// Use this code when is on production
/* 
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*',(req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
*/

app.listen(5000);
console.log('App listening on port 5000');