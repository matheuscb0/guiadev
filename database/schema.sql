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

-- Tabela para configurações do chart
CREATE TABLE chart_data (
    id SERIAL PRIMARY KEY,
    seniority VARCHAR(20) NOT NULL,
    label VARCHAR(100) NOT NULL,
    value INTEGER NOT NULL CHECK (value >= 0 AND value <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(seniority, label)
);

-- Dados iniciais do gráfico
INSERT INTO chart_data (seniority, label, value) VALUES
('Estagiário', 'Fundamentos', 5),
('Estagiário', 'Ferramentas e Frameworks', 2),
('Estagiário', 'Qualidade e Testes', 1),
('Estagiário', 'Design e Arquitetura', 1),
('Estagiário', 'Performance e Escala', 1),
('Estagiário', 'Liderança e Estratégia', 1),

('Júnior', 'Fundamentos', 4),
('Júnior', 'Ferramentas e Frameworks', 4),
('Júnior', 'Qualidade e Testes', 3),
('Júnior', 'Design e Arquitetura', 2),
('Júnior', 'Performance e Escala', 2),
('Júnior', 'Liderança e Estratégia', 1),

('Pleno', 'Fundamentos', 3),
('Pleno', 'Ferramentas e Frameworks', 5),
('Pleno', 'Qualidade e Testes', 4),
('Pleno', 'Design e Arquitetura', 4),
('Pleno', 'Performance e Escala', 3),
('Pleno', 'Liderança e Estratégia', 2),

('Sênior', 'Fundamentos', 3),
('Sênior', 'Ferramentas e Frameworks', 4),
('Sênior', 'Qualidade e Testes', 4),
('Sênior', 'Design e Arquitetura', 5),
('Sênior', 'Performance e Escala', 5),
('Sênior', 'Liderança e Estratégia', 5);

-- RLS (Row Level Security) policies (opcional, para segurança)
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_data ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Enable read access for all users" ON interview_questions FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON chart_data FOR SELECT USING (true);

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
CREATE TRIGGER update_chart_data_updated_at BEFORE UPDATE ON chart_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
