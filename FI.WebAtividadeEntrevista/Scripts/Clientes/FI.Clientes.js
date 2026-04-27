var beneficiarios = [];

$(document).ready(function () {

    // --- 1. MÁSCARAS DE CPF ---
    $('#CPF').on('input', function () {
        var cpf = $(this).val().replace(/\D/g, '');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        $(this).val(cpf);
    });

    $('#CPFBeneficiario').on('input', function () {
        var cpf = $(this).val().replace(/\D/g, '');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        $(this).val(cpf);
    });


    // --- 2. EVENTOS DO POP-UP DE BENEFICIÁRIOS ---
    $('#btnIncluirBeneficiario').click(function () {
        var cpf = $('#CPFBeneficiario').val();
        var nome = $('#NomeBeneficiario').val();

        if (cpf === "" || nome === "") {
            ModalDialog("Atenção", "Preencha o CPF e o Nome do beneficiário.");
            return;
        }

        if (!validarCPF(cpf)) {
            ModalDialog("Atenção", "O CPF do beneficiário é inválido.");
            return;
        }

        var cpfJaExiste = beneficiarios.find(b => b.CPF === cpf);
        if (cpfJaExiste) {
            ModalDialog("Atenção", "Este CPF já está cadastrado para este cliente.");
            return;
        }

        beneficiarios.push({ CPF: cpf, Nome: nome });
        AtualizarGridBeneficiarios();

        $('#CPFBeneficiario').val('');
        $('#NomeBeneficiario').val('');
    });

    $('#gridBeneficiarios').on('click', '.btn-excluir-beneficiario', function () {
        var cpf = $(this).data('cpf');
        beneficiarios = beneficiarios.filter(b => b.CPF !== cpf);
        AtualizarGridBeneficiarios();
    });

    $('#gridBeneficiarios').on('click', '.btn-alterar-beneficiario', function () {
        var cpf = $(this).data('cpf');
        var beneficiario = beneficiarios.find(b => b.CPF === cpf);

        if (beneficiario) {
            $('#CPFBeneficiario').val(beneficiario.CPF);
            $('#NomeBeneficiario').val(beneficiario.Nome);

            beneficiarios = beneficiarios.filter(b => b.CPF !== cpf);
            AtualizarGridBeneficiarios();
        }
    });



    // --- 3. ENVIO DO FORMULÁRIO PRINCIPAL ---
    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CPF": $(this).find("#CPF").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "Beneficiarios": beneficiarios
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {
                    ModalDialog("Sucesso!", r);
                    $("#formCadastro")[0].reset();

                    // Limpa os beneficiários da tela após salvar com sucesso
                    beneficiarios = [];
                    AtualizarGridBeneficiarios();
                }
        });
    });
}); // FIM DO DOCUMENT.READY


// --- 4. FUNÇÕES AUXILIARES GLOBAIS ---
function AtualizarGridBeneficiarios() {
    var tbody = $('#gridBeneficiarios tbody');
    tbody.empty();

    beneficiarios.forEach(function (b) {
        var linha = '<tr>' +
            '<td>' + b.CPF + '</td>' +
            '<td>' + b.Nome + '</td>' +
            '<td>' +
            '<button type="button" class="btn btn-primary btn-sm btn-alterar-beneficiario" data-cpf="' + b.CPF + '" style="margin-right: 5px;">Alterar</button>' +
            '<button type="button" class="btn btn-danger btn-sm btn-excluir-beneficiario" data-cpf="' + b.CPF + '">Excluir</button>' +
            '</td>' +
            '</tr>';
        tbody.append(linha);
    });
}

function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf == '') return false;

    if (cpf.length != 11 || cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" ||
        cpf == "33333333333" || cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" ||
        cpf == "77777777777" || cpf == "88888888888" || cpf == "99999999999")
        return false;

    var add = 0;
    for (var i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
    var rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(9))) return false;

    add = 0;
    for (var i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) rev = 0;
    if (rev != parseInt(cpf.charAt(10))) return false;

    return true;
}

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div>' +
        '  </div>' +
        '</div> ';

    $('body').append(texto);
    $('#' + random).modal('show');
}