/**
 * Interface para representar a resposta da API AwesomeAPI
 */
export interface Cotacao {
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

/**
 * Representa o conjunto de cotações retornadas pela API
 */
export interface CotacaoResponse {
    [key: string]: Cotacao;
}
