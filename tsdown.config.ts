import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { clientBundle } from '../../packages/client/tsdown.client.ts'

const repoRoot = fileURLToPath(new URL('../..', import.meta.url))
const requireFromWeb = createRequire(resolve(repoRoot, 'apps/web/package.json'))

const configs = clientBundle(
  '@haibala-aii/dsh-extensions-remotelink',
  ['src/index.ts', 'src/invariant.ts'],
)({ env: {} })

export default configs
