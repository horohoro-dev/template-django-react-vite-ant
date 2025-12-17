import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: {
      target: '../openapi.dashboard.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/generated/api',
      schemas: './src/generated/schemas',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        mutator: {
          path: './src/lib/axios.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
})
