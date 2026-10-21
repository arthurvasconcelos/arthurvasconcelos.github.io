type Collection = "blog" | "labs"

export type ContentTranslation = { path: string; name: string; to: string }

const DIR_TO_NAME: Record<string, string> = {
  "en-gb": "English",
  "pt-br": "Português",
  sv: "Svenska",
}

function toTranslation(collection: Collection, contentPath: string): ContentTranslation {
  const dir = contentPath.split("/")[1] ?? ""
  const slug = contentPath.split("/").at(-1)!
  const to = dir === "en-gb" ? `/${collection}/${slug}` : `/${dir}/${collection}/${slug}`
  return { path: contentPath, name: DIR_TO_NAME[dir] ?? dir, to }
}

// Other locales the same entry is published in, excluding the one being read.
export function useContentTranslations(
  collection: Collection,
  translationKey: MaybeRefOrGetter<string | undefined>,
) {
  const { locale } = useI18n()
  const localeDir = locale.value.toLowerCase()
  const key = toValue(translationKey)

  return useAsyncData(`translations-${collection}-${localeDir}-${key ?? "none"}`, async () => {
    if (!key) return [] as ContentTranslation[]
    const all = await queryCollection(collection).where("translationKey", "=", key).all()
    return all
      .filter((item) => !item.draft && !item.path.startsWith(`/${localeDir}/`))
      .map((item) => toTranslation(collection, item.path))
  })
}
