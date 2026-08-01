# Security Policy

## Reporting a vulnerability

Please do **not** open a public issue for security vulnerabilities.

Email security reports to **elias@realityshifting.tech** (or open a private
GitHub security advisory on the repository). Include:

- A description of the vulnerability and its impact
- Steps to reproduce or a proof of concept
- Affected versions or commits

We aim to acknowledge reports within 72 hours, complete triage within 5
business days, and keep you informed as we investigate and fix. The issue is
**not** disclosed publicly until a fix is available and an advisory is
published.

## Scope

OpenMeerkat handles chat credentials, contact data, API keys, and messaging
infrastructure. Issues involving credential storage (`ENCRYPTION_KEY` usage),
session handling, webhook authentication, workspace isolation, and injection
of any kind are treated as high priority.

## Supported versions

OpenMeerkat is pre-release. Only the latest commit on the default branch
receives security fixes until the first stable version is published.
