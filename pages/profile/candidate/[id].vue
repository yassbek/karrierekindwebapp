<template>
    <div class="iwq-container" v-if="candidate">
        <section class="profile-container">
            <div class="profile-section main">
                <div class="profile-picture" :style="getProfileImage"></div>
                <div>
                    <h2>{{ candidate?.Vorname }} {{ candidate?.Nachname }}</h2>
                  <p class="profile-info-region" v-if="candidate.Ort">Region {{ candidate.Ort }}
                    {{ candidate.Wie_weit_soll_der_Arbeitsort_maximal_entfernt_sein ? '+' + candidate.Wie_weit_soll_der_Arbeitsort_maximal_entfernt_sein + 'km' : '' }}</p>
                </div>

                <br>
                <div v-if="candidate.Biografie" class="profile-info-bio">
                    <p><b>Das bin ich:</b></p>
                    <p>{{ candidate.Biografie }}</p>
                </div>

                <div class="custom-button-holder">
                  <button class="custom-button small" @click="makeNewChat(candidate.id)">{{ candidate.Vorname }}
                    kontaktieren
                    </button>
                </div>
            </div>

          <div class="profile-section" v-if="candidate.Skills">
                <h2 class="profile-section-headline">Skills</h2>
                <ul class="iwq-checklist split-3">
                  <li v-for="skillEl in candidate.Skills">{{ skillEl.skill }}</li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script setup>
import {useAuth} from "~/store/auth";
import {getImageFromDirectus} from "~/utils/helper";
import {useNotificationStore} from "~/store/notifcations";

const auth = useAuth()
const route = useRoute()

function makeNewChat(partnerID) {
    // @TODO: Make new chat with partner by id
}

const {$directus} = useNuxtApp()
const notificationStore = useNotificationStore()
const talentId = ref(route.params.id)
const jobReference = ref(route.query.ref)

const candidate = ref()

