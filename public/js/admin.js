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
        
        // Bulk import elements
        this.bulkImportBtn = document.getElementById('bulk-import-btn');
        this.bulkDropdown = document.getElementById('bulk-dropdown');
        this.bulkImportModal = document.getElementById('bulk-import-modal');
        this.bulkImportCancel = document.getElementById('bulk-import-cancel');
        this.bulkImportSubmit = document.getElementById('bulk-import-submit');
        
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
        
        // Bulk import
        this.bulkImportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.bulkDropdown.classList.toggle('hidden');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.bulkDropdown.classList.add('hidden');
        });
        
        // Bulk import options
        document.getElementById('import-csv-btn').addEventListener('click', () => this.openBulkImport('csv'));
        document.getElementById('bulk-form-btn').addEventListener('click', () => this.openBulkImport('form'));
        document.getElementById('download-template-btn').addEventListener('click', () => this.downloadTemplate());
        
        // Bulk import modal
        this.bulkImportCancel.addEventListener('click', () => this.closeBulkImport());
        this.bulkImportSubmit.addEventListener('click', () => this.submitBulkImport());
        
        // Tab switching
        document.getElementById('tab-csv').addEventListener('click', () => this.switchTab('csv'));
        document.getElementById('tab-form').addEventListener('click', () => this.switchTab('form'));
        
        // File uploads
        document.getElementById('csv-file').addEventListener('change', (e) => this.handleFileUpload(e, 'csv'));
        
        // Preview buttons
        document.getElementById('preview-csv').addEventListener('click', () => this.previewData('csv'));
        
        // Auto preview for form when typing
        document.getElementById('bulk-questions').addEventListener('input', () => {
            clearTimeout(this.formPreviewTimeout);
            this.formPreviewTimeout = setTimeout(() => {
                try {
                    this.previewData('form');
                } catch (e) {
                    // Ignore errors during typing
                }
            }, 1000);
        });
        
        // Template downloads
        document.getElementById('download-csv-template').addEventListener('click', () => this.downloadTemplate('csv'));
        document.getElementById('download-csv-simple').addEventListener('click', () => this.downloadSimpleCSV());
        
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

    // ===== BULK IMPORT METHODS =====
    
    openBulkImport(tab = 'csv') {
        this.bulkDropdown.classList.add('hidden');
        this.switchTab(tab);
        this.bulkImportModal.classList.add('visible');
        this.resetBulkImport();
    }

    closeBulkImport() {
        this.bulkImportModal.classList.remove('visible');
        this.resetBulkImport();
    }

    resetBulkImport() {
        // Clear all inputs
        document.getElementById('csv-file').value = '';
        document.getElementById('csv-content').value = '';
        document.getElementById('bulk-seniority').value = '';
        document.getElementById('bulk-stack').value = '';
        document.getElementById('bulk-category').value = '';
        document.getElementById('bulk-category-goal').value = '';
        document.getElementById('bulk-questions').value = '';
        
        // Hide preview
        document.getElementById('preview-area').classList.add('hidden');
        this.bulkImportSubmit.disabled = true;
        
        // Clear any messages
        const existingMessages = this.bulkImportModal.querySelectorAll('.bulk-message');
        existingMessages.forEach(msg => msg.remove());
    }

    switchTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`tab-${tab}`).classList.add('active');
        
        // Show/hide content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        document.getElementById(`${tab}-import`).classList.remove('hidden');
    }

    handleFileUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            if (type === 'csv') {
                document.getElementById('csv-content').value = content;
            }
        };
        reader.readAsText(file);
    }

    parseCSV(content) {
        const lines = content.trim().split('\n');
        const questions = [];
        
        // Detectar separador (vírgula ou ponto e vírgula)
        const firstLine = lines[0];
        const separator = firstLine.includes(';') ? ';' : ',';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Parsing mais robusto para CSV
            const cols = this.parseCSVLine(line, separator);
            
            if (cols.length >= 5) {
                questions.push({
                    seniority: cols[0],
                    stack: cols[1],
                    category: cols[2],
                    category_goal: cols[3] || '',
                    question: cols[4],
                    order_position: parseInt(cols[5]) || 0
                });
            }
        }
        
        return questions;
    }

    parseCSVLine(line, separator) {
        const result = [];
        let current = '';
        let inQuotes = false;
        let quoteChar = '';
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if ((char === '"' || char === "'") && !inQuotes) {
                inQuotes = true;
                quoteChar = char;
            } else if (char === quoteChar && inQuotes) {
                if (nextChar === quoteChar) {
                    // Escaped quote
                    current += char;
                    i++; // Skip next char
                } else {
                    inQuotes = false;
                    quoteChar = '';
                }
            } else if (char === separator && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }

    parseForm() {
        const defaultSeniority = document.getElementById('bulk-seniority').value;
        const defaultStack = document.getElementById('bulk-stack').value;
        const defaultCategory = document.getElementById('bulk-category').value;
        const defaultCategoryGoal = document.getElementById('bulk-category-goal').value;
        const questionsText = document.getElementById('bulk-questions').value;
        
        if (!questionsText.trim()) {
            throw new Error('Digite pelo menos uma pergunta');
        }
        
        const lines = questionsText.trim().split('\n');
        const questions = [];
        
        lines.forEach((line, index) => {
            line = line.trim();
            if (!line) return;
            
            // Check if line has custom format: senioridade|stack|categoria|objetivo|pergunta
            if (line.includes('|')) {
                const parts = line.split('|').map(p => p.trim());
                if (parts.length >= 5) {
                    questions.push({
                        seniority: parts[0],
                        stack: parts[1],
                        category: parts[2],
                        category_goal: parts[3],
                        question: parts[4],
                        order_position: index + 1
                    });
                }
            } else {
                // Use default values
                questions.push({
                    seniority: defaultSeniority,
                    stack: defaultStack,
                    category: defaultCategory,
                    category_goal: defaultCategoryGoal,
                    question: line,
                    order_position: index + 1
                });
            }
        });
        
        return questions;
    }

    previewData(type) {
        try {
            let questions = [];
            
            if (type === 'csv') {
                const content = document.getElementById('csv-content').value;
                if (!content.trim()) {
                    throw new Error('Cole o conteúdo CSV ou carregue um arquivo');
                }
                questions = this.parseCSV(content);
            } else if (type === 'form') {
                questions = this.parseForm();
            }

            if (questions.length === 0) {
                throw new Error('Nenhuma pergunta válida encontrada');
            }

            this.displayPreview(questions);
            this.bulkImportSubmit.disabled = false;
            this.showBulkMessage('Preview gerado com sucesso!', 'success');

        } catch (error) {
            this.showBulkMessage(error.message, 'error');
            this.bulkImportSubmit.disabled = true;
        }
    }

    displayPreview(questions) {
        const tbody = document.getElementById('preview-table-body');
        const stats = document.getElementById('preview-stats');
        
        tbody.innerHTML = questions.map(q => `
            <tr>
                <td class="p-2">${q.seniority}</td>
                <td class="p-2">${q.stack}</td>
                <td class="p-2">${q.category}</td>
                <td class="p-2">${q.question.substring(0, 50)}${q.question.length > 50 ? '...' : ''}</td>
            </tr>
        `).join('');
        
        const uniqueStacks = [...new Set(questions.map(q => q.stack))];
        const uniqueCategories = [...new Set(questions.map(q => q.category))];
        
        stats.textContent = `${questions.length} perguntas • ${uniqueStacks.length} stacks • ${uniqueCategories.length} categorias`;
        
        document.getElementById('preview-area').classList.remove('hidden');
        
        // Store questions for import
        this.questionsToImport = questions;
    }

    async submitBulkImport() {
        if (!this.questionsToImport || this.questionsToImport.length === 0) {
            this.showBulkMessage('Nenhuma pergunta para importar. Gere o preview primeiro.', 'error');
            return;
        }

        const importBtn = this.bulkImportSubmit;
        const originalText = importBtn.textContent;
        importBtn.disabled = true;
        importBtn.textContent = 'Importando...';

        try {
            const response = await fetch('/api/admin/questions/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questions: this.questionsToImport,
                    password: this.currentPassword
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erro na importação');
            }

            const result = await response.json();
            
            // Show results
            if (result.results.success > 0) {
                this.showBulkMessage(
                    `✅ ${result.results.success}/${result.results.total} perguntas importadas com sucesso!`,
                    result.results.errors.length === 0 ? 'success' : 'warning'
                );
            }

            // Show errors if any
            if (result.results.errors.length > 0) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'bulk-message bulk-error mt-2 max-h-32 overflow-y-auto';
                errorDiv.innerHTML = `
                    <strong>Erros encontrados:</strong><br>
                    ${result.results.errors.slice(0, 5).map(e => `Linha ${e.index + 1}: ${e.error}`).join('<br>')}
                    ${result.results.errors.length > 5 ? `<br>... e mais ${result.results.errors.length - 5} erros` : ''}
                `;
                this.bulkImportModal.querySelector('.modal-content').appendChild(errorDiv);
            }

            // Reload questions if any were successful
            if (result.results.success > 0) {
                await this.loadQuestions();
                
                // Close modal after a delay
                setTimeout(() => {
                    this.closeBulkImport();
                }, 3000);
            }

        } catch (error) {
            this.showBulkMessage(`Erro durante a importação: ${error.message}`, 'error');
        } finally {
            importBtn.disabled = false;
            importBtn.textContent = originalText;
        }
    }

    showBulkMessage(message, type) {
        // Remove existing messages
        const existingMessages = this.bulkImportModal.querySelectorAll('.bulk-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Add new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `bulk-message bulk-${type}`;
        messageDiv.textContent = message;
        
        const modalContent = this.bulkImportModal.querySelector('.modal-content');
        modalContent.insertBefore(messageDiv, modalContent.lastElementChild);
    }

    downloadTemplate(type = 'csv') {
        if (type === 'csv') {
            // CSV para Excel brasileiro (separador ; e encoding UTF-8 com BOM)
            const csvContent = `seniority;stack;category;category_goal;question;order_position
Júnior;JavaScript;Conceitos Fundamentais;Verificar conhecimento básico da linguagem;O que é hoisting em JavaScript?;1
Júnior;JavaScript;Conceitos Fundamentais;Verificar conhecimento básico da linguagem;Qual a diferença entre == e === em JavaScript?;2
Pleno;Java;Framework (Spring);Medir conhecimento do framework;O que é Injeção de Dependência (DI)?;1`;
            
            this.downloadFileWithBOM(csvContent, 'template_perguntas_excel.csv', 'text/csv');
        }
    }

    downloadSimpleCSV() {
        // CSV simples com vírgulas (padrão universal)
        const csvContent = `seniority,stack,category,category_goal,question,order_position
"Júnior","JavaScript","Conceitos Fundamentais","Verificar conhecimento básico da linguagem","O que é hoisting em JavaScript?",1
"Júnior","JavaScript","Conceitos Fundamentais","Verificar conhecimento básico da linguagem","Qual a diferença entre == e === em JavaScript?",2
"Pleno","Java","Framework (Spring)","Medir conhecimento do framework","O que é Injeção de Dependência (DI)?",1`;
        
        this.downloadFile(csvContent, 'template_perguntas_simples.csv', 'text/csv');
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    downloadFileWithBOM(content, filename, contentType) {
        // Adiciona BOM (Byte Order Mark) para UTF-8 - ajuda o Excel a reconhecer a codificação
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + content], { type: contentType + ';charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}

// Initialize admin panel
const adminPanel = new AdminPanel();
