# Guia Interativo de Entrevistas para Desenvolvedores

Uma aplicação web moderna para preparação de entrevistas técnicas com inteligência artificial e banco de dados estruturado.

## 🚀 Características

- **Banco de Dados**: Perguntas organizadas no Supabase para fácil manutenção
- **IA Integrada**: Geração de respostas modelo e feedback personalizado
- **Interface Moderna**: Design responsivo com Tailwind CSS
- **Simulação de Entrevistas**: Prática interativa com feedback da IA
- **Filtros Inteligentes**: Por senioridade e tecnologia

## 📁 Estrutura do Projeto

```
guiadev/
├── public/                 # Arquivos estáticos
│   ├── css/
│   │   └── styles.css     # Estilos customizados
│   ├── js/
│   │   ├── api.js         # Cliente API
│   │   └── app.js         # Lógica principal
│   └── index.html         # Interface principal
├── database/              # Scripts do banco
│   └── schema.sql         # Estrutura das tabelas
├── server.js              # Servidor Express
├── package.json
└── .env.example          # Exemplo de configuração
```

## 🛠️ Configuração

### 1. Pré-requisitos
- Node.js (versão 16 ou superior)
- Conta no [Supabase](https://supabase.com) (gratuita)
- Chave da API [OpenRouter](https://openrouter.ai) (gratuita)

### 2. Instalação

```bash
# Clone o repositório
git clone <seu-repositorio>
cd guiadev

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais (veja detalhes abaixo)
```

### 3. Configuração do Banco de Dados (Supabase)

#### 3.1. Criar projeto no Supabase
1. Acesse [Supabase](https://supabase.com) e crie uma conta gratuita
2. Clique em "New Project"
3. Selecione uma região próxima ao seu local
4. Aguarde a criação do projeto (cerca de 2 minutos)

#### 3.2. Obter credenciais de conexão
1. No painel do projeto, vá para **Settings** → **API**
2. Copie a **URL** do projeto (ex: `https://abc123.supabase.co`)
3. Copie a chave **anon public** (inicia com `eyJ...`)
4. Cole essas informações no arquivo `.env`:

```bash
SUPABASE_URL=https://abc123.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 3.3. Executar scripts do banco
1. No painel do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Copie e execute o conteúdo do arquivo `database/schema.sql`:

```sql
-- Cole todo o conteúdo do arquivo database/schema.sql aqui
-- Este script criará a tabela: interview_questions
```

4. Clique em **Run** para executar o script
5. Verifique se a tabela foi criada em **Table Editor**

#### 3.4. Verificar a criação da tabela
Após executar o script, você deve ter:
- **interview_questions**: Tabela principal com as perguntas

### 4. Configuração da OpenRouter (IA)

1. Acesse [OpenRouter](https://openrouter.ai) e crie uma conta
2. Vá para **Keys** no menu
3. Clique em **Create Key**
4. Copie a chave gerada e adicione no `.env`:

```bash
OPENROUTER_API_KEY=sk-or-v1-abc123...
```

### 5. Configuração Opcional do Admin

Configure uma senha personalizada para o painel administrativo:

```bash
ADMIN_PASSWORD=suaSenhaPersonalizada
```

### 6. Executar a aplicação

```bash
npm start
```

Acesse: `http://localhost:3000`

### 7. Verificar se tudo funciona

1. **Interface principal**: `http://localhost:3000` - deve carregar a página inicial
2. **Painel admin**: `http://localhost:3000/admin.html` - teste com a senha configurada
3. **API do banco**: Selecione uma senioridade e stack - deve carregar perguntas
4. **IA**: Clique em "Gerar Resposta" em uma pergunta - deve funcionar com a OpenRouter

## �️ Estrutura do Banco de Dados

### Tabelas Principais

#### `interview_questions`
```sql
-- Tabela principal com as perguntas de entrevista
CREATE TABLE interview_questions (
    id SERIAL PRIMARY KEY,
    seniority VARCHAR(20) NOT NULL CHECK (seniority IN ('Estagiário', 'Júnior', 'Pleno', 'Sênior')),
    stack VARCHAR(50) NOT NULL,              -- Ex: Java, JavaScript, Python
    category VARCHAR(100) NOT NULL,          -- Ex: Framework (Spring), Conceitos Fundamentais
    category_goal TEXT,                      -- Objetivo da categoria
    question TEXT NOT NULL,                  -- A pergunta em si
    order_position INTEGER DEFAULT 0,       -- Ordem de exibição
    is_active BOOLEAN DEFAULT true,         -- Para ativar/desativar perguntas
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Comandos Úteis do Banco

#### Consultas básicas:
```sql
-- Ver todas as stacks disponíveis
SELECT DISTINCT stack FROM interview_questions ORDER BY stack;

-- Contar perguntas por senioridade
SELECT seniority, COUNT(*) as total 
FROM interview_questions 
WHERE is_active = true 
GROUP BY seniority;

-- Ver categorias por stack e senioridade
SELECT seniority, stack, category, COUNT(*) as perguntas
FROM interview_questions 
WHERE is_active = true
GROUP BY seniority, stack, category
ORDER BY seniority, stack, category;
```

#### Adicionar nova pergunta:
```sql
INSERT INTO interview_questions (seniority, stack, category, category_goal, question, order_position)
VALUES ('Júnior', 'JavaScript', 'Conceitos Fundamentais', 'Verificar conhecimento básico', 'O que é hoisting em JavaScript?', 1);
```

#### Atualizar pergunta:
```sql
UPDATE interview_questions 
SET question = 'Nova pergunta aqui', updated_at = NOW()
WHERE id = 123;
```

#### Desativar pergunta sem deletar:
```sql
UPDATE interview_questions 
SET is_active = false 
WHERE id = 123;
```

### Inserir Dados de Exemplo

Para começar com algumas perguntas de exemplo, execute no SQL Editor do Supabase:

```sql
-- Exemplos de perguntas para JavaScript Júnior
INSERT INTO interview_questions (seniority, stack, category, category_goal, question, order_position) VALUES
('Júnior', 'JavaScript', 'Conceitos Fundamentais', 'Verificar conhecimento básico da linguagem', 'O que é hoisting em JavaScript?', 1),
('Júnior', 'JavaScript', 'Conceitos Fundamentais', 'Verificar conhecimento básico da linguagem', 'Qual a diferença entre == e === em JavaScript?', 2),
('Júnior', 'JavaScript', 'Conceitos Fundamentais', 'Verificar conhecimento básico da linguagem', 'Explique o conceito de closure em JavaScript.', 3),
('Júnior', 'JavaScript', 'DOM e Eventos', 'Verificar capacidade de manipular a interface', 'Como você adicionaria um event listener a um elemento?', 1),
('Júnior', 'JavaScript', 'DOM e Eventos', 'Verificar capacidade de manipular a interface', 'Qual a diferença entre innerHTML e textContent?', 2);

-- Exemplos para Java Pleno
INSERT INTO interview_questions (seniority, stack, category, category_goal, question, order_position) VALUES
('Pleno', 'Java', 'Conceitos Avançados', 'Verificar domínio de conceitos intermediários', 'Explique a diferença entre HashMap e TreeMap.', 1),
('Pleno', 'Java', 'Conceitos Avançados', 'Verificar domínio de conceitos intermediários', 'Como funcionam as anotações customizadas em Java?', 2),
('Pleno', 'Java', 'Spring Framework', 'Medir conhecimento do ecosystem Spring', 'Explique o ciclo de vida de um bean no Spring.', 1),
('Pleno', 'Java', 'Spring Framework', 'Medir conhecimento do ecosystem Spring', 'Como implementar cache distribuído com Spring Boot?', 2);
```

Estas perguntas aparecem organizadas por categoria na interface e podem ser gerenciadas pelo painel administrativo.

## 📊 API Endpoints
- `GET /api/questions/:seniority/:stack` - Buscar perguntas
- `GET /api/stacks/:seniority` - Stacks disponíveis
- `GET /api/random-question/:seniority/:stack` - Pergunta aleatória
- `POST /api/generate` - Gerar resposta com IA

### Endpoints Admin (requerem senha):
- `POST /api/admin/questions` - Listar todas as perguntas
- `POST /api/admin/questions/add` - Adicionar nova pergunta
- `POST /api/admin/questions/edit/:id` - Editar pergunta
- `POST /api/admin/questions/delete/:id` - Deletar pergunta
- `POST /api/admin/verify` - Verificar senha admin

## 🛠️ Painel Administrativo

### Acesso
- URL: `http://localhost:3000/admin.html`
- Senha: (configurável via `ADMIN_PASSWORD` no `.env`)

### Funcionalidades Admin
- **Dashboard**: Estatísticas gerais (total de perguntas, tecnologias, etc.)
- **Gerenciar Perguntas**: 
  - ➕ Adicionar novas perguntas
  - ✏️ Editar perguntas existentes
  - 🗑️ Deletar perguntas
  - 👁️ Ativar/desativar perguntas
- **Filtros Avançados**: Por senioridade, tecnologia e status
- **Interface Responsiva**: Funciona bem em desktop e mobile

### Segurança
- ✅ Autenticação por senha
- ✅ Todas as operações verificam credenciais
- ✅ Sessão expira ao fechar o navegador
- ✅ Logs de todas as operações

## 🎯 Funcionalidades

### Para Usuários
- **Exploração**: Navegue por perguntas organizadas por senioridade e tecnologia
- **IA Assistente**: Gere respostas modelo para qualquer pergunta
- **Simulação**: Pratique entrevistas com feedback da IA

### Para Administradores
- **Fácil Manutenção**: Adicione/edite perguntas direto no Supabase
- **Escalabilidade**: Adicione novas tecnologias e categorias facilmente
- **Performance**: Carregamento otimizado com cache

## 🔧 Melhorias Implementadas

### Antes (arquivo monolítico)
- ❌ HTML de 800+ linhas
- ❌ CSS, JS e dados misturados
- ❌ Dados hardcoded
- ❌ Difícil manutenção

### Depois (arquitetura moderna)
- ✅ Arquivos separados e organizados
- ✅ Banco de dados estruturado
- ✅ API RESTful
- ✅ Código modular e reutilizável
- ✅ Fácil adição de novas perguntas

## 📈 Próximos Passos

- [ ] Interface administrativa para gerenciar perguntas
- [ ] Sistema de favoritos
- [ ] Histórico de simulações
- [ ] Exportação de relatórios
- [ ] Integração com calendário
- [ ] Modo offline

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📝 Licença

ISC License

## 🆘 Suporte

Se encontrar problemas:

1. **Erro de conexão com Supabase**: 
   - Verifique se as variáveis `SUPABASE_URL` e `SUPABASE_ANON_KEY` estão corretas no `.env`
   - Confirme se o projeto Supabase está ativo
   - Execute o script `database/schema.sql` no SQL Editor do Supabase

2. **Erro de IA/OpenRouter**:
   - Verifique se `OPENROUTER_API_KEY` está correto no `.env`
   - Teste a chave em [OpenRouter](https://openrouter.ai)
   - Verifique se há créditos na sua conta

3. **Tabelas não encontradas**:
   ```sql
   -- Execute este comando no SQL Editor do Supabase para verificar as tabelas:
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

4. **Banco vazio**:
   - Execute novamente o arquivo `database/schema.sql` no Supabase
   - Verifique se os dados iniciais foram inseridos:
   ```sql
   SELECT COUNT(*) FROM interview_questions;
   ```

5. **Problemas de permissão**:
   - Verifique se as políticas RLS estão ativas no Supabase
   - As políticas de leitura pública devem estar habilitadas

6. **Porta em uso**:
   ```bash
   # Use uma porta diferente se 3000 estiver ocupada
   PORT=3001 npm start
   ```

7. **Logs detalhados**: Verifique os logs do console do navegador (F12 → Console)

---

**Desenvolvido com café para a comunidade dev**
