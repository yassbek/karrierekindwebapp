import {createDirectus} from '~/server/utils/directus-server'
import {v4 as uuidv4} from "uuid";
import {getIdByUserType} from "../../utils/helper";

export default defineEventHandler(async (event) => {
    try {
        // get password
        const {password, token} = await readBody(event)
        // create directus client
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
        // get id of user
        const id = user.data[0].id
        // update user status to active and set new password
        try {
            await $directus.items('directus_users').updateOne(id, {
                status: 'active',
                password: password,
            })

            return {
                status: 200,
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
