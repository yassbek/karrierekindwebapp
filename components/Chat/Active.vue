<template>
  <div class="chat-main">

    <div class="chat-main-header">
      <div>
        <div class="chat-backbutton chat-main-backbutton" @click="$emit('goBack')"><img src="~/assets/icons/arrow-left-small.svg" alt="Zurück zu den Chats"></div>
        <div class="chat-main-header-image" :style="`background-image: url(${chat.partner.img});`"></div>
        <div class="chat-main-header-name">{{ chat.partner.name }}</div>
      </div>

      <NuxtLink class="custom-button chat-main-appointment-button secondary small" :to="`/appointment/${chat.partner.id}`">Termin vereinbaren</NuxtLink>
    </div>

    <div class="chat-main-body">
      <ChatBubble v-for="msg in chat.history" :msg="msg" :key="msg.datetime"/>
    </div>

    <form class="chat-main-footer iwq-form" @submit="sendMessage($event)">
      <input type="text" v-model="message" placeholder="Schreibe eine Nachricht…" name="message" id="message">

      <svg width="512" height="512" x="0" y="0" viewBox="0 0 512.001 512.001">
          <path d="M256.001 0c-71.047 0-129.186 57.803-129.186 128.852v289.064c0 51.879 42.374 94.086 94.253 94.086s94.253-42.207 94.253-94.086v-252.49c0-32.709-26.611-59.32-59.32-59.32s-59.32 26.611-59.32 59.32v218.587c0 10.92 8.853 19.773 19.773 19.773s19.773-8.853 19.773-19.773V165.426c0-10.903 8.87-19.773 19.773-19.773s19.773 8.87 19.773 19.773v252.49c0 30.073-24.634 54.539-54.706 54.539s-54.706-24.466-54.706-54.539V128.852c0-49.242 40.397-89.305 89.64-89.305s89.64 40.062 89.64 89.305v270.553c0 10.92 8.853 19.773 19.773 19.773s19.773-8.853 19.773-19.773V128.852C385.187 57.803 327.049 0 256.001 0z"></path>
      </svg>

      <button class="custom-button small" type="submit">
        <img src="~/assets/icons/arrow-right-light.svg" alt="Nachricht senden">
      </button>
    </form>
  </div>
</template>


<script setup>

  const message = ref('')
  const { chat } = defineProps(['chat'])
  const emit = defineEmits(['sendMessage', 'goBack'])

  function sendMessage(event) {
    event.preventDefault()

    if( message.value == '' ) return

    emit('sendMessage', message.value)
    message.value = ''
  }

</script>


<style lang="scss" scoped>

  .chat-main {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;

    &-backbutton {
      display: none;
    }

    &-body {
      @include flexMe(flex-start, flex-end);
      display: block;
      gap: 10px;
      flex-grow: 1;
      background-color: rgba(white, .7);
      padding-bottom: 100px;
      max-height: 650px;
      overflow-y: scroll;
    }

    &-footer {
      @include pos(0, 0, bl);
      @include flexMe(space-between, center);
      flex-wrap: nowrap;
      gap: 15px;
      width: 100%;
      padding: 20px;
      border-top: 1px solid darken($light, 10%);
      background-color: darken($light, 5%);
      z-index: 11;

      input {
        flex: 1;
        margin-bottom: 0;
      }

      svg {
        height: 30px;
        width: auto;
        display: inline-block;
        cursor: pointer;

        path {
          @include trans;
          fill: $dark;
        }

        &:hover path {
          fill: darken($primary, 20%);
        }
      }

      .custom-button {
        width: auto;

        img {
          width: 20px;
        }
      }
    }

    &-header {
      @include flexMe(space-between, center);
      @include shadow;
      padding: 20px;
      width: 100%;
      border-bottom: 1px solid darken($light, 10%);
      background-image: linear-gradient(to bottom, $light, darken($light, 5%));

      & > div {
        @include flexMe(flex-start, center);
        gap: 15px;
      }

      &-image {
        @include shadow;
        @include box(50px);
        @include bg(false, cover);
        border-radius: 50px;
      }

      &-name {
        font-weight: bold;
        color: darken($primary, 20%);
        font-size: 20px;
      }
    }
    
  }

  @media screen and (max-width: 1024px) {

    .chat-main {

      &-backbutton {
        @include box(30px);
        @include trans;
        @include flexMe(center);
        padding: 5px;
        border-radius: 5px;
        cursor: pointer;

        &:hover {
          background-color: rgba($dark, .1);
        }

        img {
          height: 100%;
        }
      }
    }
  }
  
  @media screen and (max-width: 768px) {
    .chat-main {

      &-footer {
        padding-top: 10px;
        padding-bottom: 10px;
      }

      &-header {
        padding-top: 10px;
        padding-bottom: 10px;
      }

    }
  }
  
  @media screen and (max-width: 500px) {
    
    .chat-main {

      &-footer {
        padding: 10px;
      }

      &-header {
        padding-left: 10px;
        padding-right: 10px;
      }
    }
  }

</style>