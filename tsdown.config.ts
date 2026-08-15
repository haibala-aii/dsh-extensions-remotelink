import { clientBundle } from '../../packages/client/tsdown.client.ts'

const configs = clientBundle(
  '@haibala/dsh-remote-web-ui',
  ['src/index.ts', 'src/invariant.ts'],
)({ env: {} })

/** Browser bundle from src — skip the node half already shipped in lib/. */
export default configs.filter(config => String(config.name ?? '').endsWith('/client'))
