<template>
    <div class="dashboard">
        <h1>Hallo {{ auth?.userProfile?.Vorname }}, schön dass Du da bist!</h1>

        <div class="dashboard-notice-container" v-if="notices">
            <Notice v-for="message in notices" :notice="message" />
        </div>

        <div class="dashboard-container full">
            <DashboardNotifications />
        </div>

      <div v-if="userType === 'Unternehmen'" class="dashboard-container full">
            <div class="dashboard-teaser">
                <div>
                    <h3>Neue Stelle erstellen</h3>
                    <p>Sie haben eine weitere Stelle zu besetzte? Dann erstellen Sie hier ein neues Inserat.</p>
                </div>

                <div>
                    <div class="custom-button-holder">
                        <NuxtLink class="custom-button small" to="/open-jobs/create">Jetzt erstellen</NuxtLink>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="dashboard-container split-2">
            <DashboardRequests
              v-if="userType === 'Unternehmen'"
              title="Neue Matchings"
              empty_text="Sie haben noch keine neuen Matchings erhalten."
              all_target="/job-requests"
              :notifications="jobMatchings"
            />

          <DashboardRequests
            v-if="userType === 'Talente' && !pendingJobRequests"
            :title="jobRequestsTitle"
            empty_text="Sie haben noch keine Jobanfragen erhalten."
            all_target="/job-requests"
            :notifications="jobRequests"
          />

            <DashboardRequests 
                title="Chats"
                all_target="/chats"
                :notifications="chatNotifications"
            />
        </div>

        <div v-if="user.type === 'candidate'" class="dashboard-container full">
            <div class="dashboard-teaser">
                <div>
                    <h3>Interessean einem Coaching?</h3>
                    <p>Dann schaue Dir gerne unsere aktuellen Coachin Angebot an</p>
                </div>

                <div class="custom-button-holder">
                    <NuxtLink class="custom-button" to="/coaching">Zum Coaching</NuxtLink>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import {useAuth} from "~/store/auth";
import {getUserTypeById} from "~/utils/helper";

const route = useRoute()
const user = ref({name: 'Marie', type: route.query.usertype ? route.query.usertype : 'talent', id: 69})
const jobModalOpen = ref(false)
const jobRequestsTitle = user.value.type === 'company' ? 'Angenommene Anfragen' : 'Jobanfragen'

const notices = ref([])

/*
const jobMatchings = ref([
    {
        id: 1,
        title: "Projektmanager:in",
        company: "JUNGMUT GmbH",
        description: "Lorem ipsum dolor sit amet, consetetur",
        img: '/imgs/placeholder.webp',
        bubbleCount: 1,
        target: "/job-requests/2"
    },
    {
        id: 2,
        title: "Projektmanager:in",
        company: "JUNGMUT GmbH",
        description: "Lorem ipsum dolor sit amet, consetetur",
        img: '/imgs/placeholder.webp',
        bubbleCount: 0,
        target: "/job-requests/3"
    },
    {
        id: 3,
        title: "Projektmanager:in",
        company: "JUNGMUT GmbH",
        description: "Lorem ipsum dolor sit amet, consetetur",
        img: '/imgs/placeholder.webp',
        bubbleCount: 0,
        target: "/job-requests/4"
    },
])


 */
const chatNotifications = ref([
    {
        id: 1,
        title: "Projektmanager:in",
        company: "JUNGMUT GmbH",
        description: '"Guten Tag Marie! Ich bin Tim von JUNGMUT"',
        img: '/imgs/placeholder.webp',
        bubbleCount: 1,
        target: "/chat/2"
    },
    {
        id: 2,
        title: "Projektmanager:in",
        company: "JUNGMUT GmbH",
        description: '"Guten Tag Marie! Ich bin Tim von JUNGMUT"',
        img: '/imgs/placeholder.webp',
        bubbleCount: 0,
        target: "/chat/3"
    },
    {
        id: 3,
        title: "Projektmanager:in",
        company: "JUNGMUT GmbH",
        description: '"Guten Tag Marie! Ich bin Tim von JUNGMUT"',
        img: '/imgs/placeholder.webp',
        bubbleCount: 0,
        target: "/chat/4"
    },
])
const auth = useAuth()
// usertype
const userType = computed(() => getUserTypeById(auth.user.role))
// get newest user infos
await auth.getUser()
// check if he needs to complete his registration
if (!auth.user.registration_completed) {
  notices.value.push(
    {
      message: "Bitte vervollständigen Sie Ihre Registrierung",
      importance: 'medium',
      link: '/complete-registration'
    }
  )
}
// check if he is verified
if (!auth.user.verified) {
  notices.value.push(
    {
      message: "Bitte verifizieren Sie Ihre Email",
      importance: 'medium',
      link: '/'
    }
  )
}

