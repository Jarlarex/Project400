# Contributing to DecentraMarket

Thank you for considering contributing to this project. This document outlines the guidelines for contributing.

---

## Purpose

This guide ensures consistent code quality and collaboration practices across the project.

## Scope

Covers branching strategy, commit conventions, code style, and pull request process.

## Audience

Developers wishing to contribute code, documentation, or bug reports.

---

## 🌿 Branching Strategy

We follow a simplified Git Flow:

| Branch | Purpose |
|--------|---------|
| `main` | Production-ready code, deployed to Sepolia |
| `develop` | Integration branch for features |
| `feature/*` | New features (e.g., `feature/add-dispute-resolution`) |
| `fix/*` | Bug fixes (e.g., `fix/escrow-deadline-calc`) |
| `docs/*` | Documentation updates |

### Creating a Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

---

## 📝 Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change that neither fixes nor adds |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies |

### Examples

```
feat(contracts): add escrow release after deadline

fix(frontend): handle undefined listing.seller in profile

docs: add sequence diagrams for purchase flow

test(marketplace): add escrow confirmation tests
```

---

## 🔍 Code Style

### Solidity

- Use Solidity 0.8.24
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Use NatSpec comments for all public functions
- Prefer explicit visibility (`public`, `external`, `internal`, `private`)

```solidity
/**
 * @notice Buy an item at fixed price
 * @param listingId The ID of the listing to purchase
 */
function buyItem(uint256 listingId) external payable override nonReentrant {
    // Implementation
}
```

### TypeScript/React

- Use TypeScript strict mode
- Prefer functional components with hooks
- Use descriptive variable names
- Export types/interfaces explicitly

```typescript
export interface Listing {
  id: bigint;
  seller: string;
  price: bigint;
}

export function useMarketplace() {
  // Hook implementation
}
```

### Formatting

- Run Prettier before committing (configured in project)
- Use 2-space indentation for JS/TS
- Use 4-space indentation for Solidity

---

## ✅ Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code compiles without errors (`npm run compile`)
- [ ] All tests pass (`npm test`)
- [ ] Frontend builds successfully (`cd frontend && npm run build`)
- [ ] New features have corresponding tests
- [ ] Documentation updated if needed
- [ ] Commit messages follow convention
- [ ] No sensitive data (private keys, API keys) committed
- [ ] Branch is up to date with `develop`

---

## 🔄 Pull Request Process

1. **Create PR** against `develop` branch
2. **Fill out PR template** with description of changes
3. **Request review** from maintainers
4. **Address feedback** and update as needed
5. **Squash and merge** once approved

### PR Title Format

```
<type>(<scope>): <brief description>
```

Example: `feat(escrow): add buyer refund on dispute`

---

## 🐛 Reporting Issues

When reporting bugs, include:

1. **Environment** — Browser, MetaMask version, network
2. **Steps to reproduce** — Clear numbered steps
3. **Expected behaviour** — What should happen
4. **Actual behaviour** — What actually happens
5. **Console logs** — Any error messages
6. **Screenshots** — If applicable

---

## 📖 Documentation

- Update relevant docs when changing functionality
- Use UK English spelling
- Keep explanations concise and practical
- Include code examples where helpful

---

## 🔗 Related Docs

- [Architecture](ARCHITECTURE.md)
- [Testing](docs/07-testing.md)
- [API & Contracts](docs/04-api-and-contracts.md)
