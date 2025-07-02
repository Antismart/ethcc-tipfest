"use client";

import { useState } from "react";
import { useAccount, useReadContract } from "wagmi";
import { ETHCC_TIPFEST_CONTRACT, weiToUsdc } from "../../lib/contract";
import { Card, Button, Icon } from "./DemoComponents";

export function TipHistory() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");

  // Get tip IDs for sent tips
  const { data: sentTipIds } = useReadContract({
    ...ETHCC_TIPFEST_CONTRACT,
    functionName: "getTipsBySender",
    args: address ? [address] : undefined,
  });

  // Get tip IDs for received tips
  const { data: receivedTipIds } = useReadContract({
    ...ETHCC_TIPFEST_CONTRACT,
    functionName: "getTipsByReceiver",
    args: address ? [address] : undefined,
  });

  // Get total tips count for display
  const { data: totalTips } = useReadContract({
    ...ETHCC_TIPFEST_CONTRACT,
    functionName: "getTotalTips",
  });

  const currentTipIds = activeTab === "sent" ? sentTipIds : receivedTipIds;

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">
          Tip History 📊
        </h2>
        <p className="text-sm text-[var(--app-foreground-muted)]">
          Track your tipping activity
        </p>
        {totalTips !== undefined && (
          <div className="mt-2 text-xs text-[var(--app-foreground-muted)]">
            Total tips in community: {totalTips.toString()}
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-[var(--app-gray)] p-1 rounded-lg">
        <Button
          variant={activeTab === "sent" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("sent")}
          className={`flex-1 ${
            activeTab === "sent" 
              ? "bg-[#1E3A8A] text-white" 
              : "text-[var(--app-foreground-muted)]"
          }`}
        >
          Sent ({sentTipIds?.length || 0})
        </Button>
        <Button
          variant={activeTab === "received" ? "primary" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("received")}
          className={`flex-1 ${
            activeTab === "received" 
              ? "bg-[#1E3A8A] text-white" 
              : "text-[var(--app-foreground-muted)]"
          }`}
        >
          Received ({receivedTipIds?.length || 0})
        </Button>
      </div>

      {/* Tips List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {!address ? (
          <div className="text-center py-8">
            <Icon name="wallet" size="lg" className="mx-auto mb-3 text-[var(--app-foreground-muted)]" />
            <p className="text-[var(--app-foreground-muted)]">
              Connect your wallet to view tip history
            </p>
          </div>
        ) : !currentTipIds || currentTipIds.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="history" size="lg" className="mx-auto mb-3 text-[var(--app-foreground-muted)]" />
            <p className="text-[var(--app-foreground-muted)]">
              No {activeTab} tips yet
            </p>
            {activeTab === "sent" && (
              <p className="text-xs text-[var(--app-foreground-muted)] mt-1">
                Send your first tip to get started!
              </p>
            )}
          </div>
        ) : (
          currentTipIds.map((tipId) => (
            <TipItem key={tipId.toString()} tipId={tipId} activeTab={activeTab} />
          ))
        )}
      </div>

      {/* Community Stats */}
      {address && (
        <div className="border-t border-[var(--app-card-border)] pt-4">
          <div className="text-center">
            <p className="text-xs text-[var(--app-foreground-muted)]">
              🌊 Join the wave of appreciation at EthCC! 🌊
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

function TipItem({ tipId, activeTab }: { tipId: bigint; activeTab: "sent" | "received" }) {
  const { data: tip } = useReadContract({
    ...ETHCC_TIPFEST_CONTRACT,
    functionName: "getTip",
    args: [tipId],
  });

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatAmount = (amount: bigint, token: string) => {
    if (token === "0x0000000000000000000000000000000000000000") {
      // ETH
      return `${(Number(amount) / 1e18).toFixed(4)} ETH`;
    } else {
      // USDC
      return `${weiToUsdc(amount)} USDC`;
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
  };

  if (!tip) {
    return (
      <div className="p-3 bg-[var(--app-gray)] rounded-lg animate-pulse">
        <div className="h-4 bg-[var(--app-card-border)] rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-[var(--app-card-border)] rounded w-1/2"></div>
      </div>
    );
  }

  const from = tip.from;
  const to = tip.to;
  const amount = tip.amount;
  const token = tip.token;
  const message = tip.message;
  const timestamp = tip.timestamp;

  return (
    <div className="p-4 bg-[var(--app-gray)] rounded-lg border border-[var(--app-card-border)] hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <Icon 
              name={activeTab === "sent" ? "arrow-up" : "arrow-down"} 
              size="sm" 
              className={activeTab === "sent" ? "text-red-500" : "text-green-500"}
            />
            <span className="font-medium text-sm">
              {activeTab === "sent" ? `To: ${formatAddress(to)}` : `From: ${formatAddress(from)}`}
            </span>
          </div>
          <div className="text-lg font-bold text-[#1E3A8A]">
            {formatAmount(amount, token)}
          </div>
        </div>
        <div className="text-xs text-[var(--app-foreground-muted)]">
          {formatDate(timestamp)}
        </div>
      </div>
      
      {message && (
        <div className="mt-2 p-2 bg-[var(--app-card-bg)] rounded text-sm">
          <Icon name="message" size="sm" className="inline mr-1" />
          &ldquo;{message}&rdquo;
        </div>
      )}
    </div>
  );
}
