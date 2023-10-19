const express = require('express')
const http = require('http')
const app = express()
app.use("/", function (req, res) {
    res.header("Content-Type", "text/html; charset=utf-8"); // UTF-8 설정
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
    ws.on('message', (msg) => { // 클라이언트로부터 받아오는 코드
        console.log(' 사장님 / 10분');
        console.log('user : ' + msg);
       // ws.send(msg); // 다시 클라이언트에게 보내는 코드
     
        if (msg.includes('owner')) {
            if (msg instanceof Buffer) {
                msg = msg.toString('utf8'); // 또는 다른 인코딩을 사용할 수 있음
                
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

        // 클라이언트 연결 종료 시 Set에서 제거
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
