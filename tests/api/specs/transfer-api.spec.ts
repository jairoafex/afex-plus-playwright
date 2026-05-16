import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { allure } from "allure-playwright";
import {
  API_TRANSFER_DATES,
  API_BRANCH,
  API_CUSTOMER,
  API_PERU_FEELOOKUP,
  API_PERU_RECIPIENT,
  KNOWN_TRANSFER_CODE,
} from "../../data/api.data";

test.describe("Epic: Transfer API", () => {
  test.beforeEach(() => {
    void allure.epic("Transfer API");
    void allure.tag("API");
  });

  test.describe("Feature: Transfer Queries", () => {
    test("API | Obtener tasa de cambio", async ({ request }) => {
      void allure.feature("Exchange Rate");
      void allure.story("Obtener tasa de cambio");
      void allure.severity("critical");

      const response = await test.step("GET exchange rate ZB", () =>
        request.get(
          `${process.env.URL_TRANSFER_API}/v1/transfers/exchangeRate/${API_BRANCH.code.toLowerCase()}`,
          { headers: { Authorization: `${process.env.API_AUTH_TOKEN}` } }
        )
      );

      const body = await response.json();

      await test.step("Validar respuesta", () => {
        expect(response.status()).toBe(200);
        expect(body.status).toBe("success");
      });

      await test.info().attach("Exchange rate response", {
        body: Buffer.from(JSON.stringify(body, null, 2)),
        contentType: "application/json",
      });
    });
  });

  test.describe("Feature: Transfer Request", () => {
    test("API | Cotizar y crear giro", async ({ request }) => {
      void allure.feature("endpoint feelookup, fields y create transfer");
      void allure.story("Cotizar y crear giro");
      void allure.severity("critical");

      const feelookupResponse = await test.step("POST fee lookup", () =>
        request.post(
          `${process.env.URL_TRANSFER_API}/v1/transfers/feelookup`,
          {
            headers: { Authorization: `${process.env.API_AUTH_TOKEN}` },
            data: {
              amount: faker.number.int({
                min: API_PERU_FEELOOKUP.amountMin,
                max: API_PERU_FEELOOKUP.amountMax,
              }),
              branchId: API_BRANCH.id,
              branchCode: API_BRANCH.code,
              receiverCountry: API_PERU_FEELOOKUP.receiverCountry,
              receiverCity: API_PERU_FEELOOKUP.receiverCity,
              methodPayment: API_PERU_FEELOOKUP.methodPayment,
              originCurrency: API_PERU_FEELOOKUP.originCurrency,
              includeFee: API_PERU_FEELOOKUP.includeFee,
            },
          }
        )
      );

      const feelookupBody = await feelookupResponse.json();
      const feelookupId = feelookupBody.data.id;

      expect(feelookupResponse.status()).toBe(206);
      expect(Array.isArray(feelookupBody.data.quotes)).toBe(true);

      const fieldsResponse = await test.step("POST fee lookup fields", () =>
        request.post(
          `${process.env.URL_TRANSFER_API}/v1/transfers/feelookup/fields`,
          {
            headers: { Authorization: `${process.env.API_AUTH_TOKEN}` },
            data: { feelookupId, quoteId: API_PERU_FEELOOKUP.quoteId },
          }
        )
      );

      const fieldsBody = await fieldsResponse.json();

      expect(fieldsResponse.status()).toBe(200);
      expect(fieldsBody.status).toBe("success");

      const createTransferResponse = await test.step("POST create transfer", () =>
        request.post(
          `${process.env.URL_TRANSFER_API}/v1/transfers/create`,
          {
            headers: {
              Authorization: `${process.env.API_AUTH_TOKEN}`,
              "x-afex-user-id": "109873128",
              "x-afex-branch-code": API_BRANCH.code,
            },
            data: {
              id: feelookupId,
              quoteId: API_PERU_FEELOOKUP.quoteId,
              agentFields: {
                recipientPhone: API_PERU_RECIPIENT.phone,
                recipientCityCode: API_PERU_RECIPIENT.cityCode,
                recipientCityDdi: API_PERU_RECIPIENT.cityDdi,
                recipientCountryAlpha2Code: API_PERU_RECIPIENT.countryAlpha2Code,
                recipientCountryDdi: API_PERU_RECIPIENT.countryDdi,
                recipientNames: faker.person.firstName(),
                recipientSurnames: faker.person.lastName(),
              },
              sender: {
                corporateCode: API_CUSTOMER.corporateCode,
                identification: API_CUSTOMER.identification,
                identificationType: API_CUSTOMER.identificationType,
              },
              userFullName: "Jairo Bermudez",
            },
          }
        )
      );

      const transferDetails = await createTransferResponse.json();

      expect(createTransferResponse.status()).toBe(200);
      expect(transferDetails.status).toBe("success");
      expect(transferDetails.data.transferCode).toContain(API_BRANCH.code);

      await test.info().attach("Create transfer response", {
        body: Buffer.from(JSON.stringify(transferDetails, null, 2)),
        contentType: "application/json",
      });
    });
  });

  test.describe("Feature: Transfer Queries", () => {
    test("API | Obtener detalle del giro", async ({ request }) => {
      void allure.feature("endpoint getTransferDetails");
      void allure.story("Obtener detalle del giro por codigo");
      void allure.severity("critical");

      const response = await request.get(
        `${process.env.URL_TRANSFER_API}/v1/transfers/${KNOWN_TRANSFER_CODE}`,
        {
          headers: {
            Authorization: `${process.env.API_AUTH_TOKEN}`,
            "x-afex-branch-code": API_BRANCH.code,
          },
        }
      );

      const body = await response.json();

      expect(response.status()).toBe(200);
      expect(body.status).toBe("success");
      expect(body.data.transferCode).toBe(KNOWN_TRANSFER_CODE);
    });

    test("API | Obtener envíos por sucursal", async ({ request }) => {
      void allure.feature("endpoint sentByBranch");
      void allure.story(`Obtener envios por sucursal ${API_BRANCH.code}`);
      void allure.severity("normal");

      const response = await request.get(
        `${process.env.URL_TRANSFER_API}/v1/transfers/branches/${API_BRANCH.code}/sent` +
          `?startDate=${API_TRANSFER_DATES.startDate}&endDate=${API_TRANSFER_DATES.endDate}`,
        { headers: { Authorization: `${process.env.API_AUTH_TOKEN}` } }
      );

      const body = await response.json();

      expect(response.status()).toBe(200);
      for (const transfer of body.data) {
        expect(transfer).toHaveProperty("transferCode");
        expect(transfer).toHaveProperty("state");
        expect(transfer.collectingAgentCode).toBe(API_BRANCH.code);
      }

      await test.info().attach("Sent by branch response", {
        body: Buffer.from(JSON.stringify(body, null, 2)),
        contentType: "application/json",
      });
    });

    test("API | Obtener envíos por cliente", async ({ request }) => {
      void allure.feature("endpoint sentByCustomer");
      void allure.story(`Obtener envios por cliente ${API_CUSTOMER.corporateCode}`);
      void allure.severity("normal");

      const response = await request.get(
        `${process.env.URL_TRANSFER_API}/v1/transfers/customers/${API_CUSTOMER.corporateCode}/sent` +
          `?startDate=${API_TRANSFER_DATES.startDate}&endDate=${API_TRANSFER_DATES.endDate}`,
        { headers: { Authorization: `${process.env.API_AUTH_TOKEN}` } }
      );

      const body = await response.json();

      expect(response.status()).toBe(200);
      for (const transfer of body.data) {
        expect(transfer).toHaveProperty("transferCode");
        expect(transfer).toHaveProperty("state");
        expect(transfer.sender).toBe(API_CUSTOMER.senderName);
      }

      await test.info().attach("Sent by customer response", {
        body: Buffer.from(JSON.stringify(body, null, 2)),
        contentType: "application/json",
      });
    });
  });
});
