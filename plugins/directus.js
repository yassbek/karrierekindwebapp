import { BaseStorage, Directus } from '@directus/sdk'
import { useAuth } from '~~/store/auth'

// Make sure you review the Directus SDK documentation for more information
// https://docs.directus.io/reference/sdk.html

export default defineNuxtPlugin(async (nuxtApp) => {
    const config = useRuntimeConfig()
    const directusUrl = config.public.directusUrl
    // Create a new storage class to use with the SDK
    // Needed for the SSR to play nice with the SDK
    class CookieStorage extends BaseStorage {
        deletedKeys = new Set()
        get(key) {
            if (this.deletedKeys.has(key)) return null
            const cookie = useCookie(key)
            return cookie.value
        }
        set(key, value) {
            this.deletedKeys.delete(key)
            const cookie = useCookie(key)
            return (cookie.value = value)
        }
        delete(key) {
            this.deletedKeys.add(key)
            const cookie = useCookie(key)
            return (cookie.value = null)
        }
    }
    // Create a new instance of the SDK
    const directus = new Directus(directusUrl, {
        storage: new CookieStorage(),
        auth: {
            mode: 'json',
        },
    })
    // Check if the user is logged in
    directus.transport.axios.interceptors.response.use(async function(response) {
        // If response is okay, just return it
        return response;
    }, async function (error) {
        // If token expired error, try to refresh the token
        if (error.response.status === 401 && error.response.data?.errors[0]?.message === 'Token expired.') {
            try {
                // Check if we've already tried to refresh the token
                if (!error.config.__isRetryRequest) {
                    await directus.auth.refresh();  // Refresh the token
                    // Retry the request
                    error.config.__isRetryRequest = true;
                    return directus.transport.axios.request(error.config);
                } else {
                    // If we've already tried to refresh the token, log out
                    await directus.auth.logout();
                    navigateTo('/login');
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                console.error(refreshError);
                // If refresh or logout failed, throw original error
                navigateTo('/login');
                // reload the page everything is broken
                if (process.client) window.location.reload()
                console.log('hard reload when refresh token fails')
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    });

    // Make the Directus SDK available to the rest of the app
    nuxtApp.provide('directus', directus)
})
