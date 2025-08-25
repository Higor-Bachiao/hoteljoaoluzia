# 🏨 Sistema de Gerenciamento Hoteleiro

Um sistema completo de gerenciamento hoteleiro desenvolvido com Next.js 15, React, Tailwind CSS e **Supabase** para sincronização em nuvem.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Autenticação com Supabase** - Login e registro de usuários
- **Sincronização em Nuvem** - Dados sincronizados em tempo real entre dispositivos
- **Dashboard Responsivo** - Interface adaptável para desktop, tablet e mobile
- **Gerenciamento de Quartos** - Visualização, adição, edição e exclusão
- **Sistema de Reservas** - Reserva online com confirmação
- **Filtros Avançados** - Por tipo, status, preço e disponibilidade
- **Estatísticas** - Gráficos de ocupação e métricas do hotel
- **Painel Administrativo** - CRUD completo para administradores
- **Status de Quartos** - Disponível, ocupado, manutenção, reservado
- **Histórico de Hóspedes** - Registro completo de todas as estadias
- **Real-time Updates** - Mudanças aparecem instantaneamente em todos os dispositivos

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes de interface
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones modernos

### Backend/Nuvem
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados relacional
- **Real-time Subscriptions** - Atualizações em tempo real
- **Row Level Security** - Segurança de dados

## 🌐 Deploy e Hospedagem

### Netlify + Supabase
- **Frontend**: Hospedado no Netlify (gratuito)
- **Backend**: Supabase (gratuito até 50k requisições/mês)
- **Sincronização**: Real-time entre todos os dispositivos
- **Backup**: Automático na nuvem

## 📁 Estrutura do Projeto

\`\`\`
hotel-management-system/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── admin/            # Painel administrativo
│   ├── auth/             # Autenticação
│   ├── dashboard/        # Dashboard e estatísticas
│   ├── layout/           # Layout e navegação
│   ├── reservations/     # Sistema de reservas
│   ├── rooms/            # Gerenciamento de quartos
│   └── ui/               # Componentes de interface
├── contexts/             # Context API
│   ├── auth-context-cloud.tsx  # Contexto de autenticação
│   └── hotel-context-cloud.tsx # Contexto do hotel
├── lib/                  # Utilitários e serviços
│   ├── supabase.ts       # Configuração Supabase
│   └── hotel-service-cloud.ts # Serviços de dados
├── scripts/              # Scripts SQL
│   └── supabase_schema.sql # Schema do banco
├── types/                # Definições TypeScript
│   └── hotel.ts          # Tipos do sistema
└── README.md             # Documentação
\`\`\`

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Supabase (gratuita)

### Instalação

1. **Clone o repositório**
\`\`\`bash
git clone https://github.com/seu-usuario/hotel-management-system.git
cd hotel-management-system
\`\`\`

2. **Instale as dependências**
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

3. **Configure o Supabase**
- Crie uma conta em [supabase.com](https://supabase.com)
- Crie um novo projeto
- Execute o script `scripts/supabase_schema.sql` no SQL Editor
- Copie as credenciais (URL e anon key)

4. **Configure as variáveis de ambiente**
\`\`\`bash
cp .env.local.example .env.local
# Edite .env.local com suas credenciais do Supabase
\`\`\`

5. **Execute o projeto**
\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

6. **Acesse o sistema**
\`\`\`
http://localhost:3000
\`\`\`

### Credenciais de Teste
- **Administrador**: admin@hotel.com / admin123
- **Funcionário**: staff@hotel.com / staff123
- **Hóspede**: guest@hotel.com / guest123

## 🌐 Deploy no Netlify

1. **Faça push para GitHub**
\`\`\`bash
git add .
git commit -m "Sistema hotel com Supabase"
git push origin main
\`\`\`

2. **Configure no Netlify**
- Conecte seu repositório GitHub
- Adicione as variáveis de ambiente:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Deploy automático!

## 📱 Funcionalidades da Sincronização

### 🔄 Real-time Sync
- **Automática**: Sincronização a cada 10 segundos
- **Manual**: Botão de sync manual
- **Focus**: Sincroniza quando a aba volta ao foco
- **Real-time**: Mudanças aparecem instantaneamente

### 🌐 Multi-dispositivo
- **Celular**: Interface responsiva
- **Tablet**: Layout otimizado
- **Desktop**: Experiência completa
- **Offline**: Funciona offline com sync posterior

### 💾 Backup e Segurança
- **Automático**: Backup contínuo na nuvem
- **Seguro**: Row Level Security no Supabase
- **Escalável**: Suporta múltiplos hotéis
- **Confiável**: 99.9% de uptime

## 📊 Funcionalidades Principais

### Gerenciamento de Quartos
- Visualização em grid responsivo
- Filtros por tipo, status e preço
- Busca por número ou hóspede
- Status colorido (verde=disponível, vermelho=ocupado)
- Detalhes completos do quarto
- Sincronização em tempo real

### Sistema de Reservas
- Formulário intuitivo
- Seleção de quartos disponíveis
- Validação de datas
- Confirmação automática
- Reservas futuras

### Dashboard Administrativo
- Estatísticas em tempo real
- Gráficos de ocupação
- Métricas de receita
- Controle de usuários
- Histórico completo

### Painel de Estatísticas
- Taxa de ocupação
- Receita mensal
- Distribuição por tipo de quarto
- Hóspedes ativos
- Gráficos interativos

## 🔧 Configuração Avançada

### Supabase Schema
O arquivo `scripts/supabase_schema.sql` contém:
- Tabelas de usuários, quartos, reservas e histórico
- Políticas de segurança (RLS)
- Triggers para updated_at
- Dados iniciais de teste

### Real-time Subscriptions
\`\`\`typescript
// Exemplo de subscription
supabase
  .channel('rooms-changes')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'rooms' 
  }, callback)
  .subscribe()
\`\`\`

## 🧪 Testes

\`\`\`bash
# Executar testes
npm run test

# Verificação de tipos
npm run type-check

# Build de produção
npm run build
\`\`\`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- Email: suporte@hotelmanagement.com
- GitHub Issues: [Criar Issue](https://github.com/seu-usuario/hotel-management-system/issues)

## 🗺️ Roadmap

### Versão 2.0
- [ ] Integração com APIs de pagamento
- [ ] Sistema de avaliações
- [ ] Relatórios avançados
- [ ] Notificações push
- [ ] App mobile nativo

### Versão 3.0
- [ ] IA para previsão de ocupação
- [ ] Integração com sistemas externos
- [ ] Multi-idiomas
- [ ] Tema escuro
- [ ] Analytics avançados

---

## 🌟 **SISTEMA PROFISSIONAL COM NUVEM!**

✅ **Sincronização Real-time** - Mudanças aparecem instantaneamente  
✅ **Multi-dispositivo** - Funciona em celular, tablet e desktop  
✅ **Backup Automático** - Dados seguros na nuvem  
✅ **Escalável** - Suporta crescimento do negócio  
✅ **Gratuito** - Netlify + Supabase gratuitos  

Desenvolvido com ❤️ pela equipe Hotel Management
