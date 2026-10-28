<script setup lang="ts">
const { addItem } = useBoard()
</script>

<template>
  <BoardCanvas />
  <ItemToolbar @add="addItem" />
</template>
