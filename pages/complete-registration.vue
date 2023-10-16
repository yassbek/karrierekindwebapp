<template>
    <div class="register-wrapper">
        <h1>Registrierung abschliessen</h1>
        <TabsWrapper @update:completed="updateTalent" class="register-tab" v-if="userType === 'Talente'">
            <Tab title="Persönliche Daten">
                <h2>Content für Persönlich Daten</h2>

                <form action="" class="iwq-form" @submit.prevent="updateAnsprechpartner" id="personalData"
                      name="personalData">
                    <label for="salutation">Anrede:</label>
                    <select type="text" name="salutation" id="salutation" placeholder="Herr" v-model="talent.Anrede"
                            required>
                        <option>Frau</option>
                        <option>Herr</option>
                        <option>Divers</option>
                        <option>Keine Angabe</option>
                    </select>
                    <label for="fname">Vorname:</label>
                    <input type="text" id="fname" name="fname" v-model="talent.Vorname" required>
                    <label for="lname">Nachname:</label>
                    <input type="text" id="lnmae" name="lname" v-model="talent.Nachname" required>
                    <label for="bday">Geburtsdatum:</label>
                    <input type="date" id="bday" name="bday" autocomplete="bday" v-model="talent.Geburtsdatum"
                           required>
                    <label for="street-address">Straße:</label>
                    <input type="text" id="street-address" name="street-address" autocomplete="street-address"
                           v-model="talent.Strasse" required>
                    <label for="city">Ort</label>
                    <input required type="text" id="city" name="city" autocomplete="address-level2"
                           v-model="talent.Ort">
                    <label for="country">Land:</label>
                    <select id="country" name="country" autocomplete="country" @change="updateCountry($event)" required>
                        <option v-for="(country, i) in countries" :key="i" :value="country.value">{{
                            country.label
                            }}
                        </option>
                    </select>
                    <label for="postal-code">Postleitzahl:</label>
                    <input type="number" id="postal-code" name="postal-code" autocomplete="postal-code"
                           v-model="talent.PLZ">
                    <label for="email">E-Mail:</label>
                    <input type="email" id="email-code" name="email" autocomplete="email" disabled v-model="talent.EMail">
                    <label for="tel">Telefon:</label>
                    <input type="tel" id="tel" name="tel" autocomplete="tel" v-model="talent.Telefon">
                    <!--
                    <label for="geo">Standort:</label>
                    <input type="number" id="geo" name="geo" autocomplete="geo" v-model="talent.Standort">
                    -->
                    <label for="bio">Biografie:</label>
                    <textarea id="bio" name="bio" autocomplete="bio" v-model="talent.Biografie"></textarea>
                    <!-- TODO: build frontend components / fetching already done below
                    <label for="languageSkills">Sprachkentnisse:</label>
                    <div class="languageSkills">
                        <label for="language">Sprache:</label>
                        <select id="language" name="language">
                            <option v-for="(language, i) in languages" :key="i" :value="language.value">
                                {{ language.label }}
                            </option>
                        </select>
                        <label for="skills">Kentnisse:</label>
                        <select id="skills" name="skills">
                            <option value="C2">Sprachkenntnisse auf Muttersprachniveau (C2)</option>
                            <option value="C1">fließende bis verhandlungssicher Sprachkenntnisse (C1)</option>
                            <option value="B2">fließendes Sprachniveau (B2)</option>
                            <option value="B1">gute Sprachkenntnisse (B1)</option>
                            <option value="A2">vertiefte Grundsprachkenntnisse (A2)</option>
                            <option value="A1">erste Grundsprachkenntnisse (A1)</option>
                        </select>

                    </div>
                    <label for="cv">Lebenslauf:</label>
                    <input @change="talent.Lebenslauf = $event.target.files" type="file" id="cv" name="cv">
                    -->
                </form>

            </Tab>
            <Tab title="Anonymisierung">
              <div class="settings-section maximizer">
                <h2 class="settings-headline">Anonymisierung</h2>

                <div class="settings-split iwq-form">
                  <div>
                    <label for="anonym_public" class="custom-radio-holder">
                      <input type="radio" name="anonymize_option" id="anonym_public" v-model="talent.Anonymisierung" value="public" required>
                      <label for="anonym_public" class="custom-radio"></label>
                      <span>Öffentlich</span>
                    </label>

                    <label for="anonym_nopicture" class="custom-radio-holder">
                      <input type="radio" name="anonymize_option" id="anonym_nopicture" v-model="talent.Anonymisierung" value="without_image" required>
                      <label for="anonym_nopicture" class="custom-radio"></label>
                      <span>Ohne Bild</span>
                    </label>

                    <label for="anonym_noimage_noname" class="custom-radio-holder">
                      <input type="radio" name="anonymize_option" id="anonym_noimage_noname" v-model="talent.Anonymisierung" value="hidden" required>
                      <label for="anonym_noimage_noname" class="custom-radio"></label>
                      <span>Ohne Bild und ohne Namen</span>
                    </label>
                  </div>
                </div>
              </div>

            </Tab>
            <Tab title="Fragebogen">
              <h2>Fakten und Wünsche</h2>
              <div class="job-create-container">
                <DynamicFlowForm
                  collection="Frageboegen/5"
                  :lang-model="language"
                  @update:answers="answers => linkToAnswers(answers)"
                  v-show="!submitSuccess"
                />
                <div v-show="submitSuccess" style="text-align: center;">
                  <h2 class="h3">Submit erfolgreich</h2>
                </div>
              </div>
            </Tab>
        </TabsWrapper>
        <TabsWrapper @update:completed="updateCompany" class="register-tab" v-if="userType === 'Unternehmen'">
            <Tab title="Firmenprofil">
                <h2>Content für Firmenprofil</h2>
                <form action="" class="iwq-form" @submit.prevent="updateCompany" id="personalData" name="personalData">
                    <label for="company">Unternehmen:</label>
                    <input type="text" id="company" name="company" v-model="company.Unternehmen" required>
                    <label for="street-address">Straße:</label>
                    <input type="text" id="street-address" name="street-address" autocomplete="street-address" required
                           v-model="company.Strasse">
                    <label for="city">Ort</label>
                    <input required type="text" id="city" name="city" autocomplete="address-level2"
                           v-model="company.Ort">
                    <label for="country">Land:</label>
                    <select id="country" name="country" autocomplete="country" @change="updateCountry($event)" required>
                        <option v-for="(country, i) in countries" :key="i" :value="country.value">{{
                            country.label
                            }}
                        </option>
                    </select>
                    <label for="postal-code">Postleitzahl:</label>
                    <input type="number" id="postal-code" name="postal-code" autocomplete="postal-code"
                           v-model="company.PLZ">
                    <label for="email">E-Mail:</label>
                    <input type="email" id="email-code" name="email" autocomplete="email" v-model="company.Email">
                    <label for="tel">Telefon:</label>
                    <input type="tel" id="tel" name="tel" autocomplete="tel" v-model="company.Telefon">
                    <label for="website">Webseite:</label>
                    <input type="text" id="website" name="website" autocomplete="website" v-model="company.Webseite">
                    <label for="logo">Logo:</label>
                    <input type="file" id="logo" name="logo" accept="image/png, image/gif, image/jpeg" @change="addLogo">
                    <label for="locations">Standorte:</label>
                  <!-- build open street map component -->
                    <input type="text" id="locations" name="locations" v-model="company.Standorte">
                </form>
            </Tab>
            <Tab title="Ansprechpartner">
                <h2>Ansprechpartner hinzufügen</h2>
                <form action="" class="iwq-form " id="personalData" @submit.prevent="updateAnsprechpartner" name="personalData">
                    <label for="salutation">Anrede:</label>
                    <select type="text" name="salutation" id="salutation" placeholder="Bitte auswählen"
                            v-model="ansprechpartner.Anrede" required>
                        <option>Frau</option>
                        <option>Herr</option>
                        <option>Divers</option>
                        <option>Keine Angabe</option>
                    </select>
                    <label for="fname">Vorname:</label>
                    <input type="text" id="fname" name="fname" v-model="ansprechpartner.Vorname" required>
                    <label for="lname">Nachname:</label>
                    <input type="text" id="lnmae" name="lname" v-model="ansprechpartner.Nachname" required>
                    <label for="email">E-Mail:</label>
                    <input type="email" id="email-code" name="email" v-model="ansprechpartner.EMail" disabled
                           autocomplete="email">
                    <label for="tel">Telefon:</label>
                    <input type="tel" id="tel" name="tel" v-model="ansprechpartner.Telefon" autocomplete="tel">
                </form>
            </Tab>
          <Tab title="Unternehmensdaten">
            <h2>Unternehmensdaten</h2>
            <div class="job-create-container">
              <DynamicFlowForm
                collection="Frageboegen/4"
                :lang-model="language"
                @update:answers="answers => updateUnternehmensDaten(answers)"
                v-show="!submitSuccess"
              />
              <div v-show="submitSuccess" style="text-align: center;">
                <h2 class="h3">Submit erfolgreich</h2>
              </div>
            </div>
            </Tab>
        </TabsWrapper>
    </div>
