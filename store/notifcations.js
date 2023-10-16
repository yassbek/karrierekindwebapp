import {defineStore} from 'pinia'
import {getUserTypeById} from "~/utils/helper";
import {useAuth} from "~/store/auth";

export const useNotificationStore = defineStore('notifications', {
    state: () => ({
        notifications: []
    }),
    getters: {
        getNotifications(state) {
            return state.notifications;
        },
        unreadNotifications(state) {
            return state.notifications.filter(n => n.read_status === 'unread');
        },
    },
    actions: {
        addNotification(message, type, description, temporary, timestamp, readStatus, externalIdentifier, id) {
            const notification = {
                id: id ? id : Date.now(),
                message,
                type,
                description,
                show: true,
                temporary: temporary ,
                timestamp: timestamp ? timestamp : Date.now(),
                read_status: readStatus ? readStatus : 'unread',
                external_identifier: externalIdentifier ? externalIdentifier : null,
            }
            this.notifications.push(notification)
            if (temporary) {
                setTimeout(() => {
                    this.hideNotification(notification.id)
                }, 3000 * this.notifications.length)
            }
        },
        hideNotification(id) {
            const index = this.notifications.findIndex(n => n.id === id)
            if (index !== -1) {
                this.notifications[index].show = false
            }
        },
        async loadNotifications() {
            // reset state
            this.$patch({notifications: []})
            // determine user type
            const auth = useAuth()
            const userType = getUserTypeById(auth.user.role)
            let collection
            if (userType === 'Talente') {
                collection = 'Benachrichtigungen_Talente'
            } else {
                collection = 'Benachrichtigungen_Ansprechpartner'
            }
            const {$directus} = useNuxtApp()
            const {data: notifications} = await $directus.items(collection).readByQuery({
                fields: ["*,external_identifier.*"],
            })
            notifications.forEach(notification => {
                this.addNotification(
                    notification.message,
                    notification.type,
                    notification.description,
                    false,
                    notification.date_created,
                    notification.read_status,
                    notification.external_identifier[0].item,
                    notification.id
                );
            });

        },
        async markNotificationAsRead(id) {
            // TODO: mark notification as read in directus
            const notification = this.notifications.find(n => n.id === id);
            const {$directus} = useNuxtApp()
            if (notification) {
                notification.read_status = 'read'
                try {
                    await $directus.items('Benachrichtigungen_Talente').updateOne(notification.id, {
                        read_status: 'read'
                    })
                } catch (e) {
                    console.error(e)
                }
            }
        },
        async markAllAsRead() {
            const {$directus} = useNuxtApp()
            // mark all notifications as read in store
            for (let n of this.notifications) {
                n.read_status = 'read';
            }
            try {
                // get all notifications from directus
                const directusNotifications = await $directus.items('Benachrichtigungen_Talente').readByQuery({
                    fields: ['id']
                })
                // get all ids into an array
                const ids = directusNotifications.data.map(n => n.id)
                // update all notifications
                await $directus.items('Benachrichtigungen_Talente').updateMany(ids, {
                    read_status: 'read'
                })
                // refresh notifications
                await this.loadNotifications()
            } catch (e) {
                console.error(e)
            }
        },
    }
})
