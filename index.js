const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    const { type, receiverId, file } = parsedMessage;

    if (type === 'register') {
      clients.set(receiverId, ws);
      ws.receiverId = receiverId;
      // console.log(`Client registered with ID: ${receiverId}`);
    } else if (type === 'file') {
      const receiverWs = clients.get(receiverId);
      if (receiverWs) {
        receiverWs.send(JSON.stringify({ type: 'file', file }));
        // console.log(`File sent to client with ID: ${receiverId}`);
      } else {
        console.log(`Client with ID: ${receiverId} not found`);
      }
    }
  });

  ws.on('close', () => {
    clients.delete(ws.receiverId);
    console.log(`Client with ID: ${ws.receiverId} disconnected`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
