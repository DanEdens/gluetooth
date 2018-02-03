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
const userSelection = {
    service:             SERVICES.UNKNOWN1,
    characteristicIndex: 1,
    characteristicRef:   null
};

// 2B
const onDeviceConnected = server => {
    logMessage(`(ID ${server.device.id}) GATT connected.`);

    disconnectButton.disabled = false;
    gattServer                = server;

    window.foo = server;

    return server.getPrimaryService(
        getUUID(userSelection.service)
    );
};

// 3
const onServiceRetrieved = service => {
    logMessage(`Service retrieved.`);

    userSelection.characteristicIndex = parseFloat(
        prompt(
            [
                `Characteristics of service ${userSelection.service}:`,
                CHARACTERISTICS[userSelection.service]
                    .map((row, i) => `${i} = ${row[0]}`)
                    .join('\n')
            ].join('\n\n'),
            userSelection.characteristicIndex.toString()
        )
    );

    return service.getCharacteristic(
        getUUID(getCharacteristic(userSelection.service, userSelection.characteristicIndex))
    );
};


const onCharacteristicRetrieved = characteristic => {
    characteristic.addEventListener('characteristicvaluechanged', onValueChanged);
    logMessage(`Characteristic event listener active!`);

    userSelection.characteristicRef = characteristic;

    return characteristic.readValue()
        .then(onCharacteristicRead);
};

let prevUI8A;

const onCharacteristicRead = value => {
//    logMessage(`Characteristic read:`);


    const ui8a = new Uint8Array(value.buffer);
    if (prevUI8A) {
        let difference = prevUI8A.filter(x => !ui8a.includes(x));
        if (difference.length) {
            console.log(`Diff: ${difference}`);
        }
    }

    prevUI8A = ui8a;
//    logMessage(value ? value.getUint8(0) : value);

    userSelection.characteristicRef.readValue()
        .then(onCharacteristicRead);
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
    ;
};

const onClickDisconnect = () => gattServer && gattServer.disconnect();