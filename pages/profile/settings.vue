<template>
  <div class="iwq-container" v-if="userType === 'Talente'">
        <div class="iwq-intro">
            <h1>Einstellungen</h1>
            <p class="maximizer-medium mcenter">Auf dieser Seite kannst Du Einstellungen zu Deinem konto vornehmen</p>
        </div>

        <div class="settings-section iwq-form">
            <h2 class="settings-section-headline">Mein Konto</h2>

            <div class="iwq-form-row">
                <div>
                    <label for="prename">Vorname*</label>
                  <input type="text" name="prename" id="prename" placeholder="Vorname*" v-model="talentData.Vorname"
                         required>
                </div>

                <div>
                    <label for="lastname">Nachname*</label>
                  <input type="text" name="lastname" id="lastname" placeholder="Nachname*" v-model="talentData.Nachname"
                         required>
                </div>
            </div>

            <label for="email">E-Mail Adresse*</label>
          <input type="email" v-model="talentData.EMail">

            <br><br>

            <button class="linkbutton" @click="changePasswortdModalOpen = true">Passwort ändern</button>
            <button class="linkbutton error" @click="deleteAccountModal = true">Konto löschen / inaktiv setzen</button>
        </div>

        <div class="settings-section maximizer">
          <h2 class="settings-headline">Anonymisierung</h2>

            <div class="settings-split iwq-form">
                <div>
                    <label for="anonym_public" class="custom-radio-holder">
                        <input type="radio" name="anonymize_option" id="anonym_public" v-model="talentData.Anonymisierung" value="public" required>
                        <label for="anonym_public" class="custom-radio"></label>
                        <span>Öffentlich</span>
                    </label>

                    <label for="anonym_nopicture" class="custom-radio-holder">
                        <input type="radio" name="anonymize_option" id="anonym_nopicture" v-model="talentData.Anonymisierung" value="without_image" required>
                        <label for="anonym_nopicture" class="custom-radio"></label>
                        <span>Ohne Bild</span>
                    </label>

                    <label for="anonym_noimage_noname" class="custom-radio-holder">
                        <input type="radio" name="anonymize_option" id="anonym_noimage_noname" v-model="talentData.Anonymisierung" value="hidden" required>
                        <label for="anonym_noimage_noname" class="custom-radio"></label>
                        <span>Ohne Bild und ohne Namen</span>
                    </label>
                </div>

                <div>
                    <h4 style="text-align: center;">Icon Create Widget</h4>
                </div>
            </div>
        </div>

        <div class="settings-section maximizer">
            <h2 class="settings-headline">Blacklist</h2>

            <div class="settings-section-button" @click="blacklistModal = true">+</div>

          <div class="settings-blacklist" v-if="talentData?.Blacklist?.length > 0">
            <div v-for="item in talentData.Blacklist" :key="item.id" class="settings-blacklist-item">
              <span>{{ item.Unternehmen_id.Unternehmen }}</span>
              <span class="settings-blacklist-item-action" @click="removeFromBlacklist(item.Unternehmen_id.id)">-</span>
                </div>
            </div>
          <div class="settings-blacklist" v-else>
            <p>Deine Blacklist ist leer. <a @click="blacklistModal = true">Unternehmen auf die Blacklist setzen</a></p>
          </div>
        </div>


        <div class="maximizer mcenter custom-button-holder" style="margin-top: 50px;">
            <button class="custom-button" @click="saveSettings()">Änderungen übernehmen</button>
        </div>
    </div>
  <div class="iwq-container" v-if="userType === 'Unternehmen' && ansprechpartnerData && unternehmenData">
        <div class="iwq-intro">
            <h1>Einstellungen</h1>
            <p class="maximizer-medium mcenter">Auf dieser Seite können Sie Einstellungen zu Ihrem Konto vornehmen.</p>
        </div>

        <div class="settings-section">
            <h2 class="settings-section-headline">Mein Konto</h2>

            <div class="settings-section-top">
                <div class="settings-section-top-infos iwq-form">
                    <div class="iwq-form-row">
                        <div>
                            <label for="prename">Vorname*</label>
                          <input type="text" name="prename" id="prename" placeholder="Vorname*"
                                 v-model="ansprechpartnerData.Vorname" required>
                        </div>

                        <div>
                            <label for="lastname">Nachname*</label>
                          <input type="text" name="lastname" id="lastname" placeholder="Nachname*"
                                 v-model="ansprechpartnerData.Nachname" required>
                        </div>
                    </div>

                    <label for="email">E-Mail Adresse*</label>
                  <input type="email" v-model="ansprechpartnerData.EMail">

                    <br><br>

                    <button class="linkbutton" @click="changePasswortdModalOpen = true">Passwort ändern</button>
                    <button class="linkbutton error" @click="deleteAccountModal = true">Konto löschen / inaktiv setzen</button>
                </div>

              <div class="settings-section-top-image"
                   :style="`background-image: url('${getImageFromDirectus(ansprechpartnerData?.Profilbild, 'png')}')`"
                   @click="handleFileInput('ansprechpartner')">
                    <div class="settings-section-top-image-bubble">
                        <img src="~/assets/icons/camera-light.svg" alt="Bild ändern">
                    </div>
                <input type="file" name="file" accept="image/png, image/gif, image/jpeg" ref="fileInputImageAnsprechpartner"
                       @change="handleFileSelection($event, 'ansprechpartner')" style="display: none;">

              </div>
            </div>
        </div>

        <div class="settings-section iwq-form">
            <h2 class="settings-section-headline">Mein Unternehmen</h2>

            <div class="settings-section-top">

                <div class="settings-section-top-infos">
                    <div class="iwq-form-row">
                        <div>
                            <label for="company">Firmenname*</label>
                          <input type="text" id="company" placeholder="Unternehmensname" name="company"
                                 v-model="unternehmenData.Unternehmen" required>
                        </div>
                    </div>


                    <div class="iwq-form-row">
                        <div>
                            <label for="street">Straße*</label>
                          <input type="text" id="street" placeholder="Unternehmensname" name="street"
                                 v-model="unternehmenData.Strasse" required>
                        </div>
                    </div>

                    <div class="iwq-form-row">
                        <div>
                            <label for="zip">PLZ*</label>
                          <input type="number" pattern="^\d{5}$" id="zip" placeholder="Postleitzahl" name="zip"
                                 v-model="unternehmenData.PLZ" required>
                        </div>

                        <div>
                            <label for="city">Stadt*</label>
                          <input type="text" id="city" placeholder="Unternehmensname" name="city"
                                 v-model="unternehmenData.Ort" required>
                        </div>
                    </div>

                    <button class="linkbutton" @click="deleteCompanyModal = true">Unternehmen löschen / inaktiv schalten</button>
                </div>

              <div class="settings-section-top-image"
                   :style="`background-image: url('${getImageFromDirectus(unternehmenData.Logo)}')`"
                   @click="handleFileInput('unternehmen')">
                    <div class="settings-section-top-image-bubble">
                        <img src="~/assets/icons/camera-light.svg" alt="Bild ändern">
                    </div>
                <input type="file" name="file" accept="image/png, image/gif, image/jpeg" ref="fileInputImageUnternehmen"
                       @change="handleFileSelection($event, 'unternehmen')" style="display: none;">

              </div>
            </div>
        </div>

    <div class="settings-section" v-if="allAnsprechpartner.length > 0">
            <h2 class="settings-section-headline">Weitere Ansprechpartner:innen</h2>
            <div class="settings-contact-persons">
              <template v-for="person in allAnsprechpartner">

                <div v-if="person.Ansprechpartner_id" class="settings-contact-person"
                     :key="person.Ansprechpartner_id.id">
                    <div class="settings-contact-person-infos">
                      <div class="settings-contact-person-image"
                           :style="`background-image: url('${getImageFromDirectus(person?.Ansprechpartner_id?.Profilbild)}');`"></div>
                        <div>
                          <p class="settings-contact-person-name">{{ person?.Ansprechpartner_id?.Vorname }} {{ ' ' }} {{
                              person.Ansprechpartner_id.Nachname
                            }}</p>
                          <p class="settings-contact-person-mail">{{ person?.Ansprechpartner_id?.EMail }}</p>
                        </div>
                    </div>
                <div class="settings-contact-person-action" @click="removeContactPerson(person)">
                        <img src="~/assets/icons/delete-error.svg" alt="Ansprechpartner entfernen">
                    </div>
                </div>
              </template>
            </div>


      <br>
            <div class="custom-button-holder">
                <button class="custom-button small" @click="addContactPersonModal = true">Ansprechpartner hinzufügen</button>
            </div>
        </div>

        <br><br>
        <div class="custom-button-holder maximizer mcenter">
            <button class="custom-button" @click="saveSettings()">Speichern</button>
        </div>
    </div>
    <!-- MODALS -->
    <div>
        <Modal v-if="changePasswortdModalOpen" @close="changePasswortdModalOpen = false">
            <form class="iwq-form" @submit="processPasswordChange($event)">
                <h3>Passwort ändern</h3>
                <br>

                <label for="current-pw">Aktuelles Passwort*</label>
                <input type="password" name="current-pw" id="current-pw" v-model="password" required>

                <label for="new-pw">Neues Passwort*</label>
                <input type="password" name="new-pw" id="new-pw" v-model="newPW" required>

                <label for="new-pw-repeat">Neues Passwort wiederholen*</label>
                <input type="password" name="new-pw-repeat" id="new-pw-repeat" v-model="newPWRepeat" required>

                <p v-for="message in pwErrorMessages" class="settings-error-message">{{ message }}</p>

                <br>
                <p><b>*Pflichtfeld</b></p>
                <br><br>

                <div class="custom-button-holder">
                    <button class="custom-button">Speichern</button>
                </div>
            </form>
        </Modal>

        <Modal v-if="deleteAccountModal" @close="deleteAccountModal = false">
            <h3>Konto löschen / deaktivieren</h3><br>

            <form class="iwq-form" @submit="processDeleteAccount($event)">
                <select name="account-action" id="account-action" v-model="accountDecision" required>
                    <option value="" selected disabled>Account Aktion wählen*</option>
                    <option value="deactivate">Konto deaktivieren</option>
                    <option value="delete">Konto löschen</option>
                </select>

                <label for="account-action-verification" class="custom-checkbox-holder">
                    <input type="checkbox" id="account-action-verification" name="account-action-verification" required>
                    <label for="account-action-verification" class="custom-checkbox"></label>
                    <span>Ich bin mir sicher, dass ich mein Konto einschränken will*</span>
                </label>
              <input class="mb-2" type="password" name="password" placeholder="Bitte bestätigen Sie mit ihrem Passwort"
                     required>

                <p v-for="message in deleteErrorMessages" class="settings-error-message">{{ message }}</p>

                <br>

                <div class="custom-button-holder">
                    <button class="custom-button">Aktion durchführen</button>
                </div>
            </form>
        </Modal>

        <Modal v-if="deleteCompanyModal && userType === 'Unternehmen'" @close="deleteCompanyModal = false">
            <h3>Unternehmen löschen / deaktivieren</h3><br>

            <form class="iwq-form" @submit="processDeleteCompany($event)">
                <select name="account-action" id="account-action" v-model="companyDecision" required>
                    <option value="" selected disabled> Aktion wählen*</option>
                    <option value="deactivate">Unternehmen deaktivieren</option>
                    <option value="delete">Unternehmen löschen</option>
                </select>

                <label for="account-action-verification" class="custom-checkbox-holder">
                  <input type="checkbox" id="account-action-verification" name="account-action-verification" required>
                  <label for="account-action-verification" class="custom-checkbox"></label>
                  <span>Ich bin mir sicher, dass ich mein Unternehmen einschränken will*</span>
                </label>
              <input class="mb-2" type="password" name="password" placeholder="Bitte bestätigen Sie mit ihrem Passwort"
                     required>

                <p v-for="message in deleteCompanyErrorMessages" class="settings-error-message">{{ message }}</p>

                <br>

                <div class="custom-button-holder">
                    <button class="custom-button">Aktion durchführen</button>
                </div>
            </form>
        </Modal>

        <Modal v-if="blacklistModal && userType === 'Talente'" @close="blacklistModal = false; blacklistForm.reset()">
          <form class="iwq-form" ref="blacklistForm" @submit.prevent="addToBlacklist(selectedCompany)">
            <h3>Blacklist</h3><br>
            <select name="blacklist-item" id="blacklist" v-model="selectedCompany">
                    <option value="" selected disabled>Unternehmen aussuchen</option>
              <option v-for="company in blacklistOptions" :disabled="hasCompanyInBlacklist(company)"
                      :key="company.id" :value="company.id">{{ company.Unternehmen }}
              </option>
                </select>

                <div class="custom-button-holder">
                  <button type="submit" class="custom-button small">Zur Blacklist hinzufügen</button>
                </div>
            </form>
        </Modal>

        <Modal v-if="confirmPasswordModal" @close="confirmPasswordModal = false; confirmPWForm.reset()">
            <form class="iwq-form" ref="confirmPWForm" @submit.prevent="saveSettings()">
                <h3>Passwort bestätigen</h3><br>
                <input type="password" name="confirm_password" v-model="password" placeholder="Passwort eingeben">
                <div class="custom-button-holder">
                    <button class="custom-button small">Änderungen speichern</button>
                </div>

            </form>
        </Modal>

      <!--
        <Modal v-if="changeImageModal" @close="changeImageModal = false">
            <form class="iwq-form" ref="changeProfileImageForm" @submit.prevent="insertProfileImagePreview()">
                <h2>Neues Profilbild auswählen</h2>
                <div class="custom-dropzone-container" :class="{drag: activeDrag}">
                    <div class="custom-dropzone">
                        <img v-if="profileImageFile === null" src="~/assets/icons/upload-document-primary.svg" alt="Klicken oder draufziehen zum Hochladen">
                        <p v-if="profileImageFile === null" class="custom-dropzone-title">Drag and Drop oder <u>Datei aussuchen</u> (nur PDF)</p>

                        <div class="custom-dropzone-files center" v-if="profileImageFile">
                            <div class="custom-dropzone-file">
                                <img src="~/assets/icons/files/image.svg" alt="Profilbild">
                                <p>{{ profileImageFile.name }} ausgewählt</p>
                            </div>
                        </div>
                    </div>
                  <input
                    @dragenter="activeDrag = true"
                    @drop="activeDrag = false"
                        @dragleave="activeDrag = false"
                    @change="handleFileDrop($event)"
                        multiple
                        type="file"
                        id="profile-image"
                        name="profile-image"
                        accept="application/pdf"
                    />
                </div>
                <br>
                <p>Vergessen Sie nicht die Änderungen am Ende zu speichern, sonst wird das Bild nicht hochgeladen</p>
                <br>
                <button class="custom-button small">Bestätigen</button>
            </form>
        </Modal>
        -->
        <Modal v-if="addContactPersonModal" @close="addContactPersonModal = false">
            <h2>Ansprechpartner hinzufügen</h2>

            <form class="iwq-form" ref="cpForm" @submit.prevent="addContactPerson($event)">
                <div class="iwq-form-row">
                    <div>
                        <label for="contact-person-prename">Vorname*</label>
                      <input type="text" id="contact-person-prename" v-model="newAnsprechpartner.preName" required>
                    </div>
                    <div>
                        <label for="contact-person-lastname">Nachname*</label>
                      <input type="text" id="contact-person-lastname" v-model="newAnsprechpartner.lastName" required>
                    </div>
                </div>

              <label for="contact-person-email">E-Mail Adresse*</label>
              <input type="email" id="contact-person-email" v-model="newAnsprechpartner.email" required>

                <!-- <div class="custom-dropzone-container" :class="{drag: activeDrag}">
                    <div class="custom-dropzone">
                        <img v-if="CPImage === null" src="~/assets/icons/upload-document-primary.svg" alt="Klicken oder draufziehen zum Hochladen">
                        <p v-if="CPImage === null" class="custom-dropzone-title">Drag and Drop oder <u>Datei aussuchen</u></p>

                        <div class="custom-dropzone-files center" v-if="CPImage">
                            <div class="custom-dropzone-file">
                                <img src="~/assets/icons/files/image.svg" alt="Profilbild">
                                <p>{{ CPImage.name }} ausgewählt</p>
                            </div>
                        </div>
                    </div>
                    <input
                        @dragenter="activeDrag = true"
                        @drop="activeDrag = false"
                        @dragleave="activeDrag = false"
                        @change="handeCPFileDrop($event)"
                        type="file"
                        id="cp-profile-image"
                        name="cp-profile-image"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                    />
                </div> -->
                <br><br>
                <div class="custom-button-holder">
                    <button class="custom-button small">Ansprechpartner hinzufügen</button>
                </div>
            </form>
        </Modal>
    </div>

