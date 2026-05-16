import * as https from "https";

export interface TestSummary {
  passed: number;
  failed: number;
  skipped: number;
  total: number;
  duration: number;
  failures: Array<{ name: string; error: string }>;
  reportUrl: string;
}

export async function notifySlack(summary: TestSummary): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error(
      "SLACK_WEBHOOK_URL no está definida en las variables de entorno. " +
        "Agrégala en el archivo .env: SLACK_WEBHOOK_URL=https://hooks.slack.com/services/..."
    );
  }

  const allPassed = summary.failed === 0;
  const color = allPassed ? "#36a64f" : "#cc0000";
  const title = allPassed
    ? "AFEX Plus — Reporte de Tests ✅ TODOS PASARON"
    : "AFEX Plus — Reporte de Tests ❌ HAY FALLOS";

  const minutes = Math.floor(summary.duration / 60);
  const seconds = summary.duration % 60;
  const durationText =
    minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const failuresText =
    summary.failures.length > 0
      ? summary.failures
          .map((f) => `• *${f.name}*\n  \`${f.error}\``)
          .join("\n")
      : "";

  const payload = {
    attachments: [
      {
        color,
        title,
        fields: [
          { title: "✅ Pasaron", value: String(summary.passed), short: true },
          { title: "❌ Fallaron", value: String(summary.failed), short: true },
          { title: "⏭ Omitidos", value: String(summary.skipped), short: true },
          { title: "📋 Total", value: String(summary.total), short: true },
          { title: "⏱ Duración", value: durationText, short: true },
        ],
        ...(failuresText ? { text: failuresText } : {}),
        actions: [
          {
            type: "button",
            text: "📊 Ver reporte completo",
            url: summary.reportUrl,
          },
        ],
        footer: "AFEX Playwright",
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  const body = JSON.stringify(payload);

  await new Promise<void>((resolve, reject) => {
    const url = new URL(webhookUrl);
    const options: https.RequestOptions = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk: Buffer) => {
        data += chunk.toString();
      });
      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(
            new Error(
              `Slack respondió con status ${res.statusCode}: ${data}`
            )
          );
        }
      });
    });

    req.on("error", (err: Error) => {
      reject(new Error(`Error de red al enviar notificación Slack: ${err.message}`));
    });

    req.write(body);
    req.end();
  });
}
