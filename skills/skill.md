---
name: playwright-tester-pom
description: >
  Automatización de pruebas UI con Playwright + POM sobre AFEX Plus.
  Usar cuando: ejecutar tests existentes, crear tests nuevos, extender POMs, generar reportes Allure.
  NO usar para: unit tests, pruebas de API puras, proyectos sin Playwright.
---

# Playwright Tester — POM + Allure (AFEX)

## FLUJO DE DECISIÓN

```
¿El flujo está en el CATÁLOGO?
  ├─ SÍ → MODO EJECUCIÓN (no crear nada, solo correr)
  └─ NO → FASE 1 → 2 → 3 → 4
```

Reutilización tiene prioridad absoluta.

---

## CATÁLOGO DE TESTS

| Spec                          | País       | Agente   | Método       | Moneda   | Grep                  |
|-------------------------------|------------|----------|--------------|----------|-----------------------|
| `peru.spec.ts`                | Perú       | BCP      | Efectivo     | USD env  | `"BCP"`               |
| `peru.spec.ts`                | Perú       | Yape     | Wallet       | PEN rec  | `"Yape"`              |
| `terrapay-europe.spec.ts`     | [12 SEPA]  | Terrapay | Depósito     | USD env  | `"[País].*enviar"`    |
| `terrapay-europe.spec.ts`     | [12 SEPA]  | Terrapay | Depósito     | EUR rec  | `"[País].*recibir"`   |
| `sepa-eur-validation.spec.ts` | [10 SEPA]  | Terrapay | Cotización   | EUR rec  | `"[País].*EUR"`       |

Países `terrapay-europe`: España · Alemania · Bélgica · Rumania · Chipre · Finlandia · Hungría · Holanda · Irlanda · Francia · Estonia · Bulgaria
Países `sepa-eur-validation`: Dinamarca · Eslovenia · Eslovaquia · Letonia · Lituania · Estonia · Portugal · Grecia · Italia · Malta

> `feelookup.spec.ts` excluido en config (`testIgnore`). Solo debug manual con `--grep`.
> `sepa-eur-validation` valida cotización pura sin flujo completo de giro.

---

## MODO EJECUCIÓN

```bash
# Plantilla con grep
npx playwright test --grep "<patrón>" --project=chromium --reporter=line 2>&1

# Plantilla con env vars (monto y/o país)
TEST_AMOUNT=<n> TEST_COUNTRY=<País> npm run test:quick -- <spec>
```

| Script              | Uso                                                |
|---------------------|----------------------------------------------------|
| `test:quick`        | Chromium, line reporter, sin Allure/Slack          |
| `test:notify`       | Chromium + Allure + Slack                          |
| `test:full`         | 3 browsers + Allure + Slack                        |
| `test:sepa-eur`     | 3 países SEPA-EUR simultáneos + Slack              |
| `report:serve`      | Sirve `allure-report/` en `:4040`                  |

> `allure-results/` se limpia automáticamente. Workers locales: ½ CPU; usar `--workers=2` para E2E pesados.

---

## CONTEXTO DE LA APP

```yaml
app:
  nombre: "AFEX Plus"
  base_url: "http://localhost:3000"   # también BASE_URL en .env
  login: "bypaseado"
  modulo: "Cotizar un envío"
```

> **IMPORTANTE:** Nunca levantar `plus-web` desde este repo ni desde los tests.
> Si `localhost:3000` no responde, el `beforeEach` hace `test.skip()` y muestra:
> `❌ No se puede conectar a http://localhost:3000. Levanta el proyecto plus-web antes de ejecutar los tests.`
> El usuario debe levantar `plus-web` manualmente antes de correr cualquier test.

### Flujo y mapeo a POMs

| Etapa | POM                       | Acción clave                                       | Validación      |
|-------|---------------------------|----------------------------------------------------|-----------------|
| 1     | `FeelookupPage`           | país → método → monto → cliente → "Buscar"         | tabla visible   |
| 2     | `FeelookupPage`           | seleccionar agente (paginado) → "Siguiente"        | agente marcado  |
| 3     | `BeneficiaryPage`         | datos desde `tests/data/` → "Continuar"            | —               |
| 4     | (resumen)                 | verificar montos → "Continuar"                     | —               |
| 5     | `TransferCollectionPage`  | "Recaudar" → modal DTE → "Entendido"               | —               |
| 6     | `TransferDetailsPage`     | —                                                  | `/ZB\d\w+/`     |

**Defaults:** Efectivo requiere ciudad · Depósito engloba Wallet/PIX/ATM (sin ciudad) · Recaudación = "Vender y Registrar Giro" (convierte USD→CLP).

