# AI Governance Platform

Portfolio demo: enterprise AI governance dashboard for policy enforcement, real-time usage monitoring, compliance reporting, and safety controls.

## Governance Pain Points

Enterprises adopting AI face critical risks that this platform addresses:

- **No visibility into AI usage** -- Organizations deploy ChatGPT, Claude, Copilot, and Gemini across departments with zero insight into who is using what, for which purposes, and whether outputs are safe.
- **Compliance risk** -- Without automated policy enforcement, companies risk PII leaks, prompt injection attacks, biased outputs, and regulatory violations under GDPR, SOC 2, the EU AI Act, and SEC rules.
- **Fragmented safety controls** -- Safety checks (PII redaction, bias detection, hallucination monitoring) are siloed or manual, leaving gaps that auditors and regulators are increasingly flagging.
- **Access governance gaps** -- Different departments and roles need different AI tool access levels, but managing this at scale without RBAC leads to shadow AI and data exfiltration.
- **Audit readiness** -- Immutable audit trails are required for FINRA, SEC Rule 17a-4, and SOC 2, but most organizations lack a unified logging layer across all AI tools.

## Features

- **Policy Enforcement Dashboard** -- 6 active policies across data privacy, model usage, output review, access control, audit, and bias/fairness. Real-time enforcement rates with violation tracking.
- **Live Usage Event Feed** -- Stream of all AI tool usage across the organization with allow/flag/block enforcement actions, policy attribution, and detailed reasoning.
- **Compliance Reporting** -- Q2 audit reports, weekly safety scans, and monthly governance scorecards with framework tracking (SOC 2, GDPR, EU AI Act, ISO 42001, NIST AI RMF).
- **Safety Check Log** -- Automated detection of prompt injection, PII leaks, toxic output, hallucination, data exfiltration, and bias with severity classification.
- **Team Access Matrix** -- Role-based access control showing which teams have full, restricted, review, or no access to each AI tool.
- **Governance Metrics** -- Aggregate stats: policies active, events today, blocked/flagged counts, violations per month, compliance score, and safety alerts.

## Stack

- **Next.js 15** (React 19) -- App Router with Server Components
- **Tailwind CSS** -- Utility-first styling with custom design tokens
- **TypeScript** -- Strict mode, path aliases
- **Vitest** -- Unit tests for data integrity
- **ESLint** -- Next.js core-web-vitals and TypeScript rules

## Getting Started

```bash
npm install
npm run dev        # Start dev server at http://localhost:3000
npm run test       # Run vitest tests
npm run lint       # Lint all files
npm run typecheck  # TypeScript type checking
npm run build      # Production build
```

All data is fictional. No production keys or network calls are required.
