# Setup Guide - API Keys and Configuration

This guide explains where to obtain all the necessary API keys and how to configure them for the DecentraMarket project.

## Required API Keys

### 1. SEPOLIA_RPC_URL - Alchemy API Key

**What it's for:** Connects your application to the Sepolia testnet blockchain.

**How to get it:**

1. Go to [Alchemy](https://www.alchemy.com/)
2. Sign up for a free account
3. Click "Create new app"
4. Fill in:
   - Name: DecentraMarket (or any name)
   - Chain: Ethereum
   - Network: Sepolia
5. Click on your new app and find the "API Key"
6. Use the HTTPS endpoint, which looks like:
   ```
   https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
   ```

**Alternative:** You can also use [Infura](https://infura.io/) instead of Alchemy.

---

### 2. PRIVATE_KEY - MetaMask Wallet Private Key

**What it's for:** Deploys smart contracts from your wallet to the blockchain.

**⚠️ SECURITY WARNING:** Never share this key or commit it to GitHub!

**How to get it:**

1. Open MetaMask browser extension
2. Click the three dots menu (top right)
3. Click "Account details"
4. Click "Show private key"
5. Enter your MetaMask password
6. Copy the private key (it's a 64-character hex string)
7. **Important:** Remove the `0x` prefix before adding to .env

**Example:**
```env
# If MetaMask shows: 0xabcdef123456...
# In .env use:       abcdef123456...
PRIVATE_KEY=abcdef123456789...
```

**Note:** Make sure this wallet has some Sepolia ETH for gas fees!

---

### 3. ETHERSCAN_API_KEY - Etherscan API Key

**What it's for:** Verifies your smart contract source code on Etherscan after deployment.

**How to get it:**

1. Go to [Etherscan](https://etherscan.io/)
2. Sign up for a free account
3. Go to [API Keys page](https://etherscan.io/myapikey)
4. Click "Add" to create a new API key
5. Give it a name (e.g., "DecentraMarket")
6. Copy the API key

**Note:** This is optional for local development but recommended for Sepolia deployment.

---

### 4. PINATA_API_KEY and PINATA_SECRET_KEY - Pinata IPFS Keys

**What it's for:** Uploads images and metadata to IPFS (decentralized file storage).

**How to get it:**

1. Go to [Pinata](https://pinata.cloud/)
2. Sign up for a free account (1GB storage free)
3. Go to [API Keys page](https://app.pinata.cloud/developers/api-keys)
4. Click "New Key"
5. Configure permissions:
   - ✅ Enable "pinFileToIPFS"
   - ✅ Enable "pinJSONToIPFS"
6. Give it a name (e.g., "DecentraMarket")
7. Click "Create Key"
8. **Important:** Copy both keys immediately (they won't be shown again):
   - API Key → `PINATA_API_KEY`
   - API Secret → `PINATA_SECRET_KEY`

---

### 5. PINATA_JWT - Pinata JWT Token (Server-Side Only)

**What it's for:** Authenticates server-side IPFS uploads securely (never exposed to browser).

**How to get it:**

1. In Pinata dashboard, go to [API Keys](https://app.pinata.cloud/developers/api-keys)
2. Click "New Key"
3. Configure permissions:
   - ✅ Enable "pinFileToIPFS"
   - ✅ Enable "pinJSONToIPFS"
4. Under "Access Control", select "User" permissions
5. Click "Create Key"
6. Copy the **JWT token** (long string starting with "eyJ...")
7. Use this in frontend/.env.local

---

## Configuration Files

### Root Directory `.env`

Create a `.env` file in the root directory (`Project400/.env`):

```env
# Network RPC URLs
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY

# Private key for deployment (without 0x prefix)
PRIVATE_KEY=your_metamask_private_key_without_0x

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=your_etherscan_api_key

# Pinata API keys for IPFS (legacy method, optional)
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

### Frontend Directory `frontend/.env.local`

Create a `frontend/.env.local` file:

```env
# Pinata JWT for server-side IPFS uploads (NOT exposed to browser)
PINATA_JWT=your_pinata_jwt_token

# Pinata Gateway (optional, for direct gateway access)
PINATA_GATEWAY=gateway.pinata.cloud
```

**Security Note:** The `PINATA_JWT` does NOT have the `NEXT_PUBLIC_` prefix, which means it's only available server-side. This prevents your API key from being exposed to users in the browser.

---

## Getting Test ETH for Sepolia

You'll need Sepolia ETH to deploy contracts and pay gas fees:

1. **Google Cloud Faucet** (recommended):
   - Go to [Google Cloud Sepolia Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)
   - Sign in with Google
   - Enter your wallet address
   - Get 0.05 Sepolia ETH

2. **Alchemy Faucet**:
   - Go to [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
   - Sign in with Alchemy account
   - Get 0.5 Sepolia ETH per day

3. **QuickNode Faucet**:
   - Go to [QuickNode Faucet](https://faucet.quicknode.com/ethereum/sepolia)
   - Enter wallet address
   - Get 0.1 Sepolia ETH

---

## Quick Start

Once you have all keys configured:

1. **Start local blockchain:**
   ```bash
   npm run node
   ```

2. **Deploy contracts (in another terminal):**
   ```bash
   npm run deploy:local
   ```

3. **Start frontend:**
   ```bash
   npm run frontend:dev
   ```

4. **Configure MetaMask:**
   - Network: Localhost 8545
   - Chain ID: 31337
   - RPC URL: http://127.0.0.1:8545

---

## Deploying to Sepolia

When ready to deploy to testnet:

```bash
npm run deploy:sepolia
```

Make sure:
- ✅ Your `.env` has all Sepolia keys
- ✅ Your wallet has Sepolia ETH
- ✅ Update `frontend/src/lib/contracts/Marketplace.json` with deployed address

---

## Troubleshooting

### "Insufficient funds" error
- Get more Sepolia ETH from faucets above

### "Invalid API key" error
- Double-check your Alchemy/Infura API key
- Make sure you're using the correct network (Sepolia)

### IPFS upload fails
- Verify your Pinata JWT is correct
- Check you haven't exceeded free tier limits (1GB)
- Make sure API key has correct permissions

### MetaMask connection fails
- Ensure MetaMask is unlocked
- Check you're on the correct network
- Try refreshing the page

---

## Security Best Practices

1. **Never commit `.env` files to git** (already in .gitignore)
2. **Use a test wallet** for development (not your main wallet)
3. **Keep private keys secure** - never share them
4. **Use environment variables** for all sensitive data
5. **Rotate API keys** if you suspect they've been compromised

---

## Need Help?

- [Alchemy Documentation](https://docs.alchemy.com/)
- [Pinata Documentation](https://docs.pinata.cloud/)
- [Etherscan API Docs](https://docs.etherscan.io/)
- [MetaMask Docs](https://docs.metamask.io/)
