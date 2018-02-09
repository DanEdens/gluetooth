class ControllerBluetoothInterface {
    constructor(onControllerDataReceived, onDeviceDisconnected) {
        this.gattServer               = null;
        this.batteryService           = null;
        this.deviceInformationService = null;
        this.customService            = null;
        this.customServiceNotify      = null;
        this.customServiceWrite       = null;

        this.pair       = this.pair.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.runCommand = this.runCommand.bind(this);

        this.onDeviceConnected      = this.onDeviceConnected.bind(this);
        this.onNotificationReceived = this.onNotificationReceived.bind(this);

        if (onDeviceDisconnected) {
            this.onDeviceDisconnected = onDeviceDisconnected.bind(this);
        }

        if (onControllerDataReceived) {
            this.onControllerDataReceived = onControllerDataReceived.bind(this);
        }
    }

    onDeviceConnected(device) {
        if (this.onDeviceDisconnected) {
            device.addEventListener('gattserverdisconnected', onDeviceDisconnected);
        }

        return device.gatt.connect();
    }

    pair() {
        return navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [
                ControllerBluetoothInterface.UUID_CUSTOM_SERVICE
            ]
        })
            .then(this.onDeviceConnected)
            .then(gattServer => this.gattServer = gattServer)

            // Get custom service
            .then(() => this.gattServer.getPrimaryService(ControllerBluetoothInterface.UUID_CUSTOM_SERVICE))
            .then(customService => this.customService = customService)

            //todo: battery service, device information service

            .then(() => this.customService
                .getCharacteristic(ControllerBluetoothInterface.UUID_CUSTOM_SERVICE_WRITE)
                .then(characteristic => this.customServiceWrite = characteristic))

            .then(() => this.customService
                .getCharacteristic(ControllerBluetoothInterface.UUID_CUSTOM_SERVICE_NOTIFY)
                .then(characteristic => this.customServiceNotify = characteristic))

            .then(() => this.customServiceNotify
                .startNotifications()
                .then(() => this.customServiceNotify.addEventListener('characteristicvaluechanged', this.onNotificationReceived)))
            ;
    }

    disconnect() {
        this.gattServer && this.gattServer.disconnect();
    }

    onNotificationReceived(e) {
        const {buffer}  = e.target.value;
        const eventData = new Uint8Array(buffer);

        // Max observed value = 315
        // (corresponds to touchpad sensitive dimension in mm)
        const axisX = (
            ((eventData[54] & 0xF) << 6) +
            ((eventData[55] & 0xFC) >> 2)
        ) & 0x3FF;

        // Max observed value = 315
        const axisY = (
            ((eventData[55] & 0x3) << 8) +
            ((eventData[56] & 0xFF) >> 0)
        ) & 0x3FF;

        // com.samsung.android.app.vr.input.service/ui/c.class:L222
        const timestamp = ((new Int32Array(buffer.slice(0, 4))[0]) & 0xFFFFFFFF) / 1000;

        // com.samsung.android.app.vr.input.service/ui/c.class:L222
        const temperature = eventData[57];

        // Orientation values
        const {getFloatWithOffsetFromArrayBufferAtIndex, getLength} = ControllerBluetoothInterface;

        const float0 = getFloatWithOffsetFromArrayBufferAtIndex(buffer, 4, 0);
        const float1 = getFloatWithOffsetFromArrayBufferAtIndex(buffer, 6, 0);
        const float2 = getFloatWithOffsetFromArrayBufferAtIndex(buffer, 8, 0);
        const length = getLength(float0, float1, float2);

        // Gyroscope values
        // const float3 = getFloatWithOffsetFromArrayBufferAtIndex(buffer,10, 0);
        // const float4 = getFloatWithOffsetFromArrayBufferAtIndex(buffer,12, 0);
        // const float5 = getFloatWithOffsetFromArrayBufferAtIndex(buffer,14, 0);

        // todo: Magnetometer values still missing?

        // Factor to convert radians to degrees
        // = 180 / Math.PI
        // = 57.2957

        // com.samsung.android.app.vr.input.service/ui/c.class:L313
        const angleXDeg = Math.floor(Math.asin(float0 / length) * 57.29578);
        const angleX    = Math.asin(float0 / length);

        // com.samsung.android.app.vr.input.service/ui/c.class:L317
        const angleYDeg = Math.floor(Math.asin(float1 / length) * 57.29578);
        const angleY    = Math.asin(float1 / length);

        // com.samsung.android.app.vr.input.service/ui/c.class:L321
        const angleZDeg = 90 - Math.floor(Math.acos(float2 / length) * 57.29578);
        const angleZ    = Math.PI * 0.5 - Math.acos(float2 / length);

        const triggerButton    = Boolean(eventData[58] & (1 << 0));
        const homeButton       = Boolean(eventData[58] & (1 << 1));
        const backButton       = Boolean(eventData[58] & (1 << 2));
        const touchpadButton   = Boolean(eventData[58] & (1 << 3));
        const volumeUpButton   = Boolean(eventData[58] & (1 << 4));
        const volumeDownButton = Boolean(eventData[58] & (1 << 5));

        this.onControllerDataReceived({
            // incorrect interpretation of values?
            angleX,
            angleXDeg,
            angleY,
            angleYDeg,
            angleZ,
            angleZDeg,

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
            // flags
        });
    }

    runCommand(commandValue) {
        const {getLittleEndianUint8Array, onBluetoothError} = ControllerBluetoothInterface;

        return this.customServiceWrite.writeValue(getLittleEndianUint8Array(commandValue))
            .catch(onBluetoothError);
    }
}

