import {createDirectus} from '~~/server/utils/directus-server'

export default defineEventHandler(async (event) => {
    try {
        const {companyId, jobId, talentIds: rawTalentIds} = await readBody(event);
        // If talentIds is a string, convert it to an array
        let talentIds = typeof rawTalentIds === 'string' ? [rawTalentIds] : rawTalentIds;
        // If a value is missing, return 404
        if (!companyId || !jobId || !talentIds) {
            console.log('Missing talentIds, companyId or jobId');
            return {status: 404};
        }
        // Create directus client
        const config = useRuntimeConfig();
        const $directus = createDirectus(config);
        // Generate promises for each talentId
        const jobRequestPromises = talentIds.map(talentId => {
            return $directus.items('Jobanfragen').readByQuery({
                filter: {
                    Job: {_eq: jobId},
                    Talent: {_eq: talentId},
                    status: {_eq: 'accepted'}
                }
            });
        });
        // Execute promises
        const jobRequestsResults = await Promise.all(jobRequestPromises);
        // Filter out talents that don't have accepted job requests
        const acceptedTalentUserIds = jobRequestsResults
            .filter(result => result && result.data.length > 0)
            .map(result => result.data[0].Talent);
        // If no talents have accepted requests, return 404
        if (acceptedTalentUserIds.length === 0) {
            console.log('No talents have accepted requests');
            return {status: 404};
        }
        // Get talents
        const talents = await $directus.items('Talente').readByQuery({
            filter: {
                id: {
                    _in: acceptedTalentUserIds.join(",")
                }
            },
            fields: ['*.*']
        });
        // If there are no talents, return 404
        if (!talents || talents.data.length === 0) {
            return {status: 404};
        }

        // Initialize a talent profile with minimal data (e.g., just the ID)
        const createEmptyTalentProfile = (id) => {
            return {
                id,
                Profilbild: null,
                Nachname: null,
                Vorname: null,
                Ort: null,
                Biografie: null,
                Wie_weit_soll_der_Arbeitsort_maximal_entfernt_sein: null,
                // check if other fields are allowed to be shown
            };
        };

        // Remove private data from talents
        const talentProfiles = talents.data.map(talentProfile => {
            // Initialize each talent profile with an empty template but with ID
            let sanitizedProfile = createEmptyTalentProfile(talentProfile.id);

            // If anonymization is set to "hidden", only include the first letter of the first name and the last name
            if (!talentProfile.Anonymisierung || talentProfile.Anonymisierung === 'hidden') {
                sanitizedProfile.Nachname = talentProfile.Nachname;
                sanitizedProfile.Ort = talentProfile.Ort
                // get the first letter and add a dot
                sanitizedProfile.Vorname = talentProfile.Vorname ? talentProfile.Vorname.charAt(0) + '.' : null;
            }

            // If anonymization is set to "without_image", include everything but the image
            else if (talentProfile.Anonymisierung === 'without_image') {
                sanitizedProfile.Nachname = talentProfile.Nachname;
                sanitizedProfile.Vorname = talentProfile.Vorname;
                sanitizedProfile.Ort = talentProfile.Ort
                // Add other fields that are allowed to be shown
            }

            // If anonymization is set to "public", include everything
            else if (talentProfile.Anonymisierung === 'public') {
                sanitizedProfile = {
                    id: talentProfile.id,
                    Profilbild: talentProfile.Profilbild,
                    Nachname: talentProfile.Nachname,
                    Vorname: talentProfile.Vorname,
                    Ort: talentProfile.Ort,
                    Biografie: talentProfile.Biografie,
                    Wie_weit_soll_der_Arbeitsort_maximal_entfernt_sein: talentProfile.Wie_weit_soll_der_Arbeitsort_maximal_entfernt_sein,
                    // Include other fields as needed
                };
            }

            return sanitizedProfile;
        });
        return {
            status: 200,
            data: {talents: talentProfiles}
        };

    } catch (e) {
        console.error(e);
        return e;
    }
});
