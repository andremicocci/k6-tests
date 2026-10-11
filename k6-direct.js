import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 50,
  duration: '20s',
};

export default function () {
  let res = http.get('http://localhost:31844/crash-socket');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  // Pausa rápida para expirar o timeout de 1ms do Node.js e forçar o reuso do socket morto
  sleep(0.01); 
}