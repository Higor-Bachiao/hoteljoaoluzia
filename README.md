# Sistema de Gerenciamento de Hotel

Sistema completo de gerenciamento de hotel com backend Express.js e frontend Next.js.

## 🚀 Funcionalidades

- ✅ **Backend Express.js** com MySQL
- ✅ **49 quartos** (101-120, 201-220, 301-309)
- ✅ **Autenticação JWT**
- ✅ **CRUD completo** de quartos, reservas e histórico
- ✅ **Interface responsiva** para desktop e mobile
- ✅ **Sincronização em tempo real**
- ✅ **Sistema de usuários** (Admin, Staff, Guest)

## 📋 Pré-requisitos

- Node.js 18+
- MySQL 8.0+
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório:**
\`\`\`bash
git clone <seu-repositorio>
cd sistema-hotel
\`\`\`

2. **Instale as dependências:**
\`\`\`bash
npm install
\`\`\`

3. **Configure o banco de dados:**
- Crie um banco MySQL chamado `hotel_system`
- Copie `.env.local.example` para `.env.local`
- Configure suas credenciais do MySQL

4. **Inicie o sistema:**
\`\`\`bash
npm run dev
\`\`\`

O backend estará em `http://localhost:3001` e o frontend em `http://localhost:3000`.

## 👥 Usuários de Teste

- **Admin:** admin@hotel.com / admin123
- **Staff:** staff@hotel.com / staff123  
- **Guest:** guest@hotel.com / guest123

## 🏨 Quartos do Sistema

- **Andar 1:** Quartos 101-120 (20 quartos)
- **Andar 2:** Quartos 201-220 (20 quartos)
- **Andar 3:** Quartos 301-309 (9 suítes)

**Total: 49 quartos**

## 🔧 Estrutura do Projeto

\`\`\`
├── server/           # Backend Express.js
├── app/             # Frontend Next.js
├── components/      # Componentes React
├── contexts/        # Contextos React
├── lib/            # Utilitários
├── types/          # Tipos TypeScript
└── README.md
\`\`\`

## 📡 API Endpoints

- `POST /api/auth/login` - Login
- `GET /api/rooms` - Listar quartos
- `POST /api/rooms` - Criar quarto
- `PUT /api/rooms/:id` - Atualizar quarto
- `DELETE /api/rooms/:id` - Deletar quarto
- `GET /api/reservations` - Listar reservas
- `POST /api/reservations` - Criar reserva
- `DELETE /api/reservations/:id` - Cancelar reserva
- `GET /api/history` - Histórico de hóspedes

## 🚀 Deploy

Para produção, configure:
1. Banco MySQL em produção
2. Variáveis de ambiente corretas
3. `NEXT_PUBLIC_API_URL` para sua URL de produção

## 📱 Mobile

O sistema é totalmente responsivo e funciona perfeitamente em dispositivos móveis.
