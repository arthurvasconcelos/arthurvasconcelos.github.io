<script setup lang="ts">
const localeHead = useLocaleHead({ seo: true });

useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs ?? {},
  link: localeHead.value.link ?? [],
  meta: localeHead.value.meta ?? [],
}));

useHead({
  title: "Arthur Vasconcelos",
  meta: [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { name: "description", content: "Arthur Vasconcelos — Senior Front-End Engineer" },
  ],
  link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Arthur Vasconcelos",
        jobTitle: "Senior Front-End Engineer",
        url: "https://arthurvasconcelos.com.br",
        sameAs: [
          "https://github.com/arthurvasconcelos",
          "https://www.linkedin.com/in/arthurvasconcelos/",
          "https://stackoverflow.com/users/3130385/arthur-vasconcelos",
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Stockholm",
          addressCountry: "SE",
        },
      }),
    },
  ],
});

useSeoMeta({
  title: "Arthur Vasconcelos",
  ogTitle: "Arthur Vasconcelos",
  description: "Arthur Vasconcelos — Senior Front-End Engineer",
  ogDescription: "Arthur Vasconcelos — Senior Front-End Engineer",
  ogImage: "/og-image.png",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <main class="flex grow">
        <NuxtPage />
      </main>
    </NuxtLayout>
  </UApp>
</template>
