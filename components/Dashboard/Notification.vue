<template>
    <div class="dashboard-notification cursor-pointer transition-all ease-in-out" :class="{'opacity-50 hover:opacity-100' : notification.read_status === 'read'}" >
      <template v-if="notification.type === 'chat'">
        <!-- TODO: add templates for chat notifications -->
      </template>
      <template v-if="notification.type === 'jobrequest'">
        <div>
          <p class="dashboard-notification-title">Neue Jobanfrage</p>
          <p class="dashboard-notification-description">Lorem Ipsum dolor sit amet</p>
        </div>
        <div class="custom-button-holder">
          <NuxtLink v-if="notification.external_identifier" class="custom-button small" :to="`request/${notification.external_identifier}`">Zur Anfrage</NuxtLink>
        </div>
        <!-- TODO: add templates for jobrequest notifications -->
      </template>
      <template v-if="notification.type === 'reminder'">
        <!-- TODO: add templates for reminder notifications -->
      </template>
      <template v-if="notification.type === 'standard'">
        <div v-if="notification.title">
          <p class="dashboard-notification-title">{{ notification.title }}</p>
          <p class="dashboard-notification-description">{{ notification.description }}</p>
        </div>
        <div class="custom-button-holder">
          <NuxtLink class="custom-button inverted small" to="/coaching" v-if="notification.type == 'interview'">
            Coaching-Pakete ansehen
          </NuxtLink>
          <NuxtLink class="custom-button small" :to="notification.target">{{
              targetButtonNames[notification.type]
            }}
          </NuxtLink>
        </div>
      </template>
    </div>
</template>

<script setup>
const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
})

// TODO: make them computed
const targetButtonNames = {
  chat: 'Zum Chat',
  jobrequest: 'Zur Anfrage',
  interview: 'Zum Interview',
}
</script>

<style lang="scss" scoped>
    .dashboard-notification {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 20px;
        border-radius: 10px;
        padding: 15px 20px;        
        background: white;

        p {
            margin: 0;
        }

        .custom-button-holder {
            justify-content: flex-end;
            gap: 10px;
            flex: 0 0 max-content;
        }

        &-description {
            font-size: 14px;
            margin-top: 5px !important;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            -webkit-box-orient: vertical;  
            overflow: hidden;
        }

        &-title {
            font-size: 18px;
            color: darken($primary, 20%);
            font-weight: bold;
        }

    }

    @media screen and (max-width: 1024px) {
        .dashboard-notification {
            flex-direction: column;
            align-items: flex-start;
        }
    }

    @media screen and (max-width: 500px) {
        .dashboard-notification {

            .custom-button {
                width: 100%;

                &-holder {
                    width: 100%;
                    justify-content: flex-start;
                    align-items: flex-start;
                    flex-direction: column;
                }
            }
        }
    }
</style>