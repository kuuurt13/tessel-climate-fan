var tessel = require('tessel');
var climatelib = require('climate-si7020');
var relaylib = require('relay-mono');
var config = require('./config');

var climate = climatelib.use(tessel.port[config.climatePort]);
var relay = relaylib.use(tessel.port[config.relayPort]);

var interval = config.interval;
var sampleSizes = config.sampleSizes;
var tempDiffThreshold = config.tempDiffThreshold;
var tempJumpLimit = config.tempJumpLimit;

var checkTempLed = tessel.led[3];
var fanOn = false;
var temp = { samples: [], avg: 0 };

climate.on('ready', function () {
  climateInterval();
  tessel.led[2].on();
}).on('error', function (err) {
  console.log('error connecting climate module', err);
});

function climateInterval() {
  return setInterval(() => {
    climate.readTemperature('f', (err, currentTemp) => {
      var tempDiffFromAvg = currentTemp - temp.avg;

      checkTempLed.off();

      console.log(
        'Current Temp:', currentTemp.toFixed(4),
        '/ Average Temp:', temp.avg.toFixed(4),
        '/ Temp Diff:', tempDiffFromAvg.toFixed(4),
        '/ Checking Temp Diff:', temp.samples.length >= sampleSizes.min,
        '/ Fan On:', fanOn
      );

      if (temp.avg && temp.samples.length >= sampleSizes.min) {
        tessel.led[3].on();

        if (!fanOn && tempDiffFromAvg >= tempDiffThreshold) {
          toggleFan();
        } else if (fanOn && tempDiffFromAvg <= tempDiffThreshold) {
          toggleFan();
        }
      }

      temp.avg = getAvgTemp(currentTemp.toFixed(4), temp.samples);
    });
  }, interval);
}

function getAvgTemp(temp, sampleTemps) {
  if (sampleTemps.length === sampleSizes.max) {
    sampleTemps.splice((sampleTemps.length - 1), 1);
  }

  sampleTemps.push(parseFloat(temp));

  var sum = sampleTemps.reduce((sum, cur) => sum += cur, 0);
  return sum / sampleTemps.length;
}

function toggleFan(state) {
  fanOn = !fanOn;
  temp.samples = [];

  relay.toggle(1, (err) => {
    if (err) console.log("Error toggling on fan", err);
  });
}
