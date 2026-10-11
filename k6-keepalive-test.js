import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

const BASE_URL = 'http://localhost:8080'; // Ou a URL do Mulesoft Flex Gateway

export default function () {
  http.get(`${BASE_URL}/fast-small`);

  // Pausa maior que o keepAliveTimeout (1s) para forçar o reaproveitamento de socket morto
  //sleep(1.5); 

  // Pausa rápida para expirar o timeout de 1ms do Node.js e forçar o reuso do socket morto
  sleep(0.01);  
}