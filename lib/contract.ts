export const ETHCC_TIPFEST_CONTRACT = {
  address: "0xAD8b3c1C7706662a0A3bdc3757c0E5A02987BA98" as const,
    // address: "0x29e00504dB1CF17E2381D60eBbC523e96e653866" as const,

  abi: [
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            { "internalType": "address", "name": "owner", "type": "address" }
          ],
          "type": "error",
          "name": "OwnableInvalidOwner"
        },
        {
          "inputs": [
            { "internalType": "address", "name": "account", "type": "address" }
          ],
          "type": "error",
          "name": "OwnableUnauthorizedAccount"
        },
        {
          "inputs": [],
          "type": "error",
          "name": "ReentrancyGuardReentrantCall"
        },
        {
          "inputs": [
            { "internalType": "address", "name": "token", "type": "address" }
          ],
          "type": "error",
          "name": "SafeERC20FailedOperation"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "previousOwner",
              "type": "address",
              "indexed": true
            },
            {
              "internalType": "address",
              "name": "newOwner",
              "type": "address",
              "indexed": true
            }
          ],
          "type": "event",
          "name": "OwnershipTransferred",
          "anonymous": false
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address",
              "indexed": true
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address",
              "indexed": true
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256",
              "indexed": false
            },
            {
              "internalType": "address",
              "name": "token",
              "type": "address",
              "indexed": false
            },
            {
              "internalType": "string",
              "name": "message",
              "type": "string",
              "indexed": false
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256",
              "indexed": false
            }
          ],
          "type": "event",
          "name": "TipSent",
          "anonymous": false
        },
        {
          "inputs": [],
          "stateMutability": "view",
          "type": "function",
          "name": "ETH_ADDRESS",
          "outputs": [
            { "internalType": "address", "name": "", "type": "address" }
          ]
        },
        {
          "inputs": [],
          "stateMutability": "view",
          "type": "function",
          "name": "USDC_BASE",
          "outputs": [
            { "internalType": "address", "name": "", "type": "address" }
          ]
        },
        {
          "inputs": [
            { "internalType": "address", "name": "token", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" }
          ],
          "stateMutability": "nonpayable",
          "type": "function",
          "name": "emergencyWithdraw"
        },
        {
          "inputs": [],
          "stateMutability": "view",
          "type": "function",
          "name": "owner",
          "outputs": [
            { "internalType": "address", "name": "", "type": "address" }
          ]
        },
        {
          "inputs": [],
          "stateMutability": "nonpayable",
          "type": "function",
          "name": "renounceOwnership"
        },
        {
          "inputs": [
            { "internalType": "address", "name": "to", "type": "address" },
            { "internalType": "uint256", "name": "amount", "type": "uint256" },
            { "internalType": "address", "name": "token", "type": "address" },
            { "internalType": "string", "name": "message", "type": "string" }
          ],
          "stateMutability": "payable",
          "type": "function",
          "name": "sendTip"
        },
        {
          "inputs": [
            { "internalType": "address", "name": "newOwner", "type": "address" }
          ],
          "stateMutability": "nonpayable",
          "type": "function",
          "name": "transferOwnership"
        },
        { "inputs": [], "stateMutability": "payable", "type": "receive" }
      ]
} as const;

// USDC contract address on Base Mainnet
export const USDC_BASE_MAINNET = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;

// Helper function to convert USDC amount to wei (6 decimals)
export function usdcToWei(amount: string): bigint {
  return BigInt(Math.floor(parseFloat(amount) * 1000000)); // USDC has 6 decimals
}

// Helper function to convert wei to USDC (6 decimals)
export function weiToUsdc(wei: bigint): string {
  return (Number(wei) / 1000000).toFixed(2);
}