const {
  data: companyData,
} = await useAsyncData(
  'company-id',
  () => {
    return $directus.items('Unternehmen').readByQuery({
      fields: ['id'],
    }).catch((e) => {
      console.error(e);
      return null;
    });
  },
  {
    transform: (data) => data.data[0],
  }
)
const getProfile = async () => {
  if (!talentId.value || !jobReference.value || !companyData.value.id) {
    notificationStore.addNotification(
      'Fehler beim Laden der Kandidat:innen',
      'error',
      'Es wurde keine Jobreferenz oder Nutzer ID übergeben',
      true
    )
    return
  }
  try {
    const res = await $fetch(`/api/get-talents/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId: jobReference.value,
        companyId: companyData.value.id,
        talentIds: talentId.value
      })
    })
    candidate.value = res?.data?.talents[0]
    console.log(candidate.value)
  } catch (e) {
    console.error(e)
    notificationStore.addNotification(
      'Fehler beim Laden der Kandidat:innen',
      'error',
      e.message,
      true
    )
  }
}

await getProfile()

const getProfileImage = computed(() => {
    let image
    image = getImageFromDirectus(auth.userData.avatar)
    if (!image) image = 'https://picsum.photos/300/300'
    return {
        backgroundImage: `url(${image})`
    }
})

</script>

<style lang="scss" scoped>

    .profile {

        &-container {
            margin-top: $paddingMedium;
            width: 100%;
            max-width: 960px;
            margin-left: auto;
            margin-right: auto;
        }

        &-documents {
            @include flexMe(flex-start);
            gap: $paddingSmall;

            a {
                @include trans;
                display: inline-flex;
                justify-content: center;
                flex-direction: column;
                gap: 10px;
                font-size: 12px;
                padding: 20px 10px;
                border-radius: 10px;
                font-weight: 600;
                color: $dark;

                &:hover {
                    background-color: rgba(darken($primaryLight, 5%), .5);
                }

                img {
                    height: 50px;
                }
            }
        }

        &-form {

            &-description {
                @include flexMe;
                @include trans;
                text-align: center;
                padding: 5px;
                border: 1px solid rgba($dark, .5);
                color: rgba($dark, .5);
                cursor: pointer;

                &.marked {
                    border: 2px solid $primary;
                    color: $primary;
                    font-weight: 600;

                    &:hover {
                        border-color: rgba($primary, .7);
                        color: rgba($primary, .7);
                    }
                }

                &:hover {
                    border-color: rgba($dark, .7);
                    color: rgba($dark, .7);
                }

                &s {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 10px;
                    margin-top: 20px;
                }
            }
        }

        &-info {

            &-bio {
                margin: $paddingSmall auto;

                p b {
                    margin-bottom: 10px;
                    display: block;
                }
            }

            &-region {
                font-weight: 600;
                color: $primary;
            }
        }

        &-picture {
            @include box(200px);
            @include bg(false, cover);
            @include shadow;
            position: relative;
            margin-top: calc(-30px - 100px);
            z-index: 5;
            display: inline-block;
            border-radius: 120px;
            overflow: hidden;

            &:hover &-edit-overlay {
                opacity: 1;
            }

            &-edit-overlay {
                @include box(100%);
                @include pos(0);
                @include flexMe;
                @include trans;
                flex-direction: column;
                gap: 10px;
                cursor: pointer;
                background-color: rgba($dark, .5);
                color: white;
                font-size: 12px;
                font-weight: 600;
                opacity: 0;
                -webkit-backdrop-filter: blur(8px);
                backdrop-filter: blur(8px);

                img {
                    width: 30%;
                }

                p {
                    margin: 0;
                }
            }
        }

        &-section {
            background-color: darken($light, 5%);
            padding: $paddingSmall;
            margin-bottom: $paddingSmall;

            &:hover &-edit {
                opacity: 1;
            }

            &-edit {
                @include box(40px);
                @include trans;
                @include pos(30px, 30px, tr);
                padding: 10px;
                border-radius: 40px;
                cursor: pointer;
                opacity: 0;

                &:hover {
                    background-color: rgba($dark, .05);
                }
            }

            &.main {
                position: relative;
                margin-top: 200px;
                
                &:before {
                    content: "";
                    @include box(100%, 150px);
                    @include pos(-145px, 0);
                    background-image: linear-gradient(to right, $primary, lighten($primary, 10%));
                    border-radius: 5px;
                    z-index: -1;
                }

                h2 {
                    margin-bottom: 10px !important;
                    margin-top: $paddingSmall;
                }
            }

            &:not(.main) {

                h2 {
                    padding-bottom: 20px;
                    border-bottom: 1px solid rgba($dark, .2);
                }
            }

            h2, h3, h4 {
                color: darken($primary, 30%);
                margin-top: 0;
            }
        }
    }

    .iwq-form {
        margin-top: $paddingMedium;
    }


    @media screen and (max-width: 1200px) {
        .profile {

            &-form {
                
                &-description {

                    &s {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            }
        }
    }

    @media screen and (max-width: 1024px) {
        
        .profile {

            &-form {

                &-description {
                    padding: 10px;

                    &s {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            }

            &-section {

                &-edit {
                    @include box(50px);
                    @include pos(-130px, -10px, tr);
                    @include shadow;
                    padding: 15px;
                    background-color: white !important;
                    opacity: 1;

                    img {
                        height: 100%;
                        width: auto;
                        display: block;
                    }
                }
            }
        }
    }

    @media screen and (max-width: 768px) {

        .profile {

            &-info {

                &-bio {
                    text-align: center;
                }
            }

            &-picture {
                @include box(150px);
                margin: 0 auto;
                margin-top: calc(-30px - 75px);
            }

            &-section {

                &.main {
                    @include flexMe(center);
                    flex-direction: column;
                    text-align: center;

                    h2 {
                        margin-bottom: 5px !important;
                    }

                    &:before {
                        height: 120px;
                        top: -120px;
                        border-radius: 5px 5px 0 0;
                    }
                }
            }

        }
    }
    
    @media screen and (max-width: 600px) {

        .profile {

            &-form {
                
                &-descriptions {
                    grid-template-columns: repeat(1, 1fr);
                }
            }
        }
    }

</style>