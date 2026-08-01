# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Fork of the OpenMeerkat community edition, rebranded as OpenMeerkat and
  re-licensed under AGPL-3.0 (see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)).
- Open-source hygiene: README, contributing guide, security policy, code of
  conduct, changelog, third-party notices, and GitHub Actions CI.

### Removed

- All commercially-licensed enterprise components
  (`apps/builder/src/enterprise/`): billing, audit logs, inbox teams, platform
  branding, and email templates. These remain under AhaChat LLC's commercial
  license and are not part of OpenMeerkat.
