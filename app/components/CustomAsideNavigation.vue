<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const opened = ref<Record<string, boolean>>({
  Codex: true,
  Portfolio: false,
  Lab: false,
  DevOps: false,
  Cloud: false,
  Linux: true,
  AI: false,
  "Machine Automation": false,
  "Site Reliability Engineering": false
})
</script>

<template>
  <nav class="space-y-1">
    <AsideNode
      v-for="item in navigation"
      :key="item.path"
      :item="item"
      :opened="opened"
      @update:opened="opened = $event"
    />
  </nav>
</template>