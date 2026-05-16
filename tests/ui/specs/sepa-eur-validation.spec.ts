import { test } from "@playwright/test";
import { FeelookupPage } from "../page/feelookupPage";
import { SEPA_EUR_VALIDATION_COUNTRIES } from "../../data/sepa-eur-validation.data";

const TEST_COUNTRY = process.env.TEST_COUNTRY;

test.describe("SEPA — Validación EUR en Monto a Recibir", () => {
  let feelookupPage: FeelookupPage;

  test.beforeEach(async ({ page }) => {
    feelookupPage = new FeelookupPage(page);
    await page.goto(`${process.env.BASE_URL}`);
    await feelookupPage.expectFeelookupFormVisible();
  });

  for (const { countryName } of SEPA_EUR_VALIDATION_COUNTRIES.filter(
    (c) => !TEST_COUNTRY || c.countryName === TEST_COUNTRY
  )) {
    test.describe(countryName, () => {
      test("Validar que el selector Monto a Recibir permite seleccionar EUR", async () => {
        test.setTimeout(60_000);

        await feelookupPage.typeCountry(countryName);
        await feelookupPage.selectMethodPayment("Depósito");
        await feelookupPage.clickOnAmountType("Recibir");
        await feelookupPage.selectReceiveCurrencyEUR();
        await feelookupPage.expectReceiveCurrencyIsEUR();
      });
    });
  }
});
