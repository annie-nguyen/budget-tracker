import type { Preview } from '@storybook/vue3-vite'

const preview: Preview = {
  parameters: {
    controls: {
      matcher: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
