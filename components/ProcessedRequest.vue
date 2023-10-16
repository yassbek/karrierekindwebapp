<template>
  <div class="request" :class="{disabled: type === 'declined'}">
    <template v-if="request.status === open">
      <div class="request-body">
        <div class="request-head">
          <div>
            <p class="requester">{{ request.Job?.Ansprechpartner?.Vorname }} von {{ request?.Job?.Unternehmen_und_Standort?.Unternehmen }}</p>
            <p class="request-position">{{ request.author.position }}</p>
          </div>

          <p class="request-date">Anfrage vom {{ request.date }}</p>
        </div>

        <p class="request-message truncate-2">"{{ request.message }}"</p>

        <div class="custom-button-holder align_right">
          <NuxtLink class="custom-button small" :to="`/request/${request.id}`">Anfrage ansehen</NuxtLink>
        </div>
      </div>
    </template>
    <template v-else>

      <div>
        <h3 class="request-title">{{ request.Job.Titel }}</h3>
        <p v-if="request.Job.Unternehmen_und_Standort" class="request-description">
          {{ request.Job.Unternehmen_und_Standort.Unternehmen }}</p>
    </div>

    <div class="custom-button-holder">
      <NuxtLink class="custom-button small" :to="`/chat/${request.id}`" v-if="type === 'accepted'">Zum Chat</NuxtLink>
      <NuxtLink class="custom-button inverted small" :to="`/request/${request.id}`" v-if="type === 'declined'">Anfrage wieder öffnen</NuxtLink>
    </div>

    </template>
  </div>
</template>


<script setup>

  const { request, type } = defineProps(['request', 'type'])

</script>


<style lang="scss" scoped>

  .request {
    @include flexMe(space-between, center);
    @include shadow;
    flex-wrap: nowrap;
    text-align: left;
    gap: $paddingSmall;
    padding: $paddingSmall;
    border-radius: 5px;
    background-color: white;
    width: 100%;

    &-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 5px !important;
      line-height: 1.2em !important;
      margin-top: 0;
      color: darken($primary, 20%);
    }

    &.disabled {
      background-color: rgba(white, .3);
      .request {
      
        &-description, &-title {
          color: #999 !important;
        }
      }
    }

    .custom-button-holder {
      flex: 0 0 max-content;
    }
  }

  @media screen and (max-width: 600px) {

    .request {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
  }


</style>