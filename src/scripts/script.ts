import { CotacaoResponse } from '../types/Cotacao';

/**
 * Módulo de conversão de câmbio
 * Gerencia a busca de dados da API e atualização da interface
 */

// Estado global da aplicação
let taxaUSD: number = 0;
let taxaEUR: number = 0;
let taxaBTC: number = 0;

// Elementos do DOM
const inputBRL = document.getElementById('brlInput') as HTMLInputElement;
const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;

const cardUSD = document.querySelector('#card-usd .rate') as HTMLParagraphElement;
const cardEUR = document.querySelector('#card-eur .rate') as HTMLParagraphElement;
const cardBTC = document.querySelector('#card-btc .rate') as HTMLParagraphElement;

const resultUSD = document.querySelector('#card-usd .converted-value') as HTMLElement;
const resultEUR = document.querySelector('#card-eur .converted-value') as HTMLElement;
const resultBTC = document.querySelector('#card-btc .converted-value') as HTMLElement;

/**
 * Formata um valor numérico para o formato de moeda especificado
 * @param valor O valor numérico a ser formatado
 * @param moeda O código da moeda (BRL, USD, EUR, BTC)
 * @returns String formatada
 */
function formatarMoeda(valor: number, moeda: string): string {
    if (moeda === 'BTC') {
        return `₿ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 8 })}`;
    }

    // Escolhe o locale baseado na moeda para seguir o padrão internacional
    const localeMap: { [key: string]: string } = {
        'USD': 'en-US',
        'EUR': 'de-DE',
        'BRL': 'pt-BR'
    };

    const locale = localeMap[moeda] || 'pt-BR';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: moeda
    }).format(valor);
}

/**
 * Busca as cotações atuais na API AwesomeAPI
 */
async function fetchCotacoes(): Promise<void> {
    const URL_API = 'https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL';

    try {
        const response = await fetch(URL_API);
        
        if (!response.ok) {
            throw new Error('Falha ao conectar com o serviço de cotações.');
        }

        const data: CotacaoResponse = await response.json();

        // Atribuição de taxas a partir da resposta da API
        taxaUSD = parseFloat(data.USDBRL.bid);
        taxaEUR = parseFloat(data.EURBRL.bid);
        taxaBTC = parseFloat(data.BTCBRL.bid);

        atualizarInterfaceCotacoes();
        
        errorMessage.classList.add('hidden');
        
        // Dispara a conversão se já houver valor no input
        if (inputBRL.value) {
            converterValores(parseFloat(inputBRL.value));
        }

    } catch (error) {
        console.error('[Erro API]:', error);
        errorMessage.classList.remove('hidden');
    }
}

/**
 * Atualiza os valores de cotação exibidos nos cards
 */
function atualizarInterfaceCotacoes(): void {
    cardUSD.textContent = formatarMoeda(taxaUSD, 'BRL');
    cardEUR.textContent = formatarMoeda(taxaEUR, 'BRL');
    cardBTC.textContent = formatarMoeda(taxaBTC, 'BRL');
}

/**
 * Realiza a conversão de BRL para as moedas estrangeiras
 * @param valorBRL Valor em reais digitado pelo usuário
 */
function converterValores(valorBRL: number): void {
    if (isNaN(valorBRL) || valorBRL <= 0) {
        limparResultados();
        return;
    }

    const convertidoUSD = valorBRL / taxaUSD;
    const convertidoEUR = valorBRL / taxaEUR;
    const convertidoBTC = valorBRL / taxaBTC;

    resultUSD.textContent = formatarMoeda(convertidoUSD, 'USD');
    resultEUR.textContent = formatarMoeda(convertidoEUR, 'EUR');
    resultBTC.textContent = formatarMoeda(convertidoBTC, 'BTC');
}

/**
 * Reseta os campos de resultado da interface
 */
function limparResultados(): void {
    resultUSD.textContent = '--';
    resultEUR.textContent = '--';
    resultBTC.textContent = '--';
}

/**
 * Função utilitária de debounce para otimização de performance
 */
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timeout: ReturnType<typeof setTimeout>;
    
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

// Configuração do evento de input com debounce de 300ms
const handleInput = debounce((valor: string) => {
    const numero = parseFloat(valor);
    converterValores(numero);
}, 300);

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', fetchCotacoes);

inputBRL.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    handleInput(target.value);
});
