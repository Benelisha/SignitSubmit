/**
 * These are configuration settings for the dev environment.
 *
 * Do not include API secrets in this file or anywhere in your JS.
 *
 * https://reactnative.dev/docs/security#storing-sensitive-info
 */
export default {
  API_URL: "https://api.rss2json.com/v1/",
  // NOTE: This is intentionally client-side for this prototype and is not secure for production.
  GEMINI_API_KEY: "AIzaSyCk8_uc6dHYvXbdnNnPB4G3uSFp85uY0NY",
  GEMINI_BASE_URL: "https://generativelanguage.googleapis.com/v1beta/",
  GEMINI_MODEL: "gemini-2.5-flash",
}
