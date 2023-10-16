import {defineStore} from 'pinia'
import {getFilledFields, getUserTypeById} from "~/utils/helper";

export const useAuth = defineStore('auth', {
    state: () => ({
        loggedIn: false,
        token: null,
        user: {},
        userProfile: null,
    }),
    getters: {
        isLoggedIn: (state) => state.loggedIn,
        userData: (state) => state.user,
        userProfileData: (state) => state.userProfile,
    },
    actions: {
        async login({email, password, redirect}) {
            //const router = useRouter()
            const {$directus} = useNuxtApp()
            try {
                // Try to login
                const response = await $directus.auth.login({
                    email,
                    password,
                })
                // If login was successful, fetch the users data
                const user = await $directus.users.me.read({
                    fields: ['*'],
                })
                this.$patch({token: response.access_token})
                // Update the auth store with the user data
                this.$patch({loggedIn: true, user: user})
                this.$patch({user: user})
                // If there's a redirect, send the user there
                if (redirect) {
                    await navigateTo(redirect)
                }
            } catch (e) {
                console.log(e)
                throw new Error('Wrong email address or password')
            }
        },
        async logout() {
            //const router = useRouter()
            const {$directus} = useNuxtApp()
            try {
                // Try to logout
                const response = await $directus.auth.logout()
                // Remove the auth_expires_at cookie that is left over from the logout
                const authExpiration = useCookie('auth_expires_at')
                authExpiration.value = null
                // If logout was successful, reset the auth store
                this.$reset()
                // Send the user back to the home page
                await navigateTo('/')
            } catch (e) {
                console.log(e)
                throw new Error('Issue logging out')
            }
        },
        async getUser() {
            const {$directus} = useNuxtApp()
            this.$patch({user: {}})

            try {
                // Try to fetch the user data
                const userResponse = await $directus.users.me.read({
                    fields: ['*'],
                })
                console.log('got user: ' + userResponse.id)
                // Update the auth store with the user data
                this.$patch({loggedIn: true})
                this.$patch({user: userResponse})
            } catch (e) {
                console.log(e)
            }
        },
        async resetState() {
            this.$reset()
        },
        async updateUserProfile(collection, id, data) {
            const {$directus} = useNuxtApp()
            const filledData = getFilledFields(data)
            try {
                const profile = await $directus
                    .items(collection)
                    .updateOne(id, filledData)
                this.$patch({userProfile: profile.data})
                return profile
            } catch (e) {
                console.warn(e)
                return e
            }
        },
        async loadUserProfile() {
            const {$directus} = useNuxtApp()
            const userType = getUserTypeById(this.user.role)

            let collection
            let directusFields

            if (userType === 'Unternehmen') {
                collection = 'Ansprechpartner'
                directusFields = {fields: ['*.*']}
            } else {
                collection = 'Talente'
            }
            try {
                const profile = await $directus
                    .items(collection)
                    .readByQuery(directusFields)
                this.$patch({userProfile: profile.data[0]})
            } catch (e) {
                console.warn(e)
            }
        },
        async fetchData(collection, query) {
            if (!this.user) {
                await this.getUser()
                await this.loadUserProfile()
                console.log('loading user before fetch')
            }
            const {$directus} = useNuxtApp()
            try {
                const response = await $directus
                    .items(collection)
                    .readByQuery(query)
                return response
            } catch (e) {
                console.warn(e)
            }
        }
    },
})
