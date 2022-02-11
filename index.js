const fs=require('fs');
const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const { response } = require('express');

const port = process.env.PORT || 4200;
const app = express();
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

function jsonReader(filePath, cb) {
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
}


app.get("/", function (request, response) {
	response.sendFile(__dirname + "/public/index.html");
});

app.use( express.static( `${__dirname}/public` ) );

app.use(compression());

app.get("/getdata", function (request, response) {
  jsonReader("./data.json", (err, dataval) => {
    if (err) {
      console.log("Error reading file:", err);
      return;
    }
    response.send(dataval);
  });	
});

app.post('/putdata', function(req, res) {
  var name = req.body.bedName                 ,
  devices = req.body.devices;
  console.log(name, devices);

      jsonReader("./data.json", (err, dataval) => {
        if (err) {
          console.log("Error reading file:", err);
          return;
        }
        
        let ins={};
        ins.name=name;
        ins.devices=devices;
        dataval.push(ins);

        fs.writeFile("./data.json", JSON.stringify(dataval), err => {
          if (err) console.log("Error writing file:", err);
          res.send("update success!");
        });
      });

        
});

app.get("*", function (request, response) {
	response.sendFile(__dirname + "/public/index.html");
});

app.listen(port, function () {
const message = `App listening on port ${port}`;
console.log(`\x1b[32m%s\x1b[0m`, message);
});
