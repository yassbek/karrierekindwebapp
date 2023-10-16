import {createDirectus} from '~~/server/utils/directus-server'

export default defineEventHandler(async (event) => {
    try {
        const {token} = await readBody(event)
        const config = useRuntimeConfig()
        const $directus = createDirectus(config)
        // find user by token
        const user = await $directus.items('directus_users').readByQuery({
            filter: {
                external_identifier: {
                    _eq: token
                }
            }
        })
        // return 404 if user not found
        if (user.data.length === 0) {
            return {
                status: 404,
            }
        }
        // check if user has status invited
        let needsNewPassword = false
        if (user.data[0].status === 'invited') {
            needsNewPassword = true
        }
        // get id of user
        const id = user.data[0].id
        // update user status to verified
        try {
            const response = await $directus.items('directus_users').updateOne(id, {verified: true})
            console.log(response)

            return {
                status: 200,
                needsNewPassword : needsNewPassword
            }

        } catch (e) {
            console.error(e)
            return e
        }

    } catch (e) {
        console.error(e)
        return e
    }
});
