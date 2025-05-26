<script setup>
import { ref, onMounted, computed } from 'vue';
import useBit2me from './composables/useBit2me';
import useHedera from './composables/useHedera';
import { transformBit2meData, transformHederaData } from './services/transformationService'; // Assuming you have this service
import DynamicTable from './components/DynamicTable.vue';

const { bit2meData, fetchBit2meData } = useBit2me();
const { hederaData, fetchHederaData } = useHedera();

const tableData = computed(() => {
  const transformedBit2me = bit2meData.value ? transformBit2meData(bit2meData.value) : [];
  const transformedHedera = hederaData.value ? transformHederaData(hederaData.value) : [];
  return [...transformedBit2me, ...transformedHedera];
});

onMounted(async () => {
  await fetchBit2meData();
  await fetchHederaData();
});

</script>

<template>
  <div>
    <h1>Crypto Wallet Transactions</h1>
    <DynamicTable :data="tableData" />
  </div>
</template>

<style>
/* Add some basic styling if needed */
/* For example: */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
