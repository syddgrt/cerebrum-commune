<script setup lang="ts">
definePageMeta({
  layout: false,
})

const lightStyle = ref<Record<string, string>>({
  '--light-x': '50vw',
  '--light-y': '50vh',
})
const lightVisible = ref(false)

function moveCursorLight(event: PointerEvent) {
  lightStyle.value = {
    '--light-x': `${event.clientX}px`,
    '--light-y': `${event.clientY}px`,
  }
  lightVisible.value = true
}

onMounted(() => {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (canHover && !reducedMotion) {
    window.addEventListener('pointermove', moveCursorLight, { passive: true })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', moveCursorLight)
})

const focusAreas = [
  {
    icon: 'i-lucide-cloud-cog',
    title: 'Cloud operations',
    description: 'Azure platforms, reliability, identity, and the details that keep services healthy.',
    to: '/codex/cloud/azure-cloud',
  },
  {
    icon: 'i-lucide-boxes',
    title: 'Kubernetes & GitOps',
    description: 'Production operations and hands-on experiments, from AKS to a Raspberry Pi cluster.',
    to: '/codex/devops/kubernetes/concepts',
  },
  {
    icon: 'i-lucide-house-plug',
    title: 'Homelab projects',
    description: 'Small-scale builds for storage, monitoring, networking, and practical troubleshooting.',
    to: '/portfolio/projects',
  },
]
</script>

<template>
  <UMain class="relative isolate">
    <div
      aria-hidden="true"
      class="cursor-light"
      :class="{ 'cursor-light--visible': lightVisible }"
      :style="lightStyle"
    />
    <UContainer class="landing-page relative z-10 py-8 sm:py-12 lg:py-16">
      <section class="landing-hero relative overflow-hidden rounded-3xl border border-default bg-gradient-to-br from-primary/10 via-elevated to-elevated px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
        <div class="landing-glow" />
        <div class="relative grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
          <div class="max-w-2xl">
            <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-default bg-default/70 px-3 py-1.5 text-xs font-medium text-muted">
              <UIcon name="i-lucide-orbit" class="size-4 text-primary" />
              Engineering journal <span aria-hidden="true">·</span> Est. 2024
            </div>

            <h1 class="text-4xl font-semibold tracking-tight text-pretty sm:text-5xl lg:text-6xl">
              Building reliable systems, <span class="text-primary">one lesson at a time.</span>
            </h1>
            <p class="mt-6 max-w-xl text-base leading-7 text-muted sm:text-lg">
              I’m <strong class="font-semibold text-default">Syed Muhammad Haikal</strong>, a cloud operations engineer exploring how infrastructure works in the real world—from production platforms to the tiny computers in my homelab.
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              <UButton to="/agora/introduction" color="primary" size="xl" trailing-icon="i-lucide-arrow-right">
                Explore the journal
              </UButton>
              <UButton to="/portfolio/aboutme" color="neutral" variant="outline" size="xl" icon="i-lucide-user-round">
                About me
              </UButton>
            </div>
          </div>

          <UCard class="landing-snapshot">
            <div class="flex items-center justify-between gap-3 border-b border-default pb-4">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Now exploring</p>
                <p class="mt-1 text-lg font-semibold">Cloud-native operations</p>
              </div>
              <div class="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UIcon name="i-lucide-server-cog" class="size-5" />
              </div>
            </div>
            <div class="space-y-5 py-5">
              <div class="flex items-center gap-3">
                <span class="landing-dot bg-emerald-500" />
                <div><p class="text-sm font-medium">Azure & Kubernetes</p><p class="text-xs text-muted">Platform reliability and operations</p></div>
              </div>
              <div class="flex items-center gap-3">
                <span class="landing-dot bg-sky-500" />
                <div><p class="text-sm font-medium">Homelab systems</p><p class="text-xs text-muted">Small hardware, real trade-offs</p></div>
              </div>
              <div class="flex items-center gap-3">
                <span class="landing-dot bg-violet-500" />
                <div><p class="text-sm font-medium">Learning in public</p><p class="text-xs text-muted">Notes, experiments, and discoveries</p></div>
              </div>
            </div>
            <div class="border-t border-default pt-4 text-xs text-muted">Curious by nature. Practical by habit.</div>
          </UCard>
        </div>
      </section>

      <section class="my-14 grid gap-12 lg:my-20 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
        <div>
          <div class="mb-6 flex items-end justify-between gap-4">
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Fresh from the notebook</p>
              <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">Latest articles</h2>
            </div>
            <UButton to="/codex/ai/concepts" color="neutral" variant="ghost" trailing-icon="i-lucide-arrow-up-right" size="sm">
              Browse all
            </UButton>
          </div>
          <HomeLatest />
        </div>

        <aside class="space-y-5 lg:pt-2">
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">The idea</p>
            <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">Understand the why.</h2>
          </div>
          <p class="leading-7 text-muted">
            This is a working notebook for the systems I build, operate, and learn from. I write down what worked, what broke, and the reasoning that made the difference.
          </p>
          <UCard class="bg-elevated/50">
            <UIcon name="i-lucide-quote" class="mb-3 size-5 text-primary" />
            <p class="font-medium leading-7">Good engineering starts with a useful mental model—not just a command that happens to work.</p>
          </UCard>
        </aside>
      </section>

      <section>
        <div class="mb-6">
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">What I’m working on</p>
          <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">A few current threads</h2>
        </div>
        <div class="grid gap-4 md:grid-cols-3">
          <UCard v-for="area in focusAreas" :key="area.title" class="landing-focus-card h-full">
            <NuxtLink :to="area.to" class="block h-full">
              <div class="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UIcon :name="area.icon" class="size-5" />
              </div>
              <h3 class="font-semibold">{{ area.title }}</h3>
              <p class="mt-2 text-sm leading-6 text-muted">{{ area.description }}</p>
              <span class="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Explore <UIcon name="i-lucide-arrow-right" class="size-4" />
              </span>
            </NuxtLink>
          </UCard>
        </div>
      </section>

      <footer class="mt-14 flex flex-col gap-3 border-t border-default pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Built with curiosity, Nuxt, and a lot of notes.</p>
        <div class="flex items-center gap-4">
          <a href="https://github.com/syddgrt" target="_blank" rel="noreferrer" class="inline-flex items-center gap-1.5 transition-colors hover:text-primary">
            <UIcon name="i-lucide-github" class="size-4" /> GitHub <UIcon name="i-lucide-arrow-up-right" class="size-3" />
          </a>
          <span>© 2026 Syed Muhammad Haikal</span>
        </div>
      </footer>
    </UContainer>
  </UMain>
</template>

<style scoped>
.landing-hero {
  isolation: isolate;
}

.cursor-light {
  position: fixed;
  z-index: 0;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    560px circle at var(--light-x) var(--light-y),
    color-mix(in srgb, var(--ui-primary) 13%, transparent),
    transparent 72%
  );
  transition: opacity 450ms ease;
}

.cursor-light--visible {
  opacity: 1;
}

.landing-glow {
  position: absolute;
  z-index: -1;
  top: -8rem;
  right: -4rem;
  width: 24rem;
  height: 24rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--ui-primary) 16%, transparent);
  filter: blur(70px);
  pointer-events: none;
}

.landing-dot {
  width: 0.55rem;
  height: 0.55rem;
  flex: 0 0 auto;
  border-radius: 9999px;
  box-shadow: 0 0 0 4px color-mix(in srgb, currentColor 12%, transparent);
}

.landing-focus-card {
  transition: transform 180ms ease, border-color 180ms ease;
}

.landing-focus-card:hover {
  transform: translateY(-2px);
  border-color: var(--ui-primary);
}

@media (prefers-reduced-motion: reduce) {
  .landing-focus-card {
    transition: none;
  }
}
</style>
