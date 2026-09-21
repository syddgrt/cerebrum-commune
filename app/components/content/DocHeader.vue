<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () =>
  queryCollection('docs').path(route.path).first()
)

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
</script>

<template>
  <div class="border-b border-default ">
    <div class="mt-4 flex items-center gap-4 text-sm text-muted">
      <div class="flex items-center gap-1">
        <UIcon name="i-lucide-calendar" class="size-4" />
        {{ formattedDate }}
      </div>

      <div class="flex items-center gap-1">
        <UIcon name="i-lucide-clock-3" class="size-4" />
        {{ page.readingTime }} min read
      </div>
    </div>
  </div>
</template>