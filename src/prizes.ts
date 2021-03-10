import firebase from './firebase'
import getImage from './image'

interface Prize {
	link: string
	name: string
	bits: number
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const prizes: Record<string, Prize> = require('../data/prizes.json')

const firestore = firebase.firestore()
const storage = firebase.storage().bucket()

export const removePrizes = async () => {
	const newPrizes = Object.keys(prizes)
	const { docs: oldPrizes } = await firestore.collection('prizes').get()

	await Promise.all(
		oldPrizes
			.filter(({ id }) => !newPrizes.includes(id))
			.map(({ ref }) => ref.delete())
	)
}

export const updatePrizes = async () => {
	await Promise.all(
		Object.entries(prizes).map(async ([id, data]) => {
			const image = await getImage(id)

			await Promise.all([
				firestore.doc(`prizes/${id}`).set(data),
				storage.file(`prizes/${id}`).save(image.data, {
					public: true,
					gzip: true,
					metadata: {
						contentType: image.type,
						contentDisposition: `inline; filename=${JSON.stringify(data.name)}`,
						cacheControl: 'public, max-age=31536000, s-maxage=31536000'
					}
				})
			])
		})
	)
}
