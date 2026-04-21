/**
 * Interface para representar a resposta da API AwesomeAPI
 * Cada par de moedas retorna um objeto com os dados da cotação
 */
interface CotacaoResponse {
    [key: string]: {
        code: string;
        codein: string;
        name: string;
        high: string;
        low: string;
        varBid: string;
        pctChange: string;
        bid: string; // Valor de compra (usado para cotação)
        ask: string; // Valor de venda
        timestamp: string;
        create_date: string;
    }
}

// Variáveis globais para armazenar as cotações atuais
let taxaUSD: number = 0;
let taxaEUR: number = 0;
let taxaBTC: number = 0;

// Seleção de elementos do DOM
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
    // Para Bitcoin, usamos uma formatação manual pois o símbolo ₿ é específico
    if (moeda === 'BTC') {
        return `₿ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 4, maximumFractionDigits: 8 })}`;
    }

    // Escolhe o local de acordo com a moeda para bater com o exemplo do professor
    // USD -> en-US ($ 5.00)
    // BRL -> pt-BR (R$ 5,00)
    const locale = moeda === 'USD' ? 'en-US' : (moeda === 'EUR' ? 'de-DE' : 'pt-BR');

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: moeda
    }).format(valor);
}

/**
 * Busca as cotações atuais na API e atualiza a interface
 */
async function fetchCotacoes(): Promise<void> {
    try {
        const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL');
        
        if (!response.ok) {
            throw new Error('Falha na requisição');
        }

        const data: CotacaoResponse = await response.json();

        // Extraindo os valores numéricos (bid)
        taxaUSD = parseFloat(data.USDBRL.bid);
        taxaEUR = parseFloat(data.EURBRL.bid);
        taxaBTC = parseFloat(data.BTCBRL.bid);

        // Atualizando os cards com a cotação em Real (BRL)
        cardUSD.textContent = formatarMoeda(taxaUSD, 'BRL');
        cardEUR.textContent = formatarMoeda(taxaEUR, 'BRL');
        cardBTC.textContent = formatarMoeda(taxaBTC, 'BRL');

        // Escondendo mensagem de erro se a busca for bem-sucedida
        errorMessage.classList.add('hidden');
        
        // Se houver valor no input, já converte
        if (inputBRL.value) {
            converterValores(parseFloat(inputBRL.value));
        }

    } catch (error) {
        console.error('Erro ao buscar cotações:', error);
        errorMessage.classList.remove('hidden');
    }
}

/**
 * Converte o valor de BRL para as outras moedas
 * @param valorBRL Valor digitado pelo usuário em Reais
 */
function converterValores(valorBRL: number): void {
    if (isNaN(valorBRL) || valorBRL <= 0) {
        resultUSD.textContent = '--';
        resultEUR.textContent = '--';
        resultBTC.textContent = '--';
        return;
    }

    // Cálculos de conversão: Valor em Reais / Taxa da Moeda
    const convertidoUSD = valorBRL / taxaUSD;
    const convertidoEUR = valorBRL / taxaEUR;
    const convertidoBTC = valorBRL / taxaBTC;

    // Atualizando a interface com os valores convertidos
    resultUSD.textContent = formatarMoeda(convertidoUSD, 'USD');
    resultEUR.textContent = formatarMoeda(convertidoEUR, 'EUR');
    resultBTC.textContent = formatarMoeda(convertidoBTC, 'BTC');
}

/**
 * Função de Debounce para evitar processamento excessivo durante a digitação
 * @param fn Função a ser executada
 * @param delay Atraso em milissegundos
 */
function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
    let timeout: ReturnType<typeof setTimeout>;
    
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

// Criando a versão "debounced" da função de conversão
const converterDebounced = debounce((valor: string) => {
    const numero = parseFloat(valor);
    converterValores(numero);
}, 300);

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchCotacoes);

inputBRL.addEventListener('input', (event) => {
    const target = event.target as HTMLInputElement;
    converterDebounced(target.value);
});
