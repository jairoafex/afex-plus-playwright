import { expect, test } from "@playwright/test";
import { FeelookupPage } from "../page/feelookupPage";
import { BeneficiaryPage } from "../page/beneficiaryPage";
import { AfexModalHelper } from "../../../utils/helpers/afexModal.helper";
import { CLIENT_NAME } from "../../data/peru.data";

const PERU_EXPECTED_AGENTS = ["Banco De Credito Bcp", "Interbank", "Afex Pay"];

test.describe("Test del cotizador", () => {
  let feelookupPage: FeelookupPage;
  let beneficiaryPage: BeneficiaryPage;
  let afexModal: AfexModalHelper;

  test.beforeEach(async ({ page }) => {
    feelookupPage = new FeelookupPage(page);
    beneficiaryPage = new BeneficiaryPage(page);
    afexModal = new AfexModalHelper(page);
    await page.goto(`${process.env.BASE_URL}`);
    await feelookupPage.expectFeelookupFormVisible();
  });

  test("Validar cotizaciones a Perú cotizando en USD", async () => {
    await feelookupPage.typeCountry("Perú");
    await feelookupPage.selectMethodPayment("Todos");
    await feelookupPage.typeCity("Lima");
    await feelookupPage.clickOnAmountType("Enviar");
    await feelookupPage.typeRandomAmount("USD");
    await feelookupPage.clickOnSearchQuotations();
    await feelookupPage.hasAgentQuote(PERU_EXPECTED_AGENTS);
  });

  test("Validar flujo de envio con error en el cotizador", async ({ page }) => {
    await feelookupPage.typeCountry("Perú");
    await feelookupPage.selectMethodPayment("Depósito");
    await feelookupPage.clickOnAmountType("Enviar");
    await feelookupPage.typeRandomAmount("USD");
    await feelookupPage.clickOnSearchQuotations();
    await feelookupPage.typeClient(CLIENT_NAME);
    await feelookupPage.clickOnClientFound();
    await feelookupPage.clickOnClientNotPresent();
    await feelookupPage.selectAgentQuote("Terrapay", "Depósito");
    await feelookupPage.clickOnBtnNext();
    await beneficiaryPage.checkBeneficiaryForm();
    await beneficiaryPage.clickOnRegisterNewBeneficiary();
    await beneficiaryPage.typeRealBeneficiaryName("Oscar");
    await beneficiaryPage.typeRealBeneficiarySurname("Suarez");
    await beneficiaryPage.selectIdentificationType("CEDULA DE CIUDADANIA");
    await beneficiaryPage.typeBeneficiaryIdentification("50234731");
    await beneficiaryPage.typeAccountNumber("00219313084955608611");
    await beneficiaryPage.typeAddress("calle falsa 123");
    await beneficiaryPage.typeBankName("SCOTIABANK");
    await beneficiaryPage.typeBeneficiaryRelation("Madre");
    await beneficiaryPage.typeSourceFunds("Salario");
    await beneficiaryPage.typePurposeSelect("Regalo");
    await beneficiaryPage.clickOnContinue();
    await beneficiaryPage.expectSummaryTransferVisible();

    // Intercepta la creación de remesa e inyecta un código de país inválido
    // para provocar el error controlado del servidor y validar el modal de error.
    await page.route("**/v1/remittance/create", async (route) => {
      const originalBody = route.request().postDataJSON();
      const response = await route.fetch({
        postData: JSON.stringify({
          ...originalBody,
          agentFields: {
            ...originalBody.agentFields,
            recipientCountryAlpha2Code: "XX",
          },
        }),
      });
      await route.fulfill({ response });
    });

    await beneficiaryPage.clickOnContinue();

    const hasError = await afexModal.expectModalErrorVisible();
    expect(hasError).toBe(true);

    await page.unroute("**/v1/remittance/create");
  });
});
