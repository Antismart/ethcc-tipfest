// Neynar API integration for Farcaster user search and validation
// Includes fallback to static data for browser compatibility

export interface EthCCSpeaker {
  fid?: number;
  username: string;
  display_name: string;
  bio?: string;
  pfp_url?: string;
  title: string;
  company: string;
  verified_address?: string;
  follower_count?: number;
  power_badge?: boolean;
  isVerified?: boolean;
}





// username param is used
export async function getUserByUsernameFromNeynar(username: string): Promise<EthCCSpeaker | null> {
  const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY;
  
  if (!NEYNAR_API_KEY) {
    console.warn("Neynar API key not found, falling back to static lookup");
    return getUserByUsername(username);
  }

  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;

  try {
    console.log(`Fetching user data for: ${cleanUsername}`);
    const response = await fetch(
      `https://api.neynar.com/v2/farcaster/user/by_username?username=${encodeURIComponent(cleanUsername)}`,
      {
        headers: {
          'Accept': 'application/json',
          'x-api-key': NEYNAR_API_KEY,
        },
      }
    );

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`User "${cleanUsername}" not found (404)`);
        return null;
      }
      if (response.status === 402) {
        console.warn("Neynar API quota exceeded. Using static lookup instead.");
        return getUserByUsername(username);
      }
      console.error(`Neynar API error: ${response.status} ${response.statusText}`);
      throw new Error(`Neynar API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Neynar API response:', data); // Debug log
    
    // Handle both possible response structures
    const user = data.user || data.result?.user;
    
    if (!user) {
      console.log('No user found in response structure:', Object.keys(data));
      return null;
    }

    // Get the primary ETH address for tipping, with fallbacks
    const primaryAddress = user.verified_addresses?.primary?.eth_address;
    const firstVerifiedAddress = user.verified_addresses?.eth_addresses?.[0];
    const custodyAddress = user.custody_address;
    
    // Prefer primary verified address, then first verified address, then custody address
    const verifiedAddress = primaryAddress || firstVerifiedAddress || custodyAddress;

    return {
      fid: user.fid,
      username: user.username,
      display_name: user.display_name || user.username,
      bio: user.profile?.bio?.text || "",
      pfp_url: user.pfp_url,
      title: "Farcaster User",
      company: "Farcaster",
      verified_address: verifiedAddress,
      follower_count: user.follower_count,
      power_badge: user.power_badge,
      isVerified: !!verifiedAddress,
    };
  } catch (error) {
    console.error("Error fetching user by username from Neynar:", error);
    console.error("Username attempted:", cleanUsername);
    console.error("API Key present:", !!NEYNAR_API_KEY);
    return getUserByUsername(username);
  }
}

// Static fallback functions

export async function getUserByUsername(username: string): Promise<EthCCSpeaker | null> {
  // This function is now just a placeholder since we removed static data
  // All user lookups should go through Neynar API
  console.warn("Static fallback called - no static data available for:", username);
  return null;
}

export function formatFollowerCount(count?: number): string {
  if (!count) return "0";
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
