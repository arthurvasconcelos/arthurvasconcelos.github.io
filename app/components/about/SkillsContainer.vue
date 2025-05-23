<template>
  <div
    :class="[
      // display
      'grid',
      'grid-flow-dense',
      // layout
      'grid-cols-1',
      'sm:grid-cols-2',
      'md:grid-cols-3',
      // spacing
      'gap-2',
    ]"
  >
    <slot />
  </div>
</template>
