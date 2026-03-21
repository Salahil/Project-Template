/**
 * Build de produção: aponta direto para a API (sem proxy do `ng serve`).
 * Ajuste `apiUrl` para o host real do LogApi.
 */
export const environment = {
  production: true,
  apiUrl: 'https://localhost:8443',
  apiPathPrefixes: [] as readonly string[],
  recaptchaSiteKey: '6Ld3jIIsAAAAABndFXtLD84xSp7Terd6A3EMTPDB'
};
