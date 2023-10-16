<template>
    <div class="dashboard-requests-container">

      <!--
        <div class="dashboard-requests-bubble" v-if="combinedBubbles">{{ combinedBubbles }}</div>
-->
        <div class="dashboard-requests-header">
            <p class="dashboard-requests-header-title">{{ title }}</p>
            <NuxtLink class="dashboard-requests-header-link" :to="all_target">alle ansehen</NuxtLink>
        </div>

        <div class="dashboard-requests" v-if="notifications.length > 0">
            <NuxtLink class="dashboard-request" v-for="n in notifications" :to="`${n.target}`" :key="n.id">
                <div class="dashboard-request-image" :style="`background-image: url('${n.img}');`">
                    <div class="dashboard-request-image-bubble" v-if="n.bubbleCount">{{ n.bubbleCount }}</div>
                </div>
                
                <div class="dashboard-request-infos">
                    <p class="dashboard-request-infos-title"><b>{{ n.title }}</b>, {{ n.company }}</p>
                    <p class="truncate-1">{{ n.description }}</p>
                </div>
            </NuxtLink>
        </div>
      <div class="dashboard-requests" v-else>
        <p class="text-center px-4 text-sm italic">{{ empty_text }}</p>
      </div>
      </div>
</template>

<script setup>

    const props = defineProps(['title', 'all_target', 'notifications', 'empty_text'])
    const { notifications: no  } = toRefs(props)

    /*
    const combinedBubbles = computed(() => {
        return no.value.reduce((acc, curr) => {
            return acc + curr.bubbleCount
        }, 0)
    })

     */

</script>

<style lang="scss" scoped>
    .dashboard-request {
        @include flexMe(flex-start);
        flex-wrap: nowrap;
        gap: 20px;
        padding: 15px 30px;
        color: darken($primary, 10%);

        &:hover {
            background: rgba($dark, .1);
        }

        &-image {
            @include box(50px);
            @include shadow;
            @include bg(false, cover);
            display: inline-block;
            border-radius: 50px;
            position: relative;

            &-bubble {
                --bubble-size: 20px;
                @include box(var(--bubble-size));
                @include pos(-5px, -5px, tr);
                @include shadow;
                line-height: var(--bubble-size);
                font-weight: bold;
                text-align: center;
                border-radius: var(--bubble-size);
                background-color: $secondary;
                color: white;
            }
        }

        &-infos {
            font-weight: 600;
            font-size: 14px;

            &-title {
                font-size: 16px;
            }
        }

        &s {
            margin-top: 15px;
            max-height: 350px;
            overflow-y: scroll;

            &-bubble {
                --bubble-size: 30px;
                @include box(var(--bubble-size));
                @include pos(-10px, -10px, tr);
                @include shadow;
                line-height: var(--bubble-size);
                font-weight: bold;
                text-align: center;
                border-radius: var(--bubble-size);
                background-color: $secondary;
                color: white;
            }

            &-container {
                border-radius: 10px;
                background-color: darken($light, 5%);
                position: relative;
            }

            &-header {
                @include flexMe(space-between, center);
                padding: 20px 30px 0;

                &-link {
                    @include colorize(darken($primary, 20%), false, true);
                    @include trans();
                    @include font;
                    cursor: pointer;
                    border: none;
                    padding: 0;
                    background: none;
                    font-size: 20px;
                    line-height: 1.2em;
                    text-decoration: underline;
                    font-weight: normal;
                }

                &-title {
                    margin: 0;
                    font-size: 20px;
                    font-weight: bold;
                }                
            }
        }

        p {
            margin: 0;
        }
    }

    @media screen and (max-width: 1024px) {
        
        .dashboard-request {
            padding-left: 20px;
            padding-right: 20px;
            margin: 0;

            &s {

                &-header {
                    padding: 20px;
                    background-image: linear-gradient(to top right, rgba($dark, .03), transparent);

                    &-link {
                        font-size: 16px;
                    }
                }
            }
        }
    }


    @media screen and (max-width: 500px) {
        
        .dashboard-request {

            &s {

                &-header {
                    
                    &-title {
                        font-size: 16px;
                    }
                }
            }
        }
    }

</style>