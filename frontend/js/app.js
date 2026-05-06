/* ============================================
   IFO - JavaScript Principal
   Dados Mockados (serão substituídos pela API na Sprint 2)
   ============================================ */

// DADOS MOCKADOS - BASEADO NO SQL ifo_schema_001.sql
const usuario = {
    id: 1,
    nome: "Douglas Teste",
    email: "douglas@ifo.teste",
    rendaMensal: 1500.00
};

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

const categorias = [
    { id: 1, nome: "Mesada", tipo: "RECEITA" },
    { id: 2, nome: "Freelance", tipo: "RECEITA" },
    { id: 3, nome: "Lazer", tipo: "DESPESA" },
    { id: 4, nome: "Alimentação", tipo: "DESPESA" },
    { id: 5, nome: "Transporte", tipo: "DESPESA" },
    { id: 6, nome: "Investimento", tipo: "DESPESA" }
];

const metas = [
    { id: 1, titulo: "Comprar Console Novo", valorObjetivo: 3000.00, valorAtual: 300.00, prazo: "2025-12-31" }
];

const orcamentos = [
    { id: 1, categoria: "Alimentação", limite: 750.00, gasto: 300.00 },
    { id: 2, categoria: "Lazer", limite: 450.00, gasto: 300.00 },
    { id: 3, categoria: "Investimento", limite: 300.00, gasto: 300.00 }
];

const investimentos = [
    { id: 1, valorMensal: 300.00, taxaJuros: 1.00, tempoMeses: 12, tipoJuros: "COMPOSTO", montanteFinal: 3804.75 }
];

/* ============================================
   FUNÇÕES GERAIS
   ============================================ */

// Formatador de moeda
function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Formatador de data
function formatarData(dataISO) {
    if (!dataISO) return "-";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

// Calcular saldo total
function calcularSaldo() {
    const receitas = transacoes
        .filter(t => t.tipo === "RECEITA")
        .reduce((sum, t) => sum + t.valor, 0);
    
    const despesas = transacoes
        .filter(t => t.tipo === "DESPESA")
        .reduce((sum, t) => sum + t.valor, 0);
    
    return receitas - despesas;
}

// Calcular total por tipo
function calcularTotalPorTipo(tipo) {
    return transacoes
        .filter(t => t.tipo === tipo)
        .reduce((sum, t) => sum + t.valor, 0);
}

// Calcular progresso da meta
function calcularProgresso(meta) {
    return ((meta.valorAtual / meta.valorObjetivo) * 100).toFixed(1);
}

/* ============================================
   FUNÇÕES DE RENDERIZAÇÃO
   ============================================ */

// Carregar saldo no dashboard
function carregarSaldo() {
    const saldoElement = document.querySelector("#saldo");
    if (saldoElement) {
        saldoElement.textContent = formatarMoeda(calcularSaldo());
    }
}

// Carregar resumo de receitas e despesas
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

// Carregar transações na tabela
function carregarTransacoes() {
    const tbody = document.querySelector("#tabela-transacoes");
    if (!tbody) return;

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
    `).join("");
}

// Carregar metas
function carregarMetas() {
    const container = document.querySelector("#lista-metas");
    if (!container) return;

    container.innerHTML = metas.map(meta => {
        const progresso = calcularProgresso(meta);
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
                <button class="btn btn-primary btn-sm mt-2">Adicionar Valor</button>
            </div>
        `;
    }).join("");
}

// Carregar orçamentos
function carregarOrcamentos() {
    const container = document.querySelector("#lista-orcamentos");
    if (!container) return;

    container.innerHTML = orcamentos.map(orc => {
        const percentual = ((orc.gasto / orc.limite) * 100).toFixed(1);
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
                ${percentual >= 90 ? '<div class="alert alert-warning mt-2">Próximo do limite!</div>' : ''}
            </div>
        `;
    }).join("");
}

// Carregar simulador de investimento
function carregarInvestimentos() {
    const container = document.querySelector("#resultado-investimento");
    if (!container || investimentos.length === 0) return;

    const inv = investimentos[0];
    const totalInvestido = inv.valorMensal * inv.tempoMeses;
    const rendimento = inv.montanteFinal - totalInvestido;

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

// Carregar nome do usuário no header
function carregarUsuario() {
    const usuarioElement = document.querySelector("#nome-usuario");
    if (usuarioElement) {
        usuarioElement.textContent = usuario.nome;
    }
}

/* ============================================
   INICIALIZAÇÃO
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    carregarSaldo();
    carregarResumo();
    carregarTransacoes();
    carregarMetas();
    carregarOrcamentos();
    carregarInvestimentos();

    console.log("IFO Frontend carregado com sucesso!");
    console.log("Dados para tese! - Backend será integrado na Sprint 03!");
});