function numberToWords(amount) {
  if (isNaN(amount)) return "";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
    "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];

  const b = [
    "", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  function twoDigit(n) {
    if (n < 20) return a[n];
    return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
  }

  function threeDigit(n) {
    let str = "";
    if (Math.floor(n / 100) > 0) {
      str += a[Math.floor(n / 100)] + " Hundred ";
      n = n % 100;
    }
    if (n > 0) {
      str += twoDigit(n) + " ";
    }
    return str.trim();
  }

  let num = Math.floor(amount);
  if (num === 0) return "Indian Rupees Zero Only";

  let result = "";

  const crore = Math.floor(num / 10000000);
  num %= 10000000;

  const lakh = Math.floor(num / 100000);
  num %= 100000;

  const thousand = Math.floor(num / 1000);
  num %= 1000;

  const hundred = num;

  if (crore) result += threeDigit(crore) + " Crore ";
  if (lakh) result += twoDigit(lakh) + " Lakh ";
  if (thousand) result += twoDigit(thousand) + " Thousand ";
  if (hundred) result += threeDigit(hundred);

  return "Indian Rupees " + result.trim() + " Only";
}
