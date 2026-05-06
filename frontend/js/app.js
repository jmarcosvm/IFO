/* ============================================
   IFO - JavaScript Principal
   Dados de congelados (serão substituídos pela API na Sprint 3)
   ============================================ */

// ============================================
// DADOS DE TESTE - Simulam o banco de dados
// Baseados no SQL ifo_schema_001.sql
// ============================================

// Dados do usuário logado (Douglas)
const usuario = {
    id: 1,
    nome: "Douglas Teste",
    email: "douglas@ifo.teste",
    rendaMensal: 1500.00
};

// Lista de transações (receitas e despesas)
const transacoes = [
    { id: 1, descricao: "Mesada dos pais", valor: 1500.00, tipo: "RECEITA", data: "2025-04-01", paga: true },
    { id: 2, descricao: "Freelance de fim de semana", valor: 500.00, tipo: "RECEITA", data: "2025-04-10", paga: true },
    { id: 3, descricao: "Ajuda em casa", valor: 600.00, tipo: "DESPESA", data: "2025-04-05", paga: true },
    { id: 4, descricao: "Supermercado", valor: 300.00, tipo: "DESPESA", data: "2025-04-08", paga: true },
    { id: 5, descricao: "Ônibus/Uber", valor: 150.00, tipo: "DESPESA", data: "2025-04-12", paga: true },
    { id: 6, descricao: "Cinema com amigos", valor: 200.00, tipo: "DESPESA", data: "2025-04-15", paga: true },
    { id: 7, descricao: "Lanche na faculdade", valor: 100.00, tipo: "DESPESA", data: "2025-04-18", paga: true },
    { id: 8, descricao: "Guardar para console", valor: 300.00, tipo: "DESPESA", data: "2025-04-20", paga: true }
];

// Categorias de receitas e despesas
const categorias = [
    { id: 1, nome: "Mesada", tipo: "RECEITA" },
    { id: 2, nome: "Freelance", tipo: "RECEITA" },
    { id: 3, nome: "Lazer", tipo: "DESPESA" },
    { id: 4, nome: "Alimentação", tipo: "DESPESA" },
    { id: 5, nome: "Transporte", tipo: "DESPESA" },
    { id: 6, nome: "Investimento", tipo: "DESPESA" }
];

// Metas financeiras do usuário
const metas = [
    { id: 1, titulo: "Comprar Console Novo", valorObjetivo: 3000.00, valorAtual: 300.00, prazo: "2025-12-31" }
];

// Orçamentos mensais por categoria
const orcamentos = [
    { id: 1, categoria: "Alimentação", limite: 750.00, gasto: 300.00 },
    { id: 2, categoria: "Lazer", limite: 450.00, gasto: 300.00 },
    { id: 3, categoria: "Investimento", limite: 300.00, gasto: 300.00 }
];

// Simulações de investimento
const investimentos = [
    { id: 1, valorMensal: 300.00, taxaJuros: 1.00, tempoMeses: 12, tipoJuros: "COMPOSTO", montanteFinal: 3804.75 }
];

/* ============================================
   FUNÇÕES GERAIS (UTILITÁRIOS)
   ============================================ */

