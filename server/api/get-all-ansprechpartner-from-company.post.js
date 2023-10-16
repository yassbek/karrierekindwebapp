import {createDirectus} from '~~/server/utils/directus-server'

export default defineEventHandler(async (event) => {
    try {
        const {companyId, userId} = await readBody(event);
        // If a value is missing, return 404
        if (!companyId) {
            console.log('Missing talentIds, companyId or jobId');
            return {status: 404};
        }
        // Create directus client
        const config = useRuntimeConfig();
        const $directus = createDirectus(config);
        // get all ansprechpartner from company
        const company = await $directus.items('Unternehmen').readByQuery({
            filter: {
                id: {
                    _eq: companyId
                }
            },
            fields: ['Ansprechpartner.Ansprechpartner_id.*']
        })
        return {
            status: 200,
            ansprechpartner: company.data[0].Ansprechpartner
        };

    } catch (e) {
        console.error(e);
        return e;
    }
});
