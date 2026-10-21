<script setup lang="ts">
import type { WorkExperience } from "~/composables/useWorkExperience"

defineProps<{
  experience: WorkExperience
}>()

const { t } = useI18n()
</script>

<template>
  <li class="relative pb-8 pl-10 last:pb-0 sm:pl-12">
    <AboutExperienceLogo
      :experience="experience"
      class="absolute top-2 left-[-1px] -translate-x-1/2"
    />
    <UCard>
      <template #header>
        <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div class="flex flex-col gap-0.5">
            <h3 class="font-space-grotesk text-xl font-bold">
              {{ experience.company }}
            </h3>
            <p class="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
              <UIcon :name="experience.locationIcon" aria-hidden="true" />
              {{ t(`about.workExperiences.locations.${experience.locationKey}`) }}
              <UIcon name="mdi:circle-medium" aria-hidden="true" />
              {{ experience.duration }}
            </p>
          </div>
          <p class="font-jetbrains text-sm whitespace-nowrap text-slate-600 dark:text-slate-400">
            <time :datetime="experience.startDate">{{ experience.start }}</time>
            –
            <time v-if="experience.endDate" :datetime="experience.endDate">{{
              experience.end
            }}</time>
            <span v-else>{{ t("about.workExperiences.present") }}</span>
          </p>
        </div>
      </template>

      <ol class="flex flex-col gap-5">
        <AboutExperienceRole
          v-for="role in experience.roles"
          :key="role.id"
          :role="role"
          :show-period="experience.roles.length > 1"
        />
      </ol>
    </UCard>
  </li>
</template>
