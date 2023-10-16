import {createDirectus} from '~~/server/utils/directus-server'
import {validatePassword} from "~/utils/helper";
import {v4 as uuidv4} from 'uuid';

export default defineEventHandler(async (event) => {
    try {
        // get email and password from request body
        const {email, password, userType} = await readBody(event)
        // check if password is valid
        const passwordValidation = validatePassword(password)
        if (passwordValidation !== true) {
            return {
                status: 400,
                    message: passwordValidation
            }
        }
        // create directus client
        const config = useRuntimeConfig()
        const $directus = createDirectus(config)
        // check if user already exists
        const existingUser = await $directus.users.readByQuery({
            filter: {
                email: {
                    _eq: email
                }
            }
        })
        // return 409 if user already exists
        if (existingUser.data.length > 0) {
            return {
                status: 409,
                message: 'User already exists'
            }
        }
        // user types
        const userTypes = {
            company: 'f832d35f-2593-4f5b-be26-b847d0235cd2',
            candidate: 'eedf077c-77f0-4f20-a5c5-6636063d5563'
        }
        // generate token for email verification
        const token = uuidv4()
        // create user
        const user = await $directus.users.createOne({
            email: email,
            password: password,
            role: userTypes[userType],
            status: 'active',
            external_identifier: token
        });
        // create talent profile or company profile
        const id = user.id

        try {
            //
            if (userType === 'candidate') {
                // create talent profile and link to user
                const profile = await $directus.items('Talente').createOne({
                    User: id,
                })
                console.log(profile)
            }
            //
            if (userType === 'company') {
                // create ansprechpartner and link to company profile and user
                const ansprechpartner = await $directus.items('Ansprechpartner').createOne({
                    User: id
                })
                // create company profile
                const companyProfile = await $directus.items('Unternehmen').createOne({
                    Ansprechpartner: [
                        {
                            "Ansprechpartner_id": {
                                "id": ansprechpartner.id
                            }
                        }
                    ]
                })

                console.log(companyProfile)
            }

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
