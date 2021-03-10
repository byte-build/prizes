import env from 'dotenv'
env.config()

import { removePrizes, updatePrizes } from './prizes'

Promise.all([removePrizes(), updatePrizes()])
