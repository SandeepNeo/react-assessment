import stocksData from '../data/stocks.json';

export const stockService = {
  getAvailableStocks: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(stocksData.stocks || []);
      }, 100);
    });
  },
};

export default stockService;
