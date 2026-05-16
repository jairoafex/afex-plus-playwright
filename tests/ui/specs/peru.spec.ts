import { test } from "@playwright/test";
import { FeelookupPage } from "../page/feelookupPage";
import { BeneficiaryPage } from "../page/beneficiaryPage";
import { TransferCollectionPage } from "../page/transferCollectionPage";
import { TransferDetailsPage } from "../page/transferDetailsPage";
import { AfexModalHelper } from "../../../utils/helpers/afexModal.helper";
import { CLIENT_NAME, PERU_BENEFICIARIES } from "../../data/peru.data";
import { getRetryAmount } from "../../../utils/helpers/retryAmount.helper";

const GIRO_CODE_PATTERN = /ZB\d\w+/;
const TEST_AMOUNT = process.env.TEST_AMOUNT;

test.describe("Perú — envíos", () => {
  let feelookupPage: FeelookupPage;
  let beneficiaryPage: BeneficiaryPage;
  let transferCollectionPage: TransferCollectionPage;
  let transferDetailsPage: TransferDetailsPage;
  let afexModal: AfexModalHelper;

  test.beforeEach(async ({ page }) => {
    feelookupPage = new FeelookupPage(page);
    beneficiaryPage = new BeneficiaryPage(page);
    transferCollectionPage = new TransferCollectionPage(page);
    transferDetailsPage = new TransferDetailsPage(page);
    afexModal = new AfexModalHelper(page);
    await page.goto(`${process.env.BASE_URL}`);
    await feelookupPage.expectFeelookupFormVisible();
  });

  test.describe("Efectivo", () => {
    test("Crear giro Banco De Credito BCP cotizando monto aleatorio en USD con nuevo beneficiario", async ({}, testInfo) => {
      test.setTimeout(240_000);
      const data = PERU_BENEFICIARIES.bcpCash;
      const amount = getRetryAmount(TEST_AMOUNT, testInfo.retry);

      // Etapa 1 — Cotizador (Efectivo requiere ciudad)
      await feelookupPage.typeCountry("Perú");
      await feelookupPage.selectMethodPayment("Efectivo");
      await feelookupPage.typeCity("Lima");
      await feelookupPage.clickOnAmountType("Enviar");
      amount
        ? await feelookupPage.typeAmountToSend(amount)
        : await feelookupPage.typeRandomAmount("USD");
      await feelookupPage.clickOnSearchQuotations();
      await feelookupPage.typeClient(CLIENT_NAME);
      await feelookupPage.clickOnClientFound();
      await feelookupPage.clickOnClientNotPresent();

      // Etapa 2 — Seleccionar cotización BCP (paginación automática si no está en página 1)
      await feelookupPage.selectAgentByName("Banco De Credito Bcp");
      await feelookupPage.clickOnBtnNext();

      // Etapa 3 — Nuevo beneficiario
      await beneficiaryPage.checkBeneficiaryForm();
      await beneficiaryPage.clickOnRegisterNewBeneficiary();
      await beneficiaryPage.typeRealBeneficiaryName(data.name);
      await beneficiaryPage.typeRealBeneficiarySurname(data.surname);
      await beneficiaryPage.clickOnContinue();

      // Etapa 4 — Resumen
      await beneficiaryPage.expectSummaryTransferVisible();
      await beneficiaryPage.clickOnContinue();

      // Etapa 5 — Recaudación: Efectivo → Vender y Registrar Giro
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

  test.describe("Depósito / Wallet", () => {
    test("Crear giro Yape cotizando monto aleatorio en PEN con nuevo beneficiario", async ({}, testInfo) => {
      test.setTimeout(240_000);
      const data = PERU_BENEFICIARIES.yapeDeposit;
      const amount = getRetryAmount(TEST_AMOUNT, testInfo.retry);

      // Etapa 1 — Cotizador (Depósito / Wallet no requiere ciudad)
      await feelookupPage.typeCountry("Perú");
      await feelookupPage.selectMethodPayment("Depósito");
      await feelookupPage.clickOnAmountType("Recibir");
      amount
        ? await feelookupPage.typeAmountToReceive(amount)
        : await feelookupPage.typeRandomAmount("PEN");
      await feelookupPage.clickOnSearchQuotations();
      await feelookupPage.typeClient(CLIENT_NAME);
      await feelookupPage.clickOnClientFound();
      await feelookupPage.clickOnClientNotPresent();

      // Etapa 2 — Seleccionar cotización Yape (paginación automática si no está en página 1)
      await feelookupPage.selectAgentByName("Yape");
      await feelookupPage.clickOnBtnNext();

      // Etapa 3 — Nuevo beneficiario
      await beneficiaryPage.checkBeneficiaryForm();
      await beneficiaryPage.clickOnRegisterNewBeneficiary();
      await beneficiaryPage.typeRealBeneficiaryName(data.name);
      await beneficiaryPage.typeRealBeneficiarySurname(data.surname);
      await beneficiaryPage.typeYapePhone(data.phone);
      await beneficiaryPage.typePurpose(data.purpose);
      await beneficiaryPage.clickOnContinue();

      // Etapa 4 — Resumen
      await beneficiaryPage.expectSummaryTransferVisible();
      await beneficiaryPage.clickOnContinue();

      // Etapa 5 — Recaudación: Efectivo → Vender y Registrar Giro
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
