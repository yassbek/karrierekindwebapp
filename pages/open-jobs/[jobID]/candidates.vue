<template>
  <div class="iwq-container">
    <div class="iwq-intro">
      <h1>Kandidat:innen für {{jobData.Titel}}</h1>
      <p class="maximizer-medium mcenter">Auf dieser Seite sehen Sie die Profile der Kandidat:innen, die aufgrund des Fragebogens ein Match für Ihr Unternehmen sind. Gefällt ihnen eine Person, können Sie dieser eine Jobanfrage schicken. Nur wenn diese angenommen wird, können Sie mit der Person chatten.</p>
    </div>

    <div class="iwq-section">
      <div>
        <h2 class="h3">Neuste Kandidat:innen</h2>
        <div class="candidates" v-if="newestCandidates && newestCandidates.length > 0">
          <div class="candidate" v-for="candidate in newestCandidates">
            <div class="candidate-left">
              <div class="candidate-image" :style="`background-image: url('${getImageFromDirectus(candidate.Profilbild, 'png')}')`"></div>
              <div class="candidate-infos">
                <span>{{ candidate.Vorname }} {{' '}} {{ candidate.Nachname }}</span>
                <Progress :progress="Math.floor(Math.random() * 101)"/>
              </div>
            </div>
            <div class="custom-button-holder">
              <NuxtLink class="custom-button small" :to="`/profile/candidate/${candidate.id}?ref=${id}`">Profil ansehen</NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 class="h3">In Kontakt</h2>
        <p class="candidate-title-description">Wird eine Jobanfrage durch angefragte Person abgelehnt, können Sie das Profil nicht mehr sehen.</p>
        <div class="candidates">
          <div class="candidate" v-for="candidate in inContact">
            <div class="candidate-left">
              <div class="candidate-image" :style="`background-image: url('${candidate.img}')`"></div>
              <div class="candidate-infos">
                <span class="candidate-name">{{ candidate.name }}</span>
              </div>
            </div>
            <div class="custom-button-holder">
              <NuxtLink class="custom-button small" :to="`/chat?id=${candidate.profile_id}`">Chat ansehen</NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <div v-if="requestSent > 0">
        <h2 class="h3">Es {{ requestSent === 1 ? 'wurde' : 'wurden' }} {{ requestSent }}
          {{ requestSent === 1 ? 'Jobanfrage' : 'Jobanfragen' }} gesendet. Davon wurden {{ acceptedJobRequests }} akzeptiert</h2>
        <p class="candidate-title-description">Wird eine Jobanfrage durch angefragte Person abgelehnt, können Sie das Profil nicht mehr sehen.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useAuth} from "~/store/auth";
import {useNotificationStore} from "~/store/notifcations";
import {getImageFromDirectus} from "~/utils/helper";

const route = useRoute()
const id = route.params.jobID
const {$directus} = useNuxtApp()

  // TOOD: get job candidates by jobID and render them
const candidatesDummy = ref([
  {name: 'Marie Schneider', img: '/imgs/placeholder.webp', profile_id: 1, request_date: new Date('2023-01-15 13:37:00'), status: 'open'},
  {name: 'Mario Schneider', img: '/imgs/placeholder.webp', profile_id: 2, request_date: new Date('2023-01-12 13:37:00'), status: 'open'},
  {name: 'Marta Scizzorer', img: '/imgs/placeholder.webp', profile_id: 3, request_date: new Date('2023-01-13 13:37:00'), status: 'open'},
  {name: 'Marta Scizzorer', img: '/imgs/placeholder.webp', profile_id: 4, request_date: new Date('2023-05-13 13:37:00'), status: 'contacted'},
  {name: 'Marta Scizzorer', img: '/imgs/placeholder.webp', profile_id: 5, request_date: new Date('2023-04-19 13:37:00'), status: 'contacted'},
  {name: 'Marta Scizzorer', img: '/imgs/placeholder.webp', profile_id: 6, request_date: new Date('2023-05-24 13:37:00'), status: 'contacted'},
  {name: 'Marta Scizzorer', img: '/imgs/placeholder.webp', profile_id: 7, request_date: new Date('2023-05-24 13:37:00'), status: 'request_sent'},
  {name: 'Marta Scizzorer', img: '/imgs/placeholder.webp', profile_id: 8, request_date: new Date('2023-05-24 13:37:00'), status: 'request_sent'},
  {name: 'Marta Scizzorer', img: '/imgs/placeholder.webp', profile_id: 9, request_date: new Date('2023-05-24 13:37:00'), status: 'request_sent'},
])


