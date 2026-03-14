/**
 * Configuração global da aplicação.
 *
 * API (HTTPS): O backend Spring Boot usa HTTPS com certificado (keystore.p12).
 * O arquivo keystore fica APENAS no backend (src/main/resources). O Angular
 * não deve e não tem acesso a esse arquivo — apenas usa a URL HTTPS aqui.
 *
 * Certificado self-signed (desenvolvimento): ao testar, o navegador pode
 * bloquear por "Certificado inválido". Para liberar: com o backend rodando,
 * abra https://localhost:8080/... no Chrome, clique em "Avançado" e em
 * "Ir para localhost (não seguro)". Depois disso o Angular consegue falar
 * com o Java por HTTPS.
 */
export const environment = {
  production: false,
  /** URL base do backend. Use HTTPS quando o backend estiver com SSL (ex.: keystore). */
  apiUrl: 'https://localhost:8443',
  recaptchaSiteKey: '6Ld3jIIsAAAAABndFXtLD84xSp7Terd6A3EMTPDB'
}; 