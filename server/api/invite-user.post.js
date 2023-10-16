import {createDirectus} from '~/server/utils/directus-server'
import {v4 as uuidv4} from "uuid";
import {getIdByUserType} from "../../utils/helper";

export default defineEventHandler(async (event) => {
    try {
        // get email and name from request body
        const {email, preName, lastName, companyId} = await readBody(event)
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
        // check if user already exists
        if (existingUser && existingUser.data.length > 0) {
            // check if user has the correct user type
            if (existingUser?.data[0].role === getIdByUserType('Unternehmen')) {
                // check if user has ansprechpartner profile
                const existingAnsprechpartner = await $directus.items('Ansprechpartner').readByQuery({
                    filter: {
                        User: {
                            _eq: existingUser.data[0].id
                        }
                    }
                })
                // check if ansprechpartner exists and is already assigned to company
                if (existingAnsprechpartner && existingAnsprechpartner.data.length > 0) {
                    const companyProfile = await $directus.items('Unternehmen').readByQuery({
                        filter: {
                            Ansprechpartner: {
                                Ansprechpartner_id: {
                                    id: {
                                        _eq: existingAnsprechpartner.data[0].id
                                    }
                                }
                            }
                        },
                        fields: ['Ansprechpartner.Ansprechpartner_id.id']
                    })
                    if (companyProfile && companyProfile.data.length > 0) {
                        return {
                            status: 409,
                            message: 'Benutzer existiert und ist bereits einem Unternehmen zugeordnet'
                        }
                    } else {
                        // if ansprechpartner exists but is not assigned to company, assign it
                        // first get the right company profile
                        const companyProfile = await $directus.items('Unternehmen').readByQuery({
                            filter: {
                                id: {
                                    _eq: companyId
                                }
                            },
                            fields: ['Ansprechpartner.Ansprechpartner_id.id']
                        })
                        console.log('company profile', companyProfile)
                        // get ansprechpartner ids
                        const ansprechpartnerIds = companyProfile.data[0].Ansprechpartner.map(ansprechpartner => ansprechpartner.Ansprechpartner_id.id)
                        // push existing new to array
                        ansprechpartnerIds.push(existingAnsprechpartner.data[0].id)
                        // create structure for update
                        const ansprechpartnerPayload = []
                        ansprechpartnerIds.forEach(ansprechpartnerId => {
                            ansprechpartnerPayload.push({
                                Ansprechpartner_id: {
                                    id: ansprechpartnerId
                                }
                            })
                        })
                        // update company profile
                        const company = await $directus.items('Unternehmen').updateOne(companyId, {
                            Ansprechpartner: ansprechpartnerPayload
                        })
                        console.log('company profile updated', company)
                        // return success
                        return {
                            status: 200,
                        }
                    }
                }
            } else {
                // return error if user is not of type unternehmen
                return {
                    status: 409,
                    message: 'Benutzer existiert bereits als Talent'
                }
            }
        }
        // generate token for email verification
        const token = uuidv4()
        // generate password
        const password = uuidv4()
        // create user
        const user = await $directus.users.createOne({
            email: email,
            first_name: preName,
            last_name: lastName,
            password: password,
            role: getIdByUserType('Unternehmen'),
            status: 'invited',
            external_identifier: token
        });
        console.log('new user created', user)
        // create ansprechpartner
        const newAnsprechpartner = await $directus.items('Ansprechpartner').createOne({
            User: user.id,
            Vorname: preName,
            Nachname: lastName,
            EMail: email,
        })
        console.log('new ansprechpartner created', newAnsprechpartner)
        // get company profile
        const companyProfile = await $directus.items('Unternehmen').readByQuery({
            filter: {
                id: {
                    _eq: companyId
                }
            },
            fields: ['Ansprechpartner.Ansprechpartner_id.id']
        })
        console.log('company profile', companyProfile)
        // get ansprechpartner ids
        const ansprechpartnerIds = companyProfile.data[0].Ansprechpartner.map(ansprechpartner => ansprechpartner.Ansprechpartner_id.id)
        // push existing new id to array
        ansprechpartnerIds.push(newAnsprechpartner.id)
        // create structure for update
        const ansprechpartnerPayload = []
        ansprechpartnerIds.forEach(ansprechpartnerId => {
            ansprechpartnerPayload.push({
                Ansprechpartner_id: {
                    id: ansprechpartnerId
                }
            })
        })
        // update company profile
        const company = await $directus.items('Unternehmen').updateOne(companyId, {
            Ansprechpartner: ansprechpartnerPayload
        })

        console.log('company profile updated', company)

        return {
            status: 200,
        }
    } catch (e) {
        console.error(e)
        return e
    }
});
