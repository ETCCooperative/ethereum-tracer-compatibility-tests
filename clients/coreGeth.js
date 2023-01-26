const Web3 = require('web3')
const { promisify } = require('util')

const config = require('../config')

let id = 2000

function CoreGeth(web3) {
  if (web3 instanceof Web3) {
    this.web3 = web3
  } else {
    this.web3 = new Web3(
      new Web3.providers.HttpProvider(config.CORE_GETH_RPC_URL),
    )
  }

  this.send = promisify(this.web3.currentProvider.send).bind(
    this.web3.currentProvider,
  )
}

CoreGeth.prototype.traceBlock = async function (blockNumber) {
  if (!Web3.utils.isHexStrict(blockNumber)) {
    blockNumber = Web3.utils.toHex(blockNumber)
  }

  const opts = getTraceOptions()

  const payload = {
    jsonrpc: '2.0',
    id: id++,
    method: config.CORE_GETH_USE_DEBUG_NAMESPACE
      ? 'debug_traceBlockByNumber'
      : 'trace_block',
    params: [blockNumber, opts],
  }
  const trace = await this.send(payload)
  return conformTraceBlock(trace)
}

CoreGeth.prototype.traceTransaction = async function (txHash) {
  const opts = getTraceOptions()

  const payload = {
    jsonrpc: '2.0',
    id: id++,
    method: config.CORE_GETH_USE_DEBUG_NAMESPACE
      ? 'debug_traceTransaction'
      : 'trace_transaction',
    params: [txHash, opts],
  }
  return await this.send(payload)
}

const getTraceOptions = function () {
  const opts = {}

  if (config.CORE_GETH_USE_DEBUG_NAMESPACE) {
    opts.tracer = 'callTracerParity'
  }

  return opts
}

const conformTraceBlock = (trace) => {
  trace = filterOutRewards(trace)

  trace.result.map((t) => {
    t = blockNumberToHex(t)
    t = txPositionToHex(t)
    return t
  })

  return trace
}

const filterOutRewards = (trace) => {
  trace.result = trace.result.filter((t) => t.type !== 'reward')
  return trace
}

const blockNumberToHex = (trace) => {
  trace.result = trace.result.map((t) => {
    t.blockNumber = Web3.utils.toHex(t.blockNumber)
    return t
  })
  return trace
}

const txPositionToHex = (trace) => {
  trace.result = trace.result.map((t) => {
    t.transactionPosition = Web3.utils.toHex(t.transactionPosition)
    return t
  })
  return trace
}

module.exports = CoreGeth
