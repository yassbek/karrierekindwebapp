import {navigateTo} from "#app";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = async (error, context) => {
        // show error message
        //console.error(error)
        // const auth = nuxtApp.$auth
        //await navigateTo('/')
    }
})