</template>

<script setup>
import {getFilledFields, getUserTypeById} from "~/utils/helper";
import {useAuth} from "~/store/auth";
import {format, parse} from "date-fns";
import {useNotificationStore} from "~/store/notifcations";

const auth = useAuth()
const userType = computed(() => getUserTypeById(auth.user.role))
const {path} = useRoute()
const {$directus} = useNuxtApp()

if (!auth.userProfile) await auth.loadUserProfile()
const userProfile = computed(() => auth.userProfile)
const notificationStore = useNotificationStore()

// fill in data from user profile
const talent = ref({
    Anrede: userProfile?.value?.Anrede,
    Biografie: userProfile?.value?.Biografie,
    EMail: auth.user.email,
    Geburtsdatum: userProfile?.value?.Geburtsdatum,
    Land: userProfile?.value?.Land,
    Lebenslauf: userProfile?.value?.Lebenslauf,
    Nachname: userProfile?.value?.Nachname,
    Ort: userProfile?.value?.Ort,
    PLZ: userProfile?.value?.PLZ,
    Sprachkenntnisse: userProfile?.value?.Sprachkenntnisse,
    Standort: userProfile?.value?.Standort,
    Strasse: userProfile?.value?.Strasse,
    Telefon: userProfile?.value?.Telefon,
    Vorname: userProfile?.value?.Vorname,
    status: 'published',
})

