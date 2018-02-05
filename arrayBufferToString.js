function arrayBufferToString(buffer, encoding) {
    if (encoding == null) encoding = 'utf8';

    let uint8 = new Uint8Array(buffer);

    if (encoding === 'hex') {
        let out = '';
        for (let i = 0, l = uint8.byteLength; i < l; ++i) {
            out += toHex(uint8[i])
        }

        return out;
    }

    if (encoding === 'base64') {
        str = String.fromCharCode.apply(null, uint8);

        return btoa(str);
    }

    if (encoding === 'binary' ||
        encoding === 'latin1' ||
        !TextDecoder) {
        str = String.fromCharCode.apply(null, uint8);
        return str;
    }


    //TextDecoder way
    if (encoding === 'utf16le') encoding = 'utf-16le';

    let decoder = new TextDecoder(encoding);
    let str     = decoder.decode(uint8);

    return str;
}


function binaryStringToHexString(binaryString) {
    const hex = parseInt(binaryString, 2).toString(16);

    return '0x'+hex.padStart(
        Math.round(hex.length / 2) * 2, '0'
    );
}


function hexToBinaryString(hex) {
    return hex.toString(2);
}

function checkEndian() {
    var arrayBuffer = new ArrayBuffer(2);
    var uint8Array = new Uint8Array(arrayBuffer);
    var uint16array = new Uint16Array(arrayBuffer);
    uint8Array[0] = 0xAA; // set first byte
    uint8Array[1] = 0xBB; // set second byte
    if(uint16array[0] === 0xBBAA) return "little endian";
    if(uint16array[0] === 0xAABB) return "big endian";
    else throw new Error("Something crazy just happened");
}

// JS is LE on x86 and ARM, usually