</template>


<script setup>

import {useAuth} from "~/store/auth";
import {getImageFromDirectus, getUserTypeById} from "~/utils/helper";
import {useNotificationStore} from "~/store/notifcations";

const auth = useAuth()
const userType = computed(() => getUserTypeById(auth.user.role))
const {$directus} = useNuxtApp()

const contactPersons = ref([
    {id: 1, image: '/imgs/placeholder.webp', name: 'Simone Strohm', mail: 'mailadresse@loremipsum.com'},
    {id: 2, image: '/imgs/placeholder.webp', name: 'Hans Martin', mail: 'mailadresse@loremipsum.com'},
    {id: 3, image: '/imgs/placeholder.webp', name: 'Sven Hemmerich', mail: 'mailadresse@loremipsum.com'},
    {id: 4, image: '/imgs/placeholder.webp', name: 'Ana De Armas', mail: 'mailadresse@loremipsum.com'},
    {id: 5, image: '/imgs/placeholder.webp', name: 'Mark Wahlberg', mail: 'mailadresse@loremipsum.com'},
    {id: 6, image: '/imgs/placeholder.webp', name: 'Homer Simpson', mail: 'mailadresse@loremipsum.com'},
])

const notificationStore = useNotificationStore()

// V-MODELS
const password = ref('')
const newPW = ref('')
const newPWRepeat = ref('')
const accountDecision = ref('')
const changeProfileImageForm = ref(null)
const companyDecision = ref('')
const confirmPWForm = ref(null)
const cpForm = ref(null)
// REFS
const newAnsprechpartner = ref({
  preName: '',
  lastName: '',
  email: ''
})
const addContactPersonModal = ref(false)
//const activeDrag = ref(false)
const selectedCompany = ref('')
const blacklistForm = ref()
const blacklistModal = ref(false)
//changeImageModal = ref(false)
const changePasswortdModalOpen = ref(false)
const confirmPasswordModal = ref(false)
const CPImage = ref(null)
const deleteAccountModal = ref(false)
const deleteCompanyModal = ref(false)
const deleteCompanyErrorMessages = ref([])
const deleteErrorMessages = ref([])
const pwErrorMessages = ref([])

