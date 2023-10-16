<template>
  <div class="chat-teaser">
    <div class="chat-teaser-image" :style="`background-image: url('${chat.img}')`"></div>

    <div class="chat-teaser-infos">
      <p class="chat-teaser-position">{{ chat.position }}</p>
      <p class="chat-teaser-name">{{ chat.author }}</p>
      <p class="chat-teaser-company">{{ chat.company }}</p>
    </div>
  </div>
</template>


<script setup>

  const { chat } = defineProps(['chat'])

</script>


<style lang="scss" scoped>

  .chat-teaser {
    @include trans;
    @include flexMe(flex-start);
    flex-wrap: nowrap;
    gap: 15px;
    width: 100%;
    border-bottom: 1px solid darken($light, 15%);
    padding: 10px;
    cursor: pointer;
    font-weight: 600;

    &:hover {
      background-color: darken($light, 10%);
    }

    &-company {
      font-size: 14px;
    }

    &-image {
      @include box(50px);
      @include bg(false, cover);
      border-radius: 50px;
      flex: 0 0 50px;
    }

    &-name {
      color: darken($primary, 20%);
      font-size: 14px;
      font-weight: 600;
    }

    &-position {
      font-weight: bold;
      color: darken($primary, 20%);
    }
  }

</style>