-- Dados iniciais para popular a tabela interview_questions
-- Execute este arquivo no SQL Editor do Supabase após executar o schema.sql

-- Estagiário - Geral
INSERT INTO interview_questions (seniority, stack, category, category_goal, question, order_position) VALUES
('Estagiário', 'Geral', 'Motivação e Objetivos', 'Medir o interesse genuíno e o alinhamento com a empresa.', 'Por que você se interessou por esta vaga/empresa?', 1),
('Estagiário', 'Geral', 'Motivação e Objetivos', 'Medir o interesse genuíno e o alinhamento com a empresa.', 'Quais são seus objetivos de carreira?', 2),
('Estagiário', 'Geral', 'Motivação e Objetivos', 'Medir o interesse genuíno e o alinhamento com a empresa.', 'O que te atrai na área de desenvolvimento de software?', 3),
('Estagiário', 'Geral', 'Motivação e Objetivos', 'Medir o interesse genuíno e o alinhamento com a empresa.', 'Onde você se vê em 5 anos?', 4),

('Estagiário', 'Geral', 'Conceitos Fundamentais de CC', 'Confirmar a base teórica necessária para construir conhecimento prático.', 'Qual a diferença entre SQL e NoSQL?', 1),
('Estagiário', 'Geral', 'Conceitos Fundamentais de CC', 'Confirmar a base teórica necessária para construir conhecimento prático.', 'Explique o conceito de herança em Programação Orientada a Objetos.', 2),
('Estagiário', 'Geral', 'Conceitos Fundamentais de CC', 'Confirmar a base teórica necessária para construir conhecimento prático.', 'Qual a diferença entre um array e uma lista encadeada?', 3),
('Estagiário', 'Geral', 'Conceitos Fundamentais de CC', 'Confirmar a base teórica necessária para construir conhecimento prático.', 'O que é uma API?', 4),
('Estagiário', 'Geral', 'Conceitos Fundamentais de CC', 'Confirmar a base teórica necessária para construir conhecimento prático.', 'Explique a diferença entre HTTP e HTTPS.', 5),
('Estagiário', 'Geral', 'Conceitos Fundamentais de CC', 'Confirmar a base teórica necessária para construir conhecimento prático.', 'O que é um processo e o que é uma thread?', 6),

-- Júnior - Java
INSERT INTO interview_questions (seniority, stack, category, category_goal, question, order_position) VALUES
('Júnior', 'Java', 'Linguagem Principal (Core Java)', 'Avaliar a profundidade do conhecimento, da sintaxe básica aos mecanismos internos da JVM.', 'Qual a diferença entre == e .equals() para Strings?', 1),
('Júnior', 'Java', 'Linguagem Principal (Core Java)', 'Avaliar a profundidade do conhecimento, da sintaxe básica aos mecanismos internos da JVM.', 'Explique JVM, JRE e JDK.', 2),
('Júnior', 'Java', 'Linguagem Principal (Core Java)', 'Avaliar a profundidade do conhecimento, da sintaxe básica aos mecanismos internos da JVM.', 'Qual a diferença entre ArrayList e LinkedList?', 3),
('Júnior', 'Java', 'Linguagem Principal (Core Java)', 'Avaliar a profundidade do conhecimento, da sintaxe básica aos mecanismos internos da JVM.', 'O que são tipos genéricos (Generics)?', 4),
('Júnior', 'Java', 'Linguagem Principal (Core Java)', 'Avaliar a profundidade do conhecimento, da sintaxe básica aos mecanismos internos da JVM.', 'Explique a diferença entre exceções checadas e não checadas.', 5),

('Júnior', 'Java', 'Framework (Spring)', 'Medir a compreensão do framework, desde o uso conceitual.', 'Quais são os benefícios de usar o Spring Boot em um projeto?', 1),
('Júnior', 'Java', 'Framework (Spring)', 'Medir a compreensão do framework, desde o uso conceitual.', 'O que é o Spring Data e quais suas vantagens?', 2),
('Júnior', 'Java', 'Framework (Spring)', 'Medir a compreensão do framework, desde o uso conceitual.', 'O que é o Spring MVC?', 3),
('Júnior', 'Java', 'Framework (Spring)', 'Medir a compreensão do framework, desde o uso conceitual.', 'Como o Spring lida com transações (@Transactional)?', 4),

