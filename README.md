# Volume Boost

A Decky plugin to boost default audio device volume to greater than 100% (upto 150%).

Feature Addons:

* Added individual Left and Right Channel Control (this can be toggled) - [Linked Issue](https://github.com/saumya-banthia/volume-boost/issues/1)

## Pre-requisites

pactl service installed **[Note: pactl (Pulse Audio Control) is installed by default in your Deck.]**

### Known bug (or feature?)

* Currently you can only set the volume above 100% using the UI of the plugin. If the volume is above 100% and  you use the volume buttons to increase or decrease the volume, the volume jumps back to the default range (0-100). Think of this more as a feature than a bug, as it allows you to get back to the normal function range with the press of a button.

<!-- TODO before push 
* Update decky-frontend-lib
* Update pnpm
* Update version
-->