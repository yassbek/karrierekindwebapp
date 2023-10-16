<template>
  <div class="breadcrumbs">
    <slot />
  </div>
</template>

<script setup>

</script>

<style lang="scss">

  .breadcrumb {
    margin: 0;

    &:after {
      content: "";
      @include box(12px);
      @include bg('~/assets/icons/arrow-small-right-primary.svg');
      display: inline-block;
      margin-left: 10px;
    }

    &s {
      @include flexMe(flex-start, center);
      gap: 10px;
      margin-bottom: $paddingMedium;
    }
  }

  p.breadcrumb {

    &:after {
      display: none;
    }
  }

  @media screen and (max-width: 768px) {
    .breadcrumbs {
      justify-content: center;
      margin-bottom: $paddingSmall;
    }
  }

</style>