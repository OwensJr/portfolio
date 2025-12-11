// Facebook config removed for security.
// If you later want to re-enable server-side sync, store tokens on the server or in CI/CD secrets.
// This file intentionally contains no secrets.
const FACEBOOK_CONFIG = {
    enabled: false
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FACEBOOK_CONFIG;
}
