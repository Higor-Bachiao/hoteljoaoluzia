# 🚀 Configuração do Supabase para Sincronização em Nuvem

## 1. Criar Conta no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto

## 2. Configurar Banco de Dados

1. No painel do Supabase, vá em **SQL Editor**
2. Execute o script `scripts/supabase_schema.sql`
3. Isso criará todas as tabelas necessárias

## 3. Obter Credenciais

1. Vá em **Settings** > **API**
2. Copie:
   - **Project URL** 
   - **anon/public key**

## 4. Configurar Variáveis de Ambiente

1. Crie arquivo `.env.local` na raiz do projeto:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima
\`\`\`

## 5. Deploy no Netlify

1. Faça push do código para GitHub
2. No Netlify, adicione as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy automático!

## 6. Funcionalidades

✅ **Sincronização em tempo real** entre dispositivos
✅ **Backup automático** na nuvem
✅ **Funciona offline** com sincronização posterior
✅ **Escalável** para múltiplos hotéis
✅ **Gratuito** até 50.000 requisições/mês

## 7. Credenciais de Teste

- **Admin**: `admin@hotel.com` / `admin123`
- **Staff**: `staff@hotel.com` / `staff123`
- **Guest**: `guest@hotel.com` / `guest123`
