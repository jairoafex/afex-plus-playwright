export interface TerrapayEuBeneficiary {
  countryName: string;
  beneficiaryType: string;
  name: string;
  surname: string;
  iban: string;
  bankName: string;
  phone: string;
  relation: string;
  sourceFunds: string;
  purpose: string;
  usesNativeReceiveCurrency?: boolean;
}

/**
 * Datos de prueba para Terrapay Depósito — zona SEPA.
 * Cada país admite un array de entradas para cubrir distintos tipos de beneficiario.
 * Fuente: skill.md (Alemania, Bélgica) o patrón equivalente (resto).
 */
export const EU_BENEFICIARIES: Record<string, TerrapayEuBeneficiary[]> = {
  Espana: [
    {
      countryName: "España",
      beneficiaryType: "Persona",
      name: "CARLOS",
      surname: "GARCIA LOPEZ",
      iban: "ES9121000418450200051332",
      bankName: "BANCO SANTANDER",
      phone: "573157441380",
      relation: "Hermano",
      sourceFunds: "Salario",
      purpose: "Regalo",
    },
  ],
  Alemania: [
    {
      countryName: "Alemania",
      beneficiaryType: "Persona",
      name: "Albrecht",
      surname: "Altdorfer",
      iban: "DE58370400440532018602",
      bankName: "Commerzbank AG",
      phone: "573157441380",
      relation: "Hermano",
      sourceFunds: "Salario",
      purpose: "Regalo",
    },
  ],
  Belgica: [
    {
      countryName: "Bélgica",
      beneficiaryType: "Persona",
      name: "MARTINE",
      surname: "NAHIMANA",
      iban: "BE18233534994965",
      bankName: "BNP PARIBAS FORTIS",
      phone: "573157441380",
      relation: "Hermano",
      sourceFunds: "Salario",
      purpose: "Regalo",
    },
  ],
  Rumania: [
    {
      countryName: "Rumania",
      beneficiaryType: "Persona",
      name: "Ion",
      surname: "Popescu",
      iban: "RO49AAAA1B31007593840000",
      bankName: "Banca Transilvania",
      phone: "573157441380",
      relation: "Hermano",
      sourceFunds: "Salario",
      purpose: "Regalo",
    },
  ],
  Chipre: [
    {
      countryName: "Chipre",
      beneficiaryType: "Persona",
      name: "Andreas",
      surname: "Georgiou",
      iban: "CY17002001280000001200527600",
      bankName: "Bank of Cyprus",
      phone: "573157441380",
      relation: "Hermano",
      sourceFunds: "Salario",
      purpose: "Regalo",
    },
  ],
  Finlandia: [
    {
      countryName: "Finlandia",
      beneficiaryType: "Persona",
      name: "Mikko",
      surname: "Virtanen",
      iban: "FI2112345600000785",
      bankName: "Nordea Bank",
      phone: "573157441380",
      relation: "Hermano",
      sourceFunds: "Salario",
      purpose: "Regalo",
    },
  ],
  Hungria: [
    {
      countryName: "Hungría",
      beneficiaryType: "Persona",
      name: "Zoltan",
      surname: "Kovacs",
      iban: "HU42117730161111101800000000",
      bankName: "OTP Bank",
      phone: "573157441380",
      relation: "Hermano",
      sourceFunds: "Salario",
      purpose: "Regalo",
      // Hungría usa HUF como moneda local → seleccionar EUR explícitamente
      usesNativeReceiveCurrency: true,
    },
  ],
  Holanda: [
    {
      countryName: "Holanda",
      beneficiaryType: "Persona",
      name: "Jan",
      surname: "De Vries",
      iban: "NL91ABNA0417164300",
      bankName: "ING Bank",
      phone: "573157441380",
      relation: "Hermano",
      sourceFunds: "Salario",
      purpose: "Regalo",
    },
  ],
  Irlanda: [
    {
      countryName: "Irlanda",
      beneficiaryType: "Persona",
      name: "Patrick",
      surname: "Murphy",
      iban: "IE29AIBK93115212345678",
      bankName: "Allied Irish Banks",
      phone: "573157441380",
      relation: "Hermano",
      sourceFunds: "Salario",
      purpose: "Regalo",
    },
  ],
  Francia: [
    {
      countryName: "Francia",
      beneficiaryType: "Persona",
      name: "HORIYA",
      surname: "DJELLAL",
      iban: "FR7630004031820000433016487",
      bankName: "BNP PARIBAS",
      phone: "573157441380",
      relation: "Madre",
      sourceFunds: "Salario",
      purpose: "Regalo",
    },
  ],
  Estonia: [
    {
      countryName: "Estonia",
      beneficiaryType: "Empresa",
      name: "BABILONIA",
      surname: "BOTEFLOR S L",
      iban: "EE471000001020145685",
      bankName: "CAIXABANK",
      phone: "573157441380",
      relation: "",
      sourceFunds: "Ahorros",
      purpose: "Pagos anticipados de mercancías",
    },
    {
      countryName: "Estonia",
      beneficiaryType: "Persona",
      name: "Bharath",
      surname: "Chari",
      iban: "EE641010011644993222",
      bankName: "AS SEB PANK",
      phone: "573157441380",
      relation: "",
      sourceFunds: "Ahorros",
      purpose: "Pagos anticipados de mercancías",
    },
  ],
  Bulgaria: [
    {
      countryName: "Bulgaria",
      beneficiaryType: "Persona",
      name: "Ivan",
      surname: "Petrov",
      iban: "BG80BNBG96611020345678",
      bankName: "UniCredit Bulbank",
      phone: "573157441380",
      relation: "Hermano",
      sourceFunds: "Salario",
      purpose: "Regalo",
    },
  ],
};
