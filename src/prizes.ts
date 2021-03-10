export interface Prize {
	link: string
	name: string
	bits: number
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const prizes: Record<string, Prize> = require('../data/prizes.json')

export default prizes
