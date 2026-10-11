import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '10s',
};

export default function () {
  // URL do endpoint de destino
  const url = 'http://load-test-mock-svc/api/seu-endpoint-post';

  // Payload convertido para string JSON
  const payload = JSON.stringify({
    campo1: "valor_exemplo",
    status: "ativo",
    quantidade: 42
  });

  // Configuração dos headers (Content-Type e Token Bearer)
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eisasd.sadasdsa...',
    },
  };

  // Executa a requisição POST
  let res = http.post(url, payload, params);

  // Validações de sucesso
  check(res, {
    'status é 200 ou 201': (r) => r.status === 200 || r.status === 201,
  });

  sleep(1);
}