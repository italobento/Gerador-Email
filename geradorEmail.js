/************************************************************
*                                                           *
*        MEXER SOMENTE NA VARIÁVEL DOMINIO EMAIL            *
*                                                           *
*************************************************************/
const DOMINIO_EMAIL = '.aluno@email.com';


/************************************************************
*                                                           *
*                       MÓDULOS                             *
*                                                           *
*************************************************************/
import fs from 'fs';
import capitalize from 'capitalize-pt-br';
import path from 'path';
import preposicoes from './preposicoes.js';


/************************************************************
*                                                           *
*                 EXECUÇÃO DO PROGRAMA                      *
*                                                           *
*************************************************************/
iniciar();

function converteNomeEmail(listaNomes) {

    const ARQUIVO_BASE_DADOS = 'Arquivos/Entrada/baseDadosEmail.txt';
    let baseDadosEmail = fs.readFileSync(ARQUIVO_BASE_DADOS, { encoding: 'utf8' }, (err, data) => {
        if (err) throw err;
        if (data) return data;
    });

    baseDadosEmail = baseDadosEmail.split(/\r?\n/);

    let linhas = listaNomes.split(/\r?\n/);
    let listaEmails = [];

    linhas.forEach(linha => {

        if (linha.trim()) {
            linha = linha.toLowerCase();

            let email = gerarNovoEmail(linha, [...baseDadosEmail, ...listaEmails]);
            listaEmails.push(email);

        } else {
            listaEmails.push('');
        }

    })

    return listaEmails;
}

function gerarNovoEmail(nomeCompleto, listaEmails) {
    let nome = nomeCompleto.split(' ');
    nome = nome.filter(nome => !preposicoes.includes(nome));

    let email;
    let flag;
    let tentativa = 1;

    do {

        flag = false;

        switch (tentativa) {
            case 1:
                if (nome.length >= 2)
                    email = nome[0] + '.' + nome[nome.length - 1] + DOMINIO_EMAIL;
                break;
            case 2:
                if (nome.length >= 3)
                    email = nome[0] + '.' + nome[nome.length - 2] + DOMINIO_EMAIL;
                break;
            case 3:
                if (nome.length >= 4)
                    email = nome[0] + '.' + nome[nome.length - 3] + DOMINIO_EMAIL;
                break;
            case 4:
                if (nome.length >= 4)
                    email = nome[0] + nome[nome.length - 3] + '.' + nome[nome.length - 1] + DOMINIO_EMAIL;
                break;
            case 5:
                if (nome.length >= 4)
                    email = nome[0] + nome[nome.length - 3] + '.' + nome[nome.length - 2] + DOMINIO_EMAIL;
                break;
            case 6:
                if (nome.length >= 4)
                    email = nome[0] + '.' + nome[nome.length - 3].charAt(0) + nome[nome.length - 1] + DOMINIO_EMAIL;
                break;
            case 7:
                if (nome.length >= 4)
                    email = nome[0] + '.' + nome[nome.length - 3].charAt(0) + nome[nome.length - 2] + DOMINIO_EMAIL;
                break;
            case 8:
                if (nome.length >= 4)
                    email = nome[0] + nome[nome.length - 3].charAt(0) + '.' + nome[nome.length - 1] + DOMINIO_EMAIL;
                break;
            case 9:
                if (nome.length >= 4)
                    email = nome[0] + nome[nome.length - 3].charAt(0) + '.' + nome[nome.length - 2] + DOMINIO_EMAIL;
                break;
            default:
                email = '**********' + DOMINIO_EMAIL;
                break;
        }

        email = removerAcentos(email);

        if (validarEmailExistente(email, listaEmails) && tentativa <= 9) {
            flag = true;
            tentativa++;
        }

    } while (flag);

    return email;
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
    const ARQUIVO_ENTRADA = 'Arquivos/Entrada/listaNomeCompleto.txt';

    fs.readFile(ARQUIVO_ENTRADA, { encoding: 'utf8' }, (err, data) => {
        if (err) {
            gravarArquivo('', ARQUIVO_ENTRADA);
        };

        if (data) {

            let listaEmails = converteNomeEmail(data);
            let listaPrimeiroNome = obtemNome(data, 'primeiroNome');
            let listaSobrenome = obtemNome(data, 'sobrenome');

            gravarArquivo(listaEmails, 'Arquivos/Saída/listaEmails.txt');
            gravarArquivo(listaPrimeiroNome, 'Arquivos/Saída/listaPrimeiroNome.txt');
            gravarArquivo(listaSobrenome, 'Arquivos/Saída/listaSobrenome.txt');
        }

    })
}

function obtemNome(listaNomeCompleto, tipoNome) {

    let linhas = listaNomeCompleto.split(/\r?\n/);
    let listaNomes = [];

    linhas.forEach(linha => {

        let nome = capitalize(linha);

        if (tipoNome === 'primeiroNome') {
            nome = obtemPrimeiroNome(nome);
        } else {
            nome = obtemSobrenome(nome);
        }

        listaNomes.push(nome.trim());

    })

    return listaNomes;

}

function obtemPrimeiroNome(nomeCompleto) {
    return nomeCompleto.split(' ').slice(0, 1).join(' ');
}

function obtemSobrenome(nomeCompleto) {
    return nomeCompleto.split(' ').slice(1, nomeCompleto.length).join(' ');
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

function validarEmailExistente(email, listaEmailsExistentes) {
    return listaEmailsExistentes.includes(email);
}