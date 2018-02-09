const WebSocketServer = require('websocket').server;
const http            = require('http');
const url             = require('url');
const fs              = require('fs');

const {moveMouse, keyTap} = require('robotjs');

const server = http.createServer((request, response) => {
    try {
        const {pathname}    = url.parse(request.url);
        const requestedFile = pathname === '/' ? '/index.html' : pathname;


        const fileStream = fs.createReadStream(__dirname + requestedFile);

        fileStream.pipe(response);

        fileStream.on('open', () => response.writeHead(200));
        fileStream.on('error', () => {
            response.writeHead(404);
            response.end();
        });

    } catch (e) {
        response.writeHead(500);
        response.end();
    }
}).listen(9000);


const wsServer = new WebSocketServer({
    httpServer:            server,
    autoAcceptConnections: false
});

const mousePosition = {x: 0, y: 0};
const moveCursor    = ({up, left, right, down}) => {
    if (up) {
        mousePosition.y--;
    }

    if (down) {
        mousePosition.y++;
    }

    if (left) {
        mousePosition.x--;
    }

    if (right) {
        mousePosition.x++;
    }

    if (up || down || left || right) {
        moveMouse(mousePosition.x, mousePosition.y);
    }
};

wsServer.on('request', request => {
    if (request.origin === 'http://localhost:9000') {
        const connection = request.accept('gluetooth', request.origin);

        console.log(Date.now() + ' Connection accepted.');

        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                const {left, right, up, down, button0, button1, button4, button3} = JSON.parse(message.utf8Data);

                if (left) {
                    keyTap('left');
                } else if (right) {
                    keyTap('right');
                } else if (up) {
                    keyTap('up');
                } else if (down) {
                    keyTap('down');
                }

                button0 && keyTap('a');
                button1 && keyTap('z');
                button3 && keyTap('enter');
                button4 && keyTap('control');

                //moveCursor({up, down, left, right});

            }
        });

        connection.on('close', () => {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
        });
    } else {
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
    }
});