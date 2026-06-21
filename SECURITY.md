# Security Policy

## Supported Versions

We actively monitor and patch vulnerabilities in the following versions of Carbon Twin AI™:

| Version | Supported |
| ------- | --------- |
| v0.1.x  | ✅ Yes    |
| < v0.1  | ❌ No     |

---

## Reporting a Vulnerability

We take the security of Carbon Twin AI™ seriously. If you find a security vulnerability, please do **not** open a public issue. Instead, report it responsibly by following these steps:

1. **Report Privately**: Please open a Private Vulnerability Report directly through the repository's "Security" tab on GitHub, or contact the repository owner (`maheshmm7`) through their GitHub profile contact details.
2. **Details to include**:
   * Description of the vulnerability and its potential impact.
   * Step-by-step instructions (or a proof-of-concept script) to reproduce the vulnerability.
   * Any active remediation or mitigation steps you recommend.
3. **Response Timeline**: You will receive an acknowledgement of your report within 24–48 hours. We will keep you updated as we work toward resolving the issue.

---

## Security Practices in Carbon Twin AI™

The platform has been engineered with security-first principles to ensure reliability and abuse prevention. Key measures include:

### 1. Secret Management
* **Zero Hardcoded Secrets**: All third-party credentials (such as `GEMINI_API_KEY`) are loaded dynamically through server-side environment variables (`process.env`).
* **Environment Safeguards**: The `.gitignore` file is configured to prevent accidental staging or committing of `.env.local` and similar secret files.

### 2. Abuse Prevention (Rate Limiting)
* **API Protection**: Backend routes (such as `/api/generate-twin` and `/api/carbon-coach`) implement server-side rate limiting per IP address. This prevents DDoS attacks and brute-force exhaustion of our Gemini API quotas.
* **Response Codes**: Clients exceeding request limits receive a standard `429 Too Many Requests` status code with rate-limit headers.

### 3. Client & Header Protections
* **Content Security Policy (CSP)**: Headers restrict the loading of assets and scripts to verified locations, protecting against Cross-Site Scripting (XSS).
* **Clickjacking Protection**: Implements `X-Frame-Options: DENY` to prevent the app from being embedded inside malicious iframe wrappers.
* **Mime Sniffing Protection**: Implements `X-Content-Type-Options: nosniff` to enforce strict browser content-type handling.

### 4. Input & AI Response Validation
* **Zod Schemas**: Every API input and structured AI response (from Gemini calls) is validated using strict Zod schemas to ensure shape correctness and type safety.
* **System Prompt Isolation**: Custom prompt templates isolate system instructions from user inputs, reducing the risk of prompt injection or system override.
