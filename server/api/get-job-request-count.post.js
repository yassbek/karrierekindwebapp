import {createDirectus} from '~~/server/utils/directus-server'

export default defineEventHandler(async (event) => {
    try {
        const {jobId} = await readBody(event);

        if (!jobId) return {status: 404};

        const config = useRuntimeConfig();
        const $directus = createDirectus(config);

        const talents = await $directus.items('Jobanfragen').readByQuery({
            filter: {Job: {_eq: jobId}, fields: ['id']}
        });

        const totalJobRequests = talents.data.length;
        const acceptedJobRequests = talents.data.filter(jobRequest => jobRequest.status === 'accepted').length;

        return {
            status: 200,
            totalJobRequests,
            acceptedJobRequests
        };

    } catch (e) {
        console.error(e);
        return e;
    }
});
