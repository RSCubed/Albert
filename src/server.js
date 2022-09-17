"use strict";
var express = require('express');
var app = express();
var port = 3000;
app.get('/', function (req, res) {
    res.send('Hello World!');
});
console.log("test");
app.listen(port, function () {
    console.log("Example app listening on port ".concat(port));
});
console.log('test');
