<script lang="ts" setup>
defineProps<{
  title: string;
}>();
</script>

<template>
  <h2 class="flex items-center w-full">
    <div class="grow h-1 bg-slate-700" />
    <span class="font-raleway text-2xl mx-2.5">{{ title }}</span>
    <div class="grow h-1 bg-slate-700" />
  </h2>
</template>

<style></style>