const {$directus} = useNuxtApp()

const {
  data: jobRequestsRaw,
  pendingJobRequests,
  error,
} = await useAsyncData(
  'requests',
  () => {
    return $directus.items('Jobanfragen').readByQuery({
      fields: [
        '*.*',
        'Job.Ansprechpartner.*',
        'Job.Unternehmen_und_Standort.*'
      ],
    }).catch((e) => {
      console.error(e);
      return null;
    });
  },
  {
    transform: (data) => {
      if (!data) return []
      return data.data
    }
  }
)

const getTalent = async (jobId, companyId, talentIds) => {
  if (!talentIds) return []
  try {
    const res = await $fetch(`/api/get-talents/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        jobId: jobId,
        companyId: companyId,
        talentIds: talentIds
      }
    })
    return res?.data?.talents
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

const jobMatchings = ref([]);
const jobRequests = ref([]);

watch(jobRequestsRaw, async () => {
  // if no job requests are available, set jobMatchings to empty array
  if (!jobRequestsRaw.value) {
    jobMatchings.value = [];
    return;
  }
  if (userType.value === 'Unternehmen') {
    // get talents for each job request
    const newJobMatchings = await Promise.all(jobRequestsRaw.value.map(async (jobRequest) => {
      const jobId = jobRequest.Job.id;
      const companyId = jobRequest.Job.Unternehmen_und_Standort.id;
      const talentId = jobRequest.Talent.id;
      const talent = await getTalent(jobId, companyId, talentId);

      return {
        id: jobRequest.id,
        title: jobRequest?.Job?.Titel,
        description: talent[0]?.Vorname + ' ' + talent[0]?.Nachname,
        //description: jobRequest?.Job?.Beschreibung,
        img: getImageFromDirectus(talent.Profilbild, 'png'),
        bubbleCount: 0,
        target: `/request/${jobRequest.id}`,
        talent: talent[0],
      }
    }));
    jobMatchings.value = newJobMatchings;
  }
  if (userType.value === 'Talente') {
    const newRequests = jobRequestsRaw.value.map(async (jobRequest) => {
      const job = jobRequest.Job
      const company = job.Unternehmen_und_Standort
      //const contact = job.Ansprechpartner
      return {
        id: jobRequest.id,
        title: job.Titel,
        company: company.Unternehmen,
        description: job.Beschreibung,
        img: getImageFromDirectus(company.Logo, 'png'),
        bubbleCount: 0,
        target: `/request/${jobRequest.id}`,
      }
    })
    jobRequests.value = await Promise.all(newRequests)
  }
}, {immediate: true});
</script>

<style lang="scss" scoped>

    .dashboard {
        width: 100%;
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;

        h1 {
            text-align: center;
            margin-bottom: $paddingBig !important;
        }

        &-container {
            margin-bottom: $paddingSmall;            

            &.full {
                width: 100%;
            }

            &.split {

                &-2 {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: $paddingSmall
                }

                &-3 {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: $paddingSmall
                }

                &-4 {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: $paddingSmall
                }
            }
        }

        &-notice-container {
            margin: 30px auto 50px;
        }
    }

    @media screen and (max-width: 1024px) {
        
        .dashboard {

            &-container {

                &.split {
                    
                    &-2 {
                        grid-template-columns: repeat(1, 1fr);
                    }
                }
            }

            &-teaser {
                text-align: center;
            }
        }
    }

    @media screen and (max-width: 500px) {
        
        .dashboard {

            &-teaser {
                width: calc(100% + (2 * #{$paddingSmall}));
                margin-left: -#{$paddingSmall};
                margin-right: -#{$paddingSmall};
                border-radius: 0;
            }
        }
    }

</style>