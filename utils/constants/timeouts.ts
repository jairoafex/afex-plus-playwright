/**
 * Configuración centralizada de timeouts para evitar flaky tests
 * 
 * IMPORTANTE: CUCUMBER_STEP siempre debe ser el timeout más alto para evitar que
 * las operaciones internas lo excedan
 */

export const TEST_TIMEOUTS = {
  // Esperas cortas para elementos que deberían estar disponibles rápido
  ELEMENT_VISIBLE: 45_000,          // 45s - Elemento debería estar visible
  ELEMENT_ATTACHED: 5_000,          // 5s - Elemento debería estar en el DOM
  
  // Esperas medianas para operaciones normales
  NORMAL_OPERATION: 15_000,         // 15s - Operación normal (click, fill, etc)
  NAVIGATION: 15_000,               // 15s - Navegación entre páginas
  
  // Esperas largas para operaciones de carga/backend (siempre menores que CUCUMBER_STEP)
  LOADING_SPINNER: 25_000,          // 25s - Esperar a que desaparezca un spinner
  API_RESPONSE: 28_000,             // 28s - Respuesta de API
  MODAL_OPERATION: 28_000,          // 28s - Modal con operaciones de backend
  
  // Default timeout para steps de Cucumber (SIEMPRE el más alto)
  CUCUMBER_STEP: 45_000,            // 45s - Default para cada step
  
  // Retry intervals
  RETRY_INTERVAL: 1_000,            // 1s - Intervalo entre reintentos
} as const;

export const WAIT_FOR_OPTIONS = {
  visible: { state: 'visible' as const, timeout: TEST_TIMEOUTS.ELEMENT_VISIBLE },
  attached: { state: 'attached' as const, timeout: TEST_TIMEOUTS.ELEMENT_ATTACHED },
  hidden: { state: 'hidden' as const, timeout: TEST_TIMEOUTS.LOADING_SPINNER },
  detached: { state: 'detached' as const, timeout: TEST_TIMEOUTS.NORMAL_OPERATION },
} as const;
