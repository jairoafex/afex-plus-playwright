---
name: playwright-tester-pom
description: >
  Automatización de pruebas UI con Playwright + POM sobre AFEX Plus.
  Usar cuando: ejecutar tests existentes, crear tests nuevos, extender POMs, generar reportes Allure.
  NO usar para: unit tests, pruebas de API puras, proyectos sin Playwright.
---

# Playwright Tester — POM + Allure (AFEX)

---

## FLUJO DE DECISIÓN — Leer primero

```
¿El flujo pedido ya está en el CATÁLOGO?
  ├─ SÍ → MODO EJECUCIÓN  (no crear nada — solo correr o ajustar parámetros)
  └─ NO → FASE 1 → 2 → 3 → 4
```

**Reutilización tiene prioridad absoluta.** Consultar el catálogo antes de escribir una línea de test.

---

## CATÁLOGO DE TESTS

### Perú — `tests/ui/specs/peru.spec.ts`

| ID | Agente | Método | Moneda / tipo | Grep para filtrar |
|----|--------|--------|---------------|-------------------|
| P1 | Banco De Credito BCP | Efectivo | USD — enviar | `"BCP"` |
| P2 | Yape | Wallet / Depósito | PEN — recibir | `"Yape"` |

### Europa Terrapay — `tests/ui/specs/terrapay-europe.spec.ts`

Países disponibles: **Alemania · Bélgica · Rumania · Chipre · Finlandia · Hungría · Holanda · Irlanda · Francia · Estonia · Bulgaria**

| ID | Escenario | Moneda default | Grep para filtrar |
|----|-----------|----------------|-------------------|
| E1 | Terrapay Depósito — Enviar USD | 150 USD | `"[País].*enviar"` |
| E2 | Terrapay Depósito — Recibir EUR | 100 EUR | `"[País].*recibir"` |

> Hungría usa HUF como moneda local — el test E2 selecciona EUR explícitamente.

### SEPA EUR Validación — `tests/ui/specs/sepa-eur-validation.spec.ts`

Países cubiertos: **Dinamarca · Eslovenia · Eslovaquia · Letonia · Lituania · Estonia · Portugal · Grecia · Italia · Malta**

| ID | Escenario | Moneda default | Grep para filtrar |
|----|-----------|----------------|-------------------|
| SEV1 | Validar EUR en Monto a Recibir + cotización Terrapay Depósito | 120–200 EUR aleatorio | `"[País].*EUR"` |

> Tests de cotización pura (sin flujo completo de giro). Seleccionan EUR explícitamente en el selector "Monto a Recibir" (el país puede tener su moneda nativa como DKK) y validan que quedó EUR seleccionado + que existe al menos una cotización Terrapay Depósito.
> Ejecutar con `npm run test:sepa-eur` para correr 3 países simultáneamente + notificación Slack.

> `feelookup.spec.ts` está excluido del runner (`testIgnore` en playwright.config.ts). Solo ejecutar manualmente con `--grep`.

---

## MODO EJECUCIÓN — Reutilizar test existente

### Sin personalización (montos por defecto)

```bash
# Un país de Europa
npx playwright test --grep "Alemania" --project=chromium --reporter=line 2>&1

# Solo envío en USD para Alemania
npx playwright test --grep "Alemania.*enviar" --project=chromium --reporter=line 2>&1

# Test de Perú BCP o Yape
npx playwright test --grep "BCP" --project=chromium --reporter=line 2>&1

# Todos los tests de un spec
npm run test:quick -- tests/ui/specs/peru.spec.ts
```

### Con monto personalizado (`TEST_AMOUNT`)

```bash
# Alemania con 25 USD exactos
TEST_AMOUNT=25 npx playwright test --grep "Alemania.*enviar" --project=chromium --reporter=line 2>&1

# Yape con 80 PEN exactos
TEST_AMOUNT=80 npx playwright test --grep "Yape" --project=chromium --reporter=line 2>&1
```

### Con país específico (`TEST_COUNTRY`)