const addContactPerson = async (event) => {
  event.preventDefault()
  try {
    // invite new contact person
     await $fetch('/api/invite-user', {
      method: 'POST',
      body: JSON.stringify({
        preName: newAnsprechpartner.value.preName,
        lastName: newAnsprechpartner.value.lastName,
        email: newAnsprechpartner.value.email,
        companyId: unternehmenData.value.id,
      })
    })
    // close modal
    addContactPersonModal.value = false
    // reset newAnsprechpartner
    newAnsprechpartner.value = {
      preName: '',
      lastName: '',
      email: ''
    }
    // show success message
    notificationStore.addNotification('Erfolgreich', 'success', 'Der neue Ansprechpartner wurde erfolgreich eingeladen', true)
  } catch (e) {
    console.error(e)
    notificationStore.addNotification('Fehler', 'error', e.message, true)
  }
}

const addToBlacklist = (companyId) => {
  event.preventDefault()
  const selectedItem = blacklistOptions.value.filter((item) => item.id === companyId)[0]
  talentData.value.Blacklist.push({
    Unternehmen_id: {
      id: selectedItem.id,
      Unternehmen: selectedItem.Unternehmen
    }
  })
  blacklistModal.value = false
}

const removeFromBlacklist = (id) => {
  talentData.value.Blacklist = talentData.value.Blacklist.filter(item => item.Unternehmen_id.id !== id)
}

