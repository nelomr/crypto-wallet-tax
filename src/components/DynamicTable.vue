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
import useBit2me from '../composables/useBit2me';
import useHedera from '../composables/useHedera';
import { transformBit2meData, transformHederaData } from '../services/transformationService'; // Assuming you have a transformation service

const { bit2meData, fetchBit2meData } = useBit2me();
const { hederaData, fetchHederaData } = useHedera();

const allData = ref([]);
const currentPage = ref(1);
const itemsPerPage = 10; // You can make this a prop or configurable

const transformedData = computed(() => {
  const transformedBit2me = bit2meData.value ? transformBit2meData(bit2meData.value) : [];
  const transformedHedera = hederaData.value ? transformHederaData(hederaData.value) : [];
  return [...transformedBit2me, ...transformedHedera];
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
  await fetchBit2meData();
  await fetchHederaData();
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