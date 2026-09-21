<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { useRoute } from '#imports'

const route = useRoute()

const props = defineProps<{
  item: ContentNavigationItem
  opened: Record<string, boolean>
}>()

const emit = defineEmits<{
  'update:opened': [Record<string, boolean>]
}>()

// Fix Nuxt's title-casing for acronyms
const displayTitle = computed(() => {
  const map: Record<string, string> = {
    Ai: 'AI',
    Llm: 'LLM',
    Sre: 'SRE',
    'Ci Cd': 'CI/CD'
  }

  return map[props.item.title] ?? props.item.title
})

const hasChildren = computed(() => !!props.item.children?.length)

const expanded = computed({
  get: () => props.opened[props.item.title] ?? false,
  set: (value) => {
    emit('update:opened', {
      ...props.opened,
      [props.item.title]: value
    })
  }
})

const isActive = computed(() => route.path === props.item.path)

const hasActiveChild = computed(() => {
  const walk = (items?: ContentNavigationItem[]): boolean =>
    items?.some(i => i.path === route.path || walk(i.children)) ?? false

  return walk(props.item.children)
})
</script>

<template>
  <div>
    <!-- Folder -->
    <button
      v-if="hasChildren"
      @click="expanded = !expanded"
      class="w-full flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-all duration-200"
      :class="hasActiveChild ? 'text-primary font-semibold' : 'hover:bg-muted'"
    >
      <div class="flex items-center gap-2">
        <UIcon
          :name="expanded ? 'i-lucide-folder-open' : 'i-lucide-folder'"
          class="size-4 text-primary"
        />
        <span>{{ item.title }}</span>
      </div>

      <UIcon
        name="i-lucide-chevron-right"
        class="size-3 transition-transform duration-200"
        :class="{ 'rotate-90': expanded }"
      />
    </button>

    <!-- File -->
    <NuxtLink
    v-else
    :to="item.path"
    class="relative block rounded-md px-2 py-1.5 text-sm transition-all duration-200"
    :class="isActive
        ? 'bg-primary/10 text-primary font-medium'
        : 'text-muted hover:bg-muted hover:text-default'"
    >
    <!-- Green active indicator -->
    <div
        v-if="isActive"
        class="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-primary"
    />

    <span class="ml-2 truncate block">{{ item.title }}</span>
    </NuxtLink>

    <!-- Children -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[500px]"
      leave-from-class="opacity-100 max-h-[500px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div
        v-if="hasChildren && expanded"
        class="ml-3 overflow-hidden border-l border-default pl-3"
      >
        <AsideNode
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :opened="opened"
          @update:opened="emit('update:opened', $event)"
        />
      </div>
    </Transition>
  </div>
</template>