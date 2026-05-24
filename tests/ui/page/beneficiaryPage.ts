import { expect, Locator, Page } from "@playwright/test";
import { faker as fakerES } from "@faker-js/faker";
import { TEST_TIMEOUTS } from "../../../utils/constants/timeouts";
import {
  AccountType,
  IdentificationType,
} from "../../types/beneficiary.types";
import { AntSelectHelpers } from "../../../utils/helpers/antSelect.helper";
import { AfexModalHelper } from "../../../utils/helpers/afexModal.helper";


export class BeneficiaryPage {
  private readonly antSelect: AntSelectHelpers;
  private readonly afexmodalHelper:AfexModalHelper;

  private readonly page: Page;
  private readonly beneficiaryListContainer: Locator;
  private readonly btnNewBeneficiary: Locator;
  private readonly radiobtnSelectBeneficiay: Locator;
  private readonly inputBeneficiaryName: Locator;
  private readonly inputBeneficiarySurname: Locator;
  private readonly dropdownIdentificationType: Locator;
  private readonly inputBenficiaryId: Locator;
  private readonly inputBeneficiaryPhone: Locator;
  private readonly inputYapePhone: Locator;
  private readonly inputAccountNumber: Locator;
  private readonly dropdownAccountType: Locator;
  private readonly dropdownBeneficiaryType: Locator;
  private readonly inputBankName: Locator;
  private readonly inputBankNameText: Locator;
  private readonly inputAddress: Locator;
  private readonly dropdownBeneficiaryRelation: Locator;
  private readonly dropdownSourceFunds: Locator;
  private readonly dropdownPurposeSelect: Locator;
  private readonly inputPurpose: Locator;
  private readonly btnContinue: Locator;
  private readonly summaryTransferContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.antSelect = new AntSelectHelpers(page);
    this.afexmodalHelper= new AfexModalHelper(page);
    this.beneficiaryListContainer = page.locator("div .ant-spin-container");
    this.btnNewBeneficiary = page.locator("//button[.//span[normalize-space()='Nuevo Beneficiario']]");
    this.radiobtnSelectBeneficiay = page.locator("(//span[@class='ant-radio'][1])").first();
    this.inputBeneficiaryName = page.getByRole("textbox", { name: "* Nombre", exact: true });
    this.inputBeneficiarySurname = page.getByRole("textbox", {name: "* Apellidos"});
    this.dropdownIdentificationType = page.getByRole("combobox", {name: "* Tipo de identificación"});
    this.inputBenficiaryId = page.getByRole("textbox", {name: "* Número de identificación"});
    this.inputBeneficiaryPhone = page.locator("//input[contains(@id,'form_item_recipientPhone')]");
    this.inputYapePhone = page.getByLabel("Teléfono asociado a Yape");  
    this.inputAccountNumber = page.locator("//input[contains(@id,'form_item_receiverAccountNumber')]");
    this.dropdownAccountType = page.locator("//input[@id='form_item_accountType' or @id='form_item_receiverAccountType']");
    this.inputPurpose= page.getByRole('textbox', { name: '* Propósito de la transacción' })
    this.inputBankName = page.getByRole("combobox", { name: "* Banco" });
    this.inputBankNameText = page.getByPlaceholder("Ingrese nombre del banco");
    this.inputAddress = page.getByRole("textbox", { name: "* Dirección del beneficiario" });
    this.dropdownBeneficiaryRelation = page.getByRole("combobox", { name: "* Relación con Beneficiario" });
    this.dropdownSourceFunds = page.getByRole("combobox", { name: "* Orígen de fondos" });
    this.dropdownPurposeSelect = page.getByRole("combobox", { name: "* Propósito de la transacción" });
    this.btnContinue = page.locator("(//span[contains(.,'Continuar')])[1]");
    this.summaryTransferContainer = page.locator(".summary-container");
    this.dropdownBeneficiaryType = page.getByRole("combobox", { name: "* Tipo de beneficiario" });
  }
  async checkBeneficiaryForm(): Promise<void> {
    await expect(this.beneficiaryListContainer).toHaveCount(1);
    await this.afexmodalHelper.waitForSpinnerToDisappear();
  }

  async clickOnRegisterNewBeneficiary(): Promise<void> {
    await this.btnNewBeneficiary.click();
  }

  async typeBeneficiaryName(): Promise<void> {
    await this.inputBeneficiaryName.fill(fakerES.person.firstName());
  }

  async typeRealBeneficiaryName(name:string): Promise<void> {
    await this.inputBeneficiaryName.fill(name);
  }

  async typeBeneficiarySurname(): Promise<void> {
    await this.inputBeneficiarySurname.fill(fakerES.person.lastName());
  }

  async typeRealBeneficiarySurname(surname:string): Promise<void> {
    await this.inputBeneficiarySurname.fill(surname);
  }

  async typeBeneficiaryIdentification(identification: string): Promise<void> {
    await this.inputBenficiaryId.fill(identification);
  }

  async selectIdentificationType(type: IdentificationType): Promise<void> {
    await this.dropdownIdentificationType.waitFor({ state: 'attached', timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
    await this.dropdownIdentificationType.click();
    await this.antSelect.selectByText(type);
  }

  async typeBeneficiaryPhone(phone: string): Promise<void> {
    await this.inputBeneficiaryPhone.fill(phone);
  }

  async typeYapePhone(phone: string): Promise<void> {
    await this.inputYapePhone.waitFor({ state: 'attached', timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
    await this.inputYapePhone.fill(phone);
  }

  async typeAccountType(accountType: AccountType): Promise<void> {
    await this.dropdownAccountType.waitFor({ state: 'attached', timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
    await this.dropdownAccountType.click();
    await this.antSelect.selectByText(accountType);
  }

  async typeAccountNumber(accountNumber: string): Promise<void> {
    await this.inputAccountNumber.fill(accountNumber);
  }
  async typeAddress(address: string): Promise<void> {
    await this.inputAddress.fill(address);
  }

  async typeBankNameFreeText(bank: string): Promise<void> {
    await this.inputBankNameText.fill(bank);
  }

  async typeBankName(bank: string): Promise<void> {
    await this.inputBankName.waitFor({ state: 'attached', timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
    await this.inputBankName.click();
    await this.inputBankName.fill(bank);
    await this.antSelect.selectByText(bank);
  }

  async typeBeneficiaryRelation(relation: string): Promise<void> {
    await this.dropdownBeneficiaryRelation.waitFor({ state: 'attached', timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
    await this.dropdownBeneficiaryRelation.click();
    await this.dropdownBeneficiaryRelation.fill(relation);
    await this.antSelect.selectByText(relation);
  }

  async typeSourceFunds(source: string): Promise<void> {
    await this.dropdownSourceFunds.waitFor({ state: 'attached', timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
    await this.dropdownSourceFunds.click();
    await this.dropdownSourceFunds.fill(source);
    await this.antSelect.selectByText(source);
  }

  async typePurpose(purpose: string): Promise<void> {
    await this.inputPurpose.fill(purpose);
  }

  async typePurposeSelect(purpose: string): Promise<void> {
    await this.dropdownPurposeSelect.waitFor({ state: 'attached', timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
    await this.dropdownPurposeSelect.click();
    await this.dropdownPurposeSelect.fill(purpose);
    await this.antSelect.selectByText(purpose);
  }

  async typeBeneficiaryType(beneficiary: string): Promise<void> {
    await this.dropdownBeneficiaryType.waitFor({ state: 'attached', timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
    await this.dropdownBeneficiaryType.click();
    await this.dropdownBeneficiaryType.fill(beneficiary);
    await this.antSelect.selectByText(beneficiary);
  }

  async clickOnContinue(): Promise<void> {
    await this.btnContinue.click();
  }

  async expectSummaryTransferVisible(): Promise<void> {
    await expect(this.summaryTransferContainer).toBeVisible();
  }
}
