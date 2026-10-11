import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Cria uma métrica customizada para rastrear exclusivamente erros 5xx
const serverErrorRate = new Rate('erros_servidor_5xx');

export const options = {
  vus: 10,
  duration: '15s',
  thresholds: {
    // Reprova o teste se a taxa de erros 5xx for maior que 5% (0.05). 
    // Para 1%, use 'rate < 0.01'. Para 0% (zero tolerância), use 'rate == 0'.
    'erros_servidor_5xx': ['rate < 0.05'],
    
    // Opcional: Garante que pelo menos 95% de todos os checks gerais passem com sucesso
    'checks': ['rate > 0.95'],
  },
};

export default function () {
  const url = 'http://load-test-mock-svc/fast-small'; // ou sua rota POST
  
  const payload = JSON.stringify({ campo: "valor" });
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eisasd.sadasdsa...',
    },
  };

  let res = http.post(url, payload, params);

  // Adiciona 1 (true) se for erro 5xx ou 0 (false) se for qualquer outro status
  serverErrorRate.add(res.status >= 500 && res.status < 600);

  // Checks dinâmicos para inventário de status codes
  const statusKey = `HTTP Response: ${res.status}`;
  check(res, {
    [statusKey]: (r) => true,
    'Não é erro de servidor (5xx)': (r) => r.status < 500,
  });

  sleep(0.5);
}