const hasCompanyInBlacklist = (company) => {
  return talentData.value.Blacklist.find(c => c.id === company.id) !== undefined
}
const fileInputImageAnsprechpartner = ref(null)
const fileInputImageUnternehmen = ref(null)
const handleFileInput = (type) => {
 if (type === 'ansprechpartner') {
   fileInputImageAnsprechpartner.value.click();
 }
 if (type === 'unternehmen') {
   fileInputImageUnternehmen.value.click();
 }
}
const handleFileSelection = async (event, type) => {
  const file = event.target.files[0];

  let formData = new FormData();
  formData.append('title', 'Profile picture'); // Add the title
  formData.append('file', file); // Add the file

  try {
    const response = await $directus.files.createOne(formData);
    if (type === 'ansprechpartner') {
      // update ansprechpartner
      const test = await $directus.items('Ansprechpartner').updateOne(ansprechpartnerData.value.id, {
        Profilbild: response.id
      })
      console.log(test)
      // set new profile image
      ansprechpartnerData.value.Profilbild = response.id
    }
    if (type === 'unternehmen') {
      // update unternehmen
      await $directus.items('Unternehmen').updateOne(unternehmenData.value.id, {
        Logo: response.id
      })
      // set new logo
      unternehmenData.value.Logo = response.id
    }
  } catch (e) {
    console.error('Error uploading file:', e);
    notificationStore.addNotification('Fehler', 'error', e.message, true)
  }
}

