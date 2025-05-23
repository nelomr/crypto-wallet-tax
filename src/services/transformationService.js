// Transform Bit2Me transactions (structure as provided by user)
export function transformBit2MeTransactions(transactions) {
  if (!Array.isArray(transactions)) {
    console.warn('transformBit2MeTransactions expected an array, received:', transactions);
    return [];
  }
  return transactions.map(tx => ({
    id: tx.id || `bit2me-${tx.transaction_id || tx.timestamp}-${tx.amount}`, // Attempt to create a unique ID
    date: tx.timestamp, // Assuming this is in a format that can be displayed or further processed
    type: tx.type,
    amount: parseFloat(tx.amount) || 0,
    currency: tx.currency || '', // Assuming currency info is available
    fee: parseFloat(tx.fee) || 0,
    feeCurrency: tx.feeCurrency || tx.currency, // Assuming fee currency or default to tx currency
    from: tx.from || 'N/A',
    to: tx.to || 'N/A',
    original: tx // Keep original transaction for reference if needed
  }));
}

// Transform Hedera transactions
export function transformHederaTransactions(transactions) {
  if (!Array.isArray(transactions)) {
    console.warn('transformHederaTransactions expected an array, received:', transactions);
    return [];
  }
  return transactions.map(tx => {
    // Ensure consensus_timestamp is valid before processing
    let timestamp = 'N/A';
    if (tx.consensus_timestamp) {
        // Split into seconds and nanoseconds
        const parts = tx.consensus_timestamp.split('.');
        const seconds = parseInt(parts[0], 10);
        const nanoseconds = parseInt(parts[1] || '0', 10); // Handle cases where nanoseconds might be missing
        if (!isNaN(seconds)) {
            timestamp = new Date(seconds * 1000 + nanoseconds / 1000000).toISOString();
        } else {
            console.warn('Invalid seconds in Hedera timestamp:', tx.consensus_timestamp);
        }
    } else {
        console.warn('Missing consensus_timestamp in Hedera transaction:', tx);
    }

    const type = tx.type || 'UNKNOWN'; // Default type if missing
    const fee = (parseFloat(tx.charged_tx_fee) / 100000000) || 0; // Convert from tinybars to HBAR

    let amount = 0;
    let fromAddress = null;
    let toAddress = null;
    let currency = 'HBAR'; // Default for most transfers

    if (Array.isArray(tx.transfers)) {
      // For crypto transfers (HBAR or tokens)
      tx.transfers.forEach(transfer => {
        // We're interested in the net effect on the queried account for 'amount'
        // For simplicity, let's find the main transfer.
        // A more complex app might need to handle multiple transfers to/from the account_id
        // or represent internal transfers differently.
        // This example will simplify and try to find one main movement.
        if (transfer.amount < 0) {
          fromAddress = fromAddress || transfer.account; // Prefer first 'from'
          if (Math.abs(transfer.amount) > Math.abs(amount)) amount = transfer.amount / 100000000; // HBAR
        } else {
          toAddress = toAddress || transfer.account; // Prefer first 'to'
           if (transfer.amount > Math.abs(amount)) amount = transfer.amount / 100000000; // HBAR
        }
      });
    }
    
    // Fallback for NFT transfers if no HBAR/token amount is found, or to add NFT info
    if (Array.isArray(tx.nft_transfers) && tx.nft_transfers.length > 0) {
        if (amount === 0) type = tx.type === 'TOKENMINT' ? 'NFT_MINT' : 'NFT_TRANSFER'; // Refine type for NFTs
        // For simplicity, we're not setting 'amount' for NFTs here, but you could represent it as 1 NFT
        // and potentially use a different field for token_id/serial_number
        const nftTransfer = tx.nft_transfers[0]; // Consider the first NFT transfer for from/to
        fromAddress = fromAddress || nftTransfer.sender_account_id;
        toAddress = toAddress || nftTransfer.receiver_account_id;
        currency = nftTransfer.token_id || 'NFT';
    }


    return {
      id: tx.transaction_id || `hedera-${timestamp}-${type}`,
      date: timestamp,
      type: type.toUpperCase(),
      amount: amount, // Amount in HBAR or 0 for NFTs in this simplified version
      currency: currency,
      fee: fee, // Fee in HBAR
      feeCurrency: 'HBAR',
      from: fromAddress || 'N/A',
      to: toAddress || 'N/A',
      original: tx // Keep original transaction for reference
    };
  });
}
