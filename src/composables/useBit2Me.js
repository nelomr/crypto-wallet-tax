import { ref } from 'vue';
import { getBit2MeWallets, getBit2MeTransactions } from '@/services/bit2meApi'; // Assuming @ is aliased to src
import { transformBit2MeTransactions } from '@/services/transformationService';

export function useBit2Me() {
  const wallets = ref([]);
  const transactions = ref([]);
  const isLoadingWallets = ref(false);
  const errorWallets = ref(null);
  const isLoadingTransactions = ref(false);
  const errorTransactions = ref(null);

  const fetchWallets = async () => {
    isLoadingWallets.value = true;
    errorWallets.value = null;
    wallets.value = [];
    try {
      const response = await getBit2MeWallets();
      if (response.success) {
        wallets.value = response.data;
      } else {
        errorWallets.value = response.error || 'Failed to fetch wallets';
        console.error('useBit2Me fetchWallets error:', errorWallets.value);
      }
    } catch (e) {
      errorWallets.value = e.message || 'An unexpected error occurred';
      console.error('useBit2Me fetchWallets exception:', e);
    } finally {
      isLoadingWallets.value = false;
    }
  };

  const fetchTransactions = async (walletId) => {
    if (!walletId) {
      errorTransactions.value = 'Wallet ID is required to fetch transactions.';
      console.error(errorTransactions.value);
      transactions.value = [];
      return;
    }
    isLoadingTransactions.value = true;
    errorTransactions.value = null;
    transactions.value = [];
    try {
      const response = await getBit2MeTransactions(walletId);
      if (response.success) {
        transactions.value = transformBit2MeTransactions(response.data);
      } else {
        errorTransactions.value = response.error || 'Failed to fetch transactions';
        console.error('useBit2Me fetchTransactions error:', errorTransactions.value);
      }
    } catch (e) {
      errorTransactions.value = e.message || 'An unexpected error occurred';
      console.error('useBit2Me fetchTransactions exception:', e);
    } finally {
      isLoadingTransactions.value = false;
    }
  };

  return {
    wallets,
    transactions,
    isLoadingWallets,
    errorWallets,
    isLoadingTransactions,
    errorTransactions,
    fetchWallets,
    fetchTransactions
  };
}
