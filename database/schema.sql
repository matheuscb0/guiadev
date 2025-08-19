-- Estrutura do banco para o sistema de perguntas de entrevista

-- Tabela principal de perguntas
CREATE TABLE interview_questions (
    id SERIAL PRIMARY KEY,
    seniority VARCHAR(20) NOT NULL CHECK (seniority IN ('Estagiário', 'Júnior', 'Pleno', 'Sênior')),
    stack VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    category_goal TEXT,
    question TEXT NOT NULL,
    order_position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_interview_questions_seniority_stack ON interview_questions(seniority, stack);
CREATE INDEX idx_interview_questions_active ON interview_questions(is_active);

-- RLS (Row Level Security) policies (opcional, para segurança)
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Enable read access for all users" ON interview_questions FOR SELECT USING (true);

-- Função para atualizar timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_interview_questions_updated_at BEFORE UPDATE ON interview_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
