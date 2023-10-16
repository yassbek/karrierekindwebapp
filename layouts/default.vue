<template>
    <div>
        <Header />
            <div class="page-wrapper">
                <slot />
            </div>
        <Footer />
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
    .page-wrapper {
        padding: 120px $paddingBig;
    }

    @media screen and (max-width: 1025px) {
        .page-wrapper {
            padding: $paddingBig $paddingMedium;
            padding-top: $paddingLarge;
        }
        
    }

   @media screen and ( max-width: 769px ) {
        .page-wrapper {
            padding: $paddingMedium $paddingSmall;
            padding-top: $paddingLarge;
        }
   }
</style>