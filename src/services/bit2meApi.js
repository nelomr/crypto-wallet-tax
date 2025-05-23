import CryptoJS from 'crypto-js';

// API keys should be securely stored in .env.local and prefixed with VITE_
const apiKey = import.meta.env.VITE_WALLET_API_KEY; // Or VITE_BIT2ME_API_KEY if distinct
const apiSecret = import.meta.env.VITE_BIT2ME_API_SECRET;

// Function to generate the signature for Bit2Me
function generateSignature(path, body = '') {
  if (!apiKey || !apiSecret) {
    console.error('Bit2Me API key or secret is not set in environment variables.');
    // Depending on how you want to handle this, you might throw an error
    // or return an object indicating failure.
    return { error: 'API credentials not set' };
  }
  const nonce = Date.now().toString();
  const message = nonce + path + body;
  const signature = CryptoJS.HmacSHA256(message, apiSecret).toString(CryptoJS.enc.Hex);
  return { nonce, signature };
}

// Get wallets from Bit2Me
export async function getBit2MeWallets() {
  const path = '/wallets';
  const signatureData = generateSignature(path);
  if (signatureData.error) {
    return { success: false, error: signatureData.error, data: [] };
  }
  const { nonce, signature } = signatureData;

  const headers = {
    'x-api-key': apiKey,
    'api-signature': signature,
    'nonce': nonce,
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch('https://gateway.bit2me.com' + path, {
      method: 'GET',
      headers: headers
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error('Error fetching Bit2Me wallets:', response.status, errorData);
      return { success: false, status: response.status, error: errorData.message || 'Failed to fetch wallets', data: [] };
    }
    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error('Network error fetching Bit2Me wallets:', error);
    return { success: false, error: error.message || 'Network error', data: [] };
  }
}

// Get transactions for a wallet in Bit2Me
export async function getBit2MeTransactions(walletId) {
  if (!walletId) {
    console.error('Wallet ID is required to fetch Bit2Me transactions.');
    return { success: false, error: 'Wallet ID not provided', data: [] };
  }
  const path = `/wallets/${walletId}/transactions`;
  const signatureData = generateSignature(path);
   if (signatureData.error) {
    return { success: false, error: signatureData.error, data: [] };
  }
  const { nonce, signature } = signatureData;

  const headers = {
    'x-api-key': apiKey,
    'api-signature': signature,
    'nonce': nonce,
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch('https://gateway.bit2me.com' + path, {
      method: 'GET',
      headers: headers
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error(`Error fetching Bit2Me transactions for wallet ${walletId}:`, response.status, errorData);
      return { success: false, status: response.status, error: errorData.message || 'Failed to fetch transactions', data: [] };
    }
    const data = await response.json();
    return { success: true, data: data };
  } catch (error) {
    console.error(`Network error fetching Bit2Me transactions for wallet ${walletId}:`, error);
    return { success: false, error: error.message || 'Network error', data: [] };
  }
}
