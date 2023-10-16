<template>
  <div>
    <NuxtLink class="breadcrumb" :to="to" v-if="to"><slot /></NuxtLink>
    <p class="breadcrumb" v-if="!to"><slot /></p>
  </div>
</template>

<script setup>

  const props = defineProps(['to'])



</script>

<style lang="scss" scoped>
  
  .breadcrumb {
    color: $primary;
  }

  a.breadcrumb {
    @include colorize($primary, false, true);
    font-weight: bold;
    text-decoration: underline;
    cursor: pointer;
  }
</style>