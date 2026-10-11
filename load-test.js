import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Alta concorrência para forçar o pool de conexões TCP a reutilizar sockets
  vus: 50,
  duration: '30s',
};

export default function () {
  let res = http.get('http://load-test-mock-svc/fast-small');

  // Valida se foi 200 ou se ocorreu erro de rede a nível de transporte
  let isSuccess = check(res, {
    'status é 200': (r) => r.status === 200,
  });

  // Se houver falha de transporte (ECONNRESET / socket hung up), o k6 registra r.status == 0
  if (!isSuccess && res.status === 0) {
    console.log(`Erro de rede capturado: ${res.error}`);
  }

  // Pausa milimétrica: grande o suficiente para o Node fechar o socket (5ms),
  // mas curta o suficiente para o k6 tentar reusá-lo logo em seguida.
  sleep(0.01); 
}