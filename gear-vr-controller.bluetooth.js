const logDisplay          = document.getElementById('logDisplay');
const eventDataDisplay    = document.getElementById('eventDataDisplay');
const eventDataHexDisplay = document.getElementById('eventDataHexDisplay');

const touchpadDisplayDotStyle  = document.getElementById('touchpadDisplayDot').style;
const touchpadMaxValuesDisplay = document.getElementById('touchpadMaxValuesDisplay');

const controllerButtonsDisplay = document.getElementById('controllerButtonsDisplay');


const setOffModeButton    = document.getElementById('setOffModeButton');
const setSensorModeButton = document.getElementById('setSensorModeButton');
const setVRModeButton     = document.getElementById('setVRModeButton');
const disconnectButton    = document.getElementById('disconnectButton');

// Event data byte view
(() => {
    for (let i = 0; i < 60; i++) {
        let codeElement;

        codeElement   = document.createElement('code');
        codeElement.title = `Byte ${i}`;
        eventDataDisplay.appendChild(codeElement);

        codeElement       = document.createElement('code');
        codeElement.title = `Byte ${i}`;
        eventDataHexDisplay.appendChild(codeElement);

    }
})();

const logMessage = message => {
    logDisplay.innerHTML += '<br>' + message;
    console.log(message);
};

const logEventData = eventData => {
    eventData.forEach((v, i) => {
        eventDataHexDisplay.children[i].innerHTML = v.toString(16).padStart(2, '0');
        eventDataDisplay.children[i].innerHTML    = v;
    });
};

const logTouchPadValues = ({axisY, axisX}) => {
    touchpadDisplayDotStyle.top  = axisY + 'px';
    touchpadDisplayDotStyle.left = axisX + 'px';

    maxValues.axisX = Math.max(maxValues.axisX, axisX);
    maxValues.axisY = Math.max(maxValues.axisY, axisY);

    touchpadMaxValuesDisplay.innerHTML = `Max X = ${maxValues.axisX}\nMax Y = ${maxValues.axisY}`;
};

const logControllerButtons = ({backButton, homeButton, volumeUpButton, volumeDownButton, triggerButton, touchpadButton}) =>
    controllerButtonsDisplay.innerHTML = [
        `Touchpad button = ${touchpadButton}`,
        `Back button = ${backButton}`,
        `Home button = ${homeButton}`,
        `Volume up button = ${volumeUpButton}`,
        `Volume down button = ${volumeDownButton}`,
        `Trigger button = ${triggerButton}`
    ].join('<br>');

let gattServer;
let customService;
let customServiceNotify;
let customServiceWrite;

const userSelection = {
    service: SERVICES.CUSTOM_SERVICE,
};

const NOTIFY_CHARACTERISTIC = getCharacteristic(SERVICES.CUSTOM_SERVICE, 0);
const WRITE_CHARACTERISTIC  = getCharacteristic(SERVICES.CUSTOM_SERVICE, 1);

const onDevicePaired = device => {
    logMessage(`${device.name} paired.`);
    device.addEventListener('gattserverdisconnected', onDeviceDisconnected);
    return device.gatt.connect();
};

const onDeviceDisconnected = ({target}) => {
    logMessage(`${target.name} disconnected.`);
    disconnectButton.disabled    = true;
    setSensorModeButton.disabled = true;
    setOffModeButton.disabled    = true;
    setVRModeButton.disabled     = true;
};

const onDeviceConnected = server => {
    logMessage('GATT server connected.');

    disconnectButton.disabled    = false;
    setSensorModeButton.disabled = false;
    setOffModeButton.disabled    = false;
    setVRModeButton.disabled     = false;
    gattServer                   = server;

    return server.getPrimaryService(
        getUUID(userSelection.service)
    );
};

const onServiceRetrieved = service => {
    logMessage(`Service ${userSelection.service} retrieved.`);

    customService = service;

    return customService.getCharacteristic(WRITE_CHARACTERISTIC);
};


