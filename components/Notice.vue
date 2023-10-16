<template>
  <div :class="{'notice': true, 'error': props.notice.importance == 'high', 'warning': props.notice.importance == 'medium'}">
      <span v-if="!props.notice.hasOwnProperty('link')">{{ props.notice.message }}</span>
      <NuxtLink :to="props.notice.link" target="_blank" v-if="props.notice.hasOwnProperty('link')">{{ props.notice.message }}</NuxtLink>
  </div>
</template>


<script setup>
  const props = defineProps(['notice'])
</script>


<style lang="scss" scoped>
  .notice {
    width: 100%;
    max-width: $maxWidthSmall;
    padding: 10px;
    background-color: rgba($primary, .7);
    color: white;
    font-weight: 600;
    margin: 15px auto;
    padding-left: 50px;
    position: relative;
    opacity: 0;
    animation: 1s fadeLeft ease forwards;

    @for $i from 2 through 12 {

      &:nth-of-type(#{$i}) {
        animation-delay: calc(50ms * #{$i});
      }
    }

    a {
      color: white;
      
      &:hover {
        scale: 1.1;
      }
    }

    &:before {
      content: "";
      @include box(20px);
      @include pos(11px, 10px);
      @include bg('/icons/info-i.svg', auto 60%);
      border-radius: 25px;
      background-color: rgba(white, .75);
    }

    &.error {
      background-color: $error;

      &:before {
        @include bg('/icons/error-icon.svg', auto 50%);
      }
    }

    &.warning {
      background-color: rgba($warning, .7);

      &:before {
        @include bg('/icons/warning-icon.svg', auto 50%);
      }
    }
  }


</style>