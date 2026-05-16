export type IdentificationType =
  | "CARNET DE EXTRANJERIA"
  | "CEDULA DE CIUDADANIA"
  | "PASAPORTE"
  | "RUT"
  | "DNI"
  | "RUC";

export type AccountType = "CUENTA AHORRO" | "CUENTA CORRIENTE";

export type BeneficiaryRelationship = "Madre" | "Hijo" | "Hermano" | "Amigo";

export type FundsSource = "Salario" | "Ahorros" | "Negocios";

export type Purpose = "Salario" | "Regalo" | "Impuestos";

export type DepositCurrency = "MONEDA LOCAL";

export type BeneficiaryType = "PERSONA" | "EMPRESA";

/** Forma genérica de un beneficiario peruano usada en fixtures. */
export interface PeruBeneficiary {
  name: string;
  surname: string;
  phone?: string;
  purpose?: string;
}