const {
  data: jobData,
} = await useAsyncData(
  'job-data',
  () => {
    return $directus.items('Jobs').readByQuery({
      filter: {
        id: {
          _eq: id,
        },
      },
      fields: ['Titel'],
    }).catch((e) => {
      console.error(e);
      return null;
    });
  },
  {
    transform: (data) => data.data[0],
  }
)
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

const auth = useAuth()
const notificationStore = useNotificationStore()
const jobRequests = ref([])
const getJobRequests = async () => {
  await $directus.items('Jobanfragen').readByQuery({
    filter: {
      Job: {
        _eq: id,
      },
    },
  }).then((res) => {
    jobRequests.value = res.data
  }).catch((e) => {
    console.error(e)
    notificationStore.addNotification(
      'Fehler beim Laden der Kandidat:innen',
      'error',
      e.message,
      true
    )
  })
}
const getTalents = async () => {
  if (!jobRequests.value) return []
  try {
    const talents = jobRequests.value.map((request) => request.Talent);
    const res = await $fetch(`/api/get-talents/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId: id,
        companyId: companyData.value.id,
        talentIds: talents
      })
    })
    newestCandidates.value = res?.data?.talents
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
const newestCandidates = ref([])
await getJobRequests()
await getTalents()

/*
  const newest = computed(() => {
    return candidates.value.filter(candidate => candidate.status === 'open').sort((a, b) => {
      return b.request_date - a.request_date
    })
  })
 */

  const inContact = computed(() => {
    return candidatesDummy.value.filter(candidate => candidate.status === 'contacted')
  })

const getTotalRequestCount = async () => {
  try {
    const res = await $fetch(`/api/get-job-request-count/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId: id,
      })
  })
    requestSent.value = res.totalJobRequests
    acceptedJobRequests.value = res.acceptedJobRequests
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


const requestSent = ref(0)
const acceptedJobRequests = ref(0)
await getTotalRequestCount()

</script>

<style lang="scss" scoped>

  .candidate {
    @include flexMe(space-between, center);
    flex-wrap: nowrap;
    width: 100%;
    padding: 10px 20px;
    background-color: white;
    border-radius: 5px;
    margin-bottom: 10px;

    &s {

    }

    &-image {
      @include box(50px);
      @include bg(false, cover);
      @include shadow;
      border-radius: 100px;
    }

    &-infos {
      padding-right: $paddingSmall;
      flex: 1;
      
      span {
        margin-bottom: 5px;
        display: block;
        font-weight: bold;
      }
    }

    &-left {
      @include flexMe(flex-start, center);
      gap: 20px;
      flex: 1;
    }

    &-name {
      font-weight: bold;
      margin-bottom: 0;
    }

    &-title {

      &-description {
        margin-bottom: 20px;
        margin-top: -10px;
      }
    }
    
  }

  .iwq {

    &-section {
      width: 100%;
      max-width: 960px;
      margin-left: auto;
      margin-right: auto;
      padding: $paddingSmall;
      margin-top: $paddingMedium;
      border-radius: 5px;
      background-color: rgba($dark, .05);

      & > div {
        padding-bottom: $paddingSmall;
        margin-bottom: $paddingSmall;
        border-bottom: 1px solid rgba($dark, .1);
      }
    }
  }


  @media screen and (max-width: 768px) {

    .candidate {
      padding: 20px 10px;
      flex-direction: column;
      gap: 20px;

      &s {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
      }

      &-image {
        @include box(65px);
      }

      &-infos {
        padding: 0;
        text-align: center;
        width: calc(100% - #{$paddingSmall});

        .progress-bar {
          margin-top: 15px;
        }

        & > span {
          font-size: 20px;
        }
      }

      &-left {
        flex-direction: column;
        justify-content: center;
        text-align: center;
        width: 100%;
      }

      &-title {

        &-description {
          text-align: center;
        }
      }
    }

    .iwq {

      &-section {
        padding-left: 20px;
        padding-right: 20px;

        .h3 {
          text-align: center;
        }
      }
    }

  }

  @media screen and (max-width: 500px) {

    .candidate {

      &s {
        display: block;
      }

    }
    
    .iwq {

      &-section {
        width: calc(100% + (#{$paddingSmall} * 2));
        margin-left: -#{$paddingSmall};
        margin-right: -#{$paddingSmall};
        padding: $paddingSmall;
      }
    }



  }

</style>