```bash
# Solo Alemania del suite Europa
TEST_COUNTRY=Alemania npm run test:quick -- tests/ui/specs/terrapay-europe.spec.ts

# Francia con monto personalizado
TEST_COUNTRY=Francia TEST_AMOUNT=50 npm run test:quick -- tests/ui/specs/terrapay-europe.spec.ts
```

### Scripts npm disponibles

| Script | Qué hace |
|--------|----------|
| `npm run test:quick` | Chromium, line reporter, sin Allure ni Slack — iteración rápida |
| `npm run test:notify` | Chromium + Allure + Slack |
| `npm run test:full` | 3 browsers + Allure + Slack |
| `npm run report:serve` | Sirve `allure-report/` en `:4040` |

> `allure-results/` se limpia automáticamente en cada ejecución (`cleanResultsFolder: true` en config).

> Workers local: por defecto ½ núcleos CPU. Para tests E2E pesados usar `--workers=2` para no saturar.

---

## CONTEXTO DE LA APP

```yaml
app:
  nombre: "AFEX Plus"
  base_url: "http://localhost:3000"   # también en .env como BASE_URL
  login: "bypaseado — sin autenticación"
  modulo_unico: "Cotizar un envío"
  flujo_completo: "cotizar → agente → beneficiario → resumen → recaudar → código ZB"

etapas:
  1_cotizador:
    pais_destino: "select Ant Design (obligatorio)"
    metodo_entrega:
      Efectivo: "requiere ciudad"
      Depósito: "engloba Wallet + PIX + ATM — no requiere ciudad"
      Todos: "ciudad opcional (default: capital)"
    monto: "Enviar (USD/CLP) o Recibir (moneda destino)"
    cliente: "buscar por nombre → seleccionar → click 'No presencial'"
    accion: "click 'Buscar' para lanzar cotizaciones"

  2_tabla_cotizaciones:
    nota: "tabla paginada — buscar agente en TODAS las páginas"
    accion: "seleccionar con radio button → click 'Siguiente'"

  3_beneficiario:
    nuevo: "formulario variable según agente/destino/método"
    existente: "puede requerir actualizar campos"
    accion: "click 'Continuar'"

  4_resumen:
    accion: "verificar montos y destino → click 'Continuar'"

  5_recaudacion:
    default: "Efectivo → 'Vender y Registrar Giro' (convierte USD a CLP)"
    flujo: "click 'Recaudar' → modal DTE → esperar → modal éxito → 'Entendido'"
    error_dte: "click aceptar; si repite, cerrar y continuar"
    ASSERTION_OBLIGATORIA: "código giro formato /ZB\\d\\w+/"

datos_de_prueba:
  cliente: "Diana Paez → 'No presencial'"   # CLIENT_NAME en peru.data.ts

  paises_destino:
    - { pais: "Perú",      moneda: "PEN", ciudad_default: "Lima" }
    - { pais: "Colombia",  moneda: "COP", ciudad_default: "Bogotá" }
    - { pais: "Bolivia",   moneda: "BOB", ciudad_default: "La Paz" }
    - { pais: "Ecuador",   moneda: "USD", ciudad_default: "Quito" }
    - { pais: "Argentina", moneda: "ARS", ciudad_default: "Buenos Aires" }
    - { pais: "Brasil",    moneda: "BRL", ciudad_default: "São Paulo" }
    - { pais: "Alemania",  moneda: "EUR", zona: "SEPA" }
    - { pais: "Bélgica",   moneda: "EUR", zona: "SEPA" }
    - { pais: "Francia",   moneda: "EUR", zona: "SEPA" }
    - { pais: "Rumania",   moneda: "RON", zona: "SEPA" }
    - { pais: "Chipre",    moneda: "EUR", zona: "SEPA" }
    - { pais: "Finlandia", moneda: "EUR", zona: "SEPA" }
    - { pais: "Hungría",   moneda: "HUF", zona: "SEPA", nota: "seleccionar EUR explícitamente en test E2" }
    - { pais: "Holanda",   moneda: "EUR", zona: "SEPA" }
    - { pais: "Irlanda",   moneda: "EUR", zona: "SEPA" }
    - { pais: "Estonia",    moneda: "EUR", zona: "SEPA" }
    - { pais: "Bulgaria",  moneda: "BGN", zona: "SEPA" }
    - { pais: "Dinamarca", moneda: "DKK", zona: "SEPA", nota: "moneda nativa DKK — test selecciona EUR explícitamente" }
    - { pais: "Eslovenia", moneda: "EUR", zona: "SEPA" }
    - { pais: "Eslovaquia",moneda: "EUR", zona: "SEPA" }
    - { pais: "Letonia",   moneda: "EUR", zona: "SEPA" }
    - { pais: "Lituania",  moneda: "EUR", zona: "SEPA" }
    - { pais: "Portugal",  moneda: "EUR", zona: "SEPA" }
    - { pais: "Grecia",    moneda: "EUR", zona: "SEPA" }
    - { pais: "Italia",    moneda: "EUR", zona: "SEPA" }
    - { pais: "Malta",     moneda: "EUR", zona: "SEPA" }

  monedas_envio:
    USD: [20, 200]        # Monto a enviar
    CLP: [12000, 100000]  # Monto a enviar
    PEN: [80, 500]        # Monto a recibir
    ARS: [50000, 150000]  # Monto a recibir
    BRL: [580, 900]       # Monto a recibir
    COP: [250000, 350000] # Monto a recibir
    BOB: [120, 200]       # Monto a recibir
    EUR: [120, 200]       # Monto a recibir

  promocodes: ["GIROCLUB2", "TARIFACERO"]

datos_beneficiario_por_agente:
  Peru:
    - agente: "Banco De Credito Bcp"
      metodo: "Efectivo"
      data:
        nombres: "Goku Supersayayin God"

    - agente: "Yape"
      metodo: "Wallet"
      data:
        nombres: "Jose Llontop Vite"
        wallet: "51902292319"
        proposito_transaccion: "Test automatizado"

  Colombia:
    - agente: "Terrapay"
      metodo: "Depósito"
      data:
        nombres: "JORGE LOPEZ"
        tipo_identificacion: "Cedula de Ciudadania"
        numero_identificacion: "79940632"
        telefono: "573157441380"
        banco: "Bancolombia"
        proposito_transaccion: "Regalo"
        origen_fondos: "Salario"
        relacion_beneficiario: "Madre"

  Europa_SEPA:
    nota: "Datos completos en tests/data/terrapay-europe.data.ts — EU_BENEFICIARIES"
    campos_comunes: [nombres, apellido, iban, banco, relacion, origen_fondos, proposito]
    paises_con_datos: [Alemania, Bélgica, Rumania, Chipre, Finlandia, Hungría, Holanda, Irlanda, Francia, Estonia, Bulgaria]
    paises_sepa_eur_validacion: [Dinamarca, Eslovenia, Eslovaquia, Letonia, Lituania, Estonia, Portugal, Grecia, Italia, Malta]
```

