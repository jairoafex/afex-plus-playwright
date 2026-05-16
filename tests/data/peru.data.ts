import type { PeruBeneficiary } from "../types/beneficiary.types";

export const CLIENT_NAME = "Diana Paez";

export const PERU_BENEFICIARIES = {
  bcpCash: {
    name: "Goku Supersayayin",
    surname: "God",
  } satisfies Pick<PeruBeneficiary, "name" | "surname">,

  yapeDeposit: {
    name: "Jose Llontop",
    surname: "Vite",
    phone: "51902292319",
    purpose: "Test automatizado",
  } satisfies Pick<PeruBeneficiary, "name" | "surname" | "phone" | "purpose">,
} as const;
