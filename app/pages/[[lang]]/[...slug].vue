<script setup lang="ts">
import { kebabCase } from 'scule'
import type { ContentNavigationItem, Collections, DocsCollectionItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({
  layout: 'docs',
})

const route = useRoute()
const { locale, isEnabled, t } = useDocusI18n()
const { isOpen } = useAssistant()
const appConfig = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const collectionName = computed(() => isEnabled.value ? `docs_${locale.value}` : 'docs')

const [{ data: page }, { data: surround }] = await Promise.all([
  useAsyncData(kebabCase(route.path), () =>
    queryCollection(collectionName.value as keyof Collections)
      .path(route.path)
      .first() as Promise<DocsCollectionItem>
  ),
  useAsyncData(`${kebabCase(route.path)}-surround`, () => {
    return queryCollectionItemSurroundings(
      collectionName.value as keyof Collections,
      route.path,
      { fields: ['description'] }
    )
  }),
])

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

const headline = ref(findPageHeadline(navigation?.value, page.value?.path))
const breadcrumbs = computed(() => findPageBreadcrumbs(navigation?.value, page.value?.path || ''))

useSeo({
  title,
  description,
  type: 'article',
  modifiedAt: (page.value as unknown as Record<string, unknown>).modifiedAt as string | undefined,
  breadcrumbs,
})

watch(() => navigation?.value, () => {
  headline.value = findPageHeadline(navigation?.value, page.value?.path) || headline.value
})

defineOgImage('Docs', {
  headline: headline.value,
  title: title?.slice(0, 60),
  description: formatOgDescription(title, description),
})

const github = computed(() => appConfig.github ? appConfig.github : null)

const editLink = computed(() => {
  if (!github.value) return

  return [
    github.value.url,
    'edit',
    github.value.branch,
    github.value.rootDir,
    'content',
    `${page.value?.stem}.${page.value?.extension}`,
  ].filter(Boolean).join('/')
})

const formattedDate = computed(() => {
  if (!page.value?.date) return ''

  const d = new Date(page.value.date)
  const day = d.getDate()

  const suffix =
    day % 10 === 1 && day !== 11 ? 'st'
    : day % 10 === 2 && day !== 12 ? 'nd'
    : day % 10 === 3 && day !== 13 ? 'rd'
    : 'th'

  return `${day}${suffix} ${d.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric'
  })}`
})

addPrerenderPath(`/raw${route.path}.md`)
</script>

<template>
  <UPage
    v-if="page"
    :ui="isOpen ? { center: 'lg:col-span-10' } : undefined"
  >
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :headline="headline"
      :ui="{
        wrapper: 'flex-row items-center flex-wrap justify-between',
      }"
    >
      <template #links>
        <UButton
          v-for="(link, index) in (page as DocsCollectionItem).links"
          :key="index"
          size="sm"
          v-bind="link"
        />

        <DocsPageHeaderLinks />
      </template>
    </UPageHeader>

    <!-- ✨ Metadata row -->
    <div class="flex items-center gap-4 text-sm text-muted mt-4">
      <div class="flex items-center gap-1.5">
        <UIcon name="i-lucide-calendar-days" class="size-4" />
        {{ formattedDate }}
      </div>

      <div class="w-1 h-1 rounded-full bg-muted" />

      <div class="flex items-center gap-1.5">
        <UIcon name="i-lucide-clock-3" class="size-4" />
        {{ page.readingTime }} min read
      </div>
    </div>

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />

      <USeparator v-if="github">
        <div class="flex items-center gap-2 text-sm text-muted">
          <UButton
            variant="link"
            color="neutral"
            :to="editLink"
            target="_blank"
            icon="i-lucide-pen"
            :ui="{ leadingIcon: 'size-4' }"
          >
            {{ t('docs.edit') }}
          </UButton>

          <template v-if="github?.url">
            <span>{{ t('common.or') }}</span>
            <UButton
              variant="link"
              color="neutral"
              :to="`${github.url}/issues/new/choose`"
              target="_blank"
              icon="i-lucide-alert-circle"
              :ui="{ leadingIcon: 'size-4' }"
            >
              {{ t('docs.report') }}
            </UButton>
          </template>
        </div>
      </USeparator>

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template
      v-if="!isOpen"
      #right
    >
      <DocsAsideRight :page="page" />
    </template>
  </UPage>
</template>