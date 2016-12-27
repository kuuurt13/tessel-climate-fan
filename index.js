var tessel = require('tessel');
var climatelib = require('climate-si7020');
var config = require('./config');

var climate = climatelib.use(tessel.port[config.climatePort]);

var interval = config.interval;
var sampleSize = config.sampleSize;
var tempDiffThreshold = config.tempDifference;
var fanOnDistance = config.fanOnDistance;
var fanOffDistance = config.fanOffDistance;

var sampleTemps = [];
var avgTemp = 0;
var fanOn = false;

climate.on('ready', function () {
  climateInterval();
});

climate.on('error', function (err) {
  console.log('error connecting climate module', err);
});

function climateInterval() {
  return setInterval(() => {
    climate.readTemperature('f', (err, temp) => {
      var tempChange = temp - avgTemp;

      console.log(
        'Current Temp:', temp.toFixed(4),
        '/ Average Temp:', avgTemp.toFixed(4),
        '/ Temp Diff:', tempChange.toFixed(4),
        '/ Fan On:', fanOn
      );

      if (!fanOn) {
        if (avgTemp && tempChange >= tempDiffThreshold) {
          return toggleFan(true);
        }

        if (!avgTemp || tempChange <= fanOnDistance) {
          avgTemp = getAvgTemp(temp.toFixed(4));
        }
      } else {
        if (tempChange <= fanOffDistance) {
          toggleFan(false);
        }
      }
    });
  }, interval);
}

function getAvgTemp(temp) {
  if (sampleTemps.length === sampleSize) {
    sampleTemps.splice((sampleTemps.length - 1), 1);
  }

  sampleTemps.push(parseFloat(temp));

  var sum = sampleTemps.reduce((sum, cur) => sum += cur, 0);
  return sum / sampleTemps.length;
}

function toggleFan(state) {
  if (state) {
    console.log('Turn on fan');
  } else {
    console.log('Turn off fan');
  }

  fanOn = state;
}
