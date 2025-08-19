// API client para comunicação com o backend
class QuestionsAPI {
    constructor() {
        this.baseURL = '';
    }

    async fetchQuestions(seniority, stack) {
        try {
            const response = await fetch(`/api/questions/${encodeURIComponent(seniority)}/${encodeURIComponent(stack)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar perguntas:', error);
            throw error;
        }
    }

    async fetchAvailableStacks(seniority) {
        try {
            const response = await fetch(`/api/stacks/${encodeURIComponent(seniority)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar stacks disponíveis:', error);
            throw error;
        }
    }

    async fetchRandomQuestion(seniority, stack) {
        try {
            const response = await fetch(`/api/random-question/${encodeURIComponent(seniority)}/${encodeURIComponent(stack)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar pergunta aleatória:', error);
            throw error;
        }
    }

    async generateAnswer(prompt) {
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: "openai/gpt-oss-20b:free",
                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Erro ao gerar resposta:', error);
            throw error;
        }
    }
}

// Exportar a classe para uso global
window.QuestionsAPI = QuestionsAPI;
