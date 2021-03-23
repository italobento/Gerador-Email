/************************************************************
*                                                           *
*        MEXER SOMENTE NA VARIÁVEL DOMINIO EMAIL            *
*                                                           *
*************************************************************/
const DOMINIO_EMAIL = '@unibrasilia.com.br';

// ===========================================================

const fs = require('fs')

fs.readFile('listaNomeCompleto.txt', (err, data) => {
    if (err) throw err;

    var listaEmails = converteNomeEmail(data.toString());
    gravarArquivo(listaEmails);
})

function converteNomeEmail(listaNomes) {

    var linhas = listaNomes.split(/\r?\n/);
    var listaEmails = [];
    var email = '';
    var primeiroNome = '';
    var ultimoNome = '';

    linhas.forEach((linha) => {

        if (linha.trim()) {
            linha = linha.toLowerCase();
            primeiroNome = linha.split(' ').slice(0, 1).join(' ');
            ultimoNome = linha.split(' ').slice(-1).join(' ');

            email = primeiroNome + '.' + ultimoNome + DOMINIO_EMAIL;
            email = removerAcentos(email);

            listaEmails.push(email);
        } else {
            listaEmails.push('');
        }

    })

    return listaEmails;
}

function gravarArquivo(listaEmails) {

    var emailsGerado = listaEmails.join(',').replace(/,/g, '\n');

    fs.writeFile("listaEmails.txt", emailsGerado, (erro) => {
        if (erro) throw erro;

        console.log("listaEmails.txt salvo com sucesso.");
    });
}

function removerAcentos(newStringComAcento) {
    var string = newStringComAcento;
    var mapaAcentosHex = {
        a: /[\xE0-\xE6]/g,
        e: /[\xE8-\xEB]/g,
        i: /[\xEC-\xEF]/g,
        o: /[\xF2-\xF6]/g,
        u: /[\xF9-\xFC]/g,
        c: /\xE7/g,
        n: /\xF1/g
    };

    for (var letra in mapaAcentosHex) {
        var expressaoRegular = mapaAcentosHex[letra];
        string = string.replace(expressaoRegular, letra);
    }

    return string;
}
