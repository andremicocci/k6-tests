const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Payload grande pré-gerado (aprox. 100KB)
const largePayload = {
  data: Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    message: `Item número ${i} gerado para simular um payload pesado no teste de carga.`
  }))
};

const smallPayload = { status: "ok", message: "Payload leve" };

// 1. Rápido + Pequeno
app.get('/fast-small', (req, res) => {
  res.json(smallPayload);
});

// 2. Rápido + Grande
app.get('/fast-large', (req, res) => {
  res.json(largePayload);
});

// 3. Lento + Pequeno (delay de 500ms)
app.get('/slow-small', (req, res) => {
  setTimeout(() => {
    res.json(smallPayload);
  }, 500);
});

// 4. Lento + Grande (delay de 500ms)
app.get('/slow-large', (req, res) => {
  setTimeout(() => {
    res.json(largePayload);
  }, 500);
});

// 5. Endpoint de Destruição Abrupta de Socket
app.get('/crash-socket', (req, res) => {
  // Destrói o socket imediatamente sem retornar headers HTTP
  res.socket.destroy();
});

//app.listen(PORT, () => {
//  console.log(`Mock service rodando na porta ${PORT}`);
//});

const server = app.listen(PORT, () => {
  console.log(`Mock service rodando na porta ${PORT}`);
});

// Força o fechamento prematuro de conexões ociosas para simular ECONNRESET / socket hung up
//server.keepAliveTimeout = 1000; // 1 segundo
//server.headersTimeout = 1000;   // 1 segundo

// Força o Node.js a descartar conexões ociosas imediatamente
server.keepAliveTimeout = 5; // 5 milissegundos
server.headersTimeout = 5;