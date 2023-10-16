<template>
  <div class="chat-bubble-container" :class="{partner: msg.from === 'partner'}">
    <div class="chat-bubble">
      <span class="chat-bubble-message">{{ msg.message }}</span>
      <span class="chat-bubble-time">{{ msg.datetime.getHours() + ':' + msg.datetime.getMinutes() }}</span>
    </div>
  </div>
</template>


<script setup>

  const { msg } = defineProps(['msg'])

</script>


<style lang="scss" scoped>

  .chat-bubble {
    @include trans;
    padding: 10px;
    padding-bottom: 25px;
    background-color: $primary;
    color: white;
    font-weight: 600;
    width: auto;
    display: inline-block;
    max-width: 50%;
    position: relative;
    z-index: 10;
    border-radius: 5px;
    animation: .5s fadeUp ease forwards;

    &:hover {
      @include shadow;
    }

    &:before {
      content: "";
      @include box(8px);
      @include pos(-4px, 12px, br);
      z-index: -1;
      background-color: $primary;
      transform: rotate(45deg);
    }

    &-container {
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      flex-wrap: wrap;
      padding: 20px;
      width: 100%;

      &.partner {
        justify-content: flex-start;

        .chat-bubble {
          background-color: $secondary;

          &:before {
            background-color: $secondary;
            right: auto;
            left: 12px;
          }
        }
      }
    }

    &-time {
      font-size: 10px;
      line-height: 1em;
      @include pos(5px, 5px, br);
    }
  }

  @media screen and (max-width: 768px) {

    .chat-bubble {
        max-width: calc(100% - 50px);

        &-container {
          padding: 10px 20px;
        }
    }
  }

  @media screen and (max-width: 500px) {

    .chat-bubble {
      
      &-container {
        padding: 0 10px;
      }
    }

  }

</style>