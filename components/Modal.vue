<template>
  <div class="modal">
    <div class="modal-box">
      <div class="modal-box-closer" @click="$emit('close')"></div>
      <slot />
    </div>
  </div>
</template>


<script setup>

</script>


<style lang="scss">
  .modal {
    @include pos(0, 0, tr, fixed);
    @include box(100vw, 100vh);
    overflow-y: scroll;
    padding: $paddingBig;
    background-color: rgba( darken($primary, 20%), .8 );
    -webkit-backdrop-filter: blur(8px);
    backdrop-filter: blur(8px);
    opacity: 0;
    animation: 1s fadeIn ease forwards;
    z-index: 100;
    
    &-box {
      width: 100%;
      max-width: 960px;
      background-color: white;
      padding: $paddingSmall;
      position: relative;
      margin: $paddingBig auto 0;
      opacity: 0;
      animation: 1s fadeUp ease forwards;

      h1, h2, h3, h4, h5 {
        color: darken($primary, 20%);
        margin-bottom: 10px !important;
      }

      &-closer {
        @include box(40px);
        @include pos(-10px, -10px, tr);
        @include shadow;
        @include colorize(darken($primary, 20%));
        @include trans;
        cursor: pointer;

        &:hover {
          transform: scale(1.1)
        }

        &:after {
          content: "";
          @include box(100%);
          @include pos(0);
          @include bg('~/assets/icons/closer-light.svg', 20px);
        }
      }
    }

    &-buttons {
      @include flexMe(flex-start);
      gap: 15px;
      margin-top: $paddingSmall;
    }

    &-teaser {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: $paddingMedium;
      padding: $paddingSmall;
      background-color: rgba($dark, .05);
      border-radius: 10px;

      h1, h2, h3, h4, h5 {
        margin-top: 0;
        font-weight: bold;
      }
    }

    &-title {
      font-size: 26px;
      line-height: 1.2em;
      font-weight: bold;
    }
  }


  @media screen and (max-width: 1024px) {

    .modal {
      padding: $paddingBig $paddingMedium;
      
      &-teaser {
        flex-direction: column;
        justify-content: center;
        text-align: center;
        gap: $paddingSmall;
      }
    }
  }


  @media screen and (max-width: 768px) {

    .modal {
      padding: $paddingMedium $paddingSmall;

      &-box {
        margin-top: 0;
      }

    }
  }


  @media screen and (max-width: 500px) {

    .modal {
      padding-left: 0;
      padding-right: 0;

      &-box {
        padding: $paddingSmall 20px;

        &-closer {
          right: 15px;
          top: -15px;
        }
      }
    }
  }


</style>