---

## ESTRUCTURA DEL PROYECTO

```
tests/
  ui/
    page/                           ← POMs — leer SIEMPRE antes de escribir specs
      feelookupPage.ts              — cotizador, tabla de agentes
      beneficiaryPage.ts            — formulario y selección de beneficiario
      transferCollectionPage.ts     — recaudación
      transferDetailsPage.ts        — código de giro
    specs/
      peru.spec.ts                  ← P1, P2
      terrapay-europe.spec.ts       ← E1, E2 × 11 países (for...of sobre EU_BENEFICIARIES)
      feelookup.spec.ts             ← IGNORADO en config (testIgnore) — solo debug manual
  data/
    peru.data.ts                    ← CLIENT_NAME, PERU_BENEFICIARIES
    terrapay-europe.data.ts         ← EU_BENEFICIARIES (11 países SEPA)
    api.data.ts
  types/
    beneficiary.types.ts
    feelookup.types.ts
utils/
  constants/timeouts.ts             ← TEST_TIMEOUTS — SIEMPRE importar desde aquí
  helpers/
    antSelect.helper.ts             ← selects Ant Design
    afexModal.helper.ts             ← modales AFEX
```

> **Regla de datos:** Todo dato de beneficiario vive en `tests/data/`. Nunca strings hardcodeados en specs.
> `CLIENT_NAME` está en `peru.data.ts`. Importarlo siempre desde ahí.

