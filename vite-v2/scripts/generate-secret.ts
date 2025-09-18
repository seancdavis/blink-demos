import crypto from 'crypto'

function generateRandomHash() {
  return crypto.randomBytes(20).toString('hex')
}

console.log(generateRandomHash())
