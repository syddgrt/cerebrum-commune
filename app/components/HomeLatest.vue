<script setup lang="ts">
const { data: posts } = await useAsyncData('latest-posts', () =>
  queryCollection('docs')
    .where('featured', '=', true)
    .where('published', '=', true)
    .order('date', 'DESC')
    .limit(3)
    .all()
)

const iconMap: Record<string, string> = {
  Azure: 'i-lucide-cloud',
  Kubernetes: 'i-lucide-server',
  Linux: 'i-lucide-terminal'
}

function formatDate(date: string) {
  const d = new Date(date)
  const day = d.getDate()
  const month = d.toLocaleDateString('en-GB', { month: 'long' })
  const year = d.getFullYear()

  const suffix =
    day % 10 === 1 && day !== 11 ? 'st' :
    day % 10 === 2 && day !== 12 ? 'nd' :
    day % 10 === 3 && day !== 13 ? 'rd' : 'th'

  return `${day}${suffix} ${month} ${year}`
}
</script>

<template>
  <div class="space-y-4">
    <NuxtLink
      v-for="post in posts"
      :key="post.path"
      :to="post.path"
      class="block group"
    >
      <UCard class="transition-all duration-200 group-hover:border-primary group-hover:bg-elevated/40">
        <div class="flex items-center gap-2 text-xs text-muted mb-3">
          <UIcon
            :name="iconMap[post.category || ''] || 'i-lucide-file-text'"
            class="text-primary"
          />
          <span>{{ post.category }}</span>
          <span>•</span>
          <span>{{ formatDate(post.date) }}</span>
          <span>•</span>
          <span>{{ post.readingTime }} min</span>
        </div>

        <h3 class="text-lg font-semibold group-hover:text-primary transition-colors">
          {{ post.title }}
        </h3>

        <p class="mt-2 text-muted">
          {{ post.description }}
        </p>
      </UCard>
    </NuxtLink>
  </div>
</template>