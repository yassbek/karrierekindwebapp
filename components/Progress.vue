<template>
  <div class="progress-bar" :class="{big: paramSize === 'big', secondary: paramStyle === 'secondary', gradient: paramStyle === 'gradient', 'gradient-secondary': paramStyle === 'gradient-secondary'}">
    <div class="progress" :style="`width: ${progress}%`"></div>
  </div>
</template>


<script setup>
  const params = defineProps(['progress', 'size', 'type'])
  const paramSize = ref(params.size ? params.size : 'normal')
  const paramStyle = ref(params.type ? params.type : '')
</script>


<style lang="scss" scoped>
  .progress {
    @include trans;
    height: 5px;
    background-color: $primary;
    border-radius: 10px;

    &-bar {
      width: 100%;
      max-width: $maxWidth;
      height: 5px;
      background-color: darken($light, 5%);
      border-radius: 10px;
      overflow: hidden;

      &.big {
        height: 10px;

        .progress {
          height: 10px;
        }
      }

      &.gradient {
        
        .progress {
          background-image: linear-gradient(to right, $primary, lighten($primary, 20%));
        }

        &-secondary .progress {
          background-image: linear-gradient(to right, $secondary, lighten($secondary, 20%));
        }
      }

      &.secondary {

        .progress {
          background-color: $secondary;
        }
      }
    }
  }

  @media screen and (max-width: 768px) {
    .progress {
      height: 7px;

      &-bar {
        height: 7px;
      }
    }
  }
</style>