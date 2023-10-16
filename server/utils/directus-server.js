import {Directus} from '@directus/sdk'

export function createDirectus(config) {
    const directusUrl = config.public.directusUrl
    const directusToken = config.directusToken
    const $directus = new Directus(directusUrl, {
        auth: {
            staticToken: directusToken,
        },
    })
    return $directus
}
