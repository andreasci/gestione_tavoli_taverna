const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let connectedClients = [];

wss.on('connection', (ws) => {
    console.log("Nuovo utente connesso");
    connectedClients.push(ws);

    ws.on('message', (message) => {
        console.log("Messaggio ricevuto:", message);
        // Invia l'aggiornamento a tutti i client connessi
        connectedClients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        connectedClients = connectedClients.filter(client => client !== ws);
    });
});

server.listen(3000, () => console.log("Server WebSocket in ascolto sulla porta 3000"));
