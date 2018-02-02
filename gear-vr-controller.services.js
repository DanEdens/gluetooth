/*
    Services
        Characteristic : Description
 */
const CHARACTERISTICS = {
    '1879': [
        ['2A4E', '???'],
        ['2A4B', '???'],
        ['2A4A', '???'],
        ['2A4C', '???'],
        ['2A4D', '???'],
        ['2A22', '???'],
        ['2A32', '???']
    ],

    '4F63756C-7573-2054-6872-65656D6F7465': [
        ['C8C51726-81BC-483B-A052-F7A14EA3D281', '???'],
        ['C8C51726-81BC-483B-A052-F7A14EA3D282', '???']
    ],

    'FEF5': [
        ['8082CAA8-41A6-4021-91C6-56F9B954CC34', '???'],
        ['724249F0-5EC3-4B5F-8804-42345AF08651', '???'],
        ['6C53DB25-47A1-45FE-A022-7C92FB334FD4', '???'],
        ['9D8489A3-000C-49D8-9183-855B673FDA31', '???'],
        ['457871E8-D516-4CA1-9116-57D0B17B9CB2', '???'],
        ['5F78DF94-798C-46F5-990A-B3EB6A065C88', '???'],
        ['61C8849C-F639-4765-946E-5C3419BEBB2A', '???'],
        ['64B4E8B5-0DE5-401B-A21D-ACC8DB3B913A', '???'],
        ['42C3DFDD-77BE-4D9C-8454-8F875267FB3B', '???'],
        ['B7DE1EEA-823D-43BB-A3AF-C4903DFCE23C', '???'],
    ],

    // battery_service
    '180F': [
        ['2A19', 'battery_level']
    ],

    // device_information
    '180A': [
        ['2A29', 'manufacturer_name_string'],
        ['2A24', 'model_number_string'],
        ['2A25', 'serial_number_string'],
        ['2A27', 'revision number'],
        ['2A26', 'hardware_revision_string'],
        ['2A28', 'firmware_revision_string'],
        ['2A50', 'software_revision_string']
    ]
};

function getCharacteristic(serviceUUID, index) {
    return CHARACTERISTICS[serviceUUID][index][0].toLowerCase();
}

const SERVICES = {
    BATTERY_SERVICE:    '180F',
    DEVICE_INFORMATION: '180A',
    UNKNOWN2:           '1879',
    UNKNOWN3:           '4F63756C-7573-2054-6872-65656D6F7465',
    UNKNOWN4:           'FEF5',
};

const getUUID = uuid => uuid.length === 4 ? eval(`0x${uuid}`) : uuid.toLowerCase();