# Projeto API Bancária - NestJS 

Este projeto implementa uma API simulada usando o framework [NestJS](https://nestjs.com/). O objetivo é criar endpoints para manipular contas bancárias simuladas e realizar transferências, com integrações em mock backends.

> Projeto feito e testado dentro do WSL (Windows Subsystem Linux)

## Recursos Implementados

1. **Abertura de Conta**
   - Endpoint que permite abrir uma conta vinculada a um cliente.
   - Integração com um mock backend para criar a conta.
   - Gera um identificador único (`accountId`) e armazena a conta localmente em uma estrutura simulada de banco de dados.

2. **Consulta de Extrato**
   - Endpoint que retorna o balanço e as transações de uma conta específica.
   - Validação para garantir que a conta existe.

3. **Transferências**
   - Endpoint que permite realizar transferências entre contas.
   - Integração com um mock backend para simular a realização da transferência.
   - Validação de tokens de autorização para garantir segurança.

4. **Autenticação (AUTH)**
   - Registro e login de usuários para geração de tokens de acesso.

5. **Verificação de Identidade (KYC)**
   - Upload de selfies e documentos para verificação de identidade.

## Tecnologias Utilizadas

- [NestJS](https://nestjs.com/): Framework para aplicações Node.js.
- [Axios](https://axios-http.com/): Cliente HTTP para integrações com mock backends.
- [RxJS](https://rxjs.dev/): Utilizado para manipular fluxos de dados.
- [class-validator](https://github.com/typestack/class-validator): Para validação de dados de entrada.

## Instalação e Execução

1. Clone o repositório:

   ```bash
   git clone <url-do-repositorio>
   cd <nome-do-projeto>
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```env
   MOCK_URL=<url-do-mock-backend | http://localhost:8080>
   NODE_ENV=<dev | prod | test>
   PORT=<porta>
   ```

4. Execute o projeto:

   ```bash
   npm run dev
   ```

   A API estará disponível em `http://localhost:3000`.

## Endpoints Disponíveis

**Extensão REST CLIENT**
- Foi usado uma extensão como client http chamada [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client)
para fazer as requisições para os end-points.

1. Abra o seu Vscode (Extensões)

2. Pesquise por REST Client (Faça a instalação)

3. Acesse o arquivo client.http na raiz do projeto e clique em "Send request" 

4. Pronto você já pode testar todas as rotas disponíveis


### Registro de Usuário

> ⚠️ Atenção é usar os mesmos valores do exemplo para que seja aceito dentro do mock ⚠️

**POST** `/auth/register`

- **Headers:**
  - `Content-Type`: `application/json`

- **Body:**

  ```json
  {
    "client_id": "test",
    "client_secret": "secret"
  }
  ```

- **Resposta:**

  ```json
  {
    "message": "User registered successfully"
  }
  ```

### Login de Usuário

**POST** `/auth/login`

- **Headers:**
  - `Content-Type`: `application/json`

- **Body:**

  ```json
  {
    "client_id": "test",
    "client_secret": "secret"
  }
  ```

- **Resposta:**

  ```json
  {
    "access_token": "mocked-access-token"
  }
  ```

### Abertura de Conta

**POST** `/account/open`

- **Headers:**
  - `Authorization`: `Bearer <access-token>`

- **Body:**

  ```json
  {
    "client_id": "string"
  }
  ```

- **Resposta:**

  ```json
  {
    "mockResponse": {
      "status": "ok"
    },
    "accountId": "acc-1697164835632"
  }
  ```

### Consulta de Extrato

**GET** `/account/statement/:accountId`

- **Parâmetros:**
  - `accountId`: ID da conta a ser consultada.

- **Resposta:**

  ```json
  {
    "balance": 0,
    "transactions": []
  }
  ```

### Transferência

**POST** `/transfer`

- **Headers:**
  - `Authorization`: `Bearer <access-token>`

- **Body:**

  ```json
  {
    "amount": 100,
    "account": "acc-1697164835632",
    "currency": "USD"
  }
  ```

- **Resposta:**

  ```json
  {
    "status": "ok"
  }
  ```

### Verificação de Identidade (KYC)

> Atenção: Extensões permitidas ('.jpg', '.jpeg', '.png', '.pdf')

- Já existe dois arquivos de teste dentro da pasta ./docs no projeto para ser testado, basta clicar em "Send Request"

#### Upload de Selfie

**POST** `/kyc/upload-selfie`

- **Headers:**
  - `Content-Type`: `multipart/form-data`
  - `Authorization`: `Bearer <accessToken>`

- **Body:**

  Multipart form data com os seguintes campos:
  - `name`: "file"
  - `file`: arquivo de selfie (ex.: `selfie.jpg`)

- **Resposta:**

  ```json
  {
    "message": "Document uploaded successfully",
    "filename": "selfie.jpg",
    "filePath": "uploads/selfie.jpg"
  }
  ```

#### Upload de Documento

**POST** `/kyc/upload-doc`

- **Headers:**
  - `Content-Type`: `multipart/form-data`
  - `Authorization`: `Bearer <accessToken>`

- **Body:**

  Multipart form data com os seguintes campos:
  - `name`: "file"
  - `file`: arquivo do documento (ex.: `doc.pdf`)

- **Resposta:**

  ```json
  {
    "message": "Document uploaded successfully",
    "filename": "doc.pdf",
    "filePath": "uploads/doc.pdf"
  }
  ```

## Testes

1. Execute os testes:

   ```bash
   npm run test
   ```

2. Para executar os testes em modo watch:

   ```bash
   npm run test:watch
   ```

## Melhorias Futuras

- Persistência em um banco de dados real.
- Adição de autenticação e controle de acesso mais robusto.
- Implementação de logs para monitoramento.
- Suporte a diferentes tipos de transferências (nacionais/internacionais).

---

Desenvolvido com [NestJS](https://nestjs.com/) e ❤️.

