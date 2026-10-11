import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '20s',
};

export default function () {
  const url = 'http://load-test-mock-svc/fast-small'; // ou sua rota POST
  let res = http.get(url);

  // 1. Check dinâmico: cria uma chave para CADA status code que a API retornar (ex: HTTP 200, HTTP 404, HTTP 503)
  // O uso de '() => true' garante que ele apenas registre e inventarie o código sem considerá-lo uma "falha de script"
  const statusKey = `HTTP Response: ${res.status}`;

  // 2. Checks estruturados por faixas HTTP padrão
  check(res, {
    [statusKey]: (r) => true, // Registra o contador exato de cada status code isolado
    'Sucesso (2xx)': (r) => r.status >= 200 && r.status < 300,
    'Redirecionamento (3xx)': (r) => r.status >= 300 && r.status < 400,
    'Erro do Cliente (4xx)': (r) => r.status >= 400 && r.status < 500,
    'Erro do Servidor (5xx)': (r) => r.status >= 500,
  });

  sleep(0.5);
}