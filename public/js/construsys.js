var actFiltrar;
var camposFiltro;
var operadoresFiltro;
var valoresFiltro;

function getDisabled() {
    return $('#btn-incluir').prop('disabled');
}

function setBtnLoading(btn, loading) {
    if (loading) {
        var btnTxt = btn.html();
        btnTxt = btnTxt.substr(btnTxt.indexOf('</i>') + 4, btnTxt.length);
        btn.attr('data-loading-text', '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i>' + btnTxt);
        return btn.button('loading');
    } else {
        btn.button('reset');
        return null;
    }
}

function alteraBotao(botao, habilitado) {
    if (habilitado) {
        botao.removeClass('disabled');
    } else {
        botao.addClass('disabled');
    }
    botao.attr('enabled', habilitado);
    botao.attr('disabled', !habilitado);
}

function botaoHabilitado(botao) {
    return botao.attr('enabled') === 'true' || botao.attr('enabled') === true;
}

function atualizaBotoes(table = null) {
    var selecionados = 0;
    var checks = $('.chk-acao');
    var checkAll = $('#chk-all'); 
    var btnSingle = $('.btn-single');
    var btnMulti = $('.btn-multi');
    if (table !== null){
        checks = table.find('.chk-acao');
        checkAll = table.find('#chk-all');
        btnSingle = table.closest('form').find('.btn-single');
        btnMulti = table.closest('form').find('.btn-multi');
    }
    checks.each(function () {
        if ($(this).prop('checked') === true) {
            selecionados++;
        } else {
            checkAll.prop('checked', false);
        }
    });
    if (selecionados === 1) {
        alteraBotao(btnSingle, !getDisabled());
        alteraBotao(btnMulti, !getDisabled());
    } else if (selecionados > 1) {
        alteraBotao(btnSingle, false);
        alteraBotao(btnMulti, !getDisabled());
    } else {
        alteraBotao(btnSingle, false);
        alteraBotao(btnMulti, false);
    }
}

function montaDataTable(table,data = '') {
    var url = table.attr('url');
    $.getJSON(url + '?columns=true', function (result) {
        table.html(result.columns);
//            setFiltro(table,true);
        carregaDados(table, data);
//        $('.btn-group-from').appendTo('.btn-group-to');
    });
}

function carregaDados(table, data = '') {
    data = (data !== '') ? '?data=true&' + data : '?data=true';
    url = $(table).attr('url') + data;
    dt = $(table).DataTable({
        ajax: url,
        scrollY: table.attr("scrollY")
    });
}

function formataValorCampo(valor, tipo) {
    switch (tipo) {
        case 'int':
            return parseInt(valor);
        case 'float':
            return parseFloat(valor);
        case 'string':
            return valor.trim().toUpperCase();
        default:
            return valor;
    }
}

function setFiltro(table, botaoFiltrar) {
    if (botaoFiltrar) {
        camposFiltro = $('select[name=campo-filtro]');
        operadoresFiltro = $('select[name=operador-filtro]');
        valoresFiltro = $('input[name=valor-filtro]');
        valoresFiltro.each(function () {
            $(this).attr('valor', $(this).val());
        });
    }
    table.DataTable().draw();
//    formataCampoTotalRegistros();
}

function registroEncontrado(data) {
    var result = true;
    if (camposFiltro !== undefined) {
        for (var i = 1; i < camposFiltro.length; i++) {
            var campoValorFiltro = $(valoresFiltro[i]);
            var valorFiltro = campoValorFiltro.attr('valor');
            if (valorFiltro !== '') {
                var campoFiltro = $(camposFiltro[i]).find(':selected');
                valorFiltro = formataValorCampo(valorFiltro, campoFiltro.attr('type'));
                var valorRegistro = formataValorCampo(data[campoFiltro.attr('data-column')], campoFiltro.attr('type'));
                var operador = $(operadoresFiltro[i]).val();
                var parcial = false;
                switch (operador) {
                    case '=' :
                        parcial = valorRegistro === valorFiltro;
                        break;
                    case '<>' :
                        parcial = valorRegistro !== valorFiltro;
                        break;
                    case '%%' :
                        parcial = valorRegistro.indexOf(valorFiltro) > -1;
                        break;
                    case '%' :
                        parcial = valorRegistro.indexOf(valorFiltro) === 0;
                        break;
                    case '>' :
                        parcial = valorRegistro > valorFiltro;
                        break;
                    case '<' :
                        parcial = valorRegistro < valorFiltro;
                }
                result = result && parcial;
            }
        }
    }
    return result;
}

