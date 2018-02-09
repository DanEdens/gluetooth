const logDisplay             = document.getElementById('logDisplay');
const eventDataDisplay       = document.getElementById('eventDataDisplay');
const eventData3FloatDisplay = document.getElementById('eventData3FloatDisplay');

const touchpadDisplayDotStyle  = document.getElementById('touchpadDisplayDot').style;
const touchpadMaxValuesDisplay = document.getElementById('touchpadMaxValuesDisplay');

const controllerButtonsDisplay = document.getElementById('controllerButtonsDisplay');
const aframeBox                = document.getElementById('aframeBox');


const setOffModeButton    = document.getElementById('setOffModeButton');
const setSensorModeButton = document.getElementById('setSensorModeButton');
const setVRModeButton     = document.getElementById('setVRModeButton');
const disconnectButton    = document.getElementById('disconnectButton');

// Event data byte view
(() => {
    for (let i = 0; i < 60; i++) {
        let codeElement;

        codeElement       = document.createElement('code');
        codeElement.title = `Byte ${i}`;
        eventDataDisplay.appendChild(codeElement);
    }
})();

const logMessage = message => {
    logDisplay.innerHTML += '<br>' + message;
    console.log(message);
};

const logEventData = eventData => {
    eventData.forEach((v, i) => {
        eventDataDisplay.children[i].innerHTML = v;
    });
};

const logEventData3Float = float3 => {
    eventData3FloatDisplay.innerHTML = [
        `X = ${float3[0]}`,
        `Y = ${float3[1]}`,
        `Z = ${float3[2]}`
    ].join('<br>');
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
    service: SERVICES.CUSTOM_SERVICE
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
    axisY: 0
};

// Where to start looking for 3 sets of 4 bytes each for float[3]
window.eulerOrder = 'XYZ';
let lastEventDataUint8Array;

// Combination of
// com.samsung.android.app.vr.input.service/c/c.class:L47
// com.samsung.android.app.vr.input.service/c/c.class:L71
// com.samsung.android.app.vr.input.service/c/c.class:L115
function getFloat0FromArrayBufferAtIndex(arrayBuffer, index) {
    const arrayOfShort = new Int16Array(arrayBuffer.slice(16 * index + 4, 16 * index + 5 + 1));
    return (new Float32Array([arrayOfShort[0] * 10000.0 * 9.80665 / 2048.0]))[0];
}

function getFloat1FromArrayBufferAtIndex(arrayBuffer, index) {
    const arrayOfShort = new Int16Array(arrayBuffer.slice(16 * index + 6, 16 * index + 7 + 1));
    return (new Float32Array([arrayOfShort[0] * 10000.0 * 9.80665 / 2048.0]))[0];
}

function getFloat2FromArrayBufferAtIndex(arrayBuffer, index) {
    const arrayOfShort = new Int16Array(arrayBuffer.slice(16 * index + 8, 16 * index + 9 + 1));
    return (new Float32Array([arrayOfShort[0] * 10000.0 * 9.80665 / 4096.0]))[0];
}


function getFloat3FromArrayBufferAtIndex(arrayBuffer, index) {
    const arrayOfShort = new Int16Array(arrayBuffer.slice(16 * index + 10, 16 * index + 11 + 1));
    return (new Float32Array([arrayOfShort[0] * 10000.0 * 9.80665 / 2048.0]))[0];
}

function getFloat4FromArrayBufferAtIndex(arrayBuffer, index) {
    const arrayOfShort = new Int16Array(arrayBuffer.slice(16 * index + 12, 16 * index + 13 + 1));
    return (new Float32Array([arrayOfShort[0] * 10000.0 * 9.80665 / 2048.0]))[0];
}

function getFloat5FromArrayBufferAtIndex(arrayBuffer, index) {
    const arrayOfShort = new Int16Array(arrayBuffer.slice(16 * index + 14, 16 * index + 15 + 1));
    return (new Float32Array([arrayOfShort[0] * 10000.0 * 9.80665 / 2048.0]))[0];
}

// Get vector3 length
// com.samsung.android.app.vr.input.service/ui/c.class:L115
function getLength(f1, f2, f3) {
    return Math.sqrt(f1 ** 2 + f2 ** 2 + f3 ** 2);
}


