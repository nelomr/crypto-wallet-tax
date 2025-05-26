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
      <tr v-for="(row, index) in data" :key="index">
        <td>{{ row['Tipo de transacción'] }}</td>
        <td>{{ row['Fecha'] }}</td>
        <td>{{ row['Salida'] }}</td>
        <td>{{ row['Entrada'] }}</td>
        <td>{{ row['Importe'] }}</td>
        <td>{{ row['Comisiones'] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
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
</style>