<template>
    <div clas="iwq-warpper interviews-wrapper">
        <div class="iwq-intro">
            <h1>Interviews</h1>
            <p class="maximizer-medium mcenter">Hier siehst Du eine Übersicht aller Interviews, die Du geplant hast.</p>
        </div>

        <div class="wrapper-medium">
            <button class="custom-button small" @click="createInterview()">Interview erstellen</button>
        </div>

        <div class="interviews-container">

            <div class="interviews">
                <div v-if="!interviewFinished" style="text-align: center;">
                    <p><i>Hier erscheinen die Interviews</i></p>
                    <br>
                    <button class="custom-button small ghost" @click="finishInterview()">Beendetes Interview simulieren</button>
                </div>

                <div class="interview-view" v-if="interview"><h3>Hier erscheint das Interview</h3></div>

                <div class="interview-finished-view" v-if="interviewFinished">
                    <div v-if="screen == 'normal'">
                        <p class="h3">Wie fandest Du das Interview?</p>

                        <div class="interview-finished-voting">
                            <div class="interview-finished-voting-option" @click="voteInterview(1)"><img src="~/assets/icons/face-happy.svg" alt="Interview war sehr gut"></div>
                            <div class="interview-finished-voting-option" @click="voteInterview(2)"><img src="~/assets/icons/face-good.svg" alt="Interview war gut"></div>
                            <div class="interview-finished-voting-option" @click="voteInterview(3)"><img src="~/assets/icons/face-neutral.svg" alt="Interview war ok"></div>
                            <div class="interview-finished-voting-option" @click="voteInterview(4)"><img src="~/assets/icons/face-sad.svg" alt="Interview war nicht so gut"></div>
                        </div>

                        <div class="custom-button-holder align_center">
                            <button class="custom-button small" @click="dissolveRequest()">Diese Anfrage auflösen</button>
                        </div>
                    </div>

                    <div v-if="screen === 'thankyou'">
                        <p class="h3">Vielen Dank für Dein Feedback</p>
                        <br>
                        <p class="maximizer-medium mcenter">Deine Bewertung hilft uns unser System stätig zu verbessern und noch genauere Vorschläge anzubieten.</p>
                    </div>

                    <div v-if="screen === 'compromise'">
                        <div class="interview-finished-voting">
                            <div class="interview-finished-voting-option nointeraction"><img src="~/assets/icons/face-sad.svg" alt="Interview war nicht so gut"></div>
                        </div>
                        <br>
                        <p class="h3">Dir hat das Interview nicht gefallen?</p>
                        <br>
                        <p class="maximizer-small mcenter">Wie wäre es dann mit einem unserer exklusiven Coaching-Angebote?</p>
                        <div class="custom-button-holder align_center">
                            <NuxtLink to="/coaching" class="custom-button small secondary">Coaching Pakete ansehen</NuxtLink> 
                        </div>
                    </div>
                </div>
            </div>


            <div class="interview-infos">
                <div>
                    <h3>Leitfaden</h3>

                    <ol :class="{expanded: guideExpended, 'interview-guide': true}">
                        <li>Zielsetzung: Definieren Sie das Ziel. Was möchten Sie erreichen oder vermitteln?</li>
                        <li>Zielgruppe: Bestimmen Sie die Zielgruppe. Wen möchten Sie ansprechen und welche Vorkenntnisse haben Sie</li>
                        <li>Struktur: Legen Sie eine klare und logische Struktur fest. Verwenden Sie Überschriften Unterpunkte und Nummerierungen, um den Text übersichtlich zu gestalten</li>
                        <li>Inhalte: Stellen Sie sicher, dass alle relevanten Informationen enthalten sind. Gehen Sie Schritt für Schritt vor</li>
                        <li>Sprache: Verwenden Sie eine klare und verständliche Sprache. Vermeiden Sie Fachjargon, es sei denn, er ist für die Zielgruppe angemessen</li>
                        <li>Grafiken und Beispiele: Fügen Sie, wenn nötig, Grafiken, Diagramme oder Beispiele hinzu, um komplexe Informationen zu verdeutlichen</li>
                        <li>Formatierung: Achten Sie auf eine übersichtliche Formatierung mit ausreichend Abständen, gut lesbaren Schriftarten und angemessener Schriftgröße</li>
                        <li>Überprüfen: Lassen Sie Ihre Unterlagen von anderen Personen überprüfen, um sicherzustellen, dass alles verständlich und vollständig ist. Korriegieren Sie Rechtschreibfehler und Unklarheiten</li>
                    </ol>

                    <p class="notice" @click="guideExpended = !guideExpended">
                        <span v-if="!guideExpended">alles anzeigen</span>
                        <span v-if="guideExpended">weniger anzeigen</span>
                    </p>
                </div>

                <div>
                    <p><br><b>Agenda</b></p>
                    <ol>
                        <li>Einstieg / Smalltalk</li>
                        <li>Vorstellung Unternehmen</li>
                        <li>Selbstpräsentation</li>
                        <li>Fragen und Antworten</li>
                        <li>Rückfragen</li>
                        <li>Ausblick</li>
                        <li>Verabschiedung</li>
                    </ol>
                </div>

                <div class="custom-button-holder">
                    <NuxtLink to="/coaching" class="custom-button small">Coaching Pakete ansehen</NuxtLink>
                </div>

            </div>
        </div>

    </div>
