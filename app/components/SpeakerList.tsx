"use client";

import { Card, Icon } from "./DemoComponents";
 
type SpeakerListProps = object;

export function SpeakerList({}: SpeakerListProps) {
  
  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">
          Tip Any Farcaster User 🌟
        </h2>
        <p className="text-sm text-[var(--app-foreground-muted)]">
          Use the tip form to search and tip any Farcaster user
        </p>
      </div>

      {/* Info Card */}
      <div className="p-4 bg-[var(--app-gray)] rounded-lg border border-[var(--app-card-border)]">
        <div className="text-center">
          <Icon name="users" size="lg" className="mx-auto mb-3 text-[#1E3A8A]" />
          <h3 className="font-semibold text-[var(--app-foreground)] mb-2">
            Search & Tip
          </h3>
          <p className="text-sm text-[var(--app-foreground-muted)] mb-3">
            Enter any Farcaster username in the tip form to search for users and send tips directly.
          </p>
          <div className="text-xs text-[var(--app-foreground-muted)]">
            Examples: vitalik.eth, jessepollak, base, dankrad
          </div>
        </div>
      </div>

      {/* Community Message */}
      <div className="border-t border-[var(--app-card-border)] pt-4">
        <div className="text-center">
          <p className="text-xs text-[var(--app-foreground-muted)] mb-2">
            💙 Powered by Base & Built with MiniKit 💙
          </p>
          <p className="text-xs text-[var(--app-foreground-muted)]">
            🏖️ EthCC 2025 • Cannes, France 🏖️
          </p>
        </div>
      </div>
    </Card>
  );
}
