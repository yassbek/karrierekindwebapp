<template>
    <div class="dashboard-notifications-container">
        <div class="dashboard-notifications-bubble" v-if="unreadNotifications.length">{{ unreadNotifications.length }}</div>
        <div class="dashboard-notifications-head">
            <div class="dashboard-notifications-head-title">Benachrichtigungen</div>
          <button v-if="unreadNotifications.length > 0" @click="notificationStore.markAllAsRead()">als gelesen markieren</button>
        </div>
        
        <p class="dashboard-notification-none" v-if="!notifications.length" style="padding: 0 30px 30px;"><i>Keine Benachrichtigungen vorhanden</i></p>

        <div class="dashboard-notifications" v-if="notifications.length">
            <DashboardNotification v-for="notification in notifications" @click="notificationStore.markNotificationAsRead(notification.id)" :key="notification.id" :notification="notification"/>
        </div>
    </div>
</template>

<script setup>
import {useNotificationStore} from "~/store/notifcations";
import {useAuth} from "~/store/auth";

const notificationStore = useNotificationStore()
// fetch notifications from server
await notificationStore.loadNotifications()
// get notifications from store that are not temporary
const notifications = computed(() => {
    return notificationStore.notifications.filter(notification => {
        return !notification.temporary
    })
})

// get unread notifications from store
const unreadNotifications = computed(() => notificationStore.unreadNotifications)
</script>

<style lang="scss" scoped>

    .dashboard-notification {

        &s {
            display: flex;  
            justify-content: flex-start;
            flex-direction: column;
            gap: 15px;
            margin-top: 20px;
            max-height: 350px;
            overflow-y: scroll;
            padding: $paddingSmall;


            &-bubble {
                @include pos(-10px, -10px, tr);
                min-width: 30px;
                min-height: 30px;
                display: inline-block;
                border-radius: 30px;
                background-color: $secondary;
                color: white;
                text-align: center;
                line-height: 30px;
                font-weight: bold;
            }

            &-container {
                background-color: darken($light, 5%);
                border-radius: 10px;
                position: relative;
            }

            &-head {
                @include flexMe(space-between, center);
                padding: $paddingSmall;
                padding-bottom: 0;

                &-title {
                    font-size: 22px;
                    line-height: 1.2em;
                    font-weight: bold;
                }

                button {
                    @include colorize(darken($primary, 20%), false, true);
                    @include trans();
                    @include font;
                    cursor: pointer;
                    border: none;
                    padding: 0;
                    background: none;
                    font-size: 20px;
                    line-height: 1.2em;
                    text-decoration: underline;
                }
            }
        }

        &-none {
            text-align: center;
            margin: 50px;
        }
    }


    @media screen and (max-width: 768px) {
        .dashboard-notification {
            
            &s {
                padding: 20px;
                margin-top: 0;

                &-head {
                    padding: 20px;
                    background-image: linear-gradient(to top right, rgba($dark, .03), transparent);

                    button {
                        font-size: 16px;
                    }
                }
            }
        }
    }

    @media screen and (max-width: 500px) {
        .dashboard-notification {

            &s {

                &-head-title {
                    font-size: 16px;
                }
            }
        }
    }

</style>