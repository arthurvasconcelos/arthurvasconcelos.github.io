<script lang="ts" setup>
defineProps<{
  icon: string;
  name: string;
}>();
</script>

<template>
  <UBadge :icon="icon" color="primary" variant="subtle" size="md" class="font-jetbrains">
    {{ name }}
  </UBadge>
</template>
