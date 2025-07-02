"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { ETHCC_TIPFEST_CONTRACT, USDC_BASE_SEPOLIA, usdcToWei } from "../../lib/contract";
import { getUserByUsernameFromNeynar, type EthCCSpeaker } from "../../lib/neynar-api";
import { Card, Button, Icon } from "./DemoComponents";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface TipFormProps {
  onSuccess?: (txHash: string) => void;
  initialRecipient?: { handle: string; name: string } | null;
}

export function TipForm({ onSuccess, initialRecipient }: TipFormProps) {
  const { address } = useAccount();
  const [recipientHandle, setRecipientHandle] = useState(initialRecipient?.handle || "");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("0.01");
  const [message, setMessage] = useState("");
  const [tipType, setTipType] = useState<"USDC" | "ETH">("USDC");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<EthCCSpeaker | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  // Debounce the username input to avoid excessive API calls
  const debouncedUsername = useDebounce(recipientHandle, 500);

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Update form when initialRecipient changes
  useEffect(() => {
    if (initialRecipient) {
      setRecipientHandle(initialRecipient.handle);
      setSelectedUser(null);
    }
  }, [initialRecipient]);

  // Validate user when debounced username changes
  useEffect(() => {
    const validateUser = async () => {
      const username = debouncedUsername.trim();
      
      // Don't validate if username is empty or too short
      if (username.length < 2) {
        setSelectedUser(null);
        setRecipientAddress("");
        setIsValidating(false);
        return;
      }

      // Don't validate if we already have a selected user with matching handle
      if (selectedUser && (username === selectedUser.username || username === `@${selectedUser.username}`)) {
        setIsValidating(false);
        return;
      }

      setIsValidating(true);
      
      try {
        console.log(`Validating Farcaster user: "${username}"`);
        const user = await getUserByUsernameFromNeynar(username);
        
        if (user) {
          console.log(`Found user: ${user.display_name} (@${user.username})`);
          setSelectedUser(user);
          setRecipientAddress(user.verified_address || "");
        } else {
          console.log(`User not found: ${username}`);
          setSelectedUser(null);
          setRecipientAddress("");
        }
      } catch (error) {
        console.error("User validation error:", error);
        setSelectedUser(null);
        setRecipientAddress("");
      } finally {
        setIsValidating(false);
      }
    };

    validateUser();
  }, [debouncedUsername, selectedUser]);

  // Handle input change
  const handleRecipientInputChange = useCallback((value: string) => {
    setRecipientHandle(value);
    
    // Clear selected user if user is typing something different
    if (selectedUser && value !== selectedUser.username && value !== `@${selectedUser.username}`) {
      setSelectedUser(null);
      setRecipientAddress("");
    }
  }, [selectedUser]);

  // Resolve handle to address for tipping
  const resolveHandle = useCallback(async (handle: string): Promise<string | null> => {
    // If we have a selected user, use their address
    if (selectedUser?.verified_address) {
      return selectedUser.verified_address;
    }

    // Otherwise try to fetch the user
    try {
      const user = await getUserByUsernameFromNeynar(handle);
      return user?.verified_address || null;
    } catch (error) {
      console.error("Error resolving handle:", error);
      return null;
    }
  }, [selectedUser]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!address) {
      alert("Please connect your wallet first");
      return;
    }

    setIsLoading(true);

    try {
      let targetAddress = recipientAddress;

      // If no address provided, try to resolve the handle
      if (!targetAddress && recipientHandle) {
        targetAddress = await resolveHandle(recipientHandle) || "";
      }

      if (!targetAddress) {
        alert("Please provide a valid recipient address or Farcaster handle");
        setIsLoading(false);
        return;
      }

      const tipAmount = tipType === "USDC" 
        ? usdcToWei(amount)
        : parseEther(amount);

      const tokenAddress = tipType === "USDC" ? USDC_BASE_SEPOLIA : "0x0000000000000000000000000000000000000000";

      writeContract({
        ...ETHCC_TIPFEST_CONTRACT,
        functionName: "sendTip",
        args: [
          targetAddress as `0x${string}`,
          tipAmount,
          tokenAddress as `0x${string}`,
          message || `Tip from EthCC TipFest! 🎉`
        ],
        value: tipType === "ETH" ? tipAmount : BigInt(0),
      });

    } catch (error) {
      console.error("Error sending tip:", error);
      alert("Failed to send tip. Please try again.");
      setIsLoading(false);
    }
  }, [address, recipientHandle, recipientAddress, amount, message, tipType, resolveHandle, writeContract]);

  // Handle transaction success
  if (isSuccess && hash) {
    if (onSuccess) {
      onSuccess(hash);
    }
    // Reset form
    setRecipientHandle("");
    setRecipientAddress("");
    setMessage("");
    setSelectedUser(null);
    setIsLoading(false);
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-[#1E3A8A] mb-2">
          Send a Tip 💎
        </h2>
        <p className="text-sm text-[var(--app-foreground-muted)]">
          Send tips to any Farcaster user by their username
        </p>
        
        {/* Info about user lookup */}
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
            <Icon name="users" size="sm" />
            <span>
              Enter any Farcaster username to validate and tip
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--app-foreground)]">
            Recipient Username
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="Enter Farcaster username (e.g., vitalik.eth, jessepollak)"
              value={recipientHandle}
              onChange={(e) => handleRecipientInputChange(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-[var(--app-card-border)] rounded-lg bg-[var(--app-card-bg)] text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
            
            {/* Validation indicator */}
            {isValidating && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Icon name="loader" size="sm" className="animate-spin text-[#1E3A8A]" />
              </div>
            )}
            
            {/* Success indicator */}
            {!isValidating && selectedUser && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Icon name="check" size="sm" className="text-green-500" />
              </div>
            )}
            
            {/* Error indicator */}
            {!isValidating && recipientHandle.length > 2 && !selectedUser && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Icon name="arrow-down" size="sm" className="text-red-500" />
              </div>
            )}
          </div>
          
          {/* User validation feedback */}
          {selectedUser && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {selectedUser.pfp_url && selectedUser.pfp_url.startsWith('http') ? (
                    <img
                      src={selectedUser.pfp_url}
                      alt={selectedUser.display_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-xs font-bold">
                      {selectedUser.display_name?.charAt(0).toUpperCase() || selectedUser.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-green-800">
                      {selectedUser.display_name}
                    </span>
                    {selectedUser.power_badge && (
                      <div className="w-3 h-3 bg-purple-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-green-600">
                    @{selectedUser.username} • Verified ✓
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {!isValidating && recipientHandle.length > 2 && !selectedUser && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-800">
                User not found. Please check the username and try again.
              </div>
            </div>
          )}
          
          <div className="text-xs text-[var(--app-foreground-muted)] text-center">or</div>
          
          <input
            type="text"
            placeholder="0x... wallet address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--app-card-border)] rounded-lg bg-[var(--app-card-bg)] text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          />
        </div>

        {/* Tip Type Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--app-foreground)]">
            Tip Type
          </label>
          <div className="flex space-x-2">
            <Button
              type="button"
              variant={tipType === "USDC" ? "primary" : "outline"}
              size="sm"
              onClick={() => setTipType("USDC")}
              className={tipType === "USDC" ? "bg-[#1E3A8A] text-white" : ""}
            >
              USDC
            </Button>
            <Button
              type="button"
              variant={tipType === "ETH" ? "primary" : "outline"}
              size="sm"
              onClick={() => setTipType("ETH")}
              className={tipType === "ETH" ? "bg-[#1E3A8A] text-white" : ""}
            >
              ETH
            </Button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--app-foreground)]">
            Amount ({tipType})
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--app-card-border)] rounded-lg bg-[var(--app-card-bg)] text-[var(--app-foreground)] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          />
        </div>

        {/* Message Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[var(--app-foreground)]">
            Thank You Message (Optional)
          </label>
          <textarea
            placeholder="Thanks for the amazing content! 🎉"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-[var(--app-card-border)] rounded-lg bg-[var(--app-card-bg)] text-[var(--app-foreground)] placeholder-[var(--app-foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white"
          disabled={isLoading || isPending || isConfirming || !address || (!selectedUser && !recipientAddress)}
        >
          {isLoading || isPending || isConfirming ? (
            <>
              <Icon name="loader" size="sm" className="animate-spin mr-2" />
              {isPending ? "Confirming..." : isConfirming ? "Processing..." : "Sending..."}
            </>
          ) : (
            "Send Tip 🚀"
          )}
        </Button>

        {!address && (
          <p className="text-xs text-center text-[var(--app-foreground-muted)]">
            Connect your wallet to send tips
          </p>
        )}
        
        {address && !selectedUser && !recipientAddress && (
          <p className="text-xs text-center text-[var(--app-foreground-muted)]">
            Enter a valid Farcaster username or wallet address
          </p>
        )}
      </form>

      {/* Transaction Status */}
      {hash && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="check" size="sm" className="text-green-600" />
            <span className="text-sm text-green-800">
              {isConfirming ? "Transaction confirming..." : "Tip sent successfully!"}
            </span>
          </div>
          {isSuccess && (
            <div className="mt-2 text-xs text-green-600">
              Transaction: {hash.slice(0, 10)}...{hash.slice(-8)}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
