# Security Policy

## Reporting Security Vulnerabilities

We take security seriously. If you discover a security vulnerability, please follow these steps:

1. **DO NOT** create a public GitHub issue
2. Email security@yourdomain.com with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide a detailed response within 5 business days.

## Security Measures

### Authentication
- OAuth 2.0 via Supabase Auth
- JWT tokens with secure storage
- Social login providers (Google, GitHub, Discord)

### Data Protection
- Row Level Security (RLS) on all database tables
- Environment variables for sensitive data
- No client-side exposure of API keys

### API Security
- Rate limiting (50 requests/hour per IP)
- Input validation and sanitization
- CORS properly configured

### Infrastructure
- HTTPS enforced
- Security headers implemented
- Regular dependency updates
- Error tracking with Sentry

## Responsible Disclosure

We follow responsible disclosure practices:
- Security researchers are given credit (unless they prefer anonymity)
- We aim to fix vulnerabilities within 90 days
- Critical vulnerabilities are patched immediately

## Scope

The following are in scope for security reports:
- Authentication bypass
- Data exposure
- Cross-site scripting (XSS)
- SQL injection
- Server-side request forgery (SSRF)
- Remote code execution

The following are out of scope:
- Denial of service attacks
- Social engineering
- Physical attacks
- Attacks requiring physical access to a user's device

## Security Updates

Security updates are released as soon as fixes are available. Users are notified through:
- Email notifications (for registered users)
- Dashboard notifications
- GitHub security advisories

Thank you for helping keep our application secure!