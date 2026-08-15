import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { UserConfig } from 'tsdown'
import { clientBundle } from '../../packages/client/tsdown.client.ts'

const repoRoot = fileURLToPath(new URL('../..', import.meta.url))
const requireFromWeb = createRequire(resolve(repoRoot, 'apps/web/package.json'))

const configs = clientBundle(
  '@haibala-aii/dsh-extensions-remotelink',
  ['src/index.ts', 'src/invariant.ts'],
)({ env: {} })

/** Standalone phone page: inline every dependency (no ModuleLoader, no import map). */
const mobile: UserConfig = {
  name: '@haibala-aii/dsh-extensions-remotelink/mobile',
  entry: { mobile: 'src/mobile/index.tsx' },
  outDir: 'lib',
  format: 'esm',
  platform: 'browser',
  target: 'es2024',
  dts: false,
  sourcemap: true,
  clean: false,
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production'),
  },
  alias: {
    'react-dom/client': requireFromWeb.resolve('react-dom/client'),
    'react/jsx-runtime': requireFromWeb.resolve('react/jsx-runtime'),
  },
  deps: {
    alwaysBundle: [
      'react',
      'react/**',
      'react-dom',
      'react-dom/**',
      'zod',
      '@deepseek-ai/dsh-host-apiproxy',
      '@deepseek-ai/dsh-host-apiproxy/**',
    ],
  },
  outputOptions: {
    entryFileNames: 'mobile.js',
  },
}

export default [...configs, mobile]
