import { ref } from 'vue';
import { getHederaTransactions } from '@/services/hederaApi'; // Assuming @ is aliased to src
import { transformHederaTransactions } from '@/services/transformationService';

// Default account ID from environment variable, can be overridden by function argument
const defaultHederaAccountId = import.meta.env.VITE_HEDERA_ACCOUNT_ID;

export default function() {
  const hederaTransactions = ref([]);
  const isLoadingHederaTransactions = ref(false);
  const errorHederaTransactions = ref(null);

  const fetchTransactions = async (accountId) => {
    const targetAccountId = accountId || defaultHederaAccountId;
    if (!targetAccountId) {
      errorHederaTransactions.value = 'Hedera Account ID is required (either as argument or VITE_HEDERA_ACCOUNT_ID).';
      console.error(errorHederaTransactions.value);
      hederaTransactions.value = [];
      return;
    }

    isLoadingHederaTransactions.value = true;
    errorHederaTransactions.value = null;
    hederaTransactions.value = [];
    try {
      const response = await getHederaTransactions(targetAccountId);
      if (response.success) {
        hederaTransactions.value = transformHederaTransactions(response.data);
      } else {
        errorHederaTransactions.value = response.error || 'Failed to fetch Hedera transactions';
        console.error('useHedera fetchTransactions error:', errorHederaTransactions.value);
      }
    } catch (e) {
      errorHederaTransactions.value = e.message || 'An unexpected error occurred';
      console.error('useHedera fetchTransactions exception:', e);
    } finally {
      isLoadingHederaTransactions.value = false;
    }
  };

  return {
    hederaTransactions,
    isLoadingHederaTransactions,
    errorHederaTransactions,
    fetchTransactions // Renamed from fetchHederaTransactions for potential generic use
  };
}
