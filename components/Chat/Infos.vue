<template>
  <div class="chat-infos">
    <div class="chat-infos-block gap">
      <p><b>Infos zum Unternehmen</b></p>

      <p>
        {{ chat.partner.company.name }} <br>
        {{ chat.partner.company.address }} <br>
        {{ chat.partner.company.city }} <br>
        <a :href="chat.partner.company.website.uri" target="_blank">{{ chat.partner.company.website.name }}</a>
      </p>
      
      <div class="custom-button-holder">
        <NuxtLink class="custom-button small" :to="`/company/${chat.partner.company.id}`">Zum Profil</NuxtLink>
      </div>
      
      <button class="chat-infos-report-button" @click="reportCompany(chat.partner.company.id)">Unternehmen melden</button>
    </div>
    

    <div class="chat-infos-block">
      <p><b>{{ chat.subject }}</b></p>
      <p class="truncate-4">{{ chat.description }}</p>
      <a style="margin-top: 5px; display: block;">Mehr anzeigen</a>
    </div>


    <div class="chat-infos-block">
      <div class="chat-infos-block-haed">
        <p><b>Medien:</b></p>
        <NuxtLink :to="`/chat/media/${chat.id}`"></NuxtLink>
      </div>

      <div class="chat-infos-block-media">
          <div></div>
          <div></div>
          <div></div>
        </div>
    </div>


    <div class="chat-infos-block">
      <p>Das Unternehmen passt nicht zu Ihnen? Geben Sie uns Feedback, damit wir das Matching-Verfahren verbessern können.</p>
      <br>
      <button @click="$emit('unmatch')" class="chat-infos-report-button arrow-end">Das war kein Match</button>
    </div>




  </div>
</template>


<script setup>
  const { chat } = defineProps(['chat'])

</script>


<style lang="scss" scoped>

  .chat-infos {
    padding: $paddingSmall 20px;
    font-size: 14px;
    font-weight: 600;

    &-block {
      margin-bottom: $paddingSmall;

      &-media {
        @include flexMe(flex-start);
        gap: 10px;

        & > div {
          @include box(50px);
          background: lightgrey;
        }
      }

      &.gap {
        @include flexMe(flex-start);
        flex-direction: column;
        gap: 15px;
      }

      p > b {
        margin-bottom: 5px;
        display: block;
      }
    }

    &-report-button {
      @include font;
      @include colorize($primary, false, true);
      @include trans;
      font-weight: bold;
      padding: 0;
      border: none;
      font-size: 14px;
      box-shadow: none !important;
      background: none;
      cursor: pointer;

      &.arrow-end {

        &:hover:after {
          margin-left: 10px;
        }

        &:after {
          content: "";
          @include box(10px);
          @include bg('~/assets/icons/arrow-small-right-primary.svg');
          @include trans;
          display: inline-block;
          margin-left: 5px;        
        }
      }
    }
  }

  @media screen and (max-width: 500px) {

    .chat-infos {
      padding: 25px 20px;
    }

  }

</style>