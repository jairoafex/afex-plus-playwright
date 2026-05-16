import * as fs from "fs";
import * as path from "path";
import { notifySlack, TestSummary } from "../utils/helpers/slackNotifier.helper";
import { getLocalIp } from "../utils/helpers/localIp.helper";

interface PlaywrightTestResult {
  error?: { message: string };
}

interface PlaywrightTest {
  results: PlaywrightTestResult[];
}

interface PlaywrightSpec {
  title: string;
  ok: boolean;
  tests: PlaywrightTest[];
}

interface PlaywrightSuite {
  title: string;
  specs?: PlaywrightSpec[];
  suites?: PlaywrightSuite[];
}

interface PlaywrightJsonReport {
  stats: {
    expected: number;
    unexpected: number;
    skipped: number;
    duration: number;
  };
  suites: PlaywrightSuite[];
}

function collectFailures(
  suites: PlaywrightSuite[],
  failures: Array<{ name: string; error: string }>
): void {
  for (const suite of suites) {
    if (suite.specs) {
      for (const spec of suite.specs) {
        if (!spec.ok) {
          const firstResult = spec.tests?.[0]?.results?.[0];
          const errorMessage =
            firstResult?.error?.message?.split("\n")[0] ?? "Error desconocido";
          failures.push({ name: spec.title, error: errorMessage });
        }
      }
    }
    if (suite.suites) {
      collectFailures(suite.suites, failures);
    }
  }
}

async function main(): Promise<void> {
  try {
    const resultsPath = path.resolve("test-results", "results.json");

    if (!fs.existsSync(resultsPath)) {
      throw new Error(
        `No se encontró el archivo de resultados en: ${resultsPath}\n` +
          "Asegúrate de que Playwright generó el reporte JSON antes de ejecutar este script."
      );
    }

    const raw = fs.readFileSync(resultsPath, "utf-8");
    const report: PlaywrightJsonReport = JSON.parse(raw);

    const { expected, unexpected, skipped, duration } = report.stats;
    const total = expected + unexpected + skipped;
    const durationSeconds = Math.round(duration / 1000);

    const failures: Array<{ name: string; error: string }> = [];
    collectFailures(report.suites, failures);

    const ip = getLocalIp();
    const port = process.env.REPORT_PORT ?? "4040";
    const reportUrl = `http://${ip}:${port}`;

    const summary: TestSummary = {
      passed: expected,
      failed: unexpected,
      skipped,
      total,
      duration: durationSeconds,
      failures,
      reportUrl,
    };

    await notifySlack(summary);
    console.log(`✅ Slack notificado — reporte en ${reportUrl}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`❌ Error al enviar notificación Slack: ${message}`);
  }
}

main();
