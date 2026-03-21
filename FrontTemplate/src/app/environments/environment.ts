/**
 * Desenvolvimento (`ng serve` + `proxy.conf.json`):
 * - No browser as URLs são `/api/auth/...` e `/api/usuarios/...` (prefixo só no front).
 * - O proxy remove `/api` e encaminha para `https://localhost:8443/auth/...` (igual ao LogApi).
 *
 * Esse prefixo evita 404 no Vite (Angular 21): rotas diretas `/auth` nem sempre são proxadas.
 *
 * Produção: `environment.prod.ts` usa `apiUrl` absoluto, sem `/api`.
 */
export const environment = {
  production: false,
  apiUrl: '/api',
  apiPathPrefixes: ['/api'] as const,
  recaptchaSiteKey: '6Ld3jIIsAAAAABndFXtLD84xSp7Terd6A3EMTPDB'
};
