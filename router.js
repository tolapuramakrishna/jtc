
//Install express server
const express = require('express');

const path = require('path');


module.exports = () => {
    
  global.app.use(express.static(__dirname + '/dist/'));


  global.app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
  });

  var clientsiteFootPrint = async(req) => {
    var payload = {
        agent: await utils.getUserDeviceDetails(req.headers['user-agent']),
        ipAddressDetails: await utils.getUserIpDetails(req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null)),
        createdTime: moment().toDate('YYYY-MM-DD HH:mm:ss'),
    };
    var docInserted = await utils.insertDocInDb('clientFootPrint', payload);
}
};