-- Júnior - JavaScript/React
INSERT INTO interview_questions (seniority, stack, category, category_goal, question, order_position) VALUES
('Júnior', 'JavaScript/React', 'Linguagem (JS/TS)', 'Avaliar o domínio da linguagem, desde a sintaxe assíncrona.', 'Qual a diferença entre Promise e async/await?', 1),
('Júnior', 'JavaScript/React', 'Linguagem (JS/TS)', 'Avaliar o domínio da linguagem, desde a sintaxe assíncrona.', 'O que são Closures?', 2),
('Júnior', 'JavaScript/React', 'Linguagem (JS/TS)', 'Avaliar o domínio da linguagem, desde a sintaxe assíncrona.', 'Qual a diferença entre map e forEach?', 3),
('Júnior', 'JavaScript/React', 'Linguagem (JS/TS)', 'Avaliar o domínio da linguagem, desde a sintaxe assíncrona.', 'O que é o "event bubbling"?', 4),
('Júnior', 'JavaScript/React', 'Linguagem (JS/TS)', 'Avaliar o domínio da linguagem, desde a sintaxe assíncrona.', 'Explique a diferença entre null e undefined.', 5),

('Júnior', 'JavaScript/React', 'Framework (React)', 'Medir o conhecimento do React, desde seus conceitos básicos.', 'O que é a diferença entre state e props?', 1),
('Júnior', 'JavaScript/React', 'Framework (React)', 'Medir o conhecimento do React, desde seus conceitos básicos.', 'O que é JSX?', 2),
('Júnior', 'JavaScript/React', 'Framework (React)', 'Medir o conhecimento do React, desde seus conceitos básicos.', 'Como você passa dados de um componente pai para um filho?', 3),
('Júnior', 'JavaScript/React', 'Framework (React)', 'Medir o conhecimento do React, desde seus conceitos básicos.', 'O que são "keys" em listas do React e por que são importantes?', 4),

-- Pleno - Java
INSERT INTO interview_questions (seniority, stack, category, category_goal, question, order_position) VALUES
('Pleno', 'Java', 'Linguagem Principal (Core Java)', 'Avaliar a profundidade do conhecimento.', 'Explique o conceito de Reflection e como o Garbage Collector funciona.', 1),
('Pleno', 'Java', 'Linguagem Principal (Core Java)', 'Avaliar a profundidade do conhecimento.', 'O que são Annotations?', 2),
('Pleno', 'Java', 'Linguagem Principal (Core Java)', 'Avaliar a profundidade do conhecimento.', 'Qual a diferença entre HashMap, Hashtable e ConcurrentHashMap?', 3),
('Pleno', 'Java', 'Linguagem Principal (Core Java)', 'Avaliar a profundidade do conhecimento.', 'O que são streams no Java 8 e quais suas vantagens?', 4),

('Pleno', 'Java', 'Framework (Spring)', 'Medir a compreensão do framework.', 'Explique como funciona o contêiner de Inversão de Controle (IoC) do Spring.', 1),
('Pleno', 'Java', 'Framework (Spring)', 'Medir a compreensão do framework.', 'O que é Injeção de Dependência (DI)?', 2),
('Pleno', 'Java', 'Framework (Spring)', 'Medir a compreensão do framework.', 'Qual a diferença entre as anotações @Component, @Service, @Repository e @Controller?', 3),

-- Sênior - Java
INSERT INTO interview_questions (seniority, stack, category, category_goal, question, order_position) VALUES
('Sênior', 'Java', 'Linguagem Principal (Core Java)', 'Avaliar a profundidade do conhecimento nos mecanismos internos.', 'Discuta o Java Memory Model.', 1),
('Sênior', 'Java', 'Linguagem Principal (Core Java)', 'Avaliar a profundidade do conhecimento nos mecanismos internos.', 'Como você garantiria a segurança de threads (thread safety) em uma aplicação de alta concorrência?', 2),
('Sênior', 'Java', 'Linguagem Principal (Core Java)', 'Avaliar a profundidade do conhecimento nos mecanismos internos.', 'Explique como funcionam os ClassLoaders no Java.', 3),

