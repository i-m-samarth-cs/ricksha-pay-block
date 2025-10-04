import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wallet, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletConnectProps {
  onWalletConnected: (address: string) => void;
}

export const WalletConnect = ({ onWalletConnected }: WalletConnectProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>("0");
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      toast.error("MetaMask not detected", {
        description: "Please install MetaMask to continue",
      });
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      
      const address = accounts[0];
      setAccount(address);
      onWalletConnected(address);

      // Get balance
      const balanceHex = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
      const balanceEth = parseInt(balanceHex, 16) / 10**18;
      setBalance(balanceEth.toFixed(4));

      toast.success("Wallet Connected", {
        description: `Address: ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast.error("Connection Failed", {
        description: error.message || "Failed to connect wallet",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          onWalletConnected(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, [onWalletConnected]);

  if (account) {
    return (
      <Card className="bg-card border-2 border-success p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-success" />
            <div>
              <div className="text-sm text-muted-foreground">Connected Wallet</div>
              <div className="font-mono text-foreground font-semibold">
                {account.slice(0, 8)}...{account.slice(-6)}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Balance</div>
            <div className="text-lg font-bold text-primary">{balance} ETH</div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-2 border-border p-6">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-primary mt-1" />
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">Connect Your Wallet</h3>
            <p className="text-sm text-muted-foreground">
              Connect MetaMask to book rides and make payments on the blockchain
            </p>
          </div>
        </div>
        
        <Button
          onClick={connectWallet}
          disabled={isConnecting}
          className="w-full bg-gradient-meter hover:opacity-90 text-primary-foreground font-bold h-12"
        >
          <Wallet className="w-5 h-5 mr-2" />
          {isConnecting ? "Connecting..." : "Connect MetaMask"}
        </Button>
      </div>
    </Card>
  );
};
