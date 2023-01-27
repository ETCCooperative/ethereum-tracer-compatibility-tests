const Web3 = require('web3')
const { promisify } = require('util')

const config = require('../config')

let id = 2000

function Geth(web3) {
  if (web3 instanceof Web3) {
    this.web3 = web3
  } else {
    this.web3 = new Web3(new Web3.providers.HttpProvider(config.GETH_RPC_URL))
  }

  this.send = promisify(this.web3.currentProvider.send).bind(
    this.web3.currentProvider,
  )
}

Geth.prototype.getBlockNumber = async function () {
  return await this.web3.eth.getBlockNumber()
}

Geth.prototype.traceBlock = async function (blockNumber) {
  if (!Web3.utils.isHexStrict(blockNumber)) {
    blockNumber = Web3.utils.toHex(blockNumber)
  }

  const opts = getTraceOptions()
  const payload = {
    jsonrpc: '2.0',
    id: id++,
    method: 'debug_traceBlockByNumber',
    params: [blockNumber, opts],
  }
  return await this.send(payload)
}

Geth.prototype.traceTransaction = async function (txHash) {
  const opts = getTraceOptions()
  const payload = {
    jsonrpc: '2.0',
    id: id++,
    method: 'debug_traceTransaction',
    params: [txHash, opts],
  }
  return await this.send(payload)
}

const getTraceOptions = function () {
  const opts = {
    tracer: 'flatCallTracer',
    convertParityErrors: true,
  }

  return opts
}

module.exports = Geth
