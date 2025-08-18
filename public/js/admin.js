// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentPassword = null;
        this.questions = [];
        this.filteredQuestions = [];
        this.editingQuestion = null;
        
        this.initializeElements();
        this.setupEventListeners();
    }

    initializeElements() {
        // Login elements
        this.loginScreen = document.getElementById('login-screen');
        this.adminPanel = document.getElementById('admin-panel');
        this.passwordInput = document.getElementById('admin-password');
        this.loginBtn = document.getElementById('login-btn');
        this.loginError = document.getElementById('login-error');
        
        // Admin panel elements
        this.logoutBtn = document.getElementById('logout-btn');
        this.addQuestionBtn = document.getElementById('add-question-btn');
        
        // Filters
        this.filterSeniority = document.getElementById('filter-seniority');
        this.filterStack = document.getElementById('filter-stack');
        this.filterStatus = document.getElementById('filter-status');
        
        // Statistics
        this.totalQuestions = document.getElementById('total-questions');
        this.activeQuestions = document.getElementById('active-questions');
        this.totalStacks = document.getElementById('total-stacks');
        this.totalCategories = document.getElementById('total-categories');
        
        // Table
        this.questionsTableBody = document.getElementById('questions-table-body');
        this.tableLoading = document.getElementById('table-loading');
        this.tableEmpty = document.getElementById('table-empty');
        this.questionsCount = document.getElementById('questions-count');
        
        // Modal
        this.questionModal = document.getElementById('question-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.questionForm = document.getElementById('question-form');
        this.formCancel = document.getElementById('form-cancel');
        
        // Form fields
        this.formSeniority = document.getElementById('form-seniority');
        this.formStack = document.getElementById('form-stack');
        this.formCategory = document.getElementById('form-category');
        this.formCategoryGoal = document.getElementById('form-category-goal');
        this.formQuestion = document.getElementById('form-question');
        this.formOrder = document.getElementById('form-order');
        this.formActive = document.getElementById('form-active');
    }

    setupEventListeners() {
        // Login
        this.loginBtn.addEventListener('click', () => this.handleLogin());
        this.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
        
        // Admin panel
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        this.addQuestionBtn.addEventListener('click', () => this.openAddQuestionModal());
        
        // Filters
        this.filterSeniority.addEventListener('change', () => this.applyFilters());
        this.filterStack.addEventListener('change', () => this.applyFilters());
        this.filterStatus.addEventListener('change', () => this.applyFilters());
        
        // Modal
        this.formCancel.addEventListener('click', () => this.closeModal());
        this.questionForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Close modal on outside click
        this.questionModal.addEventListener('click', (e) => {
            if (e.target === this.questionModal) this.closeModal();
        });
    }

    async handleLogin() {
        const password = this.passwordInput.value;
        if (!password) {
            this.showLoginError('Digite a senha');
            return;
        }

        try {
            const response = await fetch('/api/admin/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const result = await response.json();

            if (result.valid) {
                this.currentPassword = password;
                this.showAdminPanel();
                await this.loadQuestions();
            } else {
                this.showLoginError('Senha incorreta');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            this.showLoginError('Erro de conexão');
        }
    }

    showLoginError(message) {
        this.loginError.textContent = message;
        this.loginError.classList.remove('hidden');
        setTimeout(() => {
            this.loginError.classList.add('hidden');
        }, 3000);
    }

    showAdminPanel() {
        this.loginScreen.classList.add('hidden');
        this.adminPanel.classList.remove('hidden');
    }

    handleLogout() {
        this.currentPassword = null;
        this.loginScreen.classList.remove('hidden');
        this.adminPanel.classList.add('hidden');
        this.passwordInput.value = '';
    }

    async loadQuestions() {
        try {
            this.showTableLoading(true);
            
            const response = await fetch('/api/admin/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: this.currentPassword })
            });

            if (!response.ok) {
                throw new Error('Erro ao carregar perguntas');
            }

            this.questions = await response.json();
            this.filteredQuestions = [...this.questions];
            
            this.updateStatistics();
            this.populateStackFilter();
            this.renderTable();
            this.showTableLoading(false);
            
        } catch (error) {
            console.error('Erro ao carregar perguntas:', error);
            this.showTableLoading(false);
            this.showError('Erro ao carregar perguntas');
        }
    }

    updateStatistics() {
        const activeQuestions = this.questions.filter(q => q.is_active);
        const uniqueStacks = [...new Set(this.questions.map(q => q.stack))];
        const uniqueCategories = [...new Set(this.questions.map(q => q.category))];

        this.totalQuestions.textContent = this.questions.length;
        this.activeQuestions.textContent = activeQuestions.length;
        this.totalStacks.textContent = uniqueStacks.length;
        this.totalCategories.textContent = uniqueCategories.length;
    }

    populateStackFilter() {
        const uniqueStacks = [...new Set(this.questions.map(q => q.stack))].sort();
        
        this.filterStack.innerHTML = '<option value="">Todas as tecnologias</option>';
        uniqueStacks.forEach(stack => {
            const option = document.createElement('option');
            option.value = stack;
            option.textContent = stack;
            this.filterStack.appendChild(option);
        });
    }

    applyFilters() {
        const seniorityFilter = this.filterSeniority.value;
        const stackFilter = this.filterStack.value;
        const statusFilter = this.filterStatus.value;

        this.filteredQuestions = this.questions.filter(question => {
            if (seniorityFilter && question.seniority !== seniorityFilter) return false;
            if (stackFilter && question.stack !== stackFilter) return false;
            if (statusFilter !== '' && question.is_active.toString() !== statusFilter) return false;
            return true;
        });

        this.renderTable();
    }

    renderTable() {
        this.questionsCount.textContent = `${this.filteredQuestions.length} pergunta(s)`;
        
        if (this.filteredQuestions.length === 0) {
            this.questionsTableBody.innerHTML = '';
            this.tableEmpty.classList.remove('hidden');
            return;
        }

        this.tableEmpty.classList.add('hidden');
        
        this.questionsTableBody.innerHTML = this.filteredQuestions.map(question => `
            <tr>
                <td class="p-3">${question.id}</td>
                <td class="p-3">
                    <span class="px-2 py-1 bg-slate-100 rounded text-xs font-medium">${question.seniority}</span>
                </td>
                <td class="p-3">
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">${question.stack}</span>
                </td>
                <td class="p-3">
                    <div class="font-medium">${question.category}</div>
                    ${question.category_goal ? `<div class="text-xs text-slate-500 mt-1">${question.category_goal.substring(0, 50)}...</div>` : ''}
                </td>
                <td class="p-3 max-w-xs">
                    <div class="truncate" title="${question.question}">${question.question}</div>
                </td>
                <td class="p-3">
                    <span class="${question.is_active ? 'status-active' : 'status-inactive'}">
                        ${question.is_active ? '✅ Ativa' : '❌ Inativa'}
                    </span>
                </td>
                <td class="p-3">
                    <div class="flex gap-2">
                        <button onclick="adminPanel.editQuestion(${question.id})" 
                                class="text-blue-600 hover:text-blue-800 text-sm">
                            ✏️ Editar
                        </button>
                        <button onclick="adminPanel.deleteQuestion(${question.id})" 
                                class="text-red-600 hover:text-red-800 text-sm">
                            🗑️ Deletar
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    showTableLoading(show) {
        if (show) {
            this.tableLoading.classList.remove('hidden');
            this.questionsTableBody.innerHTML = '';
        } else {
            this.tableLoading.classList.add('hidden');
        }
    }

    openAddQuestionModal() {
        this.editingQuestion = null;
        this.modalTitle.textContent = '➕ Nova Pergunta';
        this.clearForm();
        this.questionModal.classList.add('visible');
    }

    editQuestion(id) {
        this.editingQuestion = this.questions.find(q => q.id === id);
        if (!this.editingQuestion) return;

        this.modalTitle.textContent = '✏️ Editar Pergunta';
        this.fillForm(this.editingQuestion);
        this.questionModal.classList.add('visible');
    }

    clearForm() {
        this.formSeniority.value = '';
        this.formStack.value = '';
        this.formCategory.value = '';
        this.formCategoryGoal.value = '';
        this.formQuestion.value = '';
        this.formOrder.value = '0';
        this.formActive.checked = true;
    }

    fillForm(question) {
        this.formSeniority.value = question.seniority;
        this.formStack.value = question.stack;
        this.formCategory.value = question.category;
        this.formCategoryGoal.value = question.category_goal || '';
        this.formQuestion.value = question.question;
        this.formOrder.value = question.order_position || 0;
        this.formActive.checked = question.is_active;
    }

    closeModal() {
        this.questionModal.classList.remove('visible');
        this.editingQuestion = null;
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = {
            seniority: this.formSeniority.value,
            stack: this.formStack.value,
            category: this.formCategory.value,
            category_goal: this.formCategoryGoal.value,
            question: this.formQuestion.value,
            order_position: parseInt(this.formOrder.value) || 0,
            is_active: this.formActive.checked,
            password: this.currentPassword
        };

        try {
            let url, method;
            if (this.editingQuestion) {
                url = `/api/admin/questions/edit/${this.editingQuestion.id}`;
                method = 'POST';
            } else {
                url = '/api/admin/questions/add';
                method = 'POST';
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao salvar pergunta');
            }

            const result = await response.json();
            this.showSuccess(result.message);
            this.closeModal();
            await this.loadQuestions();
            
        } catch (error) {
            console.error('Erro ao salvar pergunta:', error);
            this.showError(error.message || 'Erro ao salvar pergunta');
        }
    }

    async deleteQuestion(id) {
        if (!confirm('Tem certeza que deseja deletar esta pergunta?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/questions/delete/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: this.currentPassword })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao deletar pergunta');
            }

            const result = await response.json();
            this.showSuccess(result.message);
            await this.loadQuestions();
            
        } catch (error) {
            console.error('Erro ao deletar pergunta:', error);
            this.showError(error.message || 'Erro ao deletar pergunta');
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 
            'bg-red-100 text-red-800 border border-red-200'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Initialize admin panel
const adminPanel = new AdminPanel();
