<template>
  <div class="iwq-container">
    <div class="iwq-intro">
      <h1>Stelle bearbeiten</h1>
      <p class="maximizer-medium mcenter">Auf dieser Seite können Sie eine neue offene Stelle für Ihr Unternehmen
        anlegen. Indem Sie angeben, welche Skills und Fähigkeiten verlangt werden, können wir passende Kandidat:innen
        für Sie suchen.</p>
    </div>

    <div class="job-create-container">
      <DynamicFlowForm
        collection="Frageboegen/3"
        :job-id="jobID"
        :lang-model="language"
        @update:answers="answers => editJob(answers)"
        v-show="!submitSuccess"
      />
      <div v-show="submitSuccess" style="text-align: center;">
        <p class="maximizer-medium mcenter">Der Job wurde erfolgreich bearbeitet.</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import {format, parse} from 'date-fns'
import {useAuth} from "~/store/auth";
import {getUserTypeById} from "~/utils/helper";
import {useNotificationStore} from "~/store/notifcations";

const submitSuccess = ref(false)
const {$directus} = useNuxtApp()
const auth = useAuth()

const route = useRoute()
const jobID = Number(route.params.jobID)

const language = {
  enterKey: 'Enter',
  shiftKey: 'Umschalt',
  ok: 'Weiter',
  continue: 'Weiter',
  skip: 'Überspringen',
  pressEnter: 'Drücke :enterKey',
  multipleChoiceHelpText: 'Wähle so viele wie Du möchtest',
  multipleChoiceHelpTextSingle: 'Wähle nur eine Antwort',
  otherPrompt: 'Andere',
  placeholder: 'Gib hier Deine Antwort ein...',
  submitText: 'Job erstellen',
  longTextHelpText: ':shiftKey + :enterKey für einen Zeilenumbruch.',
  prev: 'Zurück',
  next: 'Weiter',
  percentCompleted: ':percent% abgeschlossen',
  invalidPrompt: 'Bitte fülle das Feld korrekt aus',
  thankYouText: 'Vielen Dank!',
  successText: 'Job wurde erfolgreich erstellt.',
  ariaOk: 'Drücke zum Fortfahren',
  ariaRequired: 'Dieser Schritt ist erforderlich',
  ariaPrev: 'Vorheriger Schritt',
  ariaNext: 'Nächster Schritt',
  ariaSubmitText: 'Drücke zum Absenden',
  ariaMultipleChoice: 'Drücke :letter zum Auswählen',
  ariaTypeAnswer: 'Gib hier Deine Antwort ein',
  errorAllowedFileTypes: 'Ungültiger Dateityp. Erlaubte Dateitypen: :fileTypes.',
  errorMaxFileSize: 'Datei(en) zu groß. Maximale Dateigröße: :size.',
  errorMinFiles: 'Zu wenige Dateien hinzugefügt. Mindestanzahl erlaubter Dateien: :min.',
  errorMaxFiles: 'Zu viele Dateien hinzugefügt. Maximale Anzahl erlaubter Dateien: :max.'
}
const userType = computed(() => getUserTypeById(auth.user.role))
const notificationStore = useNotificationStore()
const {
  data: userProfileCompany,
  pending,
  error,
} = await useAsyncData(
  'company',
  () => {
    if (userType.value === 'Unternehmen') {
      return $directus.items('Unternehmen').readByQuery({
        fields: [
          '*.*',
        ],
      }).catch((e) => {
        console.error(e);
        // show error toast
        notificationStore.addNotification(
          'Fehler',
          'error',
          e.message,
          true
        )
      });
    } else {
      return {data: []}
    }
  },
  {
    transform: (data) => data.data[0],
  }
)

const editJob = async (data) => {
  // TODO: remove return after testing
  return

  console.log(data)
  const filteredData = {}
  let skillsArray = {Antworten: []}

  // loop through all questions
  for (const question of data) {
    const attribute = question.directusAttribute
    if (attribute) {
      let answer = question.answer
      // skip questions without answer
      if (!answer) {
        continue;
      }
      // if attribute is 'skill', add it to the separate array and skip the rest of this iteration
      if (attribute === 'skill') {
        skillsArray.Antworten.push({
          Antworten_id: {
            id: answer
          }
        });
        continue;
      }
      // if question is a date question, format it to yyyy-MM-dd
      if (question.type === 'FlowFormDateType' && typeof answer === 'object') {
        const parsedDate = parse(answer, 'yyyy-MM-dd', new Date())
        answer = format(parsedDate, 'yyyy-MM-dd')
      }
      // if question is a multiple choice question, ensure answer is an array
      if (question.type === 'FlowFormMultipleChoiceType' && question.multipleAllowed) {
        if (!Array.isArray(answer)) {
          answer = [answer];
        }
      }
      // add answer to filtered data
      if (question.relation) {
        // if relation, add relation id and push it to array
        filteredData[attribute] = [
          {
            [question.relation + '_id']: {'id': answer}
          }
        ]
      } else {
        filteredData[attribute] = answer
      }
    }
  }
  // add UnternehmensId
  filteredData.Unternehmen_und_Standort = userProfileCompany.value.id
  // check if unternehmen exists and throw error if not
  if (userProfileCompany.value.id) {
    notificationStore.addNotification(
      'Fehler',
      'error',
      'Das Unternehmen konnte nicht gefunden werden',
      true
    )
    return
  }
  // add einstellungsdatum for today
  filteredData.Einstellungsdatum = format(new Date(), 'yyyy-MM-dd')
  // add ansprechpartner from store
  filteredData.Ansprechpartner = auth.userProfile.id
  // make api call to create job
  try {
    const job = await $directus.items('Jobs').updateOne(jobID, filteredData)
    console.log(job)
    if (!job.id) {
      notificationStore.addNotification(
        'Fehler',
        'error',
        'Der Job konnte nicht bearbeitet werden',
        true
      )
      return
    }
    // get job id
    skillsArray.Job = jobID
    // push skills to directus
    const skills = await $directus.items('Jobs_Antworten').updateOne(jobsAntwortenId, skillsArray)
    console.log(skills)
    setTimeout(() => {
      submitSuccess.value = true
    }, 2500)
  } catch (e) {
    console.log(e)
  }
}

</script>