function logOrientation({angleX, angleY, angleZ}) {
    aframeBox.object3D.rotation.set(
        angleX,
        angleY,
        angleZ,
        window.eulerOrder
    );
    // const o = aframeBox.object3D;
    // o.setRotationFromAxisAngle(new THREE.Vector3(1,0,0), angleX);
    // o.setRotationFromAxisAngle(new THREE.Vector3(0,1,0), angleY);
    // o.setRotationFromAxisAngle(new THREE.Vector3(0,0,1), angleZ);
}

function onEventDataChanged(e) {
    const {buffer} = e.target.value;

    const eventData = new Uint8Array(buffer);

    // Max observed value = 315
    // (should correspond to touchpad sensitive dimension in mm)
    // VERIFIED!
    const axisX = (
        ((eventData[3 * 16 + 6] & 0xF) << 6) +
        ((eventData[3 * 16 + 6 + 1] & 0xFC) >> 2)
    ) & 0x3FF;

    // Max observed value = 315
    const axisY = (
        ((eventData[3 * 16 + 6 + 1] & 0x3) << 8) +
        ((eventData[3 * 16 + 6 + 2] & 0xFF) >> 0)
    ) & 0x3FF;

    // com.samsung.android.app.vr.input.service/ui/c.class:L222
    const timestamp = ((new Int32Array(buffer.slice(0, 4))[0]) & 0xFFFFFFFF) / 1000;

    // com.samsung.android.app.vr.input.service/ui/c.class:L222
    const temperature = eventData[3 * 16 + 6 + 3];

    // There are 3 frames of accelerometer, gyroscope and magnet

    // Accelerometer values
    const float0 = getFloat0FromArrayBufferAtIndex(buffer, 0);
    const float1 = getFloat1FromArrayBufferAtIndex(buffer, 0);
    const float2 = getFloat2FromArrayBufferAtIndex(buffer, 0);
    const length = getLength(float0, float1, float2);

    // Gyroscope values
    // const float3 = getFloat3FromArrayBufferAtIndex(buffer, floatOffset);
    // const float4 = getFloat4FromArrayBufferAtIndex(buffer, floatOffset);
    // const float5 = getFloat5FromArrayBufferAtIndex(buffer, floatOffset);

    // todo: Magnetometer values still missing?

    // These are euler angles, probably

    // Factor to convert radians to degrees
    // = 180 / Math.PI
    // = 57.2957

    // com.samsung.android.app.vr.input.service/ui/c.class:L313
    const angleXDeg = Math.floor(Math.asin(float0 / length) * 57.29578);

    const angleX = Math.asin(float0 / length);

    // com.samsung.android.app.vr.input.service/ui/c.class:L317
    const angleYDeg = Math.floor(Math.asin(float1 / length) * 57.29578);
    const angleY    = Math.asin(float1 / length);

    // com.samsung.android.app.vr.input.service/ui/c.class:L321
    const angleZDeg = 90 - Math.floor(Math.acos(float2 / length) * 57.29578);

    const angleZ = Math.PI * 0.5 - Math.acos(float2 / length);


    const triggerButton    = Boolean(eventData[58] & (1 << 0));
    const homeButton       = Boolean(eventData[58] & (1 << 1));
    const backButton       = Boolean(eventData[58] & (1 << 2));
    const touchpadButton   = Boolean(eventData[58] & (1 << 3));
    const volumeUpButton   = Boolean(eventData[58] & (1 << 4));
    const volumeDownButton = Boolean(eventData[58] & (1 << 5));

    const structuredEventData = {
        // incorrect interpretation of values:
        angleX,
        angleY,
        angleZ,

        // correct:
        timestamp,
        temperature,
        axisX,
        axisY,
        triggerButton,
        homeButton,
        backButton,
        touchpadButton,
        volumeUpButton,
        volumeDownButton

        // missing:
        // magnetometerX
        // magnetometerY
        // magnetometerZ
        // flags
    };

    logTouchPadValues(structuredEventData);
    logControllerButtons(structuredEventData);
    logOrientation(structuredEventData);

    //logEventData(eventData);
    logEventData3Float([
        timestamp,
        temperature,
        angleZ
    ]);

    updateHistogram(eventData);

    lastEventDataUint8Array = eventData;
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

const onClickSetEulerOrder = () => window.eulerOrder = prompt('Euler order', window.eulerOrder).toUpperCase();

const saveByteArray = (data, name) => {
    const a    = document.createElement("a");
    const url  = window.URL.createObjectURL(new Blob([data]));
    a.href     = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
};

const onClickDownloadEventData = () => saveByteArray(lastEventDataUint8Array || [], 'eventData.binary');