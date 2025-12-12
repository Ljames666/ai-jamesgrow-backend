# 🧠 JAMESGROW-AI API — Arquitetura de Referência para Sistemas de IA com Multi-Provider LLM

[![NestJS](https://img.shields.io/badge/NestJS-10+-e11d48?logo=nestjs)](https://nestjs.com)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-M0_Free-47A248?logo=mongodb)](https://www.mongodb.com/atlas)
[![Render](https://img.shields.io/badge/Deploy-Render-00a95c?logo=render)](https://render.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Production-Ready Backend** para aplicação de chat com inteligência artificial, projetado com **Clean Architecture**, **Strategy Pattern para LLMs** e **compliance com os 12 Fatores**. Suporta Google Gemini e OpenAI GPT com fallback automático, WebSocket em tempo real e autenticação JWT stateless.

---

## 🎯 Visão Arquitetural

Este serviço implementa um **bounded context** de IA com as seguintes características:

- **Camada de Domínio Isolada**: interfaces e entidades não dependem de frameworks
- **Injeção de Dependência Explícita**: provedores de IA injetados via factory
- **Persistência Poliglota Futura**: atualmente MongoDB, mas preparado para PostgreSQL
- **Comunicação Híbrida**: WebSocket primário + REST fallback
- **Segurança por Design**: JWT com expiração curta, CORS restrito, sem dados sensíveis em logs

**Referência de arquitetura**: Adaptado de [Microsoft Cloud Design Patterns](https://learn.microsoft.com/en-us/azure/architecture/patterns/) e [NestJS Enterprise Examples](https.

---

## 🛠 Stack Técnica & Justificativas

| Camada           | Tecnologia                                    | Justificativa                                                      |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------------ |
| **Linguagem**    | TypeScript 5 (strict mode)                    | Tipagem segura, interoperabilidade com JS                          |
| **Framework**    | NestJS 10                                     | Modularidade, injeção de dependência, compatível com microservices |
| **Banco**        | MongoDB Atlas (M0 Free Tier)                  | Schema flexível para mensagens não estruturadas                    |
| **IA**           | `@google/generative-ai@^0.24`, `openai@^4.30` | SDKs oficiais, suporte a streaming futuro                          |
| **Realtime**     | Socket.IO 4                                   | Fallback automático para long-polling, compatível com proxies      |
| **Autenticação** | Passport + JWT (HS256)                        | Simplicidade, compatibilidade com SPA                              |
| **Testes**       | Jest + Supertest                              | Isolamento total, mocks de serviços externos                       |
| **Deploy**       | Render Web Service                            | Zero DevOps, integração nativa com GitHub                          |

---

## ▶️ Guia de Desenvolvimento Local

### Pré-requisitos

- **Node.js** `^20.12.0` ou `^22.16.0` ([Render Default](https://render.com/docs/node-version))
- **npm** >= 9
- **MongoDB Atlas** (recomendado) ou `mongod` local

### Configuração Inicial

1. **Clone e instale**

   ```bash
   git clone https://github.com/Ljames666/ai-jamesgrow-backend.git
   cd ai-jamesgrow-backend
   npm ci  # Garante exatidão do lockfile
   ```

2. **Configure `.env`**

   ```env
   # Obrigatórios
   PORT=8081
   JWT_SECRET=32+caracteres_aleatorios_seguros  # Use openssl rand -hex 32
   MONGODB_URI=mongodb+srv://user:pass@cluster.xxxx.mongodb.net/aichat

   # IA (pelo menos um)
   GEMINI_API_KEY=your_google_key
   OPENAI_API_KEY=your_openai_key

   # Opcionais
   JWT_EXPIRES_IN=1d
   NODE_ENV=development
   ```

3. **MongoDB Atlas (recomendado)**
   - Acesse [Atlas Network Access](https://www.mongodb.com/docs/atlas/security-whitelist/)
   - Adicione `0.0.0.0/0` temporariamente para desenvolvimento
   - **Nunca faça isso em produção sem firewall adicional**

4. **Execute**

   ```bash
   npm run start:dev  # Modo watch com reinício automático
   ```

   - **API**: `http://localhost:8081`
   - **Swagger**: `http://localhost:8081/api`

---

## 📡 Contrato da API (OpenAPI)

### Autenticação

| Endpoint         | Método | Body                                             | Response                                  |
| ---------------- | ------ | ------------------------------------------------ | ----------------------------------------- |
| `/auth/register` | `POST` | `{ "username": "string", "password": "string" }` | `201 Created`                             |
| `/auth/login`    | `POST` | `{ "username": "string", "password": "string" }` | `200 OK` + `{ "access_token": "string" }` |

### Chat

| Endpoint    | Método | Headers                         | Body                                                | Response                  |
| ----------- | ------ | ------------------------------- | --------------------------------------------------- | ------------------------- |
| `/chat`     | `POST` | `Authorization: Bearer <token>` | `{ "content": "string", "aiModel": "gemini\|gpt" }` | `200 OK` + resposta da IA |
| `/messages` | `GET`  | `Authorization: Bearer <token>` | `aiModel=gemini`                                    | `200 OK` + `[Message]`    |

> **Padrão de Mensagem**:
>
> ```ts
> interface Message {
>   role: 'user' | 'ai';
>   content: string;
>   aiModel: 'gemini' | 'gpt';
>   createdAt: ISODate;
> }
> ```

---

## 🧪 Estratégia de Testes

- **Unitários**: 100% de cobertura de serviços e provedores
- **Integração**: Testa autenticação, CRUD de mensagens e chamadas à IA (mockadas)
- **E2E**: Simula fluxo completo com Supertest

```bash
npm run test          # Unitários
npm run test:e2e      # Integração (requer MongoDB)
npm run test:cov      # Cobertura HTML
```

---

## 🌐 Deploy em Produção (Render)

### Passo 1: MongoDB Atlas

1. Crie cluster M0+ em [Atlas](https://cloud.mongodb.com)
2. Em **Network Access**, adicione o **IP de saída do Render** (ou use `0.0.0.0/0` para MVP)
3. Crie usuário com senha forte (sem caracteres especiais)

### Passo 2: Render Configuration

| Campo             | Valor                                  |
| ----------------- | -------------------------------------- |
| **Runtime**       | Node                                   |
| **Build Command** | `npm ci && npx nest build`             |
| **Start Command** | `npm run start:prod`                   |
| **Port**          | `10000`                                |
| **Node Version**  | `22.16.0` (via `NODE_VERSION` env var) |

### Variáveis de Ambiente (Render Dashboard)

```
MONGODB_URI = mongodb+srv://user:pass@cluster.xxxx.mongodb.net/aichat
JWT_SECRET = [32+ caracteres seguros]
GEMINI_API_KEY = [sua_chave]
OPENAI_API_KEY = [sua_chave]
NODE_ENV = production
PORT = 10000
```

> ⚠️ **Erro comum**: `MongooseServerSelectionError` → causado por IP não liberado no Atlas.  
> ✅ **Solução**: Adicione `0.0.0.0/0` temporariamente ou use VPC Peering (pago).

---

## 🗂 Estrutura de Pastas (Clean Architecture)

```
src/
├── core/               # Domínio: interfaces, casos de uso
│   └── ai/             # Provedores de IA (GeminiProvider, GptProvider)
├── modules/            # Bounded contexts
│   ├── auth/           # JWT, login, registro
│   ├── chat/           # WebSocket Gateway, eventos
│   ├── message/        # CRUD de mensagens
│   └── user/           # Modelo de usuário
├── shared/             # DTOs, exceções, pipes
└── infra/              # (futuro) adapters para serviços externos
```

> ✅ **Regra de dependência**: `modules → core → shared`. Nunca o inverso.

---

## 📜 Licença

MIT — veja [LICENSE](LICENSE).

---

## 🤝 Contribuição

1. Abra issue para discutir mudanças
2. Siga commits convencionais (`feat:`, `fix:`, `refactor:`)
3. Mantenha cobertura de testes > 85%

---

> 🔒 **Pronto para produção?**  
> Migre para autenticação com cookies httpOnly + Redis para sessões, e adicione rate limiting por usuário.

```


```
