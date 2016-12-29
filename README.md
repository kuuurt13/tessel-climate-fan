# tessel-climate-fan
A Tessel 2 project for monitoring the average temperature and turning on a fan when it notices a set increase

This code works with the <a href="https://tessel.io/" target="_blank">Tessel 2</a> in pair with the <a href="https://tessel.io/modules#module-relay" target="_blank">relay</a> and <a href="https://tessel.io/modules#module-climate" target="_blank">climate</a> modules. It takes the average temperature with the climate module and when it detects a set change in temperature it turns on a fan via the relay module.

The inspiration behind this little project is that a futon is situated over the heat vent in my small office. Because of this the warm air gets trapped underneath it. I wanted a way to push the warm air out when the heat came on. Now when the heat has a uptick from the average temperature it turns on a fan under the futon to push out the warm air. Once the heat turns off the decreases in temperature is detected and the fan shuts off. 
