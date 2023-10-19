const express = require('express')
const http = require('http')
const app = express()
app.use("/", function (req, res) {
    res.header("Content-Type", "text/html; charset=utf-8"); // UTF-8 ����
    res.sendFile(__dirname + '/index.html');

});

app.listen(8080);

const WebSocket = require('ws');
const clients = new Set();


const socket = new WebSocket.Server({
    port: 8082
});

socket.on('connection', (ws, req) => {
    clients.add(ws);
    ws.on('message', (msg) => { // Ŭ���̾�Ʈ�κ��� �޾ƿ��� �ڵ�
        console.log(' ����� / 10��');
        console.log('user : ' + msg);
       // ws.send(msg); // �ٽ� Ŭ���̾�Ʈ���� ������ �ڵ�
     
        if (msg.includes('owner')) {
            if (msg instanceof Buffer) {
                msg = msg.toString('utf8'); // �Ǵ� �ٸ� ���ڵ��� ����� �� ����
                
            }
            var parts = msg.split('/');
            var store = parts[0];
            console.log(store);
            broadcastMessage(msg);

            ws.send(store + '/' + parts[2]);
        }
        
        console.log(`Socket connected : `);
    })

    ws.on('close', () => {
        console.log('Client disconnected');

        // Ŭ���̾�Ʈ ���� ���� �� Set���� ����
        clients.delete(ws);
    });
});

function broadcastMessage(message) {
    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}
