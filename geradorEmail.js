/************************************************************
*                                                           *
*        MEXER SOMENTE NA VARIÁVEL DOMINIO EMAIL            *
*                                                           *
*************************************************************/
const DOMINIO_EMAIL = '@unibrasilia.com.br';


/************************************************************
*                                                           *
*                       MÓDULOS                             *
*                                                           *
*************************************************************/
const fs = require('fs');
const capitalize = require('capitalize-pt-br')
const path = require('path');


/************************************************************
*                                                           *
*                 EXECUÇÃO DO PROGRAMA                      *
*                                                           *
*************************************************************/
iniciar();

function converteNomeEmail(listaNomes) {

    let linhas = listaNomes.split(/\r?\n/);
    let listaEmails = [];
    let email;
    let primeiroNome;
    let ultimoNome;

    linhas.forEach((linha) => {

        if (linha.trim()) {
            linha = linha.toLowerCase();
            primeiroNome = linha.split(' ').slice(0, 1).join(' ');
            ultimoNome = linha.split(' ').slice(-1).join(' ');

            email = primeiroNome + '.' + ultimoNome + DOMINIO_EMAIL;
            email = removerAcentos(email);

            listaEmails.push(email);
        } else {
            listaEmails.push();
        }

    })

    return listaEmails;
}

function gravarArquivo(conteudo, caminhoSaida) {

    let conteudoGerado = conteudo ? conteudo.join(',').replace(/,/g, '\n') : '';
    let diretorioSaida = path.dirname(caminhoSaida);

    if (!fs.existsSync(diretorioSaida)) {
        fs.mkdirSync(diretorioSaida);
    }

    fs.writeFile(caminhoSaida, conteudoGerado, (err) => {
        if (err) throw err;

        console.log(path.basename(caminhoSaida) + ' salvo com sucesso.');
    });
}

function iniciar() {
    let arquivoEntrada = 'Arquivos/Entrada/listaNomeCompleto.txt';

    fs.readFile(arquivoEntrada, (err, data) => {
        if (err) {
            gravarArquivo('', arquivoEntrada);
        };

        if (data) {
            let listaEmails = converteNomeEmail(data.toString());
            let listaPrimeiroNome = obtemNome(data.toString(), 'primeiroNome');
            let listaSobrenome = obtemNome(data.toString(), 'sobrenome');

            gravarArquivo(listaEmails, 'Arquivos/Saída/listaEmails.txt');
            gravarArquivo(listaPrimeiroNome, 'Arquivos/Saída/listaPrimeiroNome.txt');
            gravarArquivo(listaSobrenome, 'Arquivos/Saída/listaSobrenome.txt');
        }

    })
}

function obtemNome(listaNomeCompleto, tipoNome) {

    let linhas = listaNomeCompleto.split(/\r?\n/);
    let listaNomes = [];
    let nome;

    linhas.forEach((linha) => {

        if (tipoNome === 'primeiroNome') {
            nome = capitalize(linha).split(' ').slice(0, 1).join(' ');
        } else {
            nome = capitalize(linha).split(' ').slice(1, linha.length).join(' ');
        }

        listaNomes.push(nome.trim());

    })

    return listaNomes;

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
