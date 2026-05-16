# Slack Notifier — AFEX Playwright

> Documentación de la integración de notificaciones Slack con reporte Allure en red local.
> Leer este archivo solo cuando necesites implementar, modificar o solucionar la integración.
> No es necesario cargarlo en conversaciones de testing cotidianas.

---

## Archivos de la integración

```
utils/
  helpers/
    slackNotifier.helper.ts   ← envía el resumen a Slack
    localIp.helper.ts         ← detecta la IP local de la máquina
scripts/
  notify-slack.ts             ← orquesta todo post-ejecución
.env
  SLACK_WEBHOOK_URL=          ← URL del Incoming Webhook de Slack
  REPORT_PORT=4040            ← puerto donde se sirve el reporte
```

---

## Scripts disponibles

```bash
# Correr tests en chromium + generar reporte + notificar Slack
npm run test:notify

# Correr tests en todos los browsers + generar reporte + notificar Slack
npm run test:full

# Solo servir el reporte Allure en red local (sin correr tests)
npm run report:serve
```

---

## Flujo completo al ejecutar test:notify

```
1. Playwright corre los tests → genera test-results/results.json
2. Allure genera el reporte   → genera allure-report/
3. notify-slack.ts            → lee results.json
                              → detecta IP local (ej: 192.168.1.45)
                              → construye reportUrl: http://192.168.1.45:4040
                              → envía resumen a Slack
4. report:serve               → sirve allure-report/ en el puerto 4040
```

---

## Mensaje que llega a Slack

```
AFEX Plus — Reporte de Tests ❌ HAY FALLOS

✅ Pasaron   8     ❌ Fallaron  2
⏭ Omitidos  0     📊 Total    10
⏱ Duración  47s

• Crear giro Yape con 100 PEN nuevo beneficiario
  Error: locator.click timeout exceeded
• Terrapay Colombia Depósito
  Error: Destination country inactive

📊 Ver reporte completo → http://192.168.1.45:4040
```

---

## Prerequisitos

```bash
# Instalar serve como devDependency
npm install -D serve

# Crear el webhook en Slack:
# Slack → Ajustes → Aplicaciones → Incoming Webhooks → Agregar
# Seleccionar canal → copiar URL → pegar en .env como SLACK_WEBHOOK_URL
```

---

## Notas

- La URL del reporte funciona para cualquier persona en la **misma red local**
- El reporte permanece disponible mientras `report:serve` esté corriendo
- Si la máquina cambia de red la IP cambia — relanzar `test:notify`
- `SLACK_WEBHOOK_URL` nunca debe commitearse — agregar a `.gitignore`
- Sin dependencias externas — usa solo módulos nativos de Node.js (https, os, fs)
- No consume tokens — corre de forma nativa en la máquina después de que Playwright termina