---

## FASE 1: RECONOCIMIENTO (solo para tests nuevos)

> Solo ejecutar si el flujo **no** está en el catálogo.

```bash
# Leer POMs — registrar firma exacta de cada método público
cat tests/ui/page/feelookupPage.ts
cat tests/ui/page/beneficiaryPage.ts
cat tests/ui/page/transferCollectionPage.ts
cat tests/ui/page/transferDetailsPage.ts

# Verificar cobertura existente
ls tests/ui/specs/

# Leer helpers y timeouts
cat utils/helpers/antSelect.helper.ts
cat utils/helpers/afexModal.helper.ts
cat utils/constants/timeouts.ts
```

**Regla absoluta:** Verificar la firma exacta de cada método antes de usarlo. Nunca asumir nombres.
Si el método necesario no existe en el POM, crearlo antes de usarlo en el spec.

---

## FASE 2: DISEÑO DE PAGE OBJECTS

Verificar si el POM existe antes de crearlo. Extender antes de crear.

**Cuándo extender:** el POM existe pero faltan locators o métodos para el nuevo test.
**Cuándo crear:** la pantalla no tiene POM existente.

**Plantilla POM** (`tests/ui/page/`):

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
    // Orden de locators: getByRole → getByTestId → getByLabel → getByText → css → xpath
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

**Ant Design:**
- Selects: `this.antSelect.selectByText(valor)` — nunca interactuar directamente
- Modales: métodos de `this.afexModal`
- Tablas: `div.ant-table-content tbody.ant-table-tbody`
- Radios: click con `label.ant-radio-wrapper`, verificar con `input.ant-radio-input`

---

## FASE 3: ESCRITURA DE SPECS

**Estructura obligatoria** (`tests/ui/specs/[pais].spec.ts`):

```typescript
import { test } from "@playwright/test";
import { FeelookupPage } from "../page/feelookupPage";
import { BeneficiaryPage } from "../page/beneficiaryPage";
import { TransferCollectionPage } from "../page/transferCollectionPage";
import { TransferDetailsPage } from "../page/transferDetailsPage";
import { AfexModalHelper } from "../../../utils/helpers/afexModal.helper";
import { CLIENT_NAME } from "../../data/[pais].data";
import { getRetryAmount } from "../../../utils/helpers/retryAmount.helper";

const GIRO_CODE_PATTERN = /ZB\d\w+/;
const TEST_AMOUNT = process.env.TEST_AMOUNT;  // override de monto por CLI

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

      // Etapa 1 — Cotizador
      // ...
      amount
        ? await feelookupPage.typeAmountToSend(amount)   // USD/CLP
        : await feelookupPage.typeRandomAmount("USD");

      // Etapas 2, 3, 4, 5 — ver specs existentes como referencia

      // ASSERTION OBLIGATORIA
      await transferDetailsPage.expectGiroCode(GIRO_CODE_PATTERN);
    });
  });
});
```

**Interceptación de red:**

```typescript
await page.route("**/v1/remittance/create", async (route) => {
  const body = route.request().postDataJSON();
  const response = await route.fetch({ postData: JSON.stringify({ ...body, campo: "XX" }) });
  await route.fulfill({ response });
});
// Limpiar SIEMPRE al final del test:
await page.unroute("**/v1/remittance/create");
```

**Convenciones:**
- Archivo: `tests/ui/specs/[pais].spec.ts` — un archivo por país
- `test.describe` externo: `"Perú — envíos"`
- `test.describe` interno: el método — `"Efectivo"`, `"Depósito / Wallet"`
- `test`: acción + agente + condición en español
- `test.setTimeout` solo dentro de `test()` individual, nunca en `test.describe`
- Cuando el mismo flujo aplica a múltiples datasets: `for...of Object.entries()` — ver `terrapay-europe.spec.ts`