const ansprechpartner = ref({
    Anrede: userProfile?.value?.Anrede,
    Vorname: userProfile?.value?.Vorname,
    Nachname: userProfile?.value?.Nachname,
    Telefon: userProfile?.value?.Telefon,
    EMail: auth.user.email,
    status: 'published',
})

const fetchCountries = async () => {
    try {
        const response = await $directus.items('Laender').readByQuery({
            fields: ['id', 'Laendername_DE', 'Laendername_EN'],
            limit: -1
        })
        return response.data.map(country => {
            return {
                value: country.id,
                label: country.Laendername_DE
            }
        })
    } catch (e) {
      console.error(e)
      notificationStore.addNotification(
        'Fehler',
        'error',
        e.message,
        true
      )
    }
}

const updateCountry = (event) => {
    const value = event.target.value
    if (userType.value === 'Talente') {
        talent.value.Land = {
            "key": value,
            "collection": "Laender"
        }
    } else if (userType.value === 'Unternehmen') {
        company.value.Land = {
            "key": value,
            "collection": "Laender"
        }
    }
}

const fetchLanguages = async () => {
    try {
        const response = await $directus.items('Sprachen').readByQuery({
            fields: ['id', 'Sprache', 'Abkuerzung'],
            limit: -1
        })
        return response.data.map(language => {
          return {
            value: language.id,
            label: language.Sprache
          }
        })
    } catch (e) {
      console.error(e)
      notificationStore.addNotification(
        'Fehler',
        'error',
        e.message,
        true
      )
    }
}


// get countries and languages
const countries = ref(await fetchCountries())
const languages = ref(await fetchLanguages())

const updateTalent = async () => {
  // get all fileds wiht value
  const filledFields = getFilledFields(talent.value);
  // parse date
  if (userProfile.Geburtsdatum) {
    const parsedDate = parse(userProfile.Geburtsdatum, 'yyyy-MM-dd', new Date())
    userProfile.Geburtsdatum = format(parsedDate, 'yyyy-MM-dd')
  }
  // update talent
  try {
    const response = await auth.updateUserProfile('Talente', userProfile.value.id, filledFields)
    console.log(response)
    await auth.loadUserProfile()
    // push toast notification
    notificationStore.addNotification(
      'Aktualisiert',
      'success',
      'Daten wurden erfolgreich aktualisiert',
      true
    )
    // set registration completed
    await setRegistrationCompleted()
    // redirect to dashboard
    await navigateTo('/dashboard')
  } catch (e) {
    console.error(e)
    // show error toast
    notificationStore.addNotification(
      'Fehler',
      'error',
      e.message,
      true
    )
  }
}

const addLogo = async (event) => {
  company.value.Logo = event.target.files[0]
}
const uploadLogo = async (file) => {

  let formData = new FormData();
  formData.append('title', 'Logo'); // Add the title
  formData.append('file', file); // Add the file

  try {
    const response = await $directus.files.createOne(formData);
    return response.id;
  } catch (e) {
    console.error('Error uploading file:', e);
    notificationStore.addNotification('Fehler', 'error', e.message, true)
  }
}

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

const company = ref({
  Unternehmen: userProfileCompany?.value?.Unternehmen,
  Ort: userProfileCompany?.value?.Ort,
  Strasse: userProfileCompany?.value?.Strasse,
  PLZ: userProfileCompany?.value?.PLZ,
  Telefon: userProfileCompany?.value?.Telefon,
  Email: userProfileCompany?.value?.Email,
  Webseite: userProfileCompany?.value?.Webseite,
  Logo: userProfileCompany?.value?.Logo,
  Land: userProfileCompany?.value?.Land,
  // TODO: add frontend standorte comp
  Standorte: userProfileCompany?.value?.Standorte,
  status: 'published',
})

