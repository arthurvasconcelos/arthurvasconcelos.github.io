<script setup lang="ts">
import type { WorkRole } from "~/composables/useWorkExperience"

defineProps<{
  role: WorkRole
  showPeriod: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <li
    class="flex flex-col gap-2 border-slate-200 not-first:border-t not-first:pt-5 dark:border-slate-700"
  >
    <div class="flex flex-col gap-0.5">
      <h4 class="font-space-grotesk text-lg font-semibold">{{ role.title }}</h4>
      <p class="flex flex-wrap items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
        <template v-if="showPeriod">
          <span class="font-jetbrains">
            <time :datetime="role.startDate">{{ role.start }}</time>
            –
            <time v-if="role.endDate" :datetime="role.endDate">{{ role.end }}</time>
            <span v-else>{{ t("about.workExperiences.present") }}</span>
          </span>
          <UIcon name="mdi:circle-medium" aria-hidden="true" />
          {{ role.duration }}
          <UIcon name="mdi:circle-medium" aria-hidden="true" />
        </template>
        {{ t(`about.workExperiences.locationTypes.${role.locationType}`) }}
      </p>
    </div>

    <p class="text-sm text-slate-700 dark:text-slate-300">{{ t(role.descriptionKey) }}</p>

    <ul class="flex flex-wrap gap-1.5">
      <li v-for="keyword in role.keywords" :key="keyword">
        <UBadge color="neutral" variant="subtle" size="sm" class="font-jetbrains">
          {{ keyword }}
        </UBadge>
      </li>
    </ul>
  </li>
</template>
