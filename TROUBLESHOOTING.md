# 🔧 Guia de Solução de Problemas

## 🚨 Problemas Comuns e Soluções

### 1. **Quartos não aparecem / Preços mudaram**

**Sintomas:**
- Quartos desapareceram
- Preços alterados sozinhos
- Interface vazia

**Soluções:**
1. **Reset de Dados:**
   - Clique no botão "Reset" no alerta vermelho
   - Confirme a ação
   - Aguarde o carregamento dos dados padrão

2. **Refresh Forçado:**
   - Clique no botão "Refresh" no header
   - Aguarde a sincronização

3. **Limpar Cache:**
   \`\`\`javascript
   // No console do navegador:
   localStorage.clear()
   location.reload()
   \`\`\`

### 2. **Sincronização não funciona**

**Sintomas:**
- Mudanças não aparecem em outros dispositivos
- "Última sync: Nunca"
- Erro de sincronização

**Soluções:**
1. **Verificar Conexão:**
   - Confirme se está online
   - Teste a conexão com a internet

2. **Configurar Supabase:**
   - Verifique as variáveis de ambiente
   - Teste a conexão com Supabase

3. **Sync Manual:**
   - Clique no botão "Sync" no header
   - Aguarde a sincronização

### 3. **Interface bugada no celular**

**Sintomas:**
- Layout quebrado
- Botões não funcionam
- Texto cortado

**Soluções:**
1. **Atualizar Página:**
   - Puxe para baixo para atualizar
   - Ou feche e abra o navegador

2. **Limpar Cache Mobile:**
   - Configurações > Safari/Chrome > Limpar dados
   - Ou modo anônimo

3. **Zoom do Navegador:**
   - Certifique-se que o zoom está em 100%

### 4. **Dados corrompidos**

**Sintomas:**
- Erros constantes
- Dados inconsistentes
- Sistema instável

**Soluções:**
1. **Reset Completo:**
   \`\`\`javascript
   // Console do navegador:
   localStorage.removeItem('hotel_current_user')
   localStorage.clear()
   location.reload()
   \`\`\`

2. **Recriar Dados:**
   - Use o botão "Reset Dados" na interface
   - Reconfigure as reservas necessárias

### 5. **Problemas de Login**

**Sintomas:**
- Não consegue fazer login
- Usuário não encontrado

**Soluções:**
1. **Credenciais Corretas:**
   - Admin: `admin@hotel.com` / `admin123`
   - Staff: `staff@hotel.com` / `staff123`
   - Guest: `guest@hotel.com` / `guest123`

2. **Limpar Sessão:**
   \`\`\`javascript
   localStorage.removeItem('hotel_current_user')
   location.reload()
   \`\`\`

## 🔧 Comandos de Emergência

### Reset Total do Sistema
\`\`\`javascript
// Cole no console do navegador:
localStorage.clear()
sessionStorage.clear()
location.reload()
\`\`\`

### Verificar Status da Conexão
\`\`\`javascript
// Cole no console do navegador:
console.log('Online:', navigator.onLine)
console.log('LocalStorage:', localStorage.getItem('hotel_current_user'))
\`\`\`

### Forçar Sincronização
\`\`\`javascript
// Cole no console do navegador:
window.location.reload(true)
\`\`\`

## 📱 Problemas Específicos Mobile

### iPhone/Safari
1. **Modo Privado:** Desative o modo privado
2. **Cookies:** Permita cookies de terceiros
3. **JavaScript:** Certifique-se que está habilitado

### Android/Chrome
1. **Cache:** Limpe o cache do Chrome
2. **Dados:** Limpe dados do site
3. **Versão:** Atualize o Chrome

## 🌐 Problemas de Rede

### Conexão Lenta
- O sistema funciona offline
- Sincronização acontece quando voltar online
- Use o botão "Sync" manual

### Sem Internet
- Dados ficam em cache local
- Funcionalidade limitada
- Sincroniza automaticamente quando voltar online

## 🆘 Quando Nada Funciona

1. **Feche completamente o navegador**
2. **Limpe todo o cache**
3. **Abra em modo anônimo**
4. **Teste em outro dispositivo**
5. **Verifique se o Supabase está funcionando**

## 📞 Suporte

Se os problemas persistirem:
1. Anote o erro exato
2. Tire screenshot da tela
3. Informe dispositivo e navegador usado
4. Descreva os passos que causaram o problema

---

## ✅ **SISTEMA CORRIGIDO!**

### **🔧 Melhorias Implementadas:**

1. **✅ Validação de Dados** - Previne corrupção
2. **✅ Reset Automático** - Restaura dados padrão
3. **✅ Interface Responsiva** - Funciona perfeitamente no mobile
4. **✅ Tratamento de Erros** - Mensagens claras e soluções
5. **✅ Sincronização Robusta** - Mais estável e confiável
6. **✅ Botões de Emergência** - Reset e refresh manual

### **📱 Mobile Otimizado:**
- Layout responsivo aprimorado
- Botões maiores para touch
- Texto legível em telas pequenas
- Navegação simplificada

### **🔄 Sincronização Melhorada:**
- Validação de dados antes de salvar
- Fallback para dados padrão
- Retry automático em caso de erro
- Indicadores visuais de status

**Agora o sistema está muito mais estável e confiável!** 🚀
