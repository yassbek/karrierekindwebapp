<template>
  <div class="iwq-container">
    <div class="iwq-intro">
      <h1>Neue Stelle anlegen</h1>
      <p class="maximizer-medium mcenter">Auf dieser Seite können Sie eine neue offene Stelle für Ihr Unternehmen anlegen. Indem Sie angeben, welche Skills und Fähigkeiten verlangt werden, können wir passende Kandidat:innen für Sie suchen.</p>
    </div>

    <div class="job-create-container" v-if="!noCompanyFound">
      <DynamicFlowForm
        collection="Frageboegen/3"
        :lang-model="language"
        @update:answers="answers => createJob(answers)"
        v-show="!submitSuccess"
      />
      <div v-show="submitSuccess" style="text-align: center;">
        <h2 class="h3">Super, das hat geklappt! Der Matchingprozess wird nun gestartet.</h2>
        <p class="maximizer-medium mcenter">Wir benachrichtigen Sie, sobald wir passende Talente für Ihre Stelle
          gefunden haben.</p>
      </div>
    </div>
    <div v-else>
      Es konnte kein Unternehmen gefunden werden. Bitte legen Sie zuerst ein Unternehmen an.
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
const noCompanyFound = ref(false)

const {
  data: userProfileCompany,
  pending,
  error,
} = await useAsyncData(
  'company',
  async () => {
    if (userType.value === 'Unternehmen') {
      try {
        const data = await $directus.items('Unternehmen').readByQuery({
          fields: [
            '*.*',
          ],
        });
        if (data.data.length === 0) {
          notificationStore.addNotification(
            'Fehler',
            'error',
            'Das Unternehmen konnte nicht gefunden werden',
            true
          );
          noCompanyFound.value = true
          return {data: []};  // You can decide what to return in this case
        }
        return data;
      } catch (e) {
        console.error(e);
        // show error toast
        notificationStore.addNotification(
          'Fehler',
          'error',
          e.message,
          true
        );
        return {data: []};  // You can decide what to return in this case
      }
    } else {
      return {data: []};
    }
  },
  {
    transform: (data) => data.data[0],
  }
);


const createJob = async (data) => {
  console.log(data)
  const filteredData = {}
  let skillsArray = { Antworten: [] }

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
            [question.relation + '_id']: { 'id': answer }
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
  if (!userProfileCompany.value.id) {
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
    const job = await $directus.items('Jobs').createOne(filteredData)
    console.log(job)
    if (!job.id) {
      notificationStore.addNotification(
        'Fehler',
        'error',
        'Der Job konnte nicht erstellt werden',
        true
      )
      return
    }
    // get job id
    skillsArray.Job = job.id
    // push skills to directus
    const skills = await $directus.items('Jobs_Antworten').createOne(skillsArray)
    console.log(skills)
    setTimeout(() => {
      submitSuccess.value = true
    }, 2500)
  } catch (e) {
    console.log(e)
  }
}

</script>