$(document).ready(function () {
    let orcamento = 0;
    let totalCompras = 0;
    let produtos = [];

    carregarDadosDoStorage();

    //--------------------------
    // DEFINIR ORÇAMENTO
    //--------------------------
    $('#botaoOrcamento').click(function () {
        let valor = $('#orcamento').val().replace(',', '.');
        let valorTotal = parseFloat(valor);

        if (!isNaN(valorTotal)) {
            orcamento = valorTotal;
            localStorage.setItem('orcamento', orcamento);
            $('#orcamento').val('');
            atualizarTotais();
        } else {
            alert('Digite um valor válido para o orçamento.');
        }
    });

    //--------------------------
    // MODAL - ABRIR E FECHAR
    //--------------------------
    $('#add').click(function () {
        $('#modal').fadeIn();
    });

    $('#fecharX, #fecharModal').click(function () {
        $('#modal').fadeOut();
    });

    //--------------------------
    // SALVAR PRODUTO
    //--------------------------
    $('#salvar').click(function () {
        const produto = $('#produto').val();
        const preco = parseFloat($('#preco').val());
        const quantidade = parseInt($('#quantidade').val());

        if (produto && !isNaN(preco) && !isNaN(quantidade)) {
            const subtotal = preco * quantidade;
            totalCompras += subtotal;

            produtos.push({ produto, preco, quantidade });
            salvarProdutosNoStorage();

            adicionarLinhaNaTabela(produto, preco, quantidade, subtotal);
            atualizarTotais();

            $('#modal').fadeOut();
            $('#produto').val('');
            $('#preco').val('');
            $('#quantidade').val('1');
        } else {
            alert('Preencha todos os campos corretamente.');
        }
    });

    //--------------------------
    // REMOVER PRODUTO
    //--------------------------
    $('#tabelaProdutos').on('click', '.remover', function () {
        const linha = $(this).closest('tr');
        const index = linha.index();
        const subtotal = parseFloat(linha.attr('data-subtotal'));
        linha.remove();
        totalCompras -= subtotal;

        produtos.splice(index, 1);
        salvarProdutosNoStorage();
        atualizarTotais();
    });

    //--------------------------
    // LIMPAR LISTA
    //--------------------------
    $('#limparLista').click(function () {
        $('#tabelaProdutos tbody').empty();
        produtos = [];
        totalCompras = 0;
        localStorage.removeItem('produtos');
        atualizarTotais();
    });

    //--------------------------
    // ATUALIZAR TOTAIS
    //--------------------------
    function atualizarTotais() {
        $('#totalCompras').text('R$ ' + totalCompras.toFixed(2).replace('.', ','));

        const disponivel = orcamento - totalCompras;
        const formatado = 'R$ ' + disponivel.toFixed(2).replace('.', ',');

        $('#aindaDisponivel')
            .text(formatado)
            .removeClass('verde vermelho')
            .addClass(disponivel < 0 ? 'vermelho' : 'verde');
    }

    //--------------------------
    // LOCAL STORAGE: PRODUTOS
    //--------------------------
    function salvarProdutosNoStorage() {
        localStorage.setItem('produtos', JSON.stringify(produtos));
    }

    function carregarDadosDoStorage() {
        const produtosSalvos = localStorage.getItem('produtos');
        const orcamentoSalvo = localStorage.getItem('orcamento');


        if (orcamentoSalvo) {
            orcamento = parseFloat(orcamentoSalvo);
        }

        ;
        if (produtosSalvos) {
            produtos = JSON.parse(produtosSalvos);
            produtos.forEach(p => {
                const subtotal = p.preco * p.quantidade;
                totalCompras += subtotal;
                adicionarLinhaNaTabela(p.produto, p.preco, p.quantidade, subtotal);
            });
        }

        atualizarTotais();
    }

    //--------------------------
    // ADICIONAR LINHA NA TABELA
    //--------------------------
    function adicionarLinhaNaTabela(produto, preco, quantidade, subtotal) {
        $('#tabelaProdutos tbody').append(`
      <tr data-subtotal="${subtotal}">
        <td>${produto}</td>
        <td>R$ ${preco.toFixed(2).replace('.', ',')}</td>
        <td>${quantidade}</td>
        <td><button class="remover">X</button></td>
      </tr>
    `);
    }
});