ControllerBluetoothInterface.onBluetoothError = e => {
    console.warn('Error: ' + e);
};

ControllerBluetoothInterface.UUID_CUSTOM_SERVICE        = "4f63756c-7573-2054-6872-65656d6f7465";
ControllerBluetoothInterface.UUID_CUSTOM_SERVICE_WRITE  = "c8c51726-81bc-483b-a052-f7a14ea3d282";
ControllerBluetoothInterface.UUID_CUSTOM_SERVICE_NOTIFY = "c8c51726-81bc-483b-a052-f7a14ea3d281";

ControllerBluetoothInterface.CMD_OFF                          = '0000';
ControllerBluetoothInterface.CMD_SENSOR                       = '0100';
ControllerBluetoothInterface.CMD_UNKNOWN_FIRMWARE_UPDATE_FUNC = '0200';
ControllerBluetoothInterface.CMD_CALIBRATE                    = '0300';
ControllerBluetoothInterface.CMD_KEEP_ALIVE                   = '0400';
ControllerBluetoothInterface.CMD_UNKNOWN_SETTING              = '0500';
ControllerBluetoothInterface.CMD_LPM_ENABLE                   = '0600';
ControllerBluetoothInterface.CMD_LPM_DISABLE                  = '0700';
ControllerBluetoothInterface.CMD_VR_MODE                      = '0800';

ControllerBluetoothInterface.getFloatWithOffsetFromArrayBufferAtIndex = (arrayBuffer, offset, index) => {
    const arrayOfShort = new Int16Array(arrayBuffer.slice(16 * index + offset, 16 * index + offset + 2));
    return (new Float32Array([arrayOfShort[0] * 10000.0 * 9.80665 / 2048.0]))[0];
};

ControllerBluetoothInterface.getLength = (f1, f2, f3) => Math.sqrt(f1 ** 2 + f2 ** 2 + f3 ** 2);

ControllerBluetoothInterface.getLittleEndianUint8Array = hexString => {
    const leAB = new Uint8Array(hexString.length >> 1);

    for (let i = 0, j = 0; i + 2 <= hexString.length; i += 2, j++) {
        leAB[j] = parseInt(hexString.substr(i, 2), 16);
    }

    return leAB;
};