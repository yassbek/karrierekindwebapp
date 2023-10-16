<template>
  <div class="tooltipp" :class="{open: open}" title="Tooltipp anzeigen, einfach hovern oder klicken">
    <div class="tooltipp-mark" @click="open = !open">
      <img src="~/assets/icons/questionmark.svg" alt="Tooltipp anzeigen, einfach hovern oder klicken">
    </div>
    <div class="tooltipp-tipp">{{ text }}</div>
  </div>
</template>


<script setup>
  const props = defineProps(['text'])
  const open = ref(false)
</script>


<style lang="scss" scoped>
  .tooltipp {
    position: relative;
    width: auto;
    display: inline-block;

    &.open &-tipp,
    &:hover &-tipp {
      opacity: 1;
      pointer-events: auto;
    }

    &-mark {
      @include box(30px);
      @include flexMe(center);
      @include trans;
      cursor: pointer;
      border-radius: 20px;
      background-color: rgba($dark, .1);

      &:hover {
        @include shadow;
        background-color: $primary;
      }

      img {
        display: inline-block;
        height: 15px;
        width: auto;
      }
    }

    &-tipp {
      @include pos(calc(100% + 10px), calc(50% - 125px));
      @include trans;
      width: 250px;
      border-radius: 5px;
      padding: 10px 5px;
      font-size: 14px;
      line-height: 1.4em;
      text-align: center;
      background-color: darken($light, 5%);
      opacity: 0;
      pointer-events: none;
      font-weight: 600;

      &:before {
        content: "";
        @include box(10px);
        @include pos(-5px, calc(50% - 5px));
        rotate: 45deg;
        background-color: darken($light, 5%);
      }
    }
  }
</style>