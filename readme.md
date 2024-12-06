
```markdown
# Copy-App Backend

Copy-App é um backend desenvolvido em Node.js que automatiza a criação de publicações baseadas em notícias climáticas, com integração à NewsAPI e ao ChatGPT.

## Endpoints da API

Abaixo estão os endpoints disponíveis, com exemplos de como utilizá-los via `cURL`.

---

### **Registro de Usuário**
Endpoint para registrar um novo usuário.

**URL:**  
`POST http://localhost:3000/api/auth/register`

**Headers:**  
`Content-Type: application/json`

**Body:**  
```json
{
  "username": "GuiHi",
  "email": "guihi@fieldpro.com.br",
  "password": "fieldpro"
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "GuiHi", "email": "guihi@fieldpro.com.br", "password": "fieldpro"}'
```

---

### **Login de Usuário**
Endpoint para autenticar um usuário e obter um token JWT.

**URL:**  
`POST http://localhost:3000/api/auth/login`

**Headers:**  
`Content-Type: application/json`

**Body:**  
```json
{
  "email": "guihi@fieldpro.com.br",
  "password": "fieldpro"
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "guihi@fieldpro.com.br", "password": "fieldpro"}'
```

---

### **Buscar Notícias e Criar Publicações**
Endpoint para buscar notícias personalizadas e criar publicações baseadas nelas.

**URL:**  
`POST http://localhost:3000/api/news/climate-news`

**Headers:**  
- `Authorization: Bearer <JWT_TOKEN>`  
- `Content-Type: application/json`

**Body:**  
```json
{
  "keywords": "clima+chuva",
  "source": "uol.com.br"
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3000/api/news/climate-news \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "keywords": "clima+chuva",
    "source": "uol.com.br"
  }'
```

---

### **Excluir Publicação**
Endpoint para excluir uma publicação pelo seu ID.

**URL:**  
`DELETE http://localhost:3000/api/publication/:id`

**Headers:**  
- `Authorization: Bearer <JWT_TOKEN>`

**Exemplo cURL:**
```bash
curl -X DELETE http://localhost:3000/api/publication/6752d0c5d8ec1e0c24d16157 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

### **Editar Publicação**
Endpoint para editar campos de uma publicação específica.

**URL:**  
`PUT http://localhost:3000/api/publications/:id`

**Headers:**  
- `Authorization: Bearer <JWT_TOKEN>`  
- `Content-Type: application/json`

**Body:**  
```json
{
  "pageId": "Capa",
  "field": "Title",
  "value": "Novo Título Atualizado"
}
```

**Exemplo cURL:**
```bash
curl -X PUT http://localhost:3000/api/publications/67521040ea1a1c9d9c17df84 \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "pageId": "Capa",
    "field": "Title",
    "value": "Novo Título Atualizado"
  }'
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
PORT=3000
JWT_SECRET=sua_chave_secreta
NEWS_API_KEY=sua_chave_da_newsapi
MONGO_URI=sua_conexão_mongodb
```

---

## Tecnologias Utilizadas

- **Node.js** e **Express** para o backend.
- **JWT** para autenticação.
- **MongoDB** para persistência de dados.
- **NewsAPI** para buscar notícias.
- **OpenAI GPT** para geração de conteúdo.

---

## Como Rodar o Projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/copy-app.git
   cd copy-app
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env`.
4. Inicie o servidor:
   ```bash
   npm start
   ```
5. O backend estará disponível em `http://localhost:3000`.

---

## Contribuição

Sinta-se à vontade para abrir issues ou enviar pull requests para melhorias e novas funcionalidades.

---

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para obter mais informações.
```

Este arquivo inclui os comandos `cURL`, configurações e instruções detalhadas para utilizar a API e rodar o projeto. Caso algo precise ser ajustado ou complementado, é só avisar!
