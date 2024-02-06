$(document).ready(function () {
     cardapio.eventos.init()
})

var cardapio = {};

var MEU_CARRINHO = [];
var MEU_ENDERECO = null;
var CELULAR_EMPRESA = '5541998370183';
var INSTAGRAM_EMPRESA = 'araugrowshop';
var FACEBOOK_EMPRESA = 'araugrow';
var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 6;

cardapio.eventos = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBtns();
    }
}


cardapio.metodos = {

    //obtem a lista de itens do cardapio
    obterItensCardapio: (
        categoria = "choripan",
        vermais = false) => {

        var filtro = MENU[categoria];

        if(!vermais) {
            $("#itensCardapio").html("")
            $("#btnVerMais").removeClass('hidden')
        }

        $.each(filtro, (i, e) => {

                let temp = cardapio.templates.item
                .replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${dsc}/g, e.dsc)
                .replace(/\${price}/g, e.price.toFixed(2)
                .replace(".",","))
                .replace(/\${id}/g, e.id)

                //click botao ver mais (12itens)
                if (vermais && i >= 4 && i <12) {
                    $("#itensCardapio").append(temp)
                }

                if(!vermais && i < 4) {
                    $("#itensCardapio").append(temp)
                }
                

        })

        // remover o active
        $(".container-menu a").removeClass('active')

        //adicionar o active
        $("#menu-" + categoria).addClass('active')
    },

    // clique no botao ver mais
    verMais: () => {

        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true)
        $("#btnVerMais").addClass('hidden')

    },

    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }
    },


    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)
    },

    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if(qntdAtual > 0) {

            // Obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //Obter a lista de itens
            let filtro = MENU[categoria];

            //Obter o item
            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if(item.length > 0) {

                //validar se ja existe o item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                //caso já exista só altera a qtde
                if(existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id ==id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;

                } else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }

                cardapio.metodos.mensagem('Item adicionado ao carrinho', 'green');
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();

                
            }

        }
    },

    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if(total>0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
            $(".badge-total-carrinho-1").removeClass('hidden');
        } else {
            $(".container-total-carrinho").addClass('hidden')
        }

        $(".container-total-carrinho").html(total);
        $(".badge-total-carrinho-1").html(total);

    },


    abrirCarrinho: (abrir) => {
        if (abrir) {
            $('.modal-full').removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        } else {
            $('.modal-full').addClass('hidden');
        }
    },


    carregarEtapa: (etapa) => {

        if(etapa == 1) {
            $("#lblTituloEtapa").text('Seu carrinho');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');

            
        }

        if(etapa == 2) {
            $("#lblTituloEtapa").text('Endereço de entrega');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

        if(etapa == 3) {
            $("#lblTituloEtapa").text('Resumo do pedido');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');
            

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');
        }

    },

    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;

        cardapio.metodos.carregarEtapa(etapa - 1)

    },

    carregarCarrinho: () => {

        cardapio.metodos.carregarEtapa(1);

        if(MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');

            $.each(MEU_CARRINHO, (i, e) => {
                let temp = cardapio.templates.itemCarrinho
                .replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace(".",","))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp);

                if((i + 1) == MEU_CARRINHO.length) {
                    cardapio.metodos.carregarValores()
                }

            } )

        } else {

            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i>Seu carrinho está vazio!</p>')
            cardapio.metodos.carregarValores()
            $(".botao-carrinho").html('<div class="badge-total-carrinho-1 hidden">0</div><i class="fa fa-shopping-bag"></i>')
        }



    },

    diminuirQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());

        if(qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        } else {
            cardapio.metodos.removerItemCarrinho(id)
        }
    },

    aumentarQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text());
        $("#qntd-carrinho-" + id).text(qntdAtual + 1)
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);

    },

    removerItemCarrinho: (id) => {

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id });
        cardapio.metodos.carregarCarrinho();
        cardapio.metodos.atualizarBadgeTotal();

        cardapio.metodos.mensagem('item removido do carrinho')
    },

    atualizarCarrinho: (id, qntd) => {


        let objIndex = MEU_CARRINHO.findIndex(( obj => obj.id == id));
        MEU_CARRINHO[objIndex].qntd = qntd;

        cardapio.metodos.atualizarBadgeTotal();
        cardapio.metodos.carregarValores();

    },

    carregarValores: () => {

        VALOR_CARRINHO = 0;

        $('#lblSubTotal').text('R$ 0,00');
        $('#lblValorEntrega').text('+ R$ 0,00');
        $('#lblValorTotal').text('R$ 0,00');

        $.each(MEU_CARRINHO, (i, e) => {

            VALOR_CARRINHO += parseFloat(e.price * e.qntd);

            if((i + 1) == MEU_CARRINHO.length) {
                $('#lblSubTotal').text(`R$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}`);
                $('#lblValorEntrega').text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace('.', ',')}`);
                $('#lblValorTotal').text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.', ',')}`);
            }

        })


    },

    carregarEndereco: () => {

        if(MEU_CARRINHO.length <= 0) {
            cardapio.metodos.mensagem('Seu carrinho está vazio')
            return
        } else {
            
            cardapio.metodos.carregarEtapa(2);
        }            
        
    },

    buscarCep: () => {
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');
    
        if (cep !== "") {
            var validacep = /^[0-9]{8}$/;
    
            if (validacep.test(cep)) {
                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
                    if (!("erro" in dados)) {
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUF").val(dados.uf);
                        $("#txtNumero").val('').focus();
                    } else {
                        cardapio.metodos.mensagem("CEP não encontrado. Preencha as informações manualmente");
                        $("#txtEndereco").focus();
                    }
                });
            } else {
                cardapio.metodos.mensagem("Formato do CEP inválido");
                $("#txtCEP").focus();
            }
        } else {
            cardapio.metodos.mensagem("Por favor, informe seu CEP");
            $("#txtCEP").focus();
        }
    },

    resumoPedido: () => {

        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUF").val().trim();
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        if(cep.length <= 0) {
            cardapio.metodos.mensagem("informe o cep, por favor");
            $("#txtCEP").focus();
            return;
        }

        if(endereco.length <= 0) {
            cardapio.metodos.mensagem("informe o endereço, por favor");
            $("#txtEndereco").focus();
            return;
        }

        if(bairro.length <= 0) {
            cardapio.metodos.mensagem("informe o bairro, por favor");
            $("#txtBairro").focus();
            return;
        }

        if(cidade.length <= 0) {
            cardapio.metodos.mensagem("informe a cidade, por favor");
            $("#txtCidade").focus();
            return;
        }

        if(uf == "-1") {
            cardapio.metodos.mensagem("informe o estado, por favor");
            $("#txtUf").focus();
            return;
        }

        if(numero.length <= 0) {
            cardapio.metodos.mensagem("informe o numero, por favor");
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento

    }
        cardapio.metodos.calcularEntrega();
        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();

    },

    carregarResumo: () => {


        $("#listaItensResumo").html('');

        $.each(MEU_CARRINHO, (i, e) => {
            let temp = cardapio.templates.itemResumo
            .replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2).replace(".",","))
            .replace(/\${qntd}/g, e.qntd)
        
            $("#listaItensResumo").append(temp)
        
        });

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}`);
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep}, ${MEU_ENDERECO.complemento}`);

        cardapio.metodos.finalizarPedido();

    },


    calcularEntrega: () => {
        if (MEU_ENDERECO !== null) {
            const service = new google.maps.DistanceMatrixService();
            const origin = 'Helena Piekarski Pinto, 456, Fazenda Velha, Araucária, PR, 83704650';
            const destination = `${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro}, ${MEU_ENDERECO.cidade}, ${MEU_ENDERECO.uf}, ${MEU_ENDERECO.cep}`;
            const request = {
                origins: [origin],
                destinations: [destination],
                travelMode: 'DRIVING', // Or 'bicycling', 'transit', 'walking'
                unitSystem: google.maps.UnitSystem.METRIC, // Or google.maps.UnitSystem.IMPERIAL
            };

            service.getDistanceMatrix(request, (response, status) => {
                if (status !== 'OK') {
                    console.error('Error:', status);
                    return;
                }
            
                // Process the response
                console.log(response);
            });

        }
    },

    calcularCustoEntrega: (distanceInKm) => {
        // Example: $1.5 per kilometer for delivery
        const costPerKm = 1.5;
        
        // Calculate the delivery cost based on the distance
        const deliveryCost = distanceInKm * costPerKm;

        // Ensure that the cost is not less than a minimum value, e.g., $5
        const minimumCost = 5;
        return Math.max(deliveryCost, minimumCost);
    },

    finalizarPedido: () => {
        if (MEU_CARRINHO.length > 0 && MEU_ENDERECO !== null) {
            var itens = ''; // Define 'itens' variable here
    
            $.each(MEU_CARRINHO, (i, e) => {
                itens += `*${e.qntd}x* ${e.name} ...... R$ ${e.price.toFixed(2).replace('.',',')} \n`;
    
                if ((i + 1) === MEU_CARRINHO.length) {
                    var texto = 'Olá, gostaria de fazer um pedido:';
                    texto += `\n -----------------------------`
                    texto += `\n*Itens do pedido:*\n\n${itens}`;
                    texto += `\n -----------------------------`
                    texto += `\n*Endereço de entrega:*`;
                    texto += `\n${MEU_ENDERECO.endereco}-${MEU_ENDERECO.numero} / ${MEU_ENDERECO.bairro}`;
                    texto += `\n${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf} / ${MEU_ENDERECO.cep}, ${MEU_ENDERECO.complemento}`;
                    texto += `\n -----------------------------`
                    texto += `\n\nValor do pedido: ${VALOR_CARRINHO.toFixed(2).replace('.',',')}`
                    texto += `\nValor da entrega: ${VALOR_ENTREGA.toFixed(2).replace('.',',')}`
                    texto += `\n\n*Total (com entrega): R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.',',')}*`;
    
    
                    let encode = encodeURI(texto);
    
                    let URL = `https://wa.me/${CELULAR_EMPRESA}/?text=${encode}`;

                    $("#btnEtapaResumo").attr('href', URL);
                }
            });
        }
    },



    carregarBtns: () => {

        $("#btnFacebook").attr('href', `https://facebook.com/${FACEBOOK_EMPRESA}`)
        $("#btnInstagram").attr('href', `https://instagram.com/${INSTAGRAM_EMPRESA}`)
        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);
    },









    //mensagem

    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();
        
        
        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}<div/>`
        
        $("#container-mensagem").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(()=>{
                $("#msg-" + id).remove();
            }, 800);
        }, tempo)
    }
    
}

cardapio.templates = {

    item: `
                    <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-3">
                        <div class="card card-item" id="\${id}">
                            <div class="img-produto">
                                <img src="\${img}"/>
                            </div>
                            <p class="title-produto text-center mt-4">
                                <b>\${name}</b>
                            </p>
                            <p class="price-produto text-center">
                            <b>R$ \${price}</b>
                            </p>
                            <p class="descricao-produto text-center mt-4">
                                <b>\${dsc}</b>
                            </p>
                            <div class="add-carrinho">
                                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                                <span class="add-numero-itens" id="qntd-\${id}">0</span>
                                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                                <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                            </div>
                        </div>
                    </div>
    `,

    itemCarrinho:`
                    <div class="col-12 item-carrinho">
                        <div class="img-produto">
                            <img src="\${img}"/>
                        </div>
                        <div class="dados-produto">
                            <p class="title-produto"><b>\${name}</b></p>
                            <p class="price-produto"><b>R$ \${price}</b></p>
                        </div>
                        
                        <div class="add-carrinho">
                            <span class="btn-menos-modal" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                            <span class="add-numero-itens-modal" id="qntd-carrinho-\${id}">\${qntd}</span>
                            <span class="btn-mais-modal" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                            <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fas fa-times"></i></span>
                        </div>
                    </div>
    `,

    itemResumo: `
                    <div class="col-12 item-carrinho resumo">
                        <div class="img-produto-resumo">
                            <img src="\${img}"/>
                        </div>
                        <div class="dados-produto">
                            <p class="title-produto-resumo">
                                <b>\${name}</b>
                            </p>
                            <p class="price-produto-resumo">
                                <b>R$ \${price}</b>
                            </p>
                        </div>
                        <p class="quantidade-produto-resumo">
                            x <b>\${qntd}</b>
                        </p>
                    </div>
    `,

    

}