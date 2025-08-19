require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const open = require('open');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 
        ['https://your-domain.com'] : 
        ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('public'));

const API_KEY = process.env.OPENROUTER_API_KEY;
if (!API_KEY?.trim()) {
    console.error("\nERRO: A variável de ambiente OPENROUTER_API_KEY não foi definida no arquivo .env");
    console.error("Por favor, crie um arquivo .env e adicione sua chave da OpenRouter.\n");
    process.exit(1);
}

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("\nERRO: Configure SUPABASE_URL e SUPABASE_ANON_KEY no arquivo .env");
    console.error("Visite https://supabase.com para criar um projeto gratuito.\n");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Senha simples para admin (em produção, use algo mais seguro)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware para verificar autenticação admin
const verifyAdmin = (req, res, next) => {
    const { password } = req.body;
    if (!password || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Senha incorreta ou não fornecida' });
    }
    next();
};

const BASE_API_URL = 'https://openrouter.ai/api/v1';

// === ROTAS DA API ===

// Rota para buscar perguntas por senioridade e stack
app.get('/api/questions/:seniority/:stack', async (req, res) => {
    try {
        const { seniority, stack } = req.params;
        
        const { data, error } = await supabase
            .from('interview_questions')
            .select('*')
            .eq('seniority', seniority)
            .eq('stack', stack)
            .eq('is_active', true)
            .order('category', { ascending: true })
            .order('order_position', { ascending: true });

        if (error) {
            console.error('Erro do Supabase:', error);
            return res.status(500).json({ error: 'Erro ao buscar perguntas' });
        }

        // Agrupar perguntas por categoria
        const groupedQuestions = {};
        data.forEach(question => {
            if (!groupedQuestions[question.category]) {
                groupedQuestions[question.category] = {
                    title: question.category,
                    goal: question.category_goal,
                    items: []
                };
            }
            groupedQuestions[question.category].items.push(question.question);
        });

        const result = {
            intro: `Perguntas para ${stack} - Nível ${seniority}`,
            categories: Object.values(groupedQuestions)
        };

        res.json(result);
    } catch (error) {
        console.error('Erro na rota /api/questions:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para buscar stacks disponíveis por senioridade
app.get('/api/stacks/:seniority', async (req, res) => {
    try {
        const { seniority } = req.params;
        
        const { data, error } = await supabase
            .from('interview_questions')
            .select('stack')
            .eq('seniority', seniority)
            .eq('is_active', true);

        if (error) {
            console.error('Erro do Supabase:', error);
            return res.status(500).json({ error: 'Erro ao buscar stacks' });
        }

        // Remover duplicatas
        const uniqueStacks = [...new Set(data.map(item => item.stack))];
        res.json(uniqueStacks);
    } catch (error) {
        console.error('Erro na rota /api/stacks:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Rota para buscar pergunta aleatória para simulação
app.get('/api/random-question/:seniority/:stack', async (req, res) => {
    try {
        const { seniority, stack } = req.params;
        
        const { data, error } = await supabase
            .from('interview_questions')
            .select('question')
            .eq('seniority', seniority)
            .eq('stack', stack)
            .eq('is_active', true);

        if (error) {
            console.error('Erro do Supabase:', error);
            return res.status(500).json({ error: 'Erro ao buscar pergunta aleatória' });
        }

        if (data.length === 0) {
            return res.status(404).json({ error: 'Nenhuma pergunta encontrada' });
        }

        const randomQuestion = data[Math.floor(Math.random() * data.length)];
        res.json({ question: randomQuestion.question });
    } catch (error) {
        console.error('Erro na rota /api/random-question:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Importação em massa de perguntas
app.post('/api/admin/questions/bulk', verifyAdmin, async (req, res) => {
    try {
        const { questions } = req.body;
        
        if (!questions || !Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({ error: 'Lista de perguntas é obrigatória' });
        }

        const results = {
            success: 0,
            errors: [],
            total: questions.length
        };

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            
            // Validar campos obrigatórios
            if (!question.seniority || !question.stack || !question.category || !question.question) {
                results.errors.push({
                    index: i,
                    error: 'Campos obrigatórios: seniority, stack, category, question'
                });
                continue;
            }

            try {
                const { data, error } = await supabase
                    .from('interview_questions')
                    .insert([{
                        seniority: question.seniority,
                        stack: question.stack,
                        category: question.category,
                        category_goal: question.category_goal || '',
                        question: question.question,
                        order_position: question.order_position || 0
                    }])
                    .select();

                if (error) {
                    results.errors.push({
                        index: i,
                        error: error.message
                    });
                } else {
                    results.success++;
                }
            } catch (error) {
                results.errors.push({
                    index: i,
                    error: error.message
                });
            }
        }

        res.json({
            message: `Importação concluída: ${results.success}/${results.total} perguntas adicionadas`,
            results
        });
    } catch (error) {
        console.error('Erro na importação em massa:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// === ROTAS ADMIN ===

// Listar todas as perguntas para admin
app.post('/api/admin/questions', verifyAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('interview_questions')
            .select('*')
            .order('seniority', { ascending: true })
            .order('stack', { ascending: true })
            .order('category', { ascending: true })
            .order('order_position', { ascending: true });

        if (error) {
            console.error('Erro do Supabase:', error);
            return res.status(500).json({ error: 'Erro ao buscar perguntas' });
        }

        res.json(data);
    } catch (error) {
        console.error('Erro na rota admin/questions:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Adicionar nova pergunta
app.post('/api/admin/questions/add', verifyAdmin, async (req, res) => {
    try {
        const { seniority, stack, category, category_goal, question, order_position } = req.body;
        
        if (!seniority || !stack || !category || !question) {
            return res.status(400).json({ error: 'Campos obrigatórios: seniority, stack, category, question' });
        }

        const { data, error } = await supabase
            .from('interview_questions')
            .insert([{
                seniority,
                stack,
                category,
                category_goal: category_goal || '',
                question,
                order_position: order_position || 0
            }])
            .select();

        if (error) {
            console.error('Erro do Supabase:', error);
            return res.status(500).json({ error: 'Erro ao adicionar pergunta' });
        }

        res.json({ message: 'Pergunta adicionada com sucesso', data });
    } catch (error) {
        console.error('Erro na rota admin/questions/add:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Editar pergunta
app.post('/api/admin/questions/edit/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { seniority, stack, category, category_goal, question, order_position, is_active } = req.body;

        const updateData = {};
        if (seniority !== undefined) updateData.seniority = seniority;
        if (stack !== undefined) updateData.stack = stack;
        if (category !== undefined) updateData.category = category;
        if (category_goal !== undefined) updateData.category_goal = category_goal;
        if (question !== undefined) updateData.question = question;
        if (order_position !== undefined) updateData.order_position = order_position;
        if (is_active !== undefined) updateData.is_active = is_active;

        const { data, error } = await supabase
            .from('interview_questions')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Erro do Supabase:', error);
            return res.status(500).json({ error: 'Erro ao editar pergunta' });
        }

        res.json({ message: 'Pergunta editada com sucesso', data });
    } catch (error) {
        console.error('Erro na rota admin/questions/edit:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Deletar pergunta
app.post('/api/admin/questions/delete/:id', verifyAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('interview_questions')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Erro do Supabase:', error);
            return res.status(500).json({ error: 'Erro ao deletar pergunta' });
        }

        res.json({ message: 'Pergunta deletada com sucesso' });
    } catch (error) {
        console.error('Erro na rota admin/questions/delete:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Verificar senha admin
app.post('/api/admin/verify', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ valid: true });
    } else {
        res.status(401).json({ valid: false, error: 'Senha incorreta' });
    }
});

app.post('/api/generate', async (req, res) => {
    try {
        // Validação básica
        if (!req.body.messages || !Array.isArray(req.body.messages)) {
            return res.status(400).json({ error: 'Mensagens são obrigatórias' });
        }

        const url = `${BASE_API_URL}/chat/completions`;
        const headers = {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        };
        const data = {
            model: req.body.model || "openai/gpt-oss-20b:free",
            messages: req.body.messages,
            max_tokens: 500, // Limitar tokens para controlar custos
            temperature: 0.7
        };
        
        const response = await axios.post(url, data, { 
            headers,
            timeout: 30000 // 30 segundos de timeout
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao chamar a API de Geração:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({ 
            error: 'Falha ao chamar a API do OpenRouter',
            details: error.response?.data?.error || 'Erro interno do servidor'
        });
    }
});

app.listen(port, () => {
    console.log(`\n🚀 Servidor GuiaDev rodando em http://localhost:${port}`);
    console.log(`📱 Interface principal: http://localhost:${port}/index.html`);
    console.log(`🛠️  Painel admin: http://localhost:${port}/admin.html`);
    console.log(`\n📋 Status das configurações:`);
    console.log(`   ✅ OpenRouter API: ${API_KEY ? 'Configurada' : '❌ Não configurada'}`);
    console.log(`   ✅ Supabase: ${supabaseUrl && supabaseKey ? 'Configurado' : '❌ Não configurado'}`);
    console.log(`   🔐 Senha admin: ${ADMIN_PASSWORD !== 'admin123' ? 'Personalizada' : 'Padrão (admin123)'}`);
    console.log(`\n💡 Acesse a documentação completa no README.md\n`);
});
