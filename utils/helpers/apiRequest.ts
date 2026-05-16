import { request } from "@playwright/test";

/**
 * Crea un contexto de API de Playwright preconfigurado con autenticación Bearer
 * y cabecera `Content-Type: application/json`.
 *
 * @param baseURL - URL base para todas las peticiones del contexto (ej. `https://api.afex.com`).
 * @example
 * const api = await createApiContext(process.env.BASE_URL!);
 * const response = await api.get('/v1/fees');
 * await api.dispose();
 */
export async function createApiContext(baseURL: string, token?: string) {
  return await request.newContext({
    baseURL,
    extraHTTPHeaders: {
      Authorization: `Bearer ${token ?? process.env.API_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
}