$.fn.dataTable.ext.errMode = function (settings, helpPage, message) {
    $(settings.nTable).dataTable().fnClearTable();
};

$.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            return registroEncontrado(data);
        }
);

$.extend(true, $.fn.dataTable.defaults, {
    "dom": "<'row'<'col-8 btn-group-to'><'col-4'f>>" +
            "<'row'<'col-12'tr>>" +
            "<'row'<'col-9'<'float-left'p>><'col-auto'l><'col-auto'i>>",
    "destroy": true,
    "columnDefs": [
        {"targets": 0,
            "sorting": false,
            "width": "1%",
            "orderable": false}
    ],
    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Todos"]],
    "order": [],
    "searching": false,
    "sPaginationType": "full_numbers",
    "initComplete": function (settings, json) {
//            formataCampoTotalRegistros();
    },
    "language": {
        "sEmptyTable": "Não há registros",
        "sInfo": "Total <b>_TOTAL_</b>",
        "sInfoEmpty": "Total <b><font color='red'>0</font></b>",
        "sInfoFiltered": "",
        "sInfoPostFix": "",
        "sThousands": ".",
        "sInfoThousands": ".",
        "sLengthMenu": "Exibir _MENU_",
        "sLoadingRecords": "<i class='fa fa-circle-o-notch fa-spin fa-2x fa-fw'></i>",
        "sProcessing": "<i class='fa fa-circle-o-notch fa-spin fa-2x fa-fw'></i>",
        "sSearch": "Pesquisa rápida",
        "sZeroRecords": "Registro não encontrado",
        "oPaginate": {
            "sFirst": "<i class='fa fa-angle-double-left' title='Primeira Página'></i>",
            "sPrevious": "<i class='fa fa-angle-left' title='Página Anterior'></i>",
            "sNext": "<i class='fa fa-angle-right' title='Próxima Página'></i>",
            "sLast": "<i class='fa fa-angle-double-right' title='Última Página'></i>"
        },
        "oAria": {
            "sSortAscending": "",
            "sSortDescending": ""
        }
    }
}
);

