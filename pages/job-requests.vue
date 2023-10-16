<template>
    <div class="iwq-container">
        <Breadcrumbs>
            <Breadcrumb to="/job-requests">Jobanfragen</Breadcrumb>
            <Breadcrumb>{{ jobTypes[jobFilterType] }}</Breadcrumb>
        </Breadcrumbs>

        <!-- OPEN REQUESTS -->
        <div class="requests-wrapper" v-if="jobFilterType === 'open'">
            <h1>Jobanfragen</h1>
            <p class="maximizer-medium mcenter">
                Auf dieser Seite siehst Du Anfragen von Unternehmen, die sich für Dich interessieren. <br><br>
                Schau Dir Ihre Anfragen an – wenn sie Dich interessieren und Du mit den Unternehmen chatten möchtest, nimm die Anfragen an. Wenn Du ablehnst können Dich die Unternehmen nicht kontaktieren.
            </p>

            <div class="request-nav">
                <NuxtLink v-for="(name, route) in navItems" :to="`/job-requests?status=${route}`" class="request-nav-item" :class="{active: jobFilterType == route}">{{ name }}</NuxtLink>
            </div>

            <div class="requests">
              <h2 class="mcenter maximizer-medium">Folgende Unternehmen interessieren sich für Dich:</h2>
                <ProcessedRequest v-for="request in openJobs" :key="request.id" :request="request" />
            </div>
        </div>

        <!-- ACCEPTED REQUESTS -->
        <div class="requests-wrapper" v-if="jobFilterType === 'accepted'">
            <h1>Angenommene Anfragen</h1>
            <p class="maximizer-medium mcenter">Auf dieser Seite siehst Du die Unternehmen, deren Anfragen Du angenommen hast.</p>

            <div class="request-nav">
                <NuxtLink v-for="(name, route) in navItems" :to="`/job-requests?status=${route}`" class="request-nav-item" :class="{active: jobFilterType == route}">{{ name }}</NuxtLink>
            </div>

            <div class="requests">
              <h2>Du kannst nun mit ihnen chatten:</h2>
                <ProcessedRequest v-for="request in acceptedJobs" type="accepted" :request="request" :key="request.id" />
            </div>
        </div>

       <!-- DECLINED REQUESTS -->
       <div class="requests-wrapper" v-if="jobFilterType === 'declined'">
            <h1>Abgelehnte Anfragen</h1>
            <p class="maximizer-medium mcenter">Auf dieser Seite siehst du die Unternehmen, deren Anfragen du abgelehnt hast. Solltest du dich umentscheiden, kannst du die Anfrage nachträglich trotzdem annehmen.</p>

            <div class="request-nav">
                <NuxtLink v-for="(name, route) in navItems" :to="`/job-requests?status=${route}`" class="request-nav-item" :class="{active: jobFilterType == route}">{{ name }}</NuxtLink>
            </div>

            <div class="requests">
                <ProcessedRequest v-for="request in rejectedJobs" type="declined" :request="request" :key="request.id" />
            </div>
        </div>
    </div>
</template>

<script setup>

    const route = useRoute()
    const jobFilterType = ref(route.query.status ? route.query.status : 'open')
    const navItems = {
        open: 'Offene',
        accepted: 'Angenommene',
        declined: 'Abgelehnte'
    }


    const jobTypes = {
        open: 'Offene Anfragen',
        default: 'Offene Anfragen',
        accepted: 'Akzeptierte Anfragen',
        declined: 'Abgelehnte Anfragen'
    }

    // TODO: get from API by jobFilterType
    const requests = ref([
        {id: 1, date: "22.11.2021", message: 'Guten Tag Marie! Ich bin Simone von JUNGMUT und auf dich aufmerksam geworden, weil du bereits mit HubSpot gear ausgestattet bist finden wir lorem ipsum dolor sit amet', author: {img: '/imgs/placeholder.webp', name: 'Simone Jung', company: 'JUNGMUT GmbH', position: 'HubSpot Consultant (m/w/d)'} },
        {id: 2, date: "13.05.2023", message: 'Guten Tag Marie! Ich bin Simone von JUNGMUT und auf dich aufmerksam geworden, weil du bereits mit HubSpot gear ausgestattet bist finden wir lorem ipsum dolor sit amet', author: {img: '/imgs/placeholder.webp', name: 'Simone Jung', company: 'JUNGMUT GmbH', position: 'HubSpot Consultant (m/w/d)'} },
        {id: 3, date: "14.01.2023", message: 'Guten Tag Marie! Ich bin Simone von JUNGMUT und auf dich aufmerksam geworden, weil du bereits mit HubSpot gear ausgestattet bist finden wir lorem ipsum dolor sit amet', author: {img: '/imgs/placeholder.webp', name: 'Simone Jung', company: 'JUNGMUT GmbH', position: 'HubSpot Consultant (m/w/d)'} },
    ])

    onMounted(() => {
       watch(
        () => route.query.status, 
        (updatedValue) => {
            jobFilterType.value = updatedValue ? updatedValue : 'open'
        }
       )
    })


    const {$directus} = useNuxtApp();
    const {
      data: jobs,
      pending,
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
        transform: (data) => data.data,
      }
    )
    if (process.client) console.log(jobs.value)
    // filter jobs by status
    const openJobs = computed(() => {
        return jobs.value.filter((job) => job.status === 'open')
    })
    const acceptedJobs = computed(() => {
        return jobs.value.filter((job) => job.status === 'accepted')
    })
    const rejectedJobs = computed(() => {
        return jobs.value.filter((job) => job.status === 'rejected')
    })
</script>

<style lang="scss" scoped>

    .request {
        border-radius: 5px;

        &s {
            @include flexMe(center, flex-start);
            gap: 15px;
            width: 100%;
            max-width: 960px;
            margin: $paddingMedium auto 0;
            padding: $paddingMedium;
            background-color: darken($light, 5%);
            border-radius: 10px;

            h2 {
                margin-top: 0;
                margin-bottom: $paddingSmall !important;
            }

            &-wrapper {
                text-align: center;
            }
        }   

        &-nav {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin-top: $paddingSmall;

            &-item {
                padding: 5px 10px;
                border-radius: 5px;

                &.active {
                    @include colorize($primary);
                    color: white;
                }
            }
        }
    }


    @media screen and (max-width: 1024px) {
        .request {
            
            &s {
                padding: $paddingSmall;
            }
        }
    }

    @media screen and (max-width: 768px) {
        
        .request {

            &s {
                border-radius: 0;
                width: calc(100% + (2 * #{$paddingSmall}));
                margin-left: -#{$paddingSmall};
                margin-right: -#{$paddingSmall};
            }
        }
    }

    @media screen and (max-width: 500px) {
        
        .request {

            &-nav {
                flex-direction: column;
                gap: 5px;
            }
        }
    }   

</style>