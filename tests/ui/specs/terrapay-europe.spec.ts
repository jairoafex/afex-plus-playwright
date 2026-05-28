import { test } from "@playwright/test";
import { FeelookupPage } from "../page/feelookupPage";
import { BeneficiaryPage } from "../page/beneficiaryPage";
import { TransferCollectionPage } from "../page/transferCollectionPage";
import { TransferDetailsPage } from "../page/transferDetailsPage";
import { AfexModalHelper } from "../../../utils/helpers/afexModal.helper";
import { EU_BENEFICIARIES } from "../../data/terrapay-europe.data";
import { CLIENT_NAME, CLIENT_COMPANY_NAME } from "../../data/peru.data";
import { getRetryAmount } from "../../../utils/helpers/retryAmount.helper";

const TEST_AMOUNT = process.env.TEST_AMOUNT;
const TEST_COUNTRY = process.env.TEST_COUNTRY;
const GIRO_CODE_PATTERN = /ZB\d\w+/;

test.describe("Europa — Terrapay Depósito", () => {
  let feelookupPage: FeelookupPage;
  let beneficiaryPage: BeneficiaryPage;
  let transferCollectionPage: TransferCollectionPage;
  let transferDetailsPage: TransferDetailsPage;
  let afexModal: AfexModalHelper;

  test.beforeEach(async ({ page }) => {
    const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";
    feelookupPage = new FeelookupPage(page);
    beneficiaryPage = new BeneficiaryPage(page);
    transferCollectionPage = new TransferCollectionPage(page);
    transferDetailsPage = new TransferDetailsPage(page);
    afexModal = new AfexModalHelper(page);
    const response = await page.goto(baseUrl).catch(() => null);
    if (!response || !response.ok()) {
      console.error(`\n❌ No se puede conectar a ${baseUrl}. Levanta el proyecto plus-web antes de ejecutar los tests.\n`);
      test.skip();
    }
    await feelookupPage.expectFeelookupFormVisible();
  });

  for (const data of Object.values(EU_BENEFICIARIES)
    .flat()
    .filter((d) => d.countryName !== "Estonia")
    .filter((d) => !TEST_COUNTRY || d.countryName === TEST_COUNTRY)
  ) {
    test.describe(`${data.countryName} — ${data.beneficiaryType}`, () => {

      test("Crear giro Terrapay cotizando monto a enviar en USD con nuevo beneficiario", async ({}, testInfo) => {
        test.setTimeout(240_000);
        const sendAmount = getRetryAmount(TEST_AMOUNT ?? "150", testInfo.retry);

        await feelookupPage.typeCountry(data.countryName);
        await feelookupPage.selectMethodPayment("Depósito");
        await feelookupPage.clickOnAmountType("Enviar");
        await feelookupPage.typeAmountToSend(sendAmount!);
        await feelookupPage.clickOnSearchQuotations();
        await feelookupPage.typeClient(CLIENT_NAME);
        await feelookupPage.clickOnClientFound();
        await feelookupPage.clickOnClientNotPresent();

        await feelookupPage.selectAgentQuote("Terrapay", "Depósito");
        await feelookupPage.clickOnBtnNext();

        await beneficiaryPage.checkBeneficiaryForm();
        await beneficiaryPage.clickOnRegisterNewBeneficiary();
        await beneficiaryPage.typeRealBeneficiaryName(data.name);
        await beneficiaryPage.typeRealBeneficiarySurname(data.surname);
        await beneficiaryPage.typeBeneficiaryType(data.beneficiaryType);
        await beneficiaryPage.typeAccountNumber(data.iban);
        await beneficiaryPage.typeBankName(data.bankName);
        await beneficiaryPage.typePurposeSelect(data.purpose);
        await beneficiaryPage.typeSourceFunds(data.sourceFunds);
        await beneficiaryPage.typeBeneficiaryRelation(data.relation);
        await beneficiaryPage.clickOnContinue();

        await beneficiaryPage.expectSummaryTransferVisible();
        await beneficiaryPage.clickOnContinue();

        await transferCollectionPage.clickOnCashCollectOption();
        await transferCollectionPage.clickOnSellTransfer();
        await transferCollectionPage.clickOnCollectTransfer();
        await transferCollectionPage.expectCollectingModalVisisble();
        await transferCollectionPage.expectSummaryModalVisible();
        await transferCollectionPage.clickOnBtnConfirmInModal();
        await afexModal.dismissDteErrorIfVisible();

        await transferDetailsPage.expectGiroCode(GIRO_CODE_PATTERN);
      });

      test("Crear giro Terrapay cotizando monto a recibir en EUR con nuevo beneficiario", async ({}, testInfo) => {
        test.setTimeout(240_000);
        const receiveAmount = getRetryAmount(TEST_AMOUNT ?? "100", testInfo.retry);

        await feelookupPage.typeCountry(data.countryName);
        await feelookupPage.selectMethodPayment("Depósito");
        await feelookupPage.clickOnAmountType("Recibir");

        if (data.usesNativeReceiveCurrency) {
          // Países con moneda local distinta al EUR (ej: Hungría con HUF)
          await feelookupPage.selectReceiveCurrencyEUR();
        }

        await feelookupPage.typeAmountToReceive(receiveAmount!);
        await feelookupPage.clickOnSearchQuotations();
        await feelookupPage.typeClient(CLIENT_NAME);
        await feelookupPage.clickOnClientFound();
        await feelookupPage.clickOnClientNotPresent();

        await feelookupPage.selectAgentQuote("Terrapay", "Depósito");
        await feelookupPage.clickOnBtnNext();

        await beneficiaryPage.checkBeneficiaryForm();
        await beneficiaryPage.clickOnRegisterNewBeneficiary();
        await beneficiaryPage.typeRealBeneficiaryName(data.name);
        await beneficiaryPage.typeRealBeneficiarySurname(data.surname);
        await beneficiaryPage.typeBeneficiaryType(data.beneficiaryType);
        await beneficiaryPage.typeAccountNumber(data.iban);
        await beneficiaryPage.typeBankName(data.bankName);
        await beneficiaryPage.typePurposeSelect(data.purpose);
        await beneficiaryPage.typeSourceFunds(data.sourceFunds);
        await beneficiaryPage.typeBeneficiaryRelation(data.relation);
        await beneficiaryPage.clickOnContinue();

        await beneficiaryPage.expectSummaryTransferVisible();
        await beneficiaryPage.clickOnContinue();

        await transferCollectionPage.clickOnCashCollectOption();
        await transferCollectionPage.clickOnSellTransfer();
        await transferCollectionPage.clickOnCollectTransfer();
        await transferCollectionPage.expectCollectingModalVisisble();
        await transferCollectionPage.expectSummaryModalVisible();
        await transferCollectionPage.clickOnBtnConfirmInModal();
        await afexModal.dismissDteErrorIfVisible();

        await transferDetailsPage.expectGiroCode(GIRO_CODE_PATTERN);
      });
    });
  }

  test.describe("Estonia — empresa remitente", () => {
    const estoniaEmpresa = EU_BENEFICIARIES.Estonia[0];
    const estoniaPersona = EU_BENEFICIARIES.Estonia[1];

    test("Crear giro Terrapay a Estonia cotizando monto a enviar en USD con nuevo beneficiario empresa", async ({}, testInfo) => {
      test.setTimeout(240_000);
      const sendAmount = getRetryAmount(TEST_AMOUNT ?? "150", testInfo.retry);

      await feelookupPage.typeCountry(estoniaEmpresa.countryName);
      await feelookupPage.selectMethodPayment("Depósito");
      await feelookupPage.clickOnAmountType("Enviar");
      await feelookupPage.typeAmountToSend(sendAmount!);
      await feelookupPage.clickOnSearchQuotations();
      await feelookupPage.typeClient(CLIENT_COMPANY_NAME);
      await feelookupPage.clickOnClientFound();

      await feelookupPage.selectAgentQuote("Terrapay", "Depósito");
      await feelookupPage.clickOnBtnNext();

      await beneficiaryPage.checkBeneficiaryForm();
      await beneficiaryPage.clickOnRegisterNewBeneficiary();
      await beneficiaryPage.typeRealBeneficiaryName(estoniaEmpresa.name);
      await beneficiaryPage.typeRealBeneficiarySurname(estoniaEmpresa.surname);
      await beneficiaryPage.typeBeneficiaryType(estoniaEmpresa.beneficiaryType);
      await beneficiaryPage.typeAccountNumber(estoniaEmpresa.iban);
      await beneficiaryPage.typeBankNameFreeText(estoniaEmpresa.bankName);
      await beneficiaryPage.typePurposeSelect(estoniaEmpresa.purpose);
      await beneficiaryPage.typeSourceFunds(estoniaEmpresa.sourceFunds);
      await beneficiaryPage.clickOnContinue();

      await beneficiaryPage.expectSummaryTransferVisible();
      await transferCollectionPage.clickOnRecaudarGiro();

      await transferCollectionPage.clickOnCashCollectOption();
      await transferCollectionPage.clickOnSellTransfer();
      await transferCollectionPage.clickOnCollectTransfer();
      await transferCollectionPage.expectCollectingModalVisisble();
      await transferCollectionPage.expectSummaryModalVisible();
      await transferCollectionPage.clickOnBtnConfirmInModal();
      await afexModal.dismissDteErrorIfVisible();

      await transferDetailsPage.expectGiroCode(GIRO_CODE_PATTERN);
    });

    test("Crear giro Terrapay a Estonia cotizando monto a enviar en USD con nuevo beneficiario persona", async ({}, testInfo) => {
      test.setTimeout(240_000);
      const sendAmount = getRetryAmount(TEST_AMOUNT ?? "150", testInfo.retry);

      await feelookupPage.typeCountry(estoniaPersona.countryName);
      await feelookupPage.selectMethodPayment("Depósito");
      await feelookupPage.clickOnAmountType("Enviar");
      await feelookupPage.typeAmountToSend(sendAmount!);
      await feelookupPage.clickOnSearchQuotations();
      await feelookupPage.typeClient(CLIENT_NAME);
      await feelookupPage.clickOnClientFound();
      await feelookupPage.clickOnClientNotPresent();

      await feelookupPage.selectAgentQuote("Terrapay", "Depósito");
      await feelookupPage.clickOnBtnNext();

      await beneficiaryPage.checkBeneficiaryForm();
      await beneficiaryPage.clickOnRegisterNewBeneficiary();
      await beneficiaryPage.typeRealBeneficiaryName(estoniaPersona.name);
      await beneficiaryPage.typeRealBeneficiarySurname(estoniaPersona.surname);
      await beneficiaryPage.typeBeneficiaryType(estoniaPersona.beneficiaryType);
      await beneficiaryPage.typeAccountNumber(estoniaPersona.iban);
      await beneficiaryPage.typeBankNameFreeText(estoniaPersona.bankName);
      await beneficiaryPage.typePurposeSelect(estoniaPersona.purpose);
      await beneficiaryPage.typeSourceFunds(estoniaPersona.sourceFunds);
      await beneficiaryPage.clickOnContinue();

      await beneficiaryPage.expectSummaryTransferVisible();
      await beneficiaryPage.clickOnContinue();

      await transferCollectionPage.clickOnCashCollectOption();
      await transferCollectionPage.clickOnSellTransfer();
      await transferCollectionPage.clickOnCollectTransfer();
      await transferCollectionPage.expectCollectingModalVisisble();
      await transferCollectionPage.expectSummaryModalVisible();
      await transferCollectionPage.clickOnBtnConfirmInModal();
      await afexModal.dismissDteErrorIfVisible();

      await transferDetailsPage.expectGiroCode(GIRO_CODE_PATTERN);
    });
  });
});
