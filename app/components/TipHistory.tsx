"use client";

import { useAccount } from "wagmi";
import { Card, Icon } from "./DemoComponents";

export function TipHistory() {
  const { address } = useAccount();

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">
          Tip History 📊
        </h2>
        <p className="text-sm text-[var(--app-foreground-muted)]">
          Track your tipping activity
        </p>
        <div className="mt-2 text-xs text-[var(--app-foreground-muted)]">
          History feature coming soon! ⏳
        </div>
      </div>

      {!address ? (
        <div className="text-center p-8">
          <Icon name="users" size="lg" className="mx-auto mb-4 text-[var(--app-foreground-muted)]" />
          <h3 className="text-lg font-medium text-[var(--app-foreground)] mb-2">
            Connect Your Wallet
          </h3>
          <p className="text-sm text-[var(--app-foreground-muted)]">
            Connect your wallet to view your tip history
          </p>
        </div>
      ) : (
        <div className="text-center p-8">
          <Icon name="history" size="lg" className="mx-auto mb-4 text-[#1E3A8A]" />
          <h3 className="text-lg font-medium text-[var(--app-foreground)] mb-2">
            Tip History Coming Soon
          </h3>
          <p className="text-sm text-[var(--app-foreground-muted)] mb-4">
            We&apos;re working on adding tip history functionality. For now, you can track your transactions in your wallet or on the blockchain explorer.
          </p>
          <div className="p-4 bg-[var(--app-gray)] rounded-lg">
            <p className="text-xs text-[var(--app-foreground-muted)]">
              💡 Tip: Your successful tips will show transaction confirmations in the tip form!
            </p>
          </div>
        </div>
      )}

      {/* Community Message */}
      <div className="border-t border-[var(--app-card-border)] pt-4">
        <div className="text-center">
          <p className="text-xs text-[var(--app-foreground-muted)] mb-2">
            🌊 Join the wave of appreciation at EthCC! 🌊
          </p>
          <p className="text-xs text-[var(--app-foreground-muted)]">
            Send tips to speakers, builders, and community members
          </p>
        </div>
      </div>
    </Card>
  );
}