// Formata número como moeda brasileira (R$)
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Formata data ISO (AAAA-MM-DD) para formato brasileiro (DD/MM/AAAA)
function formatarData(dataISO) {
    if (!dataISO) return "-";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

// Calcula saldo total: receitas menos despesas
function calcularSaldo() {
    const receitas = transacoes
        .filter(t => t.tipo === "RECEITA")  // Filtra apenas receitas
        .reduce((sum, t) => sum + t.valor, 0);  // Soma todas
    
    const despesas = transacoes
        .filter(t => t.tipo === "DESPESA")  // Filtra apenas despesas
        .reduce((sum, t) => sum + t.valor, 0);  // Soma todas
    
    return receitas - despesas;  // Retorna diferença
}

// Calcula total de receitas OU despesas (depende do parâmetro)
function calcularTotalPorTipo(tipo) {
    return transacoes
        .filter(t => t.tipo === tipo)  // Filtra pelo tipo (RECEITA ou DESPESA)
        .reduce((sum, t) => sum + t.valor, 0);  // Soma valores
}

// Calcula percentual de progresso da meta
function calcularProgresso(meta) {
    return ((meta.valorAtual / meta.valorObjetivo) * 100).toFixed(1);
}

/* ============================================
   FUNÇÕES DE RENDERIZAÇÃO (ATUALIZAM A TELA)
   ============================================ */

// Atualiza o saldo mostrado no dashboard
function carregarSaldo() {
    const saldoElement = document.querySelector("#saldo");
    if (saldoElement) {
        saldoElement.textContent = formatarMoeda(calcularSaldo());
    }
}

// Atualiza totais de receitas e despesas no dashboard
function carregarResumo() {
    const receitasElement = document.querySelector("#total-receitas");
    const despesasElement = document.querySelector("#total-despesas");
    
    if (receitasElement) {
        receitasElement.textContent = formatarMoeda(calcularTotalPorTipo("RECEITA"));
    }
    
    if (despesasElement) {
        despesasElement.textContent = formatarMoeda(calcularTotalPorTipo("DESPESA"));
    }
}

// Preenche a tabela de transações na página
function carregarTransacoes() {
    const tbody = document.querySelector("#tabela-transacoes");
    if (!tbody) return;  // Se não existir tabela, sai da função

    // Para cada transação, cria uma linha na tabela
    tbody.innerHTML = transacoes.map(t => `
        <tr>
            <td>${formatarData(t.data)}</td>
            <td>${t.descricao}</td>
            <td>
                <span class="badge ${t.tipo === 'RECEITA' ? 'badge-receita' : 'badge-despesa'}">
                    ${t.tipo === 'RECEITA' ? 'Receita' : 'Despesa'}
                </span>
            </td>
            <td class="${t.tipo === 'RECEITA' ? 'receita' : 'despesa'}">
                ${t.tipo === 'RECEITA' ? '+' : '-'} ${formatarMoeda(t.valor)}
            </td>
            <td>
                <button class="btn btn-sm btn-secondary">Editar</button>
                <button class="btn btn-sm btn-danger">Excluir</button>
            </td>
        </tr>
    `).join("");  // Junta todas as linhas em uma string
}

// Renderiza cards de metas financeiras com barra de progresso
function carregarMetas() {
    const container = document.querySelector("#lista-metas");
    if (!container) return;

    container.innerHTML = metas.map(meta => {
        const progresso = calcularProgresso(meta);
        // Define cor da barra: verde (100%), amarela (50%+), vermelha (<50%)
        const classeProgresso = progresso >= 100 ? 'progress-green' : progresso >= 50 ? 'progress-yellow' : 'progress-red';
        
        return `
            <div class="card">
                <h3>${meta.titulo}</h3>
                <div class="flex mb-2">
                    <span>${formatarMoeda(meta.valorAtual)}</span>
                    <span>de ${formatarMoeda(meta.valorObjetivo)}</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar ${classeProgresso}" style="width: ${progresso}%"></div>
                </div>
                <p class="text-center mt-2"><strong>${progresso}%</strong> concluído</p>
                <p class="text-center text-muted">Prazo: ${formatarData(meta.prazo)}</p>
                <button class="btn btn-primary btn-sm mt-2" onclick="alert('Funcionalidade será implementada com backend na Sprint 3!')">Adicionar Valor</button>
            </div>
        `;
    }).join("");
}

// Renderiza cards de orçamentos com alerta se próximo do limite
function carregarOrcamentos() {
    const container = document.querySelector("#lista-orcamentos");
    if (!container) return;

    container.innerHTML = orcamentos.map(orc => {
        const percentual = ((orc.gasto / orc.limite) * 100).toFixed(1);
        // Cor da barra: vermelho (100%+), amarelo (70%+), verde (<70%)
        const classeProgresso = percentual >= 100 ? 'progress-red' : percentual >= 70 ? 'progress-yellow' : 'progress-green';
        
        return `
            <div class="card">
                <h3>${orc.categoria}</h3>
                <div class="flex mb-2">
                    <span>${formatarMoeda(orc.gasto)}</span>
                    <span>de ${formatarMoeda(orc.limite)}</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar ${classeProgresso}" style="width: ${percentual}%"></div>
                </div>
                <p class="text-center mt-2"><strong>${percentual}%</strong> utilizado</p>
                ${percentual >= 90 ? '<div class="alert alert-warning mt-2">⚠️ Próximo do limite!</div>' : ''}
            </div>
        `;
    }).join("");
}

// Exibe resultados da simulação de investimento
function carregarInvestimentos() {
    const container = document.querySelector("#resultado-investimento");
    if (!container || investimentos.length === 0) return;

    const inv = investimentos[0];
    const totalInvestido = inv.valorMensal * inv.tempoMeses;  // Soma de todos os aportes
    const rendimento = inv.montanteFinal - totalInvestido;  // Quanto rendeu

    container.innerHTML = `
        <div class="grid-2">
            <div class="card">
                <h3>Resumo da Simulação</h3>
                <p><strong>Valor Mensal:</strong> ${formatarMoeda(inv.valorMensal)}</p>
                <p><strong>Taxa de Juros:</strong> ${inv.taxaJuros}% ao mês</p>
                <p><strong>Tempo:</strong> ${inv.tempoMeses} meses</p>
                <p><strong>Tipo:</strong> ${inv.tipoJuros === 'COMPOSTO' ? 'Juros Compostos' : 'Juros Simples'}</p>
            </div>
            <div class="card">
                <h3>Resultados</h3>
                <p><strong>Total Investido:</strong> ${formatarMoeda(totalInvestido)}</p>
                <p><strong>Montante Final:</strong> <span style="color: #10B981; font-size: 24px;">${formatarMoeda(inv.montanteFinal)}</span></p>
                <p><strong>Rendimento:</strong> ${formatarMoeda(rendimento)}</p>
                <p><strong>Rentabilidade:</strong> ${((rendimento / totalInvestido) * 100).toFixed(2)}%</p>
            </div>
        </div>
    `;
}

// Atualiza nome do usuário no header/cabeçalho
function carregarUsuario() {
    const usuarioElement = document.querySelector("#nome-usuario");
    if (usuarioElement) {
        usuarioElement.textContent = usuario.nome;
    }
}

/* ============================================
   INICIALIZAÇÃO (EXECUTA AO CARREGAR PÁGINA)
   ============================================ */

// Quando o HTML estiver completamente carregado
document.addEventListener("DOMContentLoaded", () => {
    // Chama todas as funções para preencher a tela
    carregarUsuario();
    carregarSaldo();
    carregarResumo();
    carregarTransacoes();
    carregarMetas();
    carregarOrcamentos();
    carregarInvestimentos();

    // Mensagens no console para debug
    console.log("IFO Frontend carregado com sucesso!");
    console.log("Dados mockados - Backend será integrado na Sprint 3!");
});