const onWriteCharacteristicRetrieved = characteristic => {
    customServiceWrite = characteristic;
    return customService.getCharacteristic(NOTIFY_CHARACTERISTIC);
};

const onNotifyCharacteristicRetrieved = characteristic => {
    customServiceNotify = characteristic;
    customServiceNotify
        .startNotifications()
        .then(() => customServiceNotify.addEventListener('characteristicvaluechanged', onEventDataChanged));
};

const maxValues = {
    axisX: 0,
    axisY: 0,
};

function onEventDataChanged(e) {
    const {buffer}  = e.target.value;
    const eventData = new Uint8Array(buffer);

    let axisY = 0; // Max is 157
    let axisX = 0; // Max is 157

    axisX += eventData[54] & (1 << 0) ? (1 << 5) : 0;
    axisX += eventData[54] & (1 << 1) ? (1 << 6) : 0;
    axisX += eventData[54] & (1 << 2) ? (1 << 7) : 0;
    axisX += eventData[55] & (1 << 3) ? (1 << 0) : 0;
    axisX += eventData[55] & (1 << 4) ? (1 << 1) : 0;
    axisX += eventData[55] & (1 << 5) ? (1 << 2) : 0;
    axisX += eventData[55] & (1 << 6) ? (1 << 3) : 0;
    axisX += eventData[55] & (1 << 7) ? (1 << 4) : 0;

    axisY += eventData[55] & (1 << 0) ? (1 << 7) : 0;
    axisY += eventData[56] & (1 << 1) ? (1 << 0) : 0;
    axisY += eventData[56] & (1 << 2) ? (1 << 1) : 0;
    axisY += eventData[56] & (1 << 3) ? (1 << 2) : 0;
    axisY += eventData[56] & (1 << 4) ? (1 << 3) : 0;
    axisY += eventData[56] & (1 << 5) ? (1 << 4) : 0;
    axisY += eventData[56] & (1 << 6) ? (1 << 5) : 0;
    axisY += eventData[56] & (1 << 7) ? (1 << 6) : 0;

    const triggerButton    = Boolean(eventData[58] & (1 << 0));
    const homeButton       = Boolean(eventData[58] & (1 << 1));
    const backButton       = Boolean(eventData[58] & (1 << 2));
    const touchpadButton   = Boolean(eventData[58] & (1 << 3));
    const volumeUpButton   = Boolean(eventData[58] & (1 << 4));
    const volumeDownButton = Boolean(eventData[58] & (1 << 5));

    const structuredEventData = {
        axisX,
        axisY,
        triggerButton,
        homeButton,
        backButton,
        touchpadButton,
        volumeUpButton,
        volumeDownButton
    };

    logTouchPadValues(structuredEventData);
    logControllerButtons(structuredEventData);

    logEventData(eventData);
}

const onClickScan = () => {
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: Object.values(SERVICES).map(getUUID)
    })
        .then(onDevicePaired)
        .then(onDeviceConnected)
        .then(onServiceRetrieved)
        .then(onWriteCharacteristicRetrieved)
        .then(onNotifyCharacteristicRetrieved)
    ;
};

const onClickSetSensorMode = () =>
    customServiceWrite
        .writeValue(getLittleEndianUint8Array(MODES.SENSOR_MODE))
        .then(() => logMessage('Device set to SENSOR mode!'))
        .catch(e => logMessage(`Error: ${e}`));

const onClickSetOffMode = () =>
    customServiceWrite
        .writeValue(getLittleEndianUint8Array(MODES.OFF_MODE))
        .then(() => logMessage('Device set to OFF mode!'))
        .catch(e => logMessage(`Error: ${e}`));

const onClickSetVRMode = () =>
    customServiceWrite
        .writeValue(getLittleEndianUint8Array(MODES.VR_MODE))
        .then(() => logMessage('Device set to VR mode!'))
        .catch(e => logMessage(`Error: ${e}`));

const onClickDisconnect = () => gattServer && gattServer.disconnect();