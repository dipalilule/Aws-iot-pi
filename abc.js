var awsiot = require('aws-iot-device-sdk');
var onoff = require('onoff');
var Gpio = onoff.Gpio,
  moist = new Gpio(21, 'in'),
  interval;


var device = awsIot.device({
   keyPath: 'd41666b28fc140e3b9ca207a9cadcff14bdd0dd62a34e481acf72d80a6ab2026-private.pem.key',
  certPath: 'd41666b28fc140e3b9ca207a9cadcff14bdd0dd62a34e481acf72d80a6ab2026-certificate.pem.crt',
    caPath: 'AmazonRootCA1 (7).pem',
  clientId: 'Pi',
      host: 'aev9wr5jdclfp-ats.iot.us-east-1.amazonaws.com'
});


device
  .on('connect', function() {
    console.log('connect');

           

                device.subscribe('pi2aws');
                /*device.publish('pi2aws', JSON.stringify({ time: Math.floor(Date.now()/1000),sensor_data: 50000
                console.log('message sent...');*/

});

interval = setInterval(function () {
  var value = moist.reasSync();
  device.publish('pi2aws', JSON.stringify({ time: Math.floor(Date.now()/1000),sensor_data: value }));
  console.log('message sent...');
  if(value==1){console.log("DRY");}
  else{console.log("WET");}
}, 600);

device
  .on('message', function(topic, payload) {
    console.log('message', topic, payload.toString());
   });

process.on('SIGINT', function () {
  clearInterval(interval);
  moist.writeSync(0);
  moist.unexport();
  console.log('Bye, bye!');
  process.exit();
});