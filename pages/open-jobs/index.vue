<template>
  <div class="iwq-container">
    <div class="iwq-intro">
      <h1>Offene Stellen</h1>
      <p class="maximizer-medium mcenter">Auf dieser Seite sehen Sie die Profile der Kandidat:innen, die aufgrund des Fragebogens ein Match für Ihr Unternehmen sind. Gefällt ihnen eine Person, können Sie dieser eine Jobanfrage schicken. Nur wenn diese angenommen wird, können Sie mit der Person chatten.</p>
      <br><br>
      <div class="custom-button-holder align_center">
        <NuxtLink to="/open-jobs/create" class="custom-button small">Neue Stelle anlegen</NuxtLink>
      </div>
    </div>

    <div class="open-jobs mcenter">
      <Dropdown
        v-for="job in jobs"
        :key="job.id"
        :title="job?.Titel"
        :bubble="getJobAnfrage(job.id).length"
        :actions="[
          {id: job.id, name: 'edit', icon: 'edit-icon-light'},
          {id: job.id, name: 'delete', icon: 'delete-light'}
        ]"
        @action="handleAction($event)"
      >
        <p>ab {{ job?.Einstellungsdatum }}
          {{ job?.Unternehmen_und_Standort?.Ort ? ', Region ' + job?.Unternehmen_und_Standort?.Ort : '' }} </p>
        <p class="open-job-request-count">{{ getJobAnfrage(job.id).length }} {{
            getJobAnfrage(job.id).length === 1 ? 'offener Vorschlag' : 'offene Vorschläge'
          }}</p>
        <div class="open-job-requests" v-if="getJobAnfrage(job.id) && getJobAnfrage(job.id).length > 0">
          <div class="open-job-request-peoples">
            <div class="open-job-request-people" v-for="i in getJobAnfrage(job.id)"
                 :style="`background-image: url('/icons/profile-placeholder.svg')`"></div>
          </div>
          <div>
            <div class="custom-button-holder">
              <NuxtLink :to="`/open-jobs/${job.id}/candidates`" class="custom-button inverted small">alle ansehen
              </NuxtLink>
            </div>
          </div>
        </div>
      </Dropdown>
    </div>
  </div>
</template>


<script setup>
import {useNotificationStore} from "~/store/notifcations";

const notifications = useNotificationStore()
const handleAction = async (action) => {
    if (action.action === 'delete') {
      await deleteJob(action.id)
    }

    if (action.action === 'edit') {
      // edit action, maybe modal
      await navigateTo(`/open-jobs/${action.id}/edit`)
    }
}

const deleteJob = async (id) => {
  // TODO: remove return after testing
  return

  try {
    // delete job in directus
    await $directus.items('Jobs').deleteOne(id)
    // delete job in jobs array
    let job = jobs.value.find(j => j.id === id)
    let index = jobs.value.indexOf(job);
    if(index !== -1) {
      jobs.value.splice(index, 1)
    }
    // push notification
    notifications.addNotification(
      'Job gelöscht',
      'success',
      'Der Job wurde erfolgreich gelöscht.',
      true
    )
  } catch (e) {
    console.error(e)
    notifications.addNotification(
      'Job konnte nicht gelöscht werden',
      'error',
      'Der Job konnte nicht gelöscht werden. Bitte versuchen Sie es erneut.',
      true
    )
  }
}


  const {$directus} = useNuxtApp();
  const {
    data: jobs,
    pendingJobs,
    errorJobs,
  } = await useAsyncData(
    'jobs',
    () => {
      return $directus.items('Jobs').readByQuery({
        fields: [
          '*.*',
          'Unternehmen_und_Standort.*'
          //'Job.*',
          //'Job.Passende_Talente.*',
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

const {
  data: jobRequests,
} = await useAsyncData(
    'requests',
    () => {
      return $directus.items('Jobanfragen').readByQuery({}).catch((e) => {
        console.error(e);
        return null;
      });
    },
    {
      transform: (data) => data.data,
    }
  )

const getJobAnfrage = (JobId) => {
    return jobRequests.value.filter((jobRequest) => {
      return jobRequest.Job === JobId
    })
}

const getUserImage = (userId) => {
    // TODO: fetch talente
    //return '/icons/profile-placeholder.svg'
}

</script>


<style lang="scss" scoped>
  .open-job {

    &s {
      margin-top: $paddingMedium;
      max-width: 1200px;
    }

    &-request {

      &s {
        @include flexMe(flex-start, center);
        gap: 30px;
      }

      &-count {
        font-weight: bold;
        font-size: 26px;
        line-height: 1.4em;
        margin: 10px auto 30px;
      }

      &-people {
        @include box(50px);
        @include bg(false, cover);
        @include shadow;
        border-radius: 50px;
        margin-right: -20px;

        &:last-of-type {
          margin-right: 0;
        }

        &s {
          @include flexMe(flex-start);
        }
      }
    }
  }


  @media screen and (max-width: 768px) {
    .open-job {

      &-request {

        &s {
          justify-content: space-between;
        }

        &-count {
          font-size: 22px;
          margin-top: 5px;
        }

        &-people {
          @include box(40px);
          margin-right: -15px;
        }
      }
    }

  }


</style>