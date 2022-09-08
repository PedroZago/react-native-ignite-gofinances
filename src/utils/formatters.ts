const { format: moneyFormatter } = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const { format: dateFormatter } = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
});

export { moneyFormatter, dateFormatter };
