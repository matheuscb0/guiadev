// Aplicação principal refatorada
class InterviewApp {
    constructor() {
        this.api = new QuestionsAPI();
        this.currentSeniority = 'Júnior';
        this.currentStack = 'JavaScript/React';
        this.seniorityChart = null;
        this.seniorityLevels = ['Estagiário', 'Júnior', 'Pleno', 'Sênior'];
        this.availableStacks = [];
        
        this.initializeElements();
    }

    initializeElements() {
        this.elements = {
            seniorityFilters: document.getElementById('seniority-filters'),
            stackFilters: document.getElementById('stack-filters'),
            questionsContainer: document.getElementById('questions-container'),
            questionsSection: document.getElementById('questions-section'),
            contentArea: document.getElementById('content-area'),
            modal: document.getElementById('modal'),
            modalTitle: document.getElementById('modal-title'),
            modalBody: document.getElementById('modal-body'),
            modalClose: document.getElementById('modal-close')
        };
    }

    async init() {
        try {
            this.showLoading();
            await this.loadInitialData();
            this.initChart();
            this.updateView();
            this.setupEventListeners();
            this.hideLoading();
        } catch (error) {
            console.error('Erro ao inicializar aplicação:', error);
            this.showError('Erro ao carregar a aplicação. Verifique sua conexão.');
        }
    }

    async loadInitialData() {
        try {
            // Carregar stacks disponíveis para a senioridade inicial
            this.availableStacks = await this.api.fetchAvailableStacks(this.currentSeniority);
            
            // Se o stack atual não estiver disponível, usar o primeiro disponível
            if (!this.availableStacks.includes(this.currentStack)) {
                this.currentStack = this.availableStacks[0] || 'JavaScript/React';
            }
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            // Fallback para stacks padrão se a API falhar
            this.availableStacks = ['JavaScript/React', 'Java', 'Node.js', 'Python'];
        }
    }

