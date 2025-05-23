<template>
  <div
    :class="[
      // Group
      'group/experience',
      // Flex
      'flex',
      'odd:flex-row-reverse',
      // Spacing
      'mt-4',
      'first:mt-0',
    ]"
  >
    <slot />
  </div>
</template>
