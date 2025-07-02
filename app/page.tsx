"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
  useClose,
  useViewProfile,
  useNotification,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button, Icon } from "./components/DemoComponents";
import { TipForm } from "./components/TipForm";
import { TipHistory } from "./components/TipHistory";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState("tip");

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();
  const close = useClose();
  const viewProfile = useViewProfile();
  const sendNotification = useNotification();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const result = await addFrame();
    if (result) {
      console.log('Frame added:', result.url, result.token);
      setFrameAdded(Boolean(result));
    }
  }, [addFrame]);



  const handleSendNotification = useCallback(async () => {
    try {
      await sendNotification({
        title: 'Tip Sent Successfully! 🎉',
        body: 'Your tip has been processed and sent to the recipient!'
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }, [sendNotification]);

  const handleTipSuccess = useCallback((txHash: string) => {
    // Show success message and potentially switch to history tab
    console.log('Tip successful:', txHash);
    setActiveTab("history");
    
    // Send notification on successful tip
    handleSendNotification();
  }, [handleSendNotification]);



  const handleViewProfile = useCallback(() => {
    viewProfile();
  }, [viewProfile]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🎪</div>
              <div>
                <h1 className="text-lg font-bold text-[#1E3A8A]">EthCC TipFest</h1>
                <p className="text-xs text-[var(--app-foreground-muted)]">Cannes 2025</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Wallet className="z-10">
              <ConnectWallet>
                <Name className="text-inherit" />
              </ConnectWallet>
              <WalletDropdown>
                <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                  <Avatar />
                  <Name />
                  <Address />
                  <EthBalance />
                </Identity>
                <WalletDropdownDisconnect />
              </WalletDropdown>
            </Wallet>
            <div className="flex items-center space-x-1">
              {saveFrameButton}
              {context?.client.added && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSendNotification}
                  className="text-[var(--app-accent)] text-xs"
                  icon={<Icon name="bell" size="sm" />}
                >
                  Notify
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewProfile}
                className="text-[var(--app-accent)] text-xs"
                icon={<Icon name="users" size="sm" />}
              >
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={close}
                className="text-[var(--app-accent)] text-xs"
              >
                ✕
              </Button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 mb-4 bg-[var(--app-gray)] p-1 rounded-lg">
          <Button
            variant={activeTab === "tip" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("tip")}
            className={`flex-1 ${
              activeTab === "tip" 
                ? "bg-[#1E3A8A] text-white" 
                : "text-[var(--app-foreground-muted)]"
            }`}
          >
            <Icon name="send" size="sm" className="mr-1" />
            Tip
          </Button>


          <Button
            variant={activeTab === "history" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("history")}
            className={`flex-1 ${
              activeTab === "history" 
                ? "bg-[#1E3A8A] text-white" 
                : "text-[var(--app-foreground-muted)]"
            }`}
          >
            <Icon name="history" size="sm" className="mr-1" />
            History
          </Button>
        </nav>

        <main className="flex-1">
          {activeTab === "tip" && (
            <TipForm 
              onSuccess={handleTipSuccess}
            />
          )}



          {activeTab === "history" && <TipHistory />}
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit 💙
          </Button>
        </footer>
      </div>
    </div>
  );
}
