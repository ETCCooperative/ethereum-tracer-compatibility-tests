/* eslint-env jest */
require('../utils/asserts')

const t = require('tap')
const Geth = require('../clients/geth')
const CoreGeth = require('../clients/coreGeth')

const geth = new Geth()
const coreGeth = new CoreGeth()

const clients = [geth, coreGeth]

const failedBlocksToSkip = []

const testRunner = async () => {
  await t.test('Test trace_block', async (t) => {
    let startBlockNumber = 1
    let latestBlockNumber = await geth.getBlockNumber()

    for (let i = startBlockNumber; i < latestBlockNumber; i++) {
      if (failedBlocksToSkip.indexOf(i) > -1) {
        console.log('-- Skipping block', i)
        continue
      }

      let requests = clients.map((client) => {
        return client.traceBlock(i)
      })

      let results = await Promise.all(requests)

      // keep only the JSON RPC result
      results = results.map((result) => result.result)

      const pass = t.strictSameUnordered(...results)
      if (!pass) {
        break
      }
    }

    t.end()
  })
}
testRunner()
