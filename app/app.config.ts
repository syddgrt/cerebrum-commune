export default defineAppConfig({
  title: 'Syed Docs',
  description: 'Engineering notes and chaos',

  ui: {
    pageHero: {
      slots: {
        container: 'w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6'
      }
    },

    prose: {
      card: {
        slots: {
          base: 'relative rounded-lg border border-default p-5 text-left',
          title: 'text-left font-semibold',
          description: 'text-left text-muted'
        }
      }
    }
  }
})