### Países soportados

| País        | Moneda | Zona  | Notas                                              |
|-------------|--------|-------|----------------------------------------------------|
| Perú        | PEN    | LATAM | ciudad default: Lima                               |
| Colombia    | COP    | LATAM | Bogotá                                             |
| Bolivia     | BOB    | LATAM | La Paz                                             |
| Ecuador     | USD    | LATAM | Quito                                              |
| Argentina   | ARS    | LATAM | Buenos Aires                                       |
| Brasil      | BRL    | LATAM | São Paulo                                          |
| Alemania, Bélgica, Francia, Chipre, Finlandia, Holanda, Irlanda, Estonia, Eslovenia, Eslovaquia, Letonia, Lituania, Portugal, Grecia, Italia, Malta | EUR | SEPA | |
| Rumania     | RON    | SEPA  |                                                    |
| Bulgaria    | BGN    | SEPA  |                                                    |
| Hungría     | HUF    | SEPA  | test E2 selecciona EUR explícito                   |
| Dinamarca   | DKK    | SEPA  | `sepa-eur-validation` selecciona EUR explícito     |

### Rangos de monto por moneda

```
USD: 20-200 (enviar)     CLP: 12000-100000 (enviar)
PEN: 80-500 (recibir)    ARS: 50000-150000 (recibir)
BRL: 580-900 (recibir)   COP: 250000-350000 (recibir)
BOB: 120-200 (recibir)   EUR: 120-200 (recibir)
```

### Cliente de prueba

- Default: `CLIENT_NAME` desde `peru.data.ts` → "No presencial"
- Empresa (solo Europa): "First Pay Finance Ltd" → "No presencial"

### Promocodes

`GIROCLUB2` · `TARIFACERO`

---

## DATOS DE BENEFICIARIO

Los datos viven en `tests/data/`. Nunca strings hardcodeados en specs.

| Spec                          | Archivo de datos                       | Export                |
|-------------------------------|----------------------------------------|-----------------------|
| `peru.spec.ts`                | `tests/data/peru.data.ts`              | `PERU_BENEFICIARIES`  |
| `terrapay-europe.spec.ts`     | `tests/data/terrapay-europe.data.ts`   | `EU_BENEFICIARIES`    |
| `[país].spec.ts` (nuevo)      | `tests/data/[país].data.ts`            | `[PAÍS]_BENEFICIARIES`|

Campos comunes Europa SEPA: `nombres, apellido, iban, banco, relacion, origen_fondos, proposito`.

---

## ESTRUCTURA DEL PROYECTO

```
tests/
  ui/
    page/                           ← POMs (leer SIEMPRE antes de escribir specs)
      feelookupPage.ts
      beneficiaryPage.ts
      transferCollectionPage.ts
      transferDetailsPage.ts
    specs/                          ← un archivo por país
      peru.spec.ts
      terrapay-europe.spec.ts       ← for...of sobre EU_BENEFICIARIES
      sepa-eur-validation.spec.ts
      feelookup.spec.ts             ← IGNORADO en config
  data/                             ← todos los beneficiarios y CLIENT_NAME
  types/
utils/
  constants/timeouts.ts             ← TEST_TIMEOUTS (única fuente)
  helpers/
    antSelect.helper.ts             ← selects Ant Design
    afexModal.helper.ts             ← modales AFEX
    retryAmount.helper.ts           ← getRetryAmount(base, retry)
```

---

## CÓMO AGREGAR UN PAÍS O AGENTE NUEVO

Receta de 4 pasos. Si el país tiene spec, agregar al existente; nunca crear specs por agente individual.

1. **Datos**: crear/extender `tests/data/[país].data.ts` con `[PAÍS]_BENEFICIARIES` (dataset por agente).
2. **POM**: verificar si `BeneficiaryPage` cubre los campos del agente. Si faltan locators/métodos → **extender el POM existente**, no crear uno nuevo. `BeneficiaryPage` es genérico.
3. **Spec**:
   - Si `[país].spec.ts` existe → agregar `test.describe` del nuevo método/agente dentro.
   - Si no existe → crear `[país].spec.ts` con la plantilla SPEC.
4. **Catálogo**: agregar fila a la tabla del catálogo de esta skill.

---

## FASE 1 — RECONOCIMIENTO (solo tests nuevos)

```bash
cat tests/ui/page/feelookupPage.ts
cat tests/ui/page/beneficiaryPage.ts
cat tests/ui/page/transferCollectionPage.ts
cat tests/ui/page/transferDetailsPage.ts
cat utils/helpers/antSelect.helper.ts
cat utils/helpers/afexModal.helper.ts
cat utils/constants/timeouts.ts
ls tests/ui/specs/
```

