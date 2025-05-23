<script lang="ts" setup>
defineProps<{
  title: string;
  icon?: string;
}>();
</script>

<template>
  <h3 class="flex items-center text-lg">
    <UIcon v-if="icon" :name="icon" class="mr-2" />
    {{ title }}
  </h3>
</template>

<style></style>