/*
const handeCPFileDrop = (event) => {
        CPImage.value = event.target.files[0]
    }

    const handleFileDrop = (event) => {
        profileImageFile.value = event.target.files[0]
    }

    const insertProfileImagePreview = () => {
        changeImageModal.value = false

        const reader = new FileReader()

        reader.onload = () => {
            const base64Data = reader.result
            user.value.admin.image = base64Data;
        }

        reader.readAsDataURL(profileImageFile.value)
    }
*/

const checkIfPasswordIsValid = async (password) => {
  try {
    await $fetch('/api/check-password', {
      method: 'POST',
      body: JSON.stringify({
        email: auth.user.email,
        password: password
      })
    })
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

const processDeleteAccount = async (event) => {
  event.preventDefault()
  // check if password is valid
  const pw = event.target.elements.password.value
  const isValid = await checkIfPasswordIsValid(pw)
  if (!isValid) {
    notificationStore.addNotification('Fehler', 'error', 'Das eingegebene Passwort ist nicht korrekt', true)
    return
  }
  // check if decision is valid
  if (accountDecision.value === '') {
    notificationStore.addNotification('Fehler', 'error', 'Bitte wählen Sie eine Aktion aus', true)
    return
  }
  // check if checkbox is checked
  if (!event.target.elements['account-action-verification'].checked) {
    notificationStore.addNotification('Fehler', 'error', 'Bitte bestätigen Sie die Aktion', true)
    return
  }
  // get account id
  let accountId
  let collection
  if (userType.value === 'Talente') {
    accountId = talentData.value.id
    collection = 'Talente'
  } else if (userType.value === 'Unternehmen') {
    collection = 'Ansprechpartner'
    accountId = ansprechpartnerData.value.id
  }
  // handle account deletion
  if (accountDecision.value === 'delete') {
    // delete account
    try {
      // delete user and account
      await $directus.items(collection).deleteOne(accountId)
      await $directus.users.deleteOne(auth.user.id)
      notificationStore.addNotification('Erfolgreich', 'success', 'Ihr Konto wurde erfolgreich gelöscht', true)
      // logout user after 3 seconds
      delay(3000).then(() => {
        auth.logout()
      })
    } catch (e) {
      console.error(e)
      notificationStore.addNotification('Fehler', 'error', e.message, true)
    }
  }
  // handle account deactivation
  if (accountDecision.value === 'deactivate') {
    try {
    // deactivate user and account
    await $directus.items(collection).updateOne(accountId, {
      status: 'inactive'
    })
      await $directus.users.updateOne(auth.user.id, {
      status: 'suspended'
    })
      notificationStore.addNotification('Erfolgreich', 'success', 'Ihr Konto wurde erfolgreich deaktiviert', true)
      delay(2000).then(() => {
        auth.logout()
      })
    } catch (e) {
      console.error(e)
      notificationStore.addNotification('Fehler', 'error', e.message, true)
    }
  }
  // close modal
  deleteAccountModal.value = false
}
const processDeleteCompany = async (event) => {
  event.preventDefault()
  // check if password is valid
  const pw = event.target.elements.password.value
  const isValid = await checkIfPasswordIsValid(pw)
  if (!isValid) {
    notificationStore.addNotification('Fehler', 'error', 'Das eingegebene Passwort ist nicht korrekt', true)
    return
  }
  // check if decision is valid
  if (companyDecision.value === '') {
    notificationStore.addNotification('Fehler', 'error', 'Bitte wählen Sie eine Aktion aus', true)
    return
  }
  // check if checkbox is checked
  if (!event.target.elements['account-action-verification'].checked) {
    notificationStore.addNotification('Fehler', 'error', 'Bitte bestätigen Sie die Aktion', true)
    return
  }
  // handle company deletion
  if (companyDecision.value === 'delete') {
    try {
      // delete company
      await $directus.items('Unternehmen').deleteOne(unternehmenData.id)
      notificationStore.addNotification('Erfolgreich', 'success', 'Ihr Unternehmen wurde erfolgreich gelöscht', true)
      // logout user after 3 seconds
      delay(3000).then(() => {
        auth.logout()
      })
    } catch (e) {
      console.error(e)
      notificationStore.addNotification('Fehler', 'error', e.message, true)
    }
  }
  // handle company deactivation
  if (companyDecision.value === 'deactivate') {
    // deactivate company
    await $directus.items('Unternehmen').updateOne(unternehmenData.id, {
      status: 'inactive'
    })
  }
  // close modal
  deleteCompanyModal.value = false
}

const processPasswordChange = async (event) => {
  event.preventDefault()
  pwErrorMessages.value = []
  // check if passwords are equal
  if (newPW.value !== newPWRepeat.value) {
    notificationStore.addNotification('Fehler', 'error', 'Die Passwörter stimmen nicht überein', true)
    return
  }
  // password requirements logic
  const passwordValidation = validatePassword(newPW.value)
  if (passwordValidation !== true) {
    notificationStore.addNotification('Fehler', 'error', passwordValidation, true)
    return
  }
  // change password
  try {
    await $directus.users.updateOne(auth.user.id, {
      password: newPW.value
    })
    notificationStore.addNotification('Erfolgreich', 'success', 'Ihr Passwort wurde erfolgreich geändert', true)
    // logout user after 3 seconds
    delay(3000).then(() => {
      auth.logout()
    })
  } catch (e) {
    console.error(e)
    notificationStore.addNotification('Fehler', 'error', e.message, true)
  }
  // clear refs
  password.value = ''
  newPW.value = ''
  newPWRepeat.value = ''
  // close modal
  changePasswortdModalOpen.value = false
}

const removeContactPerson = (person) => {
  if (!confirm(`Sind Sie sicher, dass Sie ${person.Ansprechpartner_id.Vorname} ${person.Ansprechpartner_id.Nachname} als Ansprechpartner entfernen wollen?`)) return
  allAnsprechpartner.value = allAnsprechpartner.value.filter(item => item.Ansprechpartner_id.id !== person.Ansprechpartner_id.id)
  //unternehmenData.value.Ansprechpartner = unternehmenData.value.Ansprechpartner.filter(item => item.id !== person.id)
}


const saveSettings = async () => {
  if (userType.value === 'Talente') {
    await updateTalentSettings()
  } else if (userType.value === 'Unternehmen') {
    await updateUnternehmenSettings()
  }
}
const updateTalentSettings = async () => {
  // make a copy of the talent object
  const talent = {...talentData.value}
  // adjust the blacklist
  talent.Blacklist = talent.Blacklist.map(item => {
    return {
      Unternehmen_id: {
        id: item.Unternehmen_id.id,
      }
    }
  })
  try {
    // update talent
    await $directus.items('Talente').updateOne(talentData.value.id, talent);
    // update email in user object
    if (talent.EMail) {
      try {
        await $directus.users.updateOne(auth.user.id, {
          email: talent.EMail
        })
        notificationStore.addNotification('Erfolgreich', 'success', 'Ihre Einstellungen wurden erfolgreich gespeichert', true)
      } catch (e) {
        console.error(e)
        notificationStore.addNotification('Fehler', 'error', e.message, true)
      }
    }
  } catch (e) {
    console.error(e)
    notificationStore.addNotification('Fehler', 'error', e.message, true)
  }
}
const updateUnternehmenSettings = async () => {
  // make a copy of the unternehmen object and the ansprechpartner object
  const unternehmen = {...unternehmenData.value}
  // adjust the ansprechpartner
  unternehmen.Ansprechpartner = allAnsprechpartner.value.map(item => {
    return {
      Ansprechpartner_id: {
        id: item.Ansprechpartner_id.id,
      }
    }
  })
  let ansprechpartner = {...ansprechpartnerData.value}
  // remove unused fields
  ansprechpartner = removeUnusedFields(ansprechpartner)
  try {
    // update unternehmen
    await $directus.items('Unternehmen').updateOne(unternehmenData.value.id, unternehmen);
    // update ansprechpartner
    await $directus.items('Ansprechpartner').updateOne(ansprechpartnerData.value.id, ansprechpartner);
    // update email in user object
    if (ansprechpartner.EMail) {
      try {
        await $directus.users.updateOne(auth.user.id, {
          email: ansprechpartner.EMail
        })
        notificationStore.addNotification('Erfolgreich', 'success', 'Ihre Einstellungen wurden erfolgreich gespeichert', true)
      } catch (e) {
        console.error(e)
        notificationStore.addNotification('Fehler', 'error', e.message, true)
      }
    }
  } catch (e) {
    console.error(e)
    notificationStore.addNotification('Fehler', 'error', e.message, true)
  }
}

// helper function to fetch data from directus
async function fetchDataFromDirectus(type, fields = ['*.*'], returnFirstItem = true) {
  try {
    const response = await $directus.items(type).readByQuery({fields});
    return returnFirstItem ? response.data[0] : response.data;
  } catch (e) {
    console.error(e);
    notificationStore.addNotification('Fehler', 'error', e.message, true);
    return null;
  }
}

// variables for fetching data from directus
let talentData, unternehmenData, ansprechpartnerData, blacklistOptions;
let talentPending, unternehmenPending, ansprechpartnerPending, pendingBlOptions;
let talentError, unternehmenError, ansprechpartnerError, errorBlOptions;
// handle different user types
switch (userType.value) {
  case 'Talente':
    ({
      data: talentData,
      pending: talentPending,
      error: talentError
    } = await useAsyncData('talente', () => fetchDataFromDirectus('Talente', [
      'id',
      'Vorname',
      'Nachname',
      'EMail',
      'Anonymisierung',
      'Blacklist.Unternehmen_id.Unternehmen',
      'Blacklist.Unternehmen_id.id'
    ])));

    ({
      data: blacklistOptions,
      pending: pendingBlOptions,
      error: errorBlOptions
    } = await useAsyncData('blacklistOptions', () => fetchDataFromDirectus('Unternehmen', ['id', 'Unternehmen'], false)));
    break;

  case 'Unternehmen':
    ({
      data: unternehmenData,
      pending: unternehmenPending,
      error: unternehmenError
    } = await useAsyncData('unternehemen', () => fetchDataFromDirectus('Unternehmen', [
      'id',
      'Strasse',
      'PLZ',
      'Logo',
      'Ort',
      'Profilbild',
      'Unternehmen',
      'Ansprechpartner.Ansprechpartner_id.*',
    ])));

    ({
      data: ansprechpartnerData,
      pending: ansprechpartnerPending,
      error: ansprechpartnerError
    } = await useAsyncData('ansprechpartner', () => fetchDataFromDirectus('Ansprechpartner', [
      'id',
      'Vorname',
      'Nachname',
      'EMail',
      'Profilbild'
    ])));
    break;

  default:
    notificationStore.addNotification('Fehler', 'error', 'Unbekannter Benutzertyp', true);
    break;
}

const allAnsprechpartner = ref([])
const getAllAnsprechpartner = async () => {
  try {
    const response = await $fetch('/api/get-all-ansprechpartner-from-company', {
      method: 'POST',
      body: JSON.stringify({
        companyId: unternehmenData.value.id,
      })
    })
    allAnsprechpartner.value = response.ansprechpartner
  } catch (e) {
    console.error(e)
  }
}

if (userType.value === 'Unternehmen') await getAllAnsprechpartner()

// TODO: REMOVE PATCH FOR EXISTING USERS AFTER A FEW WEEKS

if (userType.value === 'Unternehmen') {
  if (ansprechpartnerData.value.EMail !== auth.user.email) {
    console.log('email patch user')
    try {
      // update ansprechpartner email
      await $directus.items('Ansprechpartner').updateOne(ansprechpartnerData.value.id, {
        Email: auth.user.email
      })
    } catch (e) {
      console.error(e)
    } finally {
      if (process.client) window.location.reload()
    }
  }
}

if (userType.value === 'Talente') {
  if (talentData.value.EMail !== auth.user.email) {
    console.log('email patch user')
    try {
      // update talent email
      await $directus.items('Talente').updateOne(talentData.value.id, {
        EMail: auth.user.email
      })
    } catch (e) {
      console.error(e)
    } finally {
      if (process.client) window.location.reload()
    }
  }
}

</script>


<style lang="scss" scoped>
    .settings {

        &-blacklist {

            &-item {
                @include flexMe(space-between, center);
                @include trans;
                padding: 10px;
                border-bottom: 1px dashed rgba($dark, .1);
                font-weight: 600;

                &:hover {
                    background-color: rgba($dark, .05);
                }

                &:last-of-type {
                    border-bottom: none;
                }

                &-action {
                    @include box(20px);
                    @include colorize($error);
                    @include trans;
                    cursor: pointer;
                    border-radius: 20px;
                    text-align: center;
                    color: $light;
                    font-weight: bold;
                    font-size: 22px;
                    line-height: 15px;

                    &:hover {
                        transform: scale(1.1);
                    }
                }
            }
        }

        &-contact {

            &-person {
                @include flexMe(space-between, center);
                padding: 10px 0;
                margin-bottom: 10px;
                border-bottom: 1px solid rgba($dark, .05);

                &:last-of-type {
                    border-bottom: none;
                }

                &s {

                }

                &-action {
                    @include box(50px);
                    @include trans;
                    @include flexMe(center);
                    border-radius: 50px;
                    padding: 10px;
                    cursor: pointer;

                    &:hover {
                        background-color: rgba($dark, .05);
                    }

                    img {
                        height: 20px;
                    }
                }

                &-image {
                    @include box(50px);
                    @include bg(false, cover);
                    border-radius: 50px;
                }

                &-infos {
                    @include flexMe(flex-start, center);
                    gap: 20px;
                }

                &-name {
                    font-weight: bold;
                    font-size: 18px;
                    color: darken($primary, 20%);
                }
            }
        }

        &-error {

            &-message {
                color: $error;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 10px;
            }
        }

        &-section {
            padding: $paddingSmall;
            border-radius: 10px;
            margin: $paddingMedium auto 0;
            background-color: darken($light, 5%);
            position: relative;
            max-width: 960px;

            &:hover &-button {
                opacity: 1;
            }

            &-button {
                @include box(30px);
                @include pos(15px, 15px, tr);
                @include flexMe;
                @include trans;
                border-radius: 30px;
                background-color: rgba($dark, .05);
                font-size: 26px;
                color: $primary;
                text-align: center;
                line-height: 30px;
                font-weight: bold;
                opacity: 0;
                cursor: pointer;

                &:hover {
                    background-color: rgba($dark, .1);
                    transform: scale(1.1);
                }
            }

            &-top {
                @include flexMe(flex-start);
                flex-wrap: wrap;
                gap: $paddingSmall;

                &-infos {
                    flex: 1;
                }

              &-image {
                    @include box(120px);
                    @include bg(false, cover);
                    @include trans;
                    border-radius: 120px;
                    position: relative;
                    cursor: pointer;

                    &:hover {
                        @include shadow;
                    }

                    &:hover &-bubble {
                        scale: 1.1;
                    }

                    &-bubble {
                        @include box(50px);
                        @include flexMe(center);
                        @include trans;
                        @include pos(-5px, -5px, br);
                        background-color: $primary;
                        border-radius: 50px;

                      img {
                            height: 25px;
                        }
                    }
                }
            }
        }

        &-split {
            display: flex;
            margin-top: $paddingSmall;

            & > div {
                flex: 1;
                padding: 10px;

                &:first-of-type {
                    border-right: 1px solid $dark;
                    padding-left: 0;
                }

                &:nth-of-type(2) {
                    padding-right: 0;
                }
            }
        }
    }

    .linkbutton {
        display: block;
        margin: 0 0 10px;
        font-size: 14px;
        line-height: 1em;
    }


    @media screen and (max-width: 1024px) {

      .settings {

            &-section {

                &:has(.settings-section-top) {
                    margin-top: $paddingMedium;
                }

                &-button {
                    opacity: 1;
                    transform: translateY(-15px) !important;
                    right: 5px;
                }

                &-top {
                    flex-direction: column-reverse;
                }
            }
        }


    }


    @media screen and (max-width: 768px) {
        .settings {

            &-section {
                padding: 0;
                margin: 0;
                background: none;
                padding-bottom: $paddingSmall;
                margin-bottom: $paddingSmall;
                border-bottom: 1px dashed rgba($dark, .3);
                border-radius: 0;

                &:last-of-type {
                    border-bottom: none;
                }
            }

            &-split {
                flex-direction: column;
                justify-content: flex-start;
                gap: 30px;

                & > div {
                    padding: 0;

                    &:first-of-type {
                        border: none;
                    }
                }
            }
        }
    }

    @media screen and (max-width: 500px) {
        .settings {

            &-contact {

              &-person {

                    &-action,
                    &-infos {
                        flex: 1;
                    }

                    &-infos {
                        gap: 15px;
                        flex-wrap: nowrap;

                        &-image {
                            @include box(30px);
                        }
                    }
                }
            }
        }
    }


</style>