Verificar firma exacta de cada método. Si no existe, **crearlo en el POM antes de usarlo en el spec**.

---

## FASE 2 — PAGE OBJECTS

Extender antes de crear. Crear POM solo si la pantalla no tiene uno.

**Plantilla POM** (`tests/ui/page/[nombre]Page.ts`):

```typescript
import { expect, Locator, Page } from "@playwright/test";
import { AntSelectHelpers } from "../../../utils/helpers/antSelect.helper";
import { AfexModalHelper } from "../../../utils/helpers/afexModal.helper";
import { TEST_TIMEOUTS } from "../../../utils/constants/timeouts";

export class NombrePage {
  private readonly afexModal: AfexModalHelper;
  private readonly antSelect: AntSelectHelpers;
  private readonly page: Page;
  private readonly miElemento: Locator;

  constructor(page: Page) {
    this.page = page;
    this.antSelect = new AntSelectHelpers(page);
    this.afexModal = new AfexModalHelper(page);
    // Orden: getByRole → getByTestId → getByLabel → getByText → css → xpath
    this.miElemento = page.getByRole("button", { name: "Acción" });
  }

  async clickOnMiElemento(): Promise<void> {
    await this.miElemento.click();
  }

  async expectMiElementoVisible(): Promise<void> {
    await expect(this.miElemento).toBeVisible({ timeout: TEST_TIMEOUTS.NORMAL_OPERATION });
  }
}
```

**Reglas Ant Design:**
- Selects → `this.antSelect.selectByText(valor)` (nunca interactuar directo)
- Modales → métodos de `this.afexModal`
- Tablas → `div.ant-table-content tbody.ant-table-tbody`
- Radios → click en `label.ant-radio-wrapper`, verificar `input.ant-radio-input`

---

## FASE 3 — SPECS

Un archivo por país. `test.describe` externo = país; internos = método/agente.

**Plantilla SPEC** (`tests/ui/specs/[país].spec.ts`):

```typescript
import { test } from "@playwright/test";
import { FeelookupPage } from "../page/feelookupPage";
import { BeneficiaryPage } from "../page/beneficiaryPage";
import { TransferCollectionPage } from "../page/transferCollectionPage";
import { TransferDetailsPage } from "../page/transferDetailsPage";
import { AfexModalHelper } from "../../../utils/helpers/afexModal.helper";
import { CLIENT_NAME, BENEFICIARIES } from "../../data/[país].data";
import { getRetryAmount } from "../../../utils/helpers/retryAmount.helper";

const GIRO_CODE_PATTERN = /ZB\d\w+/;
const TEST_AMOUNT = process.env.TEST_AMOUNT;

test.describe("País — envíos", () => {
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

  test.describe("Método", () => {
    test("Crear giro Agente cotizando monto en MONEDA con nuevo beneficiario", async ({}, testInfo) => {
      test.setTimeout(240_000);
      const data = BENEFICIARIES.agente;
      const amount = getRetryAmount(TEST_AMOUNT, testInfo.retry);

      // Etapa 1
      amount
        ? await feelookupPage.typeAmountToSend(amount)
        : await feelookupPage.typeRandomAmount("USD");

      // Etapas 2-5 (ver specs existentes como referencia)

      // Assertion obligatoria
      await transferDetailsPage.expectGiroCode(GIRO_CODE_PATTERN);
    });
  });
});
```

**Interceptación de red:**
```typescript
await page.route("**/v1/remittance/create", async (route) => { /* ... */ });
// Siempre limpiar al final:
await page.unroute("**/v1/remittance/create");
```

**Convenciones:**
- Archivo: `tests/ui/specs/[país].spec.ts` — uno por país
- `describe` externo: `"Perú — envíos"` · internos: `"Efectivo"`, `"Depósito / Wallet"`
- Test: acción + agente + condición en español
- `test.setTimeout` solo dentro de `test()` individual, **nunca** en `describe`
- Múltiples datasets → `for...of Object.entries()` (ver `terrapay-europe.spec.ts`)

---

## FASE 4 — EJECUCIÓN

Ver tabla de scripts en MODO EJECUCIÓN.

---

## FIX LOOP — máx. 3 intentos

1. Leer terminal
2. Leer screenshot en `test-results/`

| Síntoma                            | Acción                                           |
|------------------------------------|--------------------------------------------------|
| `TypeError: x is not a function`   | Leer POM, usar nombre correcto o crear método    |
| Timeout en locator                 | Corregir locator en POM                          |
| Elemento no disponible             | `waitFor` con `TEST_TIMEOUTS`                    |
| Select/modal Ant no responde       | Usar helper correcto                             |
| Comportamiento roto en UI          | Reportar al usuario (bug de app)                 |

