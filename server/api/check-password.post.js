import {createDirectus} from '~/server/utils/directus-server'

export default defineEventHandler(async (event) => {
    try {
        // get email and password from request body
        const {email, password} = await readBody(event)
        // create directus client
        const config = useRuntimeConfig()
        const $directus = createDirectus(config)
        // check if email and password are correct
        const response = await $directus.auth.login({
            email,
            password,
        })
        // if email and password are not correct, return 401
        if (!response) {
            return {
                status: 401,
            }
        }
        // if email and password are correct, return 200
        return {
            status: 200,

        }
    } catch (e) {
        console.error(e)
        return e
    }
});
