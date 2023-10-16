<template>
    <div class="tabs-wrapper">
        <ul class="tabs-nav">
            <li 
                class="tabs-nav-item" 
                v-for="title in tabTitles" 
                :key="title"
                :class="{current: title == selectedTitle}"
                @click="setTitle(title)"
            > {{ title }} </li>   
        </ul>
        <div class="tabs-content">
            <slot />
            <div class="tabs-content-nav">
                <button class="custom-button" type="button" v-if="!isLastTab" @click="showNextTab()">Weiter</button>
                <button class="custom-button" type="submit" v-if="isLastTab" @click="completeRegistration()">Registrierung abschliessen</button>
            </div>
        </div>
    </div>
</template>


<script setup>
    const slots         = useSlots()

    const tabTitles     = ref( slots.default().map((tab) => tab.props.title) )
    const selectedTitle = ref(tabTitles.value[0])
    const isLastTab     = ref(false)

    provide('selectedTitle', selectedTitle)

    function showNextTab() {
        let currentIndex = tabTitles.value.indexOf(selectedTitle.value)

        selectedTitle.value = tabTitles.value[currentIndex + 1]

        if( selectedTitle.value == tabTitles.value[tabTitles.value.length - 1] ) {
            isLastTab.value = true
        }
    }

    const emit = defineEmits(['update:completed'])
    function completeRegistration() {
        console.log("completed");
        emit('update:completed', true)
    }

    function setTitle(title) {
        selectedTitle.value = title

        if( selectedTitle.value == tabTitles.value[tabTitles.value.length - 1] ) {
            isLastTab.value = true
            return
        }

        isLastTab.value = false
    }


</script>


<style lang="scss" scoped>
    .tabs {

        &-content {
            width: 100%;
            padding: $paddingMedium;
            border: 2px solid $primaryLight;
            padding-bottom: 120px;
            position: relative;

            &-nav {
                @include pos(0,0,bl);
                @include flexMe(flex-end, center);
                padding: $paddingSmall;
                width: 100%;
            }
        }

        &-nav {
            @include flexMe(space-between, center);
            gap: 20px;
            width: 100%;
            margin: 0;
            padding: 0;

            &-item {
                @include trans;
                padding: 10px 20px;
                border: 2px solid $primaryLight;
                border-bottom: none;
                flex: 1;
                border-radius: 5px 5px 0 0;
                color: $primary;
                font-weight: bold;
                font-size: 20px;
                cursor: pointer;

                &:hover {
                    background-color: rgba($primaryLight, .5);
                }

                &.current {
                    background-color: $primaryLight;
                }
            }
        }

        &-wrapper {
            width: 100%;
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
        }
    }

    @media screen and (max-width: 768px) {
        
        .tabs {

            &-nav {
                gap: 0;
                
                &-item {
                    width: 100%;
                    flex: auto;
                    border-radius: 0;

                    &:first-of-type {
                        border-radius: 5px 5px 0 0;
                    }
                }
            }
        }
    }
</style>