$(document).ready(function () {
    var ctrl = false;
    var clickChk = false;
    $(document).keydown(function (event) {
        ctrl = event.keyCode === 17;
    });
    $(document).keyup(function (event) {
        ctrl = false;
    });

    $('table').on('click', '.chk-acao', function () {
        atualizaBotoes($(this).closest('table'));
        clickChk = true;
    });

    $('body').on('click', 'tr[role="row"]', function (e) {
        var td = $(this).children()[0];
        var check = $(td).children();
        if(check.prop('id') !== 'chk-all'){
            var checked = (clickChk) ? !check.prop('checked') : check.prop('checked');
            if (!ctrl) {
                var checks = $(this).closest('table').find('.chk-acao');
                checks.each(function(){
                    $(this).prop('checked', false);
                });
            }
            check.prop('checked', !checked);
            atualizaBotoes($(this).closest('table'));
            clickChk = false;            
        } 
    });

    $('body').on('click', '#chk-all', function () {
        var inputs, x, chks;
        chks = $('table[url="'+$(this).closest('table').attr('url')+'"]').find('.chk-acao');
        inputs = chks.get();
        for (x = 0; x < inputs.length; x++) {
            inputs[x].checked = this.checked;
        }
        atualizaBotoes(chks.closest('table'));
    });

    $('body').on('click', '#reset-filter', function (event) {
        event.preventDefault();
        var form = $($(this).attr('aria-controls'));
        $(form).each(function () {
            this.reset();
        });
        $('#btn-filtrar').trigger('click');
    });

    $('body').on('click', '#add-filter', function (event) {
        event.preventDefault();
        var form = $($(this).attr('aria-controls'));
        $(form).append('<div class="filtro-adicional">' + $('#filtro-padrao').html() + '</div>');
    });

    $('body').on('click', '#remove-filter', function (event) {
        event.preventDefault();
        var form = $($(this).attr('aria-controls'));
        var filtros = form.children('.filtro-adicional');
        $(filtros).each(function () {
            $(this).remove();
        });
        $('#reset-filter').trigger('click');
    });

    $('.dropdown-submenu .dropdown-toggle').on('click', function () {
        $('.dropdown-submenu .dropdown-menu').css('display', 'none');
        $(this).siblings().css('display', 'block');
        return false;
    });

    $('body').on('click', '#btn-validacep', function () {
        var cep = document.getElementById('pencep[]').value;
        var sUrl = 'https://viacep.com.br/ws/' + cep + '/json/';
        console.log(sUrl);
        $.ajax({
            url: sUrl,
            success: function (data) {
                var estados = document.getElementById('estcodigo[]');
                for (i = 0; i < estados.length; i++) {
                    if (data.uf === estados.options[i].text) {
                        estados.options[i].selected = true;
                        break;
                    }
                }
                document.getElementById('pencep[]').value = data.cep;
                document.getElementById('bainome[]').value = data.bairro;
                document.getElementById('cidnome[]').value = data.localidade;
                document.getElementById('lognome[]').value = data.logradouro;
            }
        });
    });

    $('.btn-excluir').on('click', function () {
        if (botaoHabilitado($(this))) {
            if (confirm('Deseja realmente excluir o(s) registro(s) selecionado(s)?')) {
                var form = $($(this).data('form'));
                $.post(form.prop('action') + '/excluir', form.serialize(), function (data) {
                    switch (data.status) {
                        case 'ERRO':
                            $('#msg-global').html(data.msg);
                            break;
                        case 'OK' :
                            window.location.href = data.redirect;
                            break;
                    }
                });
            }
        }
    });

    $('body').on('click', '.chk-ativo', function () {
        $(this).attr('value', ($(this).prop('checked') ? 1 : 0));
    });

    // $('table').each(function () {
    //     var table = $(this);
    //     montaDataTable(table);
    // });

    $('#btn-filtrar').on('click', function () {
        var btn = setBtnLoading($(this), true);
        var sTable = $(this).attr('aria-controls');
        var table = $('#' + sTable);
        setFiltro(table, true);
        setBtnLoading(btn, false);
    });

    $('body').on('keyup', 'input[type="search"]', function () {
        var sTable = $(this).attr('aria-controls');
        var table = $('#' + sTable);
        setFiltro(table, false);
    });

    $('body').on('select:flexdatalist', '.flexdatalist', function (item, options) {
        var props = $(this).data('visible-properties');
        var propsAlt = $(this).data('visible-properties-alt');
        var divMain = $(this).closest('.row'); 
        props = props.slice(0, props.length);
        propsAlt = propsAlt.slice(0, propsAlt.length);
        for (i = 0; i < props.length; i++) {
            if (propsAlt[i] !== $(this).prop("id")) {
                divMain.find('#' + propsAlt[i]).val(options[props[i]]);
                divMain.find('#' + propsAlt[i]).attr('validado', true);
            }
        }
    });

    $('body').on('input', '.flexdatalist-id', function () {
        $(this).attr('validado', false);
        $(this).tooltip('dispose');
    });

    $('body').on('blur', '.flexdatalist-id', function () {
        var divMain = $(this).closest('.row');
        var idFlex = $(this).data('target');
        var flex = divMain.find(idFlex);
        var campoId = $(this).attr('campoid');
        var id = $(this).prop('id');
        var valId = $(this).val();
        var validado = $(this).attr('validado');
        if (valId !== "" && (validado !== true && validado !== 'true')) {
            var props = $(flex).data('visible-properties');
            var propsAlt = $(flex).data('visible-properties-alt');
            props = props.slice(0, props.length);
            propsAlt = propsAlt.slice(0, propsAlt.length);
            $(flex).removeClass('flexdatalist-selected');
            $(flex).val("");
            divMain.find(idFlex + '-flexdatalist').val("");
            divMain.find(idFlex + '-flexdatalist').removeClass('flexdatalist-selected');
            $.ajax({
                url: $(flex).data('data'),
                data: campoId + "=" + valId,
                success: function (data) {
                    var result = data;//JSON.parse(data);
                    if (result.length > 0) {
                        divMain.find('#' + id).tooltip('dispose');
                        for (i = 0; i < props.length; i++) {
                            var prop = props[i];
                            var propAlt = propsAlt[i];
                            if (propAlt === $(flex).attr('id')) {
                                divMain.find('#' + propAlt + '-flexdatalist').val(result[0][prop]);
                                divMain.find('#' + propAlt).attr('validado', true);
                            } else {
                                divMain.find('#' + propAlt).val(result[0][prop]);
                                divMain.find('#' + propAlt).attr('validado', true);
                            }
                        }
                        divMain.find(idFlex + '-flexdatalist').focus();
                    } else {
                        for (i = 0; i < props.length; i++) {
                            var propAlt = propsAlt[i];
                            divMain.find('#' + propAlt).val("");
                        }
                        divMain.find('#' + id).tooltip({
                            placement: "bottom",
                            title: 'Registro "' + valId + '" não encontrado'
                        });
                        divMain.find('#' + id).val('');
                        divMain.find('#' + id).focus();
                    }
                }
            });
        }
    });

    $('body').on('click', '[data-toggle="modal"]', function () {
        var modal = $($(this).data('target') + ' .modal-dialog');
        var form = $($(this).data('form'));
        var url = $(this).data('url');
        var action = $(this).data('action');
        var data = null;
        var arr = ['alterar', 'visualizar'];

        if ((arr.indexOf(action) > -1) || (url !== "")) {
            data = form.serialize();
        }
        url = url !== undefined ? url : form.prop('action') + '/' + action;
        modal.load(url, data,function (responseText, textStatus, XMLHttpRequest){
            if(textStatus === "error"){
                var title = $('<h5></h5>').addClass('modal-title').html('Erro');
                var buttonClose = $('<button></button>').addClass('close').attr('data-dismiss','modal').html('<span>&times;</span>');
                var header = $('<div></div>').addClass('modal-header').append(title).append(buttonClose);
                var body = $('<div></div>').addClass('modal-body').html(responseText);
                var content = $('<div></div>').addClass('modal-content').addClass('modal-xl').append(header).append(body);
                modal.html('');
                modal.append(content);
            }
        });
    });

    $('body').on('hidden.bs.modal', '.modal', function () {
        $(this).find('.modal-dialog').html('');
    });

//    $('body').on('hide.bs.modal','.modal', function(e) {
//        if(!confirm('Existem informações que ainda não foram salvas, deseja realmente cancelar?')){
//            e.preventDefault();
//        }
//    });


    $('body').on('keydown', 'input[name="valor-filtro"]', function (e) {
        if (e.which === 13) {
            e.preventDefault();
            $('#btn-filtrar').focus();
            $('#btn-filtrar').trigger('click');
            return false;
        }
    });

    $('body').on('click','[data-action="replicar"]',function(){
        var from = $($(this).data('from')).clone(),
            appendTo = $($(this).data('append'));
        from.removeClass('sr-only');
        from.find('.flexdatalist').each(function () {
            console.log($(this));
            var readonly = $(this).prop('readonly');
            if (!readonly) {
                $(this).flexdatalist();
            }
        });
        appendTo.append(from.prop('outerHTML'));
    });

    $('body').on('click','[data-action="remover"]',function(){
        var $this = $(this),
            $campoId = $this.closest('.form-group').find('[name="'+$this.data('id')+'[]"]'),
            valorId = "";
        if($campoId.length > 0){
            valorId = $campoId.val();
        }
        if(valorId === ""){
            if($this.closest('.tab-pane').find('.form-group').length > 2){
                $this.closest('.form-group').remove();
            }
        } else {
            if(confirm($this.data('confirm'))){
                var data = '_token='+$('[name="_token"]').val()+'&id[]='+valorId;
                $.post($this.data('url'),data,function(data){
                    switch (data.status) {
                        case 'ERRO':
                            $('#msg-fr-modal').html(data.msg);
                            break;
                        case 'OK' :
                            if($this.closest('.tab-pane').find('.form-group').length <= 2){
                                $this.closest('.form-group').find('[data-action="replicar"]').trigger('click');
                            }
                            $this.closest('.form-group').remove();
                            break;
                    }
                });
            }
        }
    });

    $('body').on('show.bs.modal','.modal',function(e){
        parent = $(this).parent().closest('.modal');                
        if(parent.length > 0){
            $(this).appendTo(parent.parent());
        }
    });

    $('body').on('hidden.bs.modal','.modal',function(e){
        if($(this).hasClass('main')){
            $('.modal').each(function(){
                if(!$(this).hasClass('main')){
                    $(this).remove();
                }
            })
        }
    });
});