const updateCompany = async () => {
  // check if logo needs upload
  if (company.value.Logo) {
    company.value.Logo = await uploadLogo(company.value.Logo)
  }
  // get all fileds with value
  const filledFields = getFilledFields(company.value);
  // update company
  if (filledFields.Land) {
    filledFields.Land = filledFields.Land.key
  }

  try {
    // first update unternehmen
    const response = await $directus.items('Unternehmen').updateOne(userProfileCompany.value.id, filledFields)
    // then update ansprechpartner
    console.log(response)
    await updateAnsprechpartner()
  } catch (e) {
    console.error(e)
    // show error toast
    notificationStore.addNotification(
      'Fehler',
      'error',
      e.message,
      true
    )
  }
}

const updateAnsprechpartner = async () => {
  // get all fields with value
  const filledFields = getFilledFields(ansprechpartner.value);
  // update ansprechpartner
  try {
    const response = await $directus.items('Ansprechpartner').updateOne(userProfile.value.id, filledFields);
    console.log(response)
    await auth.loadUserProfile()
    // push toast notification
    notificationStore.addNotification(
      'Aktualisiert',
      'success',
      'Daten wurden erfolgreich aktualisiert',
      true
    )
    // set registration completed
    await setRegistrationCompleted()
    // redirect to dashboard
    delay(2000).then(async () => {
      await navigateTo('/')
    })
  } catch (e) {
    console.error(e)
    // show error toast
    notificationStore.addNotification(
      'Fehler',
      'error',
      e.message,
      true
    )
  }
}

const submitSuccess = ref(false)

const setRegistrationCompleted = async () => {
  try {
    const response = await $directus.users.updateOne(auth.user.id, {
      registration_completed: true
    })
    console.log(response)
  } catch (e) {
    console.error(e)
    // show error toast
    notificationStore.addNotification(
      'Fehler',
      'error',
      e.message,
      true
    )
  }
}

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
    submitText: 'Absenden',
    longTextHelpText: ':shiftKey + :enterKey für einen Zeilenumbruch.',
    prev: 'Zurück',
    next: 'Weiter',
    percentCompleted: ':percent% abgeschlossen',
    invalidPrompt: 'Bitte fülle das Feld korrekt aus',
    thankYouText: 'Vielen Dank!',
    successText: 'Das Profil wurde erfolgreich erstellt.',
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

const linkToAnswers = async (data) => {
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
      // if question is sprachkenntnisse, add custom template to answer
      if (attribute === 'Sprachkenntnisse') {
        // loop throgh all answers
        for (const sprachkenntnis of answer) {
          // add custom template to answer
          filteredData[attribute].push(
            {
              "Sprache": {
                "key": sprachkenntnis.value
              },
              "Sprachlevel" : sprachkenntnis.rating.Value
            }
          )
        }
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
            [question.relation + '_id']:
              {
                'id': answer
              }
          }
        ]
      } else {
        filteredData[attribute] = answer
      }
    }
  }

  try {
    const updateTalent = await $directus.items('Talente').updateOne(userProfile.value.id, filteredData)
    console.log(updateTalent)
    const createEntryTalenteAntworten = await $directus.items('Talente_Antworten').createOne({
      Talent: userProfile.value.id,
      Antworten: skillsArray.Antworten,
    })
    console.log(createEntryTalenteAntworten)
    submitSuccess.value = true
    notificationStore.addNotification(
      'Aktualisiert',
      'success',
      'Daten wurden erfolgreich aktualisiert',
      true
    )
  } catch (e) {
    console.error(e)
    notificationStore.addNotification(
      'Fehler',
      'error',
      e.message,
      true
    )
  }
}

const updateUnternehmensDaten = async (data) => {
  const filteredData = {}

  // TODO: auf den neusten stand bringen

  data.forEach(question => {
    const attribute = question.directusAttribute
    if (attribute) {
      let answer = question.answer
      // parse date
      if (question.type === 'FlowFormDateType' && typeof answer === 'object') {
        const parsedDate = parse(answer, 'yyyy-MM-dd', new Date())
        answer = format(parsedDate, 'yyyy-MM-dd')
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
  })

  try {
    const response = await $directus.items('Unternehmen').updateOne(userProfileCompany.value.id, filteredData)
    console.log(response)
    notificationStore.addNotification(
      'Aktualisiert',
      'success',
      'Daten wurden erfolgreich aktualisiert',
      true
    )
  } catch (e) {
    console.error(e)
    // show error toast
    notificationStore.addNotification(
      'Fehler',
      'error',
      e.message,
      true
    )
  }
}

</script>

<style lang="scss" scoped>

    .register {

      &-tab {
        margin-top: $paddingBig;

        label {
          text-align: left;
        }
      }

      &-wrapper {
        text-align: center;
      }
    }
</style>
