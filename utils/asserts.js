/* eslint-env jest */
const t = require('tap')
const { strict } = require('tcompare')
const assert = require('assert')

t.Test.prototype.addAssert(
  'strictSameUnordered',
  2,
  function (found, wanted, message, extra) {
    if (message && typeof message === 'object') {
      extra = message
      message = ''
    }

    if (!extra) {
      extra = {}
    }

    message = message || 'should be equivalent strictly'
    extra.found = found
    extra.wanted = wanted
    try {
      assert.deepStrictEqual(found, wanted)
    } catch (err) {
      const s = strict(found, wanted, { style: 'js' })
      if (!s.match) {
        extra.diff = s.diff
      }
      return this.ok(s.match, message, extra)
    }
    return this.pass(message, extra)
  },
)
