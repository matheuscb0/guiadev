# 📊 Guia de Importação em Massa - GuiaDev

## 🎯 **Sistema de Importação Implementado**

Adicionei um sistema completo de importação em massa de perguntas com **2 opções**:

### 1. **📊 Importação CSV (Recomendado para Excel)**
- **Template otimizado** para Excel brasileiro
- **Separador**: ponto e vírgula (`;`) 
- **Encoding**: UTF-8 com BOM
- **Arquivo**: `template_perguntas_excel.csv`

### 3. **✏️ Formulário Múltiplo**
- Digite várias perguntas rapidamente
- Define valores padrão uma vez
- Uma pergunta por linha

## 🔧 **Como usar no Excel - CORRIGIDO**

### ✅ **Método Correto**:

1. **Baixe o template** → Clique em "Template CSV (Excel)"
2. **Abra no Excel** → O arquivo já vem com:
   - ✅ Separadores corretos (`;`)
   - ✅ Encoding UTF-8 com BOM
   - ✅ Headers em português
3. **Edite os dados** diretamente no Excel
4. **Salve como CSV** (mantenha o formato)
5. **Importe no painel admin**

### 🚫 **Problemas do método anterior**:
- ❌ Separadores incorretos (`,` vs `;`)
- ❌ Encoding sem BOM
- ❌ Excel interpretava mal os caracteres

## 📝 **Formato dos Campos**

| Campo | Obrigatório | Exemplo |
|-------|-------------|---------|
| **seniority** | ✅ | Júnior, Pleno, Sênior, Estagiário |
| **stack** | ✅ | JavaScript, Java, Python, etc. |
| **category** | ✅ | Conceitos Fundamentais |
| **category_goal** | ❌ | Verificar conhecimento básico |
| **question** | ✅ | O que é hoisting em JavaScript? |
| **order_position** | ❌ | 1, 2, 3... (ordem de exibição) |

## 🎯 **Funcionalidades Avançadas**

### **Preview Inteligente**
- ✅ Visualiza dados antes de importar
- ✅ Mostra estatísticas (quantidade, stacks, categorias)
- ✅ Detecta erros automaticamente

### **Import Robusto**
- ✅ Valida cada linha individualmente
- ✅ Continua mesmo se algumas linhas falharem
- ✅ Relatório detalhado de erros
- ✅ Suporte a aspas e caracteres especiais

### **Formatos Flexíveis**
- ✅ Aceita `,` e `;` como separadores
- ✅ Trata aspas automaticamente
- ✅ Remove espaços extras

## 📊 **Templates Disponíveis**

### **Template Excel (Recomendado)**
```csv
seniority;stack;category;category_goal;question;order_position
Júnior;JavaScript;Conceitos Fundamentais;Verificar conhecimento básico;O que é hoisting?;1
```

### **Template Simples**  
```csv
"seniority","stack","category","category_goal","question","order_position"
"Júnior","JavaScript","Conceitos Fundamentais","Verificar conhecimento básico","O que é hoisting?",1
```


## 🚀 **Como Testar**

1. **Acesse**: `http://localhost:3000/admin.html`
2. **Login** com sua senha admin
3. **Clique**: "Importar Múltiplas" → "Importar CSV"
4. **Baixe**: "Template CSV (Excel)"
5. **Abra no Excel** → Edite → Salve
6. **Importe** o arquivo
7. **Preview** → **Importar**

## ✨ **Benefícios da Implementação**

- ✅ **Compatibilidade total** com Excel brasileiro
- ✅ **Detecção automática** de separadores
- ✅ **Validação robusta** com relatórios de erro
- ✅ **Preview antes de importar**
- ✅ **Múltiplos formatos** (CSV, Formulário)
- ✅ **Templates prontos** para uso
- ✅ **Interface intuitiva** com tabs

**Agora o Excel vai funcionar perfeitamente!** 🎉
