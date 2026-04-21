# Conversor de Câmbio Inteligente 💸

Aplicação web moderna e responsiva para consulta de cotações de moedas em tempo real (USD, EUR, BTC) em relação ao Real (BRL).

## 🚀 Tecnologias Utilizadas

- **HTML5 & CSS3**: Estrutura e estilização moderna com Flexbox e Grid.
- **TypeScript**: Lógica de programação com tipagem estática para maior segurança.
- **Parcel**: Bundler "zero config" para automação de build e desenvolvimento.
- **AwesomeAPI**: Fonte de dados para as cotações em tempo real.

## ✨ Funcionalidades

- **Cotações em Tempo Real**: Carrega automaticamente os valores de USD, EUR e BTC ao abrir a página.
- **Conversor Inteligente**: Realiza a conversão automática enquanto você digita, sem necessidade de botões.
- **Debounce**: Implementação de atraso de 300ms na digitação para economia de recursos e performance.
- **Tratamento de Erros**: Feedback visual caso a API esteja indisponível.
- **Formatação Regional**: Valores formatados de acordo com a moeda (ex: $ 5.00 para Dólar e R$ 25,00 para Real).

## 🛠️ Como Executar

### Pré-requisitos
- Node.js instalado

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/MarcsVinny/Conversor-de-C-mbio-Inteligente.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```

### Desenvolvimento
Para rodar o projeto localmente com hot-reload:
```bash
npm start
```

### Build
Para gerar os arquivos de produção na pasta `dist`:
```bash
npm run build
```

---
*Projeto desenvolvido para fins acadêmicos (ADS).*
