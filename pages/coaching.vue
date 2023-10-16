<template>
    <div class="iwq-container">
        <div class="iwq-intro">
            <h1>Coaching</h1>
            <p class="maximizer-medium mcenter">Du benötigst Hilfe - zum Beispiel bei Deinem Lebenslauf, bei Gesprächen mit Arbeitgebern, mit dem Chat oder mit der Sprache? Dann kannst Du hier ein <b>Coaching</b> heraussuchen, das Dir gefällt! Coaching bedeutet, eine Person/ein Coach berät Dich zu den Themen und spricht mit Dir über Deine persönlichen Fragen (online oder vor Ort) und gemeinsam findet ihr eine Lösung. Natürlich kannst Du dich vorher kostenlos beraten lassen – vereinbare jetzt einen Termin!</p>
        </div>

        <div class="coaching-packages">
            <div v-for="(p, index) in packages" :key="index" class="coaching-package">
                <h2 class="coaching-package-title">{{ p.name }}</h2>

                <ul class="coaching-package-capabilities iwq-checklist center">
                   <li v-for="capability in p.capabilities">{{ capability }}</li> 
                </ul>

                <div class="coaching-package-footer">
                    <p v-if="p.allowCoupons" class="coacking-package-footer-notice">Teilnahme durch Bildungsgutschein möglich</p>
                    <p v-if="!p.allowCoupons" class="coacking-package-footer-notice"><b><u>Keine</u></b> Teilnahme durch Bildungsgutschein möglich</p>

                    <div class="custom-button-holder align_center">
                        <NuxtLink :to="p.appointmentLink" class="custom-button secondary small" target="_blank">Jetzt Termin vereinbaren</NuxtLink>
                    </div>  
                </div>
            </div>
        </div>
    </div>
</template>



<script setup>
    const packages = ref([
        {id: 0, name: 'Paket 1', capabilities: ['Erstellung von Bewerbungsunterlagen'], allowCoupons: true, appointmentLink: 'https://jungmut.com'},
        {id: 1, name: 'Paket 2', capabilities: ['Erstellung von Bewerbungsunterlagen', 'Vorbereitung Interview'], allowCoupons: true, appointmentLink: 'https://jungmut.com'},
        {id: 2, name: 'Paket 3', capabilities: ['Erstellung von Bewerbungsunterlagen', 'Vorbereitung Interview', 'Coaching'], allowCoupons: true, appointmentLink: 'https://jungmut.com'},
        {id: 3, name: 'Paket 4', capabilities: ['Erstellung von Bewerbungsunterlagen', 'Vorbereitung Interview', 'Coaching', 'Video Bewerbung'], allowCoupons: true, appointmentLink: 'https://jungmut.com'},
        {id: 4, name: 'Paket 5', capabilities: ['Erstellung von Bewerbungsunterlagen', 'Vorbereitung Interview', 'Coaching', 'Video Bewerbung', 'Begleitung ins Vorstellungsgespräch'], allowCoupons: true, appointmentLink: 'https://jungmut.com'},
        {id: 5, name: 'Paket 6', capabilities: ['Individuelle PaketZusammenstellung'], allowCoupons: false, appointmentLink: 'https://jungmut.com'},
    ])
</script>



<style lang="scss" scoped>

    .coaching {

        &-package {
            @include trans;
            padding: $paddingSmall;
            border-radius: 10px;
            background-color: rgba($primaryLight, .5);
            padding-bottom: 150px;
            position: relative;
            opacity: 0;
            animation: 1s fadeUp ease forwards;

            @for $i from 1 through 10 {
                &:nth-of-type(#{$i}) {
                    animation-delay: calc(#{$i} * 200ms);
                }
            }

            &:hover {
                @include shadow(10px, 50px, .1);
                background-color: $primaryLight;
                transform: scale(1.05);
            }

            &s {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: $paddingSmall;
                margin-top: $paddingBig;
            }

            &-capabilities {
                padding: $paddingSmall 0;
            }

            &-footer {
                @include pos(0,0,bl);
                width: 100%;
                padding: $paddingSmall;
                text-align: center;

                &:before {
                    content: "";
                    @include pos(0, #{$paddingSmall});
                    width: calc(100% - (#{$paddingSmall} * 2));
                    border-top: 1px dashed rgba($dark, .2);
                }

                p {
                    margin-bottom: 10px;
                }
            }

            &-title {
                text-align: center;
                padding-bottom: $paddingSmall;
                border-bottom: 1px dashed rgba($dark, .2);
            }
        }
    }

    @media screen and (max-width: 1400px) {
        .coaching {

            &-package {

                &s {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        }
    }

    @media screen and (max-width: 768px) {
        .coaching {

            &-package {

                &s {
                    grid-template-columns: repeat(1, 1fr);
                }
            }
        }    
    }

</style>