```typescript
await this.miElemento.waitFor({ state: "attached", timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
```

> `getRetryAmount(TEST_AMOUNT, testInfo.retry)` varía el monto en reintentos automáticos (0=exacto, 1=+2, 2=-1). Obligatorio en todo spec que use `TEST_AMOUNT`.

**Si falla tras 3 intentos:** detener, reportar `expected vs actual` + screenshot, pedir orientación. No aumentar timeouts para ocultar el problema.

---

## REPORTE ALLURE

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

Metadata opcional:
```typescript
import { allure } from "allure-playwright";
await allure.epic("Cotizador");
await allure.feature("Perú — Depósito");
await allure.severity("critical");
```

---

## MODO SWARM

Tres sub-agentes en paralelo. Invocar con _"usa el skill en modo swarm"_.

| Agente | Responsabilidad                                              |
|--------|--------------------------------------------------------------|
| 1      | Happy path por país desde `[PAÍS]_BENEFICIARIES`             |
| 2      | Errores de red (`page.route`) y montos límite                |
| 3      | Variantes: promocodes, beneficiario existente, métodos alt.  |

Reglas: cada agente ejecuta FASE 1 completa antes de escribir · agentes 2 y 3 trabajan en países distintos al del agente 1 · nunca crear spec nuevo si el país ya tiene uno (agregar `describe`).

Al terminar:
```bash
npm run test:quick
npx allure generate allure-results --clean -o allure-report
```

---

## MODO AUDITORÍA

Invocar con _"Audita los tests"_ o _"Revisa [archivo]"_.

**Specs:**

| #   | Criterio                                                                          |
|-----|-----------------------------------------------------------------------------------|
| S1  | Métodos llamados existen en POM con firma exacta                                  |
| S2  | Datos del beneficiario vienen de `tests/data/`                                    |
| S3  | Todo flujo completo verifica `/ZB\d\w+/`                                          |
| S4  | Efectivo → "Vender y Registrar Giro" (salvo excepción)                            |
| S5  | Sin `page.pause()`                                                                |
| S6  | Cada `page.route()` tiene `page.unroute()`                                        |
| S7  | `test.setTimeout` solo en `test()`, no en `describe`                              |
| S8  | Un archivo por país, describes anidados por método                                |
| S9  | Describes y tests en español                                                      |
| S10 | Métodos `expect*` usan `expect()` real                                            |

**POMs:**

| #   | Criterio                                                                          |
|-----|-----------------------------------------------------------------------------------|
| P1  | Orden de locators: getByRole → getByTestId → getByLabel → getByText → css → xpath |
| P2  | Selects vía `this.antSelect.selectByText()`                                       |
| P3  | Modales vía `this.afexModal`                                                      |
| P4  | `waitFor` usa `TEST_TIMEOUTS` (nada hardcodeado)                                  |
| P5  | Métodos async con return type explícito                                           |
| P6  | Locators `private readonly`                                                       |

**Formato de reporte (denso):**
```
peru.spec.ts:    ❌S3 (test "Crear giro BCP")  ⚠️S7
beneficiaryPage: ❌P4  ⚠️P1
Hallazgos: 4 | Críticos: 2 | Advertencias: 2
```

Tras el reporte: preguntar si aplicar correcciones. Primero ❌, luego ⚠️.

---

## REGLAS DE ORO

1. **Reutilizar primero** — consultar catálogo antes de crear
2. **Un spec por país** — describes anidados por método/agente; nunca specs por agente individual
3. **Datos del beneficiario solo desde `tests/data/`**
4. **Ant Design solo vía helpers** — `antSelect.helper` y `afexModal.helper`
5. **Timeouts solo desde `TEST_TIMEOUTS`**
6. **Assertion `/ZB\d\w+/` obligatoria** en todo flujo completo
7. **`getRetryAmount` obligatorio** cuando hay `TEST_AMOUNT`

---

## FORMATO DE RESPUESTA

- **Modo ejecución:** comando + resultado. Sin explicar el catálogo ni el flujo.
- **Modo creación:** aplicar las 4 fases en silencio. Mostrar solo archivos creados/modificados con diff resumido.
- **Modo auditoría:** formato denso de tabla, sin prosa.
- **Fallos:** terminal + screenshot + diagnóstico en 2-3 líneas. No reformular reglas.
- No anunciar lo que se va a hacer — hacerlo.
- No repetir reglas de esta skill en cada respuesta — asumirlas.