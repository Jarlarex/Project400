# Deployment and Operations

## Purpose

Guide developers through environment setup, deployment procedures, and operational considerations.

## Scope

Covers local development, testnet deployment, and production considerations.

## Audience

Developers deploying and operating the application.

---

## 1. Environment Variables

### Root Directory (.env)

```env
# Ethereum Provider (for contract deployment)
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Deployer Wallet (for Sepolia deployment)
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix

# Etherscan (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Frontend Directory (frontend/.env.local)

```env
# Pinata IPFS (required for uploads)
PINATA_JWT=your_pinata_jwt_token
```

### Environment Variable Sources

| Variable | Where to Get |
|----------|--------------|
| `SEPOLIA_RPC_URL` | [Alchemy](https://dashboard.alchemy.com/) or [Infura](https://infura.io/) |
| `PRIVATE_KEY` | MetaMask: Account Details → Export Private Key |
| `ETHERSCAN_API_KEY` | [Etherscan API Keys](https://etherscan.io/myapikey) |
| `PINATA_JWT` | [Pinata API Keys](https://app.pinata.cloud/developers/api-keys) |

---

## 2. .env.example Template

Create this file in the root directory for reference:

```env
# Ethereum Provider
# Get from: https://dashboard.alchemy.com/ or https://infura.io/
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# Deployer Wallet Private Key (WITHOUT 0x prefix)
# Export from MetaMask: Account Details → Export Private Key
# WARNING: Never commit real private keys!
PRIVATE_KEY=

# Etherscan API Key (for contract verification)
# Get from: https://etherscan.io/myapikey
ETHERSCAN_API_KEY=
```

---

## 3. Local Development (Hardhat Network)

### Prerequisites

- Node.js 18+
- npm
- MetaMask browser extension

### Step-by-Step

```bash
# 1. Install dependencies
npm install
cd frontend && npm install && cd ..

# 2. Start local Hardhat node (Terminal 1)
npm run node

# Expected output:
# Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
# Accounts (with 10000 ETH each):
# Account #0: 0xf39Fd6...

# 3. Deploy contract (Terminal 2)
npm run deploy:local

# Expected output:
# Deploying contracts with the account: 0xf39Fd6...
# Marketplace deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
# ABI copied to frontend

# 4. Start frontend (Terminal 3)
cd frontend && npm run dev

# 5. Configure MetaMask
# - Network: Localhost 8545
# - RPC URL: http://127.0.0.1:8545
# - Chain ID: 31337
# - Currency Symbol: ETH

# 6. Import test account (optional)
# Use one of the private keys printed by `npm run node`
```

### Reset Local State

If you restart Hardhat node, MetaMask nonce may be out of sync:

1. MetaMask → Settings → Advanced → Reset Account
2. This clears pending transactions and resets nonce

---

## 4. Testnet Deployment (Sepolia)

### Prerequisites

- Sepolia ETH (get from [faucet](https://sepoliafaucet.com/))
- Configured `.env` file with `SEPOLIA_RPC_URL` and `PRIVATE_KEY`

### Step-by-Step

```bash
# 1. Ensure .env is configured
cat .env
# Should show SEPOLIA_RPC_URL and PRIVATE_KEY

# 2. Deploy to Sepolia
npm run deploy:sepolia

# Expected output:
# Deploying contracts with the account: 0xAd84F3...
# Network: sepolia
# Marketplace deployed to: 0x7db2fdaD5542Bc80ded7f076fB2628957Aba339b
# Waiting for block confirmations...
# Contract verified on Etherscan!

# 3. Verify deployment
# Visit: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS#code
```

### Deployment Artefacts

After deployment, these files are created/updated:

| File | Content |
|------|---------|
| `deployments/sepolia.json` | Network, address, deployer, timestamp |
| `frontend/src/lib/contracts/Marketplace.json` | Address, chainId, ABI |

---

## 5. Frontend Deployment

### Build

```bash
cd frontend
npm run build
```

### Deployment Options

| Platform | Command | Notes |
|----------|---------|-------|
| **Vercel** | Push to GitHub, connect repo | Automatic builds |
| **Netlify** | Push to GitHub, connect repo | Requires `next export` |
| **Self-hosted** | `npm run build && npm run start` | Requires Node.js server |

### Vercel Environment Variables

Set in Vercel dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `PINATA_JWT` | Your Pinata JWT token |

---

## 6. CI/CD Considerations

### Recommended GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Compile contracts
        run: npm run compile
      
      - name: Run tests
        run: npm test
      
      - name: Build frontend
        run: |
          cd frontend
          npm ci
          npm run build
```

---

## 7. Monitoring and Logging

### Contract Events

Monitor contract activity via Etherscan:
- [Events tab](https://sepolia.etherscan.io/address/0x7db2fdaD5542Bc80ded7f076fB2628957Aba339b#events)

### Frontend Logging

Console logs in development:
- `useMarketplace.ts` logs transaction details
- `ipfs.ts` logs upload progress
- `explore/page.tsx` logs listing fetches

### Recommended Monitoring

| Aspect | Tool |
|--------|------|
| Contract activity | Etherscan alerts |
| Frontend errors | Vercel analytics / Sentry |
| IPFS availability | Pinata dashboard |
| RPC health | Alchemy dashboard |

---

## 8. Operational Checklist

### Pre-deployment

- [ ] Tests pass (`npm test`)
- [ ] Frontend builds (`npm run build`)
- [ ] Environment variables configured
- [ ] Sufficient ETH for deployment gas

### Post-deployment

- [ ] Contract verified on Etherscan
- [ ] Frontend points to correct contract address
- [ ] IPFS uploads working
- [ ] MetaMask connects to correct network
- [ ] Create test listing to verify flow

### Ongoing

- [ ] Monitor Pinata storage usage
- [ ] Check contract balance (platform fees)
- [ ] Review error logs periodically

---

## 9. Troubleshooting

### "Transaction reverted"

1. Check MetaMask is on correct network
2. Verify sufficient ETH for gas
3. Check contract state (is listing active?)
4. Read revert reason in console

### "IPFS upload failed"

1. Verify `PINATA_JWT` is set
2. Check Pinata dashboard for rate limits
3. Ensure file size < 10MB
4. Check server logs for detailed error

### "Contract not found"

1. Verify `frontend/src/lib/contracts/Marketplace.json` exists
2. Check `address` and `chainId` match deployment
3. Redeploy if ABI changed

---

## 10. Related Documentation

- [Requirements](01-requirements.md) — System requirements
- [Testing](07-testing.md) — Test procedures
- [Security](../SECURITY.md) — Security considerations