</template>

<script setup>

    const interviewFinished = ref(false)
    const interview = ref(null)
    const screen = ref('normal')
    const guideExpended = ref(false)

    function createInterview() {
        alert("Interview erstellt")
    }

    function finishInterview() {
        interviewFinished.value = true
    }

    function voteInterview(rating) {
        // @todo: RATING LOGIC   

        if( rating == 4 ) {
            screen.value = 'compromise'
            return
        }
        
        screen.value = 'thankyou'
    }

    function dissolveRequest() {

        if( confirm("Bist Du sicher, dass Du diese Anfrage auflösen willst?") ) {
            // @todo: DISSOLVING LOGIC
        }        
    }

</script>

<style lang="scss" scoped>

    .interview {
     
        &s {
            @include flexMe(center);
            flex: 1;
            background-color: darken($light, 5%);
            padding: $paddingSmall;
            border-radius: 5px;
            min-height: 350px;

            &-container {
                display: flex;
                justify-content: center;
                align-items: flex-start;
                gap: $paddingSmall;
                width: 100%;
                max-width: 1200px;
                margin: $paddingSmall auto 0;
            }
        }

        &-finished {

            &-voting {
                @include flexMe(center);
                gap: $paddingSmall;
                margin-top: $paddingSmall;

                &-option {
                    @include trans;
                    @include box(120px);
                    padding: 10px;
                    border-radius: 120px;
                    cursor: pointer;
                    
                    &:hover {
                        box-shadow: 0 0 20px rgba(lighten($secondary, 10%), .2);
                        background-color: rgba($secondary, .2);

                        img {
                            transform: scale(1.05);
                        }
                    }

                    img {
                        @include trans;
                        width: 100%;
                    }

                    &.nointeraction {
                        box-shadow: none;
                        background: none;
                        cursor: auto;

                        img {
                            transform: none;
                        }
                    }
                }
            }

            &-view {
                text-align: center;

                .custom-button-holder {
                    margin-top: $paddingSmall;
                }
            }
        }

        &-guide {
            max-height: 300px;
            overflow-y: scroll;
            position: relative;

            &:after {
                content: "";
                @include box(100%, 100px);
                @include pos(0, 0, bl);
                background: linear-gradient(to top, #ebebeb 20%, transparent);
            }

            &.expanded {
                height: auto;
                max-height: 100%;
                overflow: visible;
            }
        }   

        &-infos {
            width: 350px;
            background-color: darken($light, 5%);
            padding: $paddingSmall;
            border-radius: 5px;

            h3 {
                margin-top: 0;
            }

            ol {
                padding-left: 30px;

                li {
                    list-style-type: auto;
                    margin-bottom: 8px;
                    font-size: 14px;
                    line-height: 1.4em;
                }
            }

            .custom-button-holder {
                margin-top: 30px;
            }
        }
    }

    .notice {
        @include colorize($primary, false, true);
        @include trans;
        cursor: pointer;
    }


    .wrapper-medium {
        margin-top: $paddingMedium;
    }

    @media screen and (max-width: 1200px) {

        .interview {

            &s {
                width: 100%;

                &-container {
                    flex-wrap: wrap;
                    flex-direction: column;
                }
            }

            &-infos {
                width: 100%;
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;
            }
        }

        .wrapper {
            
            &-medium {
                @include flexMe();
                margin-top: $paddingSmall;
                margin-bottom: $paddingMedium;
            }
        }
    }


    @media screen and (max-width: 768px) {

        .interview {

            &-infos {
                grid-template-columns: repeat(1, 1fr);
                background-color: $primaryLight;
            }

            &-finished-voting {
                gap: 15px;

                &-option {
                    @include box(80px);
                }
            }
        }
    }


    @media screen and (max-width: 500px) {
        
        .interview {

            &s {
                padding: $paddingSmall 20px;
            }

            &-finished-voting {
                display: grid;
                grid-template-columns: repeat(2, 1fr);

                &-option {
                    @include box(100px);
                    margin: 0 auto;
                }
            }

            &-infos {
                padding: $paddingSmall 20px;
            }
        }
    }

</style>