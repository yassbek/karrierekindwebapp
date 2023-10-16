import {createDirectus} from '~~/server/utils/directus-server'

export default defineEventHandler(async (event) => {
    try {
        const {email} = await readBody(event)
        const config = useRuntimeConfig()
        const $directus = createDirectus(config)

        await $directus.auth.password.request(email);

        return {
            status: 200,
        }

    } catch (e) {
        console.error(e)
        return e
    }
});