    setupEventListeners() {
        // Modal
        this.elements.modalClose.addEventListener('click', () => this.hideModal());
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) this.hideModal();
        });

        // Esc key para fechar modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.hideModal();
        });
    }

    createFilterButtons(container, items, activeItem, clickHandler, type) {
        container.innerHTML = '';
        items.forEach(item => {
            const button = document.createElement('button');
            button.textContent = item;
            const baseClasses = 'px-4 py-2 rounded-full text-sm md:text-base font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';
            
            if (type === 'seniority') {
                button.className = `${baseClasses} bg-white text-teal-700 border border-teal-200 hover:bg-teal-50 focus:ring-teal-500`;
            } else {
                button.className = `${baseClasses} bg-slate-100 text-slate-600 hover:bg-slate-200 focus:ring-slate-500`;
            }
            
            if (item === activeItem) {
                button.classList.add(type === 'seniority' ? 'active-seniority' : 'active-stack');
            }
            
            button.addEventListener('click', () => clickHandler(item));
            container.appendChild(button);
        });
    }

    async handleSeniorityClick(seniority) {
        try {
            this.showLoading();
            this.currentSeniority = seniority;
            
            // Carregar stacks disponíveis para a nova senioridade
            this.availableStacks = await this.api.fetchAvailableStacks(seniority);
            
            // Se o stack atual não estiver disponível, usar o primeiro disponível
            if (!this.availableStacks.includes(this.currentStack)) {
                this.currentStack = this.availableStacks[0];
            }
            
            await this.updateView();
            this.hideLoading();
        } catch (error) {
            console.error('Erro ao alterar senioridade:', error);
            this.showError('Erro ao carregar dados para esta senioridade.');
        }
    }

    async handleStackClick(stack) {
        try {
            this.showLoading();
            this.currentStack = stack;
            await this.updateView();
            this.hideLoading();
        } catch (error) {
            console.error('Erro ao alterar stack:', error);
            this.showError('Erro ao carregar perguntas para esta tecnologia.');
        }
    }

    async updateView() {
        try {
            // Atualizar filtros
            this.createFilterButtons(
                this.elements.seniorityFilters, 
                this.seniorityLevels, 
                this.currentSeniority, 
                (seniority) => this.handleSeniorityClick(seniority), 
                'seniority'
            );
            
            this.createFilterButtons(
                this.elements.stackFilters, 
                this.availableStacks, 
                this.currentStack, 
                (stack) => this.handleStackClick(stack), 
                'stack'
            );

            // Carregar perguntas
            await this.loadQuestions();
            
            // Atualizar gráfico
            await this.updateChart();
            
        } catch (error) {
            console.error('Erro ao atualizar view:', error);
            this.showError('Erro ao atualizar a interface.');
        }
    }

    async loadQuestions() {
        try {
            const data = await this.api.fetchQuestions(this.currentSeniority, this.currentStack);
            this.renderQuestions(data);
        } catch (error) {
            console.error('Erro ao carregar perguntas:', error);
            this.renderQuestionsError();
        }
    }

    renderQuestions(data) {
        // Atualizar header da seção
        this.updateQuestionsHeader(data);
        
        // Renderizar perguntas
        this.elements.questionsContainer.innerHTML = '';
        
        if (data.categories && data.categories.length > 0) {
            data.categories.forEach(category => {
                const card = this.createQuestionCard(category);
                this.elements.questionsContainer.appendChild(card);
            });
            
            // Adicionar botão de simulação
            this.addSimulationButton();
        } else {
            this.renderNoQuestions();
        }
    }

    updateQuestionsHeader(data) {
        // Criar ou atualizar o header se não existir
        let header = this.elements.questionsSection.querySelector('.questions-header');
        if (!header) {
            header = document.createElement('div');
            header.className = 'questions-header flex justify-between items-center mb-6';
            this.elements.questionsSection.insertBefore(header, this.elements.questionsContainer);
        }
        
        header.innerHTML = `
            <div>
                <h3 class="text-2xl font-bold text-slate-800">${this.currentStack} - Nível ${this.currentSeniority}</h3>
                <p class="text-slate-600 mt-1">${data.intro}</p>
            </div>
            <button id="simulate-interview-btn" class="bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap">
                🎯 Simular Entrevista
            </button>
        `;
        
        // Adicionar listener para o botão de simulação
        const simulateBtn = document.getElementById('simulate-interview-btn');
        if (simulateBtn) {
            simulateBtn.addEventListener('click', () => this.handleSimulateInterview());
        }
    }

    createQuestionCard(category) {
        const card = document.createElement('div');
        card.className = 'bg-white border border-slate-200 rounded-xl p-6 shadow-sm fade-in';
        
        const itemsHtml = category.items.map((item, index) => `
            <li class="flex items-start justify-between group py-1">
                <span class="flex-1 text-slate-700">${item}</span>
                <div class="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button class="generate-answer-btn text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200 transition-colors" data-question="${item}">
                        ✨ IA
                    </button>
                </div>
            </li>
        `).join('');

        card.innerHTML = `
            <h4 class="font-bold text-lg text-slate-800 mb-2">${category.title}</h4>
            <p class="text-sm text-slate-500 italic mb-4"><strong>Objetivo:</strong> ${category.goal}</p>
            <ul class="space-y-2 text-slate-600">${itemsHtml}</ul>
        `;

        // Adicionar event listeners para os botões
        card.querySelectorAll('.generate-answer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.getAttribute('data-question');
                this.handleGenerateAnswer(question);
            });
        });

        return card;
    }

    addSimulationButton() {
        // O botão já é adicionado no header, então não precisamos fazer nada aqui
    }

    renderNoQuestions() {
        this.elements.questionsContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">🤔</div>
                <h3 class="text-xl font-semibold text-slate-600 mb-2">Nenhuma pergunta encontrada</h3>
                <p class="text-slate-500">Não há perguntas disponíveis para ${this.currentStack} - ${this.currentSeniority}</p>
            </div>
        `;
    }

    renderQuestionsError() {
        this.elements.questionsContainer.innerHTML = `
            <div class="text-center py-12">
                <div class="text-6xl mb-4">⚠️</div>
                <h3 class="text-xl font-semibold text-slate-600 mb-2">Erro ao carregar perguntas</h3>
                <p class="text-slate-500">Tente novamente em alguns instantes</p>
                <button class="mt-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700" onclick="window.location.reload()">
                    Tentar Novamente
                </button>
            </div>
        `;
    }

    async handleGenerateAnswer(question) {
        this.showModal('Resposta Modelo ✨', this.getLoadingHTML());
        try {
            const prompt = `Responda como um candidato ${this.currentSeniority} para ${this.currentStack}. Seja direto, objetivo e prático. Máximo 3-4 parágrafos. Pergunta: "${question}"`;
            const answer = await this.api.generateAnswer(prompt);
            const formattedAnswer = answer.replace(/\n/g, '<br>');
            this.elements.modalBody.innerHTML = `<p>${formattedAnswer}</p>`;
        } catch (error) {
            this.elements.modalBody.innerHTML = '<p class="text-red-500">Desculpe, ocorreu um erro ao gerar a resposta. Tente novamente.</p>';
            console.error(error);
        }
    }

    async handleSimulateInterview() {
        try {
            this.showModal('Simulação de Entrevista ✨', this.getLoadingHTML());
            
            const { question } = await this.api.fetchRandomQuestion(this.currentSeniority, this.currentStack);

            this.elements.modalBody.innerHTML = `
                <p class="font-semibold mb-2">Pergunta:</p>
                <p class="mb-4 p-3 bg-slate-50 rounded-lg">${question}</p>
                <textarea id="user-answer" class="w-full p-3 border rounded-lg" rows="6" placeholder="Digite sua resposta aqui..."></textarea>
                <button id="submit-answer-btn" class="mt-4 bg-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-700 w-full">
                    Enviar Resposta e Receber Feedback
                </button>
                <div id="feedback-container" class="mt-4"></div>
            `;

            document.getElementById('submit-answer-btn').addEventListener('click', () => {
                this.handleSubmitAnswer(question);
            });
        } catch (error) {
            console.error('Erro na simulação:', error);
            this.elements.modalBody.innerHTML = '<p class="text-red-500">Erro ao carregar pergunta para simulação. Tente novamente.</p>';
        }
    }

    async handleSubmitAnswer(question) {
        const userAnswer = document.getElementById('user-answer').value;
        if (!userAnswer.trim()) {
            alert('Por favor, digite uma resposta antes de enviar.');
            return;
        }

        const feedbackContainer = document.getElementById('feedback-container');
        feedbackContainer.innerHTML = this.getLoadingHTML();

        try {
            const prompt = `Você é um recrutador tech avaliando um candidato ${this.currentSeniority}. Fale DIRETAMENTE com o candidato usando "você".

Pergunta: "${question}"
Resposta: "${userAnswer}"

Dê um feedback natural em 3 partes curtas:
1. Um elogio genuíno sobre a resposta
2. Uma observação crítica (se necessário para o nível)  
3. Uma dica prática para melhorar

Use linguagem natural, correta e direta. Máximo 3-4 linhas.`;

            const feedback = await this.api.generateAnswer(prompt);
            
            // Converter markdown básico para HTML
            let formattedFeedback = feedback;
            formattedFeedback = formattedFeedback.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
            formattedFeedback = formattedFeedback.replace(/\n/g, '<br>');
            
            feedbackContainer.innerHTML = `
                <h4 class="font-bold text-lg mt-4">Feedback da IA:</h4>
                <div class="p-4 bg-slate-100 rounded-lg mt-2">${formattedFeedback}</div>
            `;
        } catch (error) {
            feedbackContainer.innerHTML = '<p class="text-red-500">Desculpe, ocorreu um erro ao gerar o feedback. Tente novamente.</p>';
            console.error(error);
        }
    }

    async updateChart() {
        try {
            const chartData = await this.api.fetchChartData(this.currentSeniority);
            
            if (this.seniorityChart && chartData.length > 0) {
                const values = chartData.map(item => item.value);
                const labels = chartData.map(item => item.label);
                
                this.seniorityChart.data.labels = labels;
                this.seniorityChart.data.datasets[0].data = values;
                this.seniorityChart.data.datasets[0].label = `Foco para ${this.currentSeniority}`;
                this.seniorityChart.update();
            }
        } catch (error) {
            console.error('Erro ao atualizar gráfico:', error);
        }
    }

    initChart() {
        const canvas = document.getElementById('seniorityChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        this.seniorityChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Fundamentos', 'Ferramentas e Frameworks', 'Qualidade e Testes', 'Design e Arquitetura', 'Performance e Escala', 'Liderança e Estratégia'],
                datasets: [{
                    label: `Foco para ${this.currentSeniority}`,
                    data: [4, 4, 3, 2, 2, 1], // Dados padrão
                    backgroundColor: 'rgba(13, 148, 136, 0.2)',
                    borderColor: 'rgb(13, 148, 136)',
                    pointBackgroundColor: 'rgb(13, 148, 136)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(13, 148, 136)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        pointLabels: {
                            font: { size: 12 }
                        },
                        grid: {
                            color: 'rgba(148, 163, 184, 0.3)'
                        },
                        angleLines: {
                            color: 'rgba(148, 163, 184, 0.3)'
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed.r}/5`;
                            }
                        }
                    }
                }
            }
        });
    }

    showModal(title, content) {
        this.elements.modalTitle.textContent = title;
        this.elements.modalBody.innerHTML = content;
        this.elements.modal.classList.add('visible');
    }

    hideModal() {
        this.elements.modal.classList.remove('visible');
    }

    getLoadingHTML() {
        return '<div class="loader"></div><p class="text-center text-slate-500">Gerando com IA...</p>';
    }

    showLoading() {
        this.elements.contentArea.classList.add('loading');
    }

    hideLoading() {
        this.elements.contentArea.classList.remove('loading');
    }

    showError(message) {
        this.elements.questionsContainer.innerHTML = `
            <div class="error-message">
                <strong>Erro:</strong> ${message}
            </div>
        `;
        this.hideLoading();
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const app = new InterviewApp();
    app.init();
});
