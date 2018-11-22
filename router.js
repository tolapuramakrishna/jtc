//Install express server
const express = require('express');

const path = require('path');


module.exports = () => {

  global.app.use(express.static(__dirname + '/dist/'));


  global.app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
  });

  
};
