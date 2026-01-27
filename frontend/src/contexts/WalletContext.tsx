"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { BrowserProvider, JsonRpcSigner, Contract } from "ethers";
import MarketplaceABI from "@/lib/contracts/Marketplace.json";

// Supported chains
const SUPPORTED_CHAINS: Record<number, { name: string; rpcUrl: string }> = {
  31337: { name: "Hardhat Local", rpcUrl: "http://127.0.0.1:8545" },
  11155111: { name: "Sepolia Testnet", rpcUrl: "" }, // Uses wallet's RPC
};

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;
  balance: string;
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  marketplace: Contract | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState("0");
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [marketplace, setMarketplace] = useState<Contract | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!address;

  // Initialize provider and check for existing connection
  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        const browserProvider = new BrowserProvider(window.ethereum);
        setProvider(browserProvider);

        // Check if already connected
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            await handleAccountsChanged(accounts, browserProvider);
          }
        } catch (err) {
          console.error("Error checking accounts:", err);
        }

        // Listen for account changes
        window.ethereum.on("accountsChanged", (accounts: string[]) => {
          handleAccountsChanged(accounts, browserProvider);
        });

        // Listen for chain changes
        window.ethereum.on("chainChanged", (newChainId: string) => {
          setChainId(parseInt(newChainId, 16));
          window.location.reload();
        });
      }
    };

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts: string[], browserProvider: BrowserProvider) => {
    if (accounts.length === 0) {
      // User disconnected
      setAddress(null);
      setSigner(null);
      setMarketplace(null);
      setBalance("0");
    } else {
      const newAddress = accounts[0];
      setAddress(newAddress);

      const newSigner = await browserProvider.getSigner();
      setSigner(newSigner);

      // Get chain ID
      const network = await browserProvider.getNetwork();
      setChainId(Number(network.chainId));

      // Get balance
      const balanceWei = await browserProvider.getBalance(newAddress);
      setBalance((Number(balanceWei) / 1e18).toFixed(4));

      // Initialize marketplace contract
      if (MarketplaceABI.address && MarketplaceABI.abi) {
        const marketplaceContract = new Contract(
          MarketplaceABI.address,
          MarketplaceABI.abi,
          newSigner
        );
        setMarketplace(marketplaceContract);
      }
    }
  };

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("Please install MetaMask to use this application");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (provider) {
        await handleAccountsChanged(accounts, provider);
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError("Connection rejected by user");
      } else {
        setError("Failed to connect wallet");
      }
    } finally {
      setIsConnecting(false);
    }
  }, [provider]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setSigner(null);
    setMarketplace(null);
    setBalance("0");
    setChainId(null);
  }, []);

  const switchNetwork = useCallback(async (targetChainId: number) => {
    if (!window.ethereum) return;

    const chainHex = `0x${targetChainId.toString(16)}`;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainHex }],
      });
    } catch (err: any) {
      // Chain not added to MetaMask
      if (err.code === 4902) {
        const chainInfo = SUPPORTED_CHAINS[targetChainId];
        if (chainInfo) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: chainHex,
                  chainName: chainInfo.name,
                  rpcUrls: [chainInfo.rpcUrl],
                },
              ],
            });
          } catch (addErr) {
            setError("Failed to add network");
          }
        }
      } else {
        setError("Failed to switch network");
      }
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        isConnecting,
        chainId,
        balance,
        provider,
        signer,
        marketplace,
        error,
        connect,
        disconnect,
        switchNetwork,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}
