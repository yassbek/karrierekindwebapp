<template>
  <div class="dropdown" :class="{open: open}">
    <div class="dropdown-header" @click="toggleDropdown($event)">
      <p class="dropdown-title">
        <img src="~/assets/icons/arrow-small-right-light.svg" class="dropdown-title-indicator">
        {{ title }}
      </p>

      <div class="dropdown-actions" v-if="actions">
        <div class="dropdown-action" v-for="action in actions"><img :src="images[action.icon]" @click="$emit('action', {action: action.name, id: action.id})"></div>
      </div>

      <div class="dropdown-bubble" v-if="bubble">{{ bubble }}</div>
    </div>

    <div class="dropdown-body" v-show="open">
      <slot />
    </div>

  </div>
</template>


<script setup lang="ts">
  import { filename } from 'pathe/utils';
  const glob = import.meta.glob('~/assets/icons/*.svg', { eager: true });
  const images = Object.fromEntries(
    Object.entries(glob).map(([key, value]) => [filename(key), value.default])
  );

  const props = defineProps(['title', 'actions', 'bubble'])
  const open = ref(false)

  const toggleDropdown = (event: any) => {

    if( event.target.matches('.dropdown-action') || event.target.matches('.dropdown-action img')  ) {
      event.preventDefault() 
      return
    }

    open.value = !open.value
  }

  
</script>


<style lang="scss" scoped>
  .dropdown {
    position: relative;
    z-index: 5;
    margin-bottom: $paddingSmall;

    &.open &-header {
      border-radius: 5px 5px 0 0;
    }

    &.open &-title-indicator {
      transform: rotate(90deg);
    }

    &-action {
      @include box(40px);
      @include flexMe(center);
      @include trans;
      display: inline-flex;
      background-color: rgba($dark, .05);
      padding: 5px;
      border-radius: 40px;
      cursor: pointer;
      opacity: 0;
      transform: translateY(20px);

      &:hover {
        background-color: rgba($dark, .1);
        scale: 1.1;
      }

      &s {
        @include flexMe(flex-end, center);
        @include trans;
        gap: 10px;
        flex: 1;
      }

      @for $i from 1 through 5 {
        &:nth-of-type(#{$i}) {
          transition-delay: calc(50ms * #{$i});
        }
      }

      img {
        display: block;
        width: auto;
        height: 20px;
      }
    }

    &-body {
      background-color: darken($light, 5%);
      padding: $paddingSmall;
      border-radius: 0 0 5px 5px;
    }

    &-bubble {
      @include box(20px);
      @include pos(-7px, -7px, tr);
      @include shadow;
      border-radius: 20px;
      text-align: center;
      font-size: 14px;
      line-height: 20px;
      color: white;
      background-color: $secondary;
      font-weight: bold;
    }

    &-header {
      @include flexMe(space-between, center);
      @include colorize($primary);
      @include trans;
      gap: $paddingSmall;
      cursor: pointer;
      padding: 15px 20px;
      color: white;
      border-radius: 5px;
      font-weight: 600;
      font-size: 20px;

      &:hover .dropdown-action {
        opacity: 1;
        transform: translateY(0px);
      }
    }

    &-title {
      @include flexMe(flex-start, center);
      gap: 10px;
      flex: 1;

      &-indicator {
        @include trans(.5s, cubic-bezier(0.25, 1, 0.5, 1));
        height: 12px;
        display: inline-block;
        width: auto;
      }
    }
  }

  @media screen and (max-width: 1024px) {
    .dropdown {

      &-action {
        opacity: 1;
        transform: translateY(0px);

        &s {
          opacity: 1;
          gap: 5px;
        }
      }

    }

  }


  @media screen and (max-width: 768px) {
    
    .dropdown {
      margin-bottom: 16px;

      &-action {
        @include box(30px);

        img {
          height: 15px;
        }

        &s {
          flex: unset;
        }
      }

      &-body {
        padding: 20px;
      }

      &-header {
        padding: 10px 20px;
        flex-wrap: nowrap;
      }

      &-title {
        flex-wrap: nowrap;
        font-size: 18px;
      }
    }
    
  }


</style>