---

## FASE 4: EJECUCIÓN

```bash
# Iteración rápida — sin Allure ni Slack
npm run test:quick

# Spec específico
npm run test:quick -- tests/ui/specs/peru.spec.ts

# Filtrar por nombre / agente / país
npx playwright test --grep "Yape" --project=chromium --reporter=line 2>&1

# Con parámetros de monto y país
TEST_AMOUNT=25 TEST_COUNTRY=Alemania npm run test:quick -- tests/ui/specs/terrapay-europe.spec.ts

# Workers explícitos (recomendado para E2E pesados en local)
npx playwright test --project=chromium --workers=2 --reporter=line 2>&1

# Todos los browsers (pre-merge o CI)
npm run test:full
```

---

## FIX LOOP — máx. 3 intentos

1. **Leer output** del terminal
2. **Leer screenshot** en `test-results/` — estado visual real de la UI al fallar

| Tipo | Síntoma | Acción |
|------|---------|--------|
| Método inexistente | `TypeError: page.x is not a function` | Leer POM, usar nombre correcto o crear método |
| Selector incorrecto | Timeout en locator | Corregir locator en POM |
| Bug de app | Comportamiento roto en UI | Documentar y reportar al usuario |
| Timing | Elemento no disponible | `waitFor` con `TEST_TIMEOUTS` |
| Ant Design | Select/modal no responde | Verificar que se usa el helper correcto |

```typescript
await this.miElemento.waitFor({ state: "attached", timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED });
```

### Variación de monto en reintentos

Cuando el test usa un monto específico (`TEST_AMOUNT`), cada reintento automático usa un valor ligeramente distinto para evitar fallar con el mismo número exacto:

| Intento | Monto aplicado |
|---------|----------------|
| 0 — primera ejecución | `TEST_AMOUNT` exacto |
| 1 — retry 1 | `TEST_AMOUNT + 2` (por encima) |
| 2 — retry 2 | `TEST_AMOUNT - 1` (por debajo) |

Esto está implementado en `utils/helpers/retryAmount.helper.ts` via `getRetryAmount(base, testInfo.retry)`.
Todo spec nuevo que acepte `TEST_AMOUNT` **debe** usar este helper — nunca usar el env var directamente en `typeAmountToSend/Receive`.

Plantilla obligatoria en specs con monto:
```typescript
test("...", async ({}, testInfo) => {
  const amount = getRetryAmount(TEST_AMOUNT, testInfo.retry);
  // ...
  amount
    ? await feelookupPage.typeAmountToSend(amount)
    : await feelookupPage.typeRandomAmount("USD");
});
```

**Si falla tras 3 intentos:** detener, reportar error exacto (expected vs actual + screenshot), pedir orientación. No aumentar timeouts para ocultar el problema.

---

## REPORTE ALLURE

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

Metadata opcional para navegación:

```typescript
import { allure } from "allure-playwright";
await allure.epic("Cotizador");
await allure.feature("Perú — Depósito");
await allure.severity("critical");
```

---

## MODO SWARM

Para cobertura amplia simultánea, lanzar 3 sub-agentes en paralelo:

| Agente | Responsabilidad | Archivo destino |
|--------|----------------|-----------------|
| **Agente 1** | Happy Path por país — datos de `EU_BENEFICIARIES` / `PERU_BENEFICIARIES` | `terrapay-europe.spec.ts`, `peru.spec.ts` |
| **Agente 2** | Errores de red (`page.route`) y montos límite | spec del país asignado |
| **Agente 3** | Variantes: promocodes, beneficiario existente, métodos alternativos | spec del país asignado |

**Coordinación:**
- Cada agente ejecuta Fase 1 completa antes de escribir
- Agentes 2 y 3 trabajan en países distintos al que tiene Agente 1 activo
- No crear nuevos specs si el país ya tiene uno — agregar `test.describe` dentro del existente

