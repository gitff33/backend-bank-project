export interface FakeCardData {
  cardNumber: string;
  maskedCardNumber: string;
  expDate: string;
  cvv: string;
}

export function generateFakeCardData(): FakeCardData {
  let cardNumber = '4276';
  for (let i = 0; i < 12; i++) {
    cardNumber += Math.floor(Math.random() * 10).toString();
  }

  const maskedCardNumber = `${cardNumber.slice(0, 4)} **** **** ${cardNumber.slice(-4)}`;

  const currentYear = new Date().getFullYear();
  const expYear = (currentYear + 5).toString().slice(-2);
  const expMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const expDate = `${expMonth}/${expYear}`;

  const cvv = Math.floor(100 + Math.random() * 900).toString();
  return { cardNumber, maskedCardNumber, expDate, cvv };
}
