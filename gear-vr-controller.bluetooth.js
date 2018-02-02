const valueDisplay     = document.getElementById('valueDisplay');
const disconnectButton = document.getElementById('disconnectButton');

const logMessage = message => {
    valueDisplay.innerHTML += '<br>' + message;
    console.log(message);
};

// 1
const onDevicePaired = device => {
    logMessage(`${device.name} paired.`);

    device.addEventListener('gattserverdisconnected', onDeviceDisconnected);

    return device.gatt.connect();
};

// 2A
const onDeviceDisconnected = ({target}) => {
    logMessage(`${target.name} disconnected.`);
    disconnectButton.disabled = true;
};


let gattServer;

// 2B
const onDeviceConnected = server => {
    logMessage(`(ID ${server.device.id}) GATT connected.`);

    disconnectButton.disabled = false;
    gattServer                = server;

    return server.getPrimaryService(
        getUUID(SERVICES.BATTERY_SERVICE)
    );
};

// 3
const onServiceRetrieved = service => {
    logMessage(`Service retrieved.`);

    return service.getCharacteristic(
        getUUID(getCharacteristic(SERVICES.BATTERY_SERVICE, 0))
    );
};

const onCharacteristicRetrieved = characteristic => {
    characteristic.addEventListener('characteristicvaluechanged', onValueChanged);
    return characteristic.readValue();
};

const onCharacteristicRead = value => {
    logMessage(`Characteristic read: ${value ? value.getUint8(0) : value}`);
};


function onValueChanged({target}) {
    if (target.value) {
        const {buffer} = target.value.buffer;

        if (!buffer) return;

        const ascii  = arrayBufferToString(buffer);
        const values = Array.prototype.map.call(buffer, (val, i) => val.getUint8(i));

        logMessage(`characteristicvaluechanged => ${ascii}<br>${values}`);
    }
}

const onClickScan = () => {
    navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: Object.values(SERVICES).map(getUUID)
    })
        .then(onDevicePaired)
        .then(onDeviceConnected)
        .then(onServiceRetrieved)
        .then(onCharacteristicRetrieved)
        .then(onCharacteristicRead)
    ;
};

const onClickDisconnect = () => gattServer && gattServer.disconnect();