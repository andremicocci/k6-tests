No Rancher Desktop com WSL, o Docker e o Kubernetes compartilham o mesmo ambiente por padrão (utilizando o motor Moby). Isso significa que você não precisa carregar a imagem manualmente com comandos de load específicos.

Execute os passos diretamente no seu terminal WSL (como Ubuntu):

1. Construir a Imagem Docker
Abra o seu terminal WSL na pasta do projeto e execute o build:

Bash
docker build -t load-test-mock:latest .
Verificação: Execute docker images e confirme se load-test-mock:latest aparece na listagem.

2. Aplicar os Manifestos no Kubernetes
O kubectl do Rancher Desktop já está integrado ao contexto do cluster local. Com o arquivo k8s-manifest.yaml no diretório, aplique-o:

Bash
kubectl apply -f k8s-manifest.yaml
Verificação: Execute kubectl get pods -l app=load-test-mock e aguarde até que o status mude para Running.

3. Testar a Conectividade
Inicie um redirecionamento de porta para validar os endpoints localmente:

Bash
kubectl port-forward svc/load-test-mock-svc 8080:80
Em outro terminal WSL, faça uma requisição de teste:

Bash
curl http://localhost:8080/fast-small
Verificação: O comando deve retornar o JSON {"status":"ok","message":"Payload leve"} imediatamente.


TESTE DE CARGA
k6 run load-test.js

K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=relatorio-carga.html k6 run load-test.js

K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=relatorio-carga.html k6 run k6-direct.js





  426  docker build -t load-test-mock:latest .
  427  kubectl rollout restart deployment/load-test-mock

kubectl apply -f k6-runner-pod.yaml  
kubectl cp load-test.js k6-runner:/scripts/load-test.js
kubectl exec -it k6-runner -- k6 run /scripts/load-test.js