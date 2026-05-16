/**
 * Constantes de prueba compartidas para los specs de la API de transferencias.
 */

export const API_TRANSFER_DATES = {
  startDate: "2026-01-10",
  endDate: "2026-01-12",
} as const;

export const API_BRANCH = {
  code: "ZB",
  id: "31",
} as const;

export const API_CUSTOMER = {
  corporateCode: "1481947",
  identification: "222311233",
  identificationType: "RUT",
  senderName: "DIANA  PAEZ",
} as const;

export const API_PERU_FEELOOKUP = {
  receiverCountry: "PE",
  receiverCity: "LIM",
  methodPayment: "ALL",
  originCurrency: "USD",
  includeFee: false,
  amountMin: 25,
  amountMax: 35,
  quoteId: 7,
} as const;

export const API_PERU_RECIPIENT = {
  phone: "987654321",
  cityCode: "LIM",
  countryAlpha2Code: "PE",
  countryDdi: 51,
  cityDdi: 1,
} as const;

export const KNOWN_TRANSFER_CODE = "ZB60079316";