**Al terminar:**
```bash
npm run test:quick
npx allure generate allure-results --clean -o allure-report
```

Invocar con: _"usa el skill en modo swarm"_ o _"prueba desde múltiples ángulos"_.

---

## MODO AUDITORÍA

Revisión de calidad sobre specs y POMs sin correr tests.

**Invocar con:** _"Audita los tests"_, _"Revisa peru.spec.ts"_, _"Audita todos los POMs"_

### Specs

| # | Criterio | Qué verificar |
|---|----------|---------------|
| S1 | Métodos válidos | Cada método llamado existe en el POM con firma exacta |
| S2 | Datos del beneficiario | Vienen de `tests/data/` — nunca inventados ni hardcodeados |
| S3 | Assertion ZB | Todo flujo completo verifica `/ZB\d\w+/` |
| S4 | Recaudación correcta | Efectivo → Vender y Registrar Giro (salvo indicación explícita) |
| S5 | Sin page.pause() | No hay llamadas de debug |
| S6 | Limpieza de rutas | Cada `page.route()` tiene su `page.unroute()` |
| S7 | setTimeout correcto | No hay `test.setTimeout` a nivel de `test.describe` |
| S8 | Agrupación correcta | Por país en un archivo, por método en describes anidados |
| S9 | Idioma | Describes y tests en español |
| S10 | Assertions reales | Métodos `expect*` usan `expect()` — no solo retornan boolean sin assertar |

### POMs

| # | Criterio | Qué verificar |
|---|----------|---------------|
| P1 | Orden de locators | getByRole → getByTestId → getByLabel → getByText → css → xpath |
| P2 | Selects delegados | Toda interacción con select usa `this.antSelect.selectByText()` |
| P3 | Modales delegados | Toda interacción con modal usa `this.afexModal` |
| P4 | Timeouts con constante | Todo `waitFor` usa `TEST_TIMEOUTS` — ningún número hardcodeado |
| P5 | Return types explícitos | Métodos async tienen tipo de retorno declarado |
| P6 | Locators privados | Todos los locators como `private readonly` |

### Formato del reporte

```
## Reporte de Auditoría

### [archivo]
✅ S1 — Métodos válidos
❌ S3 — Assertion /ZB\d\w+/ ausente en test "Crear giro BCP"
⚠️ S7 — test.setTimeout a nivel de describe — mover a cada test individual

Hallazgos: 2  |  Críticos: 1  |  Advertencias: 1
```

Tras el reporte, preguntar si aplicar correcciones. Primero los ❌, luego los ⚠️.

---

## REGLAS DE ORO

1. **Reutilizar primero** — consultar el catálogo antes de crear cualquier test
2. **Leer el contexto PRIMERO** — antes de abrir cualquier archivo del proyecto
3. **Verificar firma del método** — nunca asumir nombres, leer el POM
4. **Ant Design necesita sus helpers** — nunca replicar lógica de `antSelect` o `afexModal`
5. **Timeouts solo desde `TEST_TIMEOUTS`** — nunca un número hardcodeado
6. **Datos del beneficiario desde `tests/data/`** — nunca inventar ni hardcodear en specs
7. **Assertion `/ZB\d\w+/` obligatoria** — el flujo no está completo sin verificar el código
8. **Recaudación por defecto: Efectivo → Vender y Registrar Giro**
9. **Un archivo spec por país** — agrupar con `test.describe` anidados por método
10. **`test.setTimeout` solo dentro de `test()` individual** — nunca en `test.describe`
11. **`page.pause()` es debug** — nunca en código a commitear
12. **`page.unroute()` después de `page.route()`** — siempre limpiar interceptaciones
13. **Tests en español** — convención del proyecto
14. **Al fallar: leer screenshot + terminal** — diagnosticar con ambas fuentes antes de corregir
15. **`getRetryAmount` obligatorio en specs con monto** — nunca usar `TEST_AMOUNT` directo en `typeAmount*`; pasar siempre por `getRetryAmount(TEST_AMOUNT, testInfo.retry)` para que los reintentos usen un valor distinto