('Sênior', 'Java', 'Arquitetura e Design', 'Analisar a capacidade de liderar transformações arquiteturais complexas.', 'Como você migraria um sistema monolítico legado para uma arquitetura de microsserviços usando o padrão Strangler Fig?', 1),
('Sênior', 'Java', 'Arquitetura e Design', 'Analisar a capacidade de liderar transformações arquiteturais complexas.', 'Discuta os trade-offs de diferentes padrões de comunicação em microsserviços (REST vs. Filas de Mensagens vs. gRPC).', 2),

-- Python
INSERT INTO interview_questions (seniority, stack, category, category_goal, question, order_position) VALUES
('Júnior', 'Python', 'Fundamentos da Linguagem', 'Avaliar o domínio da linguagem, desde suas estruturas de dados básicas.', 'Explique a diferença entre listas e tuplas em Python.', 1),
('Júnior', 'Python', 'Fundamentos da Linguagem', 'Avaliar o domínio da linguagem, desde suas estruturas de dados básicas.', 'Como funcionam os dicionários?', 2),
('Júnior', 'Python', 'Fundamentos da Linguagem', 'Avaliar o domínio da linguagem, desde suas estruturas de dados básicas.', 'O que é fatiamento (slicing) de sequências?', 3),
('Júnior', 'Python', 'Fundamentos da Linguagem', 'Avaliar o domínio da linguagem, desde suas estruturas de dados básicas.', 'O que são "list comprehensions"?', 4),

('Pleno', 'Python', 'Fundamentos da Linguagem', 'Avaliar o domínio de recursos avançados da linguagem.', 'Como funcionam os decorators e em que cenários você os utilizaria?', 1),
('Pleno', 'Python', 'Fundamentos da Linguagem', 'Avaliar o domínio de recursos avançados da linguagem.', 'O que são generators e qual a diferença para uma função normal?', 2),
('Pleno', 'Python', 'Fundamentos da Linguagem', 'Avaliar o domínio de recursos avançados da linguagem.', 'Qual a diferença entre *args e **kwargs?', 3),

-- Node.js
INSERT INTO interview_questions (seniority, stack, category, category_goal, question, order_position) VALUES
('Júnior', 'Node.js', 'Paradigma Central', 'Avaliar a profundidade do entendimento do modelo de E/S não bloqueante.', 'O que é o loop de eventos (event loop) no Node.js?', 1),
('Júnior', 'Node.js', 'Paradigma Central', 'Avaliar a profundidade do entendimento do modelo de E/S não bloqueante.', 'O que significa dizer que o Node.js é "non-blocking"?', 2),
('Júnior', 'Node.js', 'Paradigma Central', 'Avaliar a profundidade do entendimento do modelo de E/S não bloqueante.', 'O que é o módulo fs e para que serve?', 3),

('Júnior', 'Node.js', 'Programação Assíncrona', 'Medir a maturidade no tratamento da assincronicidade.', 'O que é "callback hell" e como Promises ajudam a resolvê-lo?', 1),
('Júnior', 'Node.js', 'Programação Assíncrona', 'Medir a maturidade no tratamento da assincronicidade.', 'Qual a diferença entre Promises e async/await?', 2),

-- C#/.NET
INSERT INTO interview_questions (seniority, stack, category, category_goal, question, order_position) VALUES
('Júnior', 'C#/.NET', 'Linguagem (C#)', 'Avaliar o domínio da linguagem C#, desde seus tipos fundamentais.', 'Qual a diferença entre struct (tipo de valor) e class (tipo de referência)?', 1),
('Júnior', 'C#/.NET', 'Linguagem (C#)', 'Avaliar o domínio da linguagem C#, desde seus tipos fundamentais.', 'O que é boxing e unboxing?', 2),
('Júnior', 'C#/.NET', 'Linguagem (C#)', 'Avaliar o domínio da linguagem C#, desde seus tipos fundamentais.', 'Explique os 4 pilares da OOP.', 3),

('Júnior', 'C#/.NET', 'Plataforma .NET', 'Medir a profundidade do conhecimento sobre a plataforma .NET.', 'Qual a diferença entre .NET Core e .NET Framework?', 1),
('Júnior', 'C#/.NET', 'Plataforma .NET', 'Medir a profundidade do conhecimento sobre a plataforma .NET.', 'O que é o CLR?', 2);
