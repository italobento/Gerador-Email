'use strict';

/************************************************************
*                                                           *
*        MEXER SOMENTE NA VARIÁVEL DOMINIO EMAIL            *
*                                                           *
*************************************************************/
const DOMINIO_EMAIL = '@unibrasilia.com.br';

// ===========================================================

// ===== Módulos =====
const fs = require('fs');
const capitalize = require('capitalize-pt-br')
// ===================

iniciar();

function converteNomeEmail(listaNomes) {

    let linhas = listaNomes.split(/\r?\n/);
    let listaEmails = [];
    let email = '';
    let primeiroNome = '';
    let ultimoNome = '';

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

function gravarArquivo(listaEmails, caminhoSaida) {

    let emailsGerado = listaEmails.join(',').replace(/,/g, '\n');

    fs.writeFile(caminhoSaida, emailsGerado, (erro) => {
        if (erro) throw erro;

        console.log(caminhoSaida + ' salvo com sucesso.');
    });
}

function iniciar() {
    fs.readFile('Arquivos/Entrada/listaNomeCompleto.txt', (err, data) => {
        if (err) throw err;

        let listaEmails = converteNomeEmail(data.toString());
        let listaPrimeiroNome = obtemPrimeiroNome(data.toString());
        let listaSobrenome = obtemSobrenome(data.toString());

        gravarArquivo(listaEmails, 'Arquivos/Saída/listaEmails.txt');
        gravarArquivo(listaPrimeiroNome, 'Arquivos/Saída/listaPrimeiroNome.txt');
        gravarArquivo(listaSobrenome, 'Arquivos/Saída/listaSobrenome.txt');
    })
}

function obtemPrimeiroNome(listaNomes) {

    let linhas = listaNomes.split(/\r?\n/);
    let listaPrimeiroNome = [];
    let primeiroNome = '';

    linhas.forEach((linha) => {

        if (linha.trim()) {
            primeiroNome = capitalize(linha.split(' ').slice(0, 1).join(' '));
            listaPrimeiroNome.push(primeiroNome);
        } else {
            listaPrimeiroNome.push('');
        }

    })

    return listaPrimeiroNome;

}

function obtemSobrenome(listaNomes) {

    let linhas = listaNomes.split(/\r?\n/);
    let listaSobrenome = [];
    let sobrenome = '';

    linhas.forEach((linha) => {

        if (linha.trim()) {
            sobrenome = capitalize(linha).split(' ').slice(1, linha.length).join(' ');
            listaSobrenome.push(sobrenome);
        } else {
            listaSobrenome.push('');
        }

    })

    return listaSobrenome;

}

function removerAcentos(newStringComAcento) {
    let string = newStringComAcento;
    let mapaAcentosHex = {
        a: /[\xE0-\xE6]/g,
        e: /[\xE8-\xEB]/g,
        i: /[\xEC-\xEF]/g,
        o: /[\xF2-\xF6]/g,
        u: /[\xF9-\xFC]/g,
        c: /\xE7/g,
        n: /\xF1/g
    };

    for (let letra in mapaAcentosHex) {
        let expressaoRegular = mapaAcentosHex[letra];
        string = string.replace(expressaoRegular, letra);
    }

    return string;
}
