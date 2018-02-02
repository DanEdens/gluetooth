// This only works in the Carmel Developer Preview browser that ships with Gear VR phones.
// Useless if you're not running that mobile app. :(
const state = {
    lastButtons: {},
    lastAxes:    {}
};

const bindToGamePad = () => {
    Array.prototype.forEach.call(navigator.getGamepads(), function (activePad, padIndex) {
        if (activePad && activePad.connected) {
            console.log(activePad);

            if (activePad.id.includes("Gear VR")) {
                // Process buttons and axes for the Gear VR touch panel
                activePad.buttons.forEach(function (gamepadButton, buttonIndex) {
                    if (buttonIndex === 0 && gamepadButton.pressed && !lastButtons[buttonIndex]) {
                        console.log('Tap!');
                    }
                    state.lastButtons[buttonIndex] = gamepadButton.pressed;
                });

                activePad.axes.forEach(function (axisValue, axisIndex) {

                    if (axisIndex === 0 && axisValue < 0 && lastAxes[axisIndex] >= 0) {
                        console.log('Handle swipe right!');
                    } else if (axisIndex === 0 && axisValue > 0 && lastAxes[axisIndex] <= 0) {
                        console.log('Handle swipe left!');
                    } else if (axisIndex === 1 && axisValue < 0 && lastAxes[axisIndex] >= 0) {
                        console.log('Handle swipe up!');
                    } else if (axisIndex === 1 && axisValue > 0 && lastAxes[axisIndex] <= 0) {
                        console.log('Handle swipe down!');
                    }
                    state.lastAxes[axisIndex] = axisValue;
                });
            } else {
                console.log('This is a connected Bluetooth gamepad which you may want to support in your VR experience');
            }
        }
    });
};
