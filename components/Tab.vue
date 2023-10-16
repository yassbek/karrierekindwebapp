<template>
    <div class="tab" v-show="title == selectedTitle">
        <div class="tab-content">
            <slot />
        </div>
    </div>
</template>


<script setup>

    const props = defineProps(['title'])
    const selectedTitle = ref(inject('selectedTitle'))

</script>


<style lang="scss" scoped>

</style>