import { randomBytes } from 'crypto'

const secret = randomBytes(32).toString('hex')
console.log('Generated JWT Secret:')
console.log(secret)
console.log('\nAdd this to your environment variables as COOKIE_JWT_SECRET')
console.log('For local development, you can add it to your Netlify site settings')