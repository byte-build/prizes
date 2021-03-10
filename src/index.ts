import env from 'dotenv'
env.config()

import firebase from './firebase'
import prizes from './prizes'
import getImage from './image'

const firestore = firebase.firestore()
const storage = firebase.storage().bucket()

Promise.all(
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
