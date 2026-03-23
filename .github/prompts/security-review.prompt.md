---
name: 'security-review'
description: 'Analyze code for security vulnerabilities including XSS, injection, CORS, and auth issues'
mode: 'ask'
---

# Security Review

Analyze the selected code (or workspace) for security vulnerabilities.

## Review Categories

### 1. Cross-Site Scripting (XSS)
- Check React components for `dangerouslySetInnerHTML`
- Verify user input is not rendered directly without sanitization
- Check for URL-based XSS (query params rendered in UI)

### 2. Injection Attacks
- Review API routes for command injection risks
- Check for unsanitized user input in file paths or shell commands
- Verify parameterized queries if database access is added

### 3. CORS Configuration
- Review `cors()` middleware settings in `api/src/index.ts`
- Check for overly permissive origins (`*`)
- Verify allowed methods and headers are restrictive

### 4. Authentication & Authorization
- Check if admin routes are protected
- Review AuthContext for proper session management
- Verify no sensitive data in localStorage without encryption
- Check for missing auth checks on mutating endpoints (POST/PUT/DELETE)

### 5. Security Headers
- Check for missing headers: Content-Security-Policy, X-Frame-Options, etc.
- Verify helmet.js or equivalent is configured
- Check for exposed server information

### 6. Secrets & Configuration
- Scan for hardcoded API keys, tokens, or passwords
- Verify environment variables used for sensitive config
- Check `.gitignore` includes `.env` files

### 7. Dependencies
- Check for known vulnerabilities (`npm audit`)
- Verify no unused or outdated dependencies

## Output Format
Organize findings by severity:

| Severity | Finding | Location | Fix |
|----------|---------|----------|-----|
| Critical | ... | ... | ... |
| High | ... | ... | ... |
| Medium | ... | ... | ... |
| Low | ... | ... | ... |
