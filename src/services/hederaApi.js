// Get transactions for an account on Hedera
export async function getHederaTransactions(accountId) {
  if (!accountId) {
    console.error('Hedera Account ID is required.');
    return { success: false, error: 'Account ID not provided', transactions: [] };
  }

  const url = `https://mainnet.mirrornode.hedera.com/api/v1/transactions?account.id=${accountId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error(`Error fetching Hedera transactions for account ${accountId}:`, response.status, errorData);
      return { success: false, status: response.status, error: errorData.message || 'Failed to fetch transactions', transactions: [] };
    }
    const data = await response.json();
    // The original function returned data.transactions, so we stick to that,
    // but wrap it for consistency with the Bit2Me service.
    return { success: true, data: data.transactions || [] }; // Ensure data is an array
  } catch (error) {
    console.error(`Network error fetching Hedera transactions for account ${accountId}:`, error);
    return { success: false, error: error.message || 'Network error', transactions: [] };
  }
}
