<template>  
  <table>
    <thead>
      <tr>
        <th>Tipo de transacción</th>
        <th>Fecha</th>
        <th>Salida</th>
        <th>Entrada</th>
        <th>Importe</th>
        <th>Comisiones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in paginatedData" :key="index">
        <td>{{ row['Tipo de transacción'] }}</td>
        <td>{{ row['Fecha'] }}</td>
        <td>
          {{ row['Salida'] }}
          <span v-if="row['Salida']">{{ ` (${row.currency} - ${row.source})` }}</span>
        </td>
        <td>
          {{ row['Entrada'] }}
          <span v-if="row['Entrada']">{{ ` (${row.currency} - ${row.source})` }}</span>
        </td>


        <td>{{ row['Importe'] }}</td>
        <td>{{ row['Comisiones'] }}</td>
      </tr>
    </tbody>
  </table>  
  <div class="pagination">
    <button @click="prevPage" :disabled="currentPage === 1">Anterior</button>
    <span>Página {{ currentPage }} de {{ totalPages }}</span>
    <button @click="nextPage" :disabled="currentPage === totalPages">Siguiente</button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import useBit2me from '../composables/useBit2Me';
import useHedera from '../composables/useHedera';
import { transformBit2MeTransactions, transformHederaTransactions } from '../services/transformationService'; // Assuming you have a transformation service

const { transactions, fetchTransactions: fetchBit2meTransactions } = useBit2me();
const { hederaTransactions, fetchTransactions: fetchHederaTransactions } = useHedera();

const allData = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10; // You can make this a prop or configurable

const transformedData = computed(() => {
  const transformedBit2me = transactions.value ? transformBit2MeTransactions(transactions.value) : [];
  const transformedHedera = hederaTransactions.value ? transformHederaTransactions(hederaTransactions.value) : [];
  return [...transformBit2MeTransactions(transactions.value), ...transformedHedera];
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return transformedData.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(transformedData.value.length / itemsPerPage);
});

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

onMounted(async () => {
  await fetchBit2meTransactions();
  await fetchHederaTransactions();
});
</script>

<style scoped>
/* Add your table styles here */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  text-align: left;
}

.pagination {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>