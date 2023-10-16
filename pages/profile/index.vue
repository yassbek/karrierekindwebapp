<template>
  <div class="iwq-container">
        <section class="iwq-intro" v-if="userType === 'Talente'">
            <h1>Mein Profil</h1>
            <p class="maximizer-medium mcenter">Auf dieser Seite sehen Sie Ihr Profil, wie es Unternehmen angezeigt wird, sobald KarriereKind ein Match erstellt hat.</p>
        </section>

        <section class="iwq-intro" v-if="userType === 'Unternehmen'">
            <h1>Unternehmensprofil</h1>
            <p class="maximizer-medium mcenter">Auf dieser Seite sehen Sie Ihr Profil, wie es Unternehmen angezeigt wird, sobald KarriereKind ein Match erstellt hat.</p>
        </section>

        <section class="profile-container">
            <div class="profile-section main">
              <div class="profile-section-edit" @click="editModalOpen = true"><img
                        src="~/assets/icons/edit-icon.svg" alt="Dokumente bearbeiten"></div>

              <div class="profile-picture"
                   :style="[`backgroundImage:url(${getImageFromDirectus(userType === 'Talente' ? talentData?.Profilbild : unternehmenData?.Logo)})`]">
                    <div class="profile-picture-edit-overlay" @click="handleFileInput">
                        <img src="~/assets/icons/camera-light.svg" alt="Neues Foto hochladen">
                        <p>Bild ändern</p>
                    </div>
                    <input type="file" name="file" accept="image/png, image/gif, image/jpeg" ref="fileInputImage" @change="handleFileSelection" style="display: none;">
                </div>

                <div v-if="userType === 'Talente'">
                  <h2>{{ talentData?.Vorname }} {{ talentData?.Nachname }}</h2>
                  <p class="profile-info-region">Region {{ talentData.Ort }}, {{ talentData.Wie_weit_soll_der_Arbeitsort_maximal_entfernt_sein }}</p>
                </div>

                <div v-if="userType === 'Unternehmen'">
                  <h2>{{ unternehmenData.Unternehmen }}</h2>
                  <p class="profile-info-region">{{ unternehmenData.Standort }}</p>
                </div>
                

                <br>
              <div class="profile-info-bio" v-if="userType === 'Talente' && talentData.Biografie">
                    <p><b>Das bin ich:</b></p>
                  <p>{{ talentData.Biografie }}</p>
                </div>
              <div class="profile-info-bio" v-if="userType === 'Unternehmen' && unternehmenData.Biografie">
                    <p><b>Das sind wir:</b></p>
                  <p>{{ unternehmenData.Biografie }}</p>
                </div>
            </div>

          <div class="profile-section"
               v-if="userType === 'Talente' && talentData?.Skills?.length > 0 ||  userType === 'Unternehmen' && unternehmenData?.Skills?.length > 0">
                <h2 class="profile-section-headline">
                    <span>Skills</span>
                </h2>

              <ul class="iwq-checklist split-3"
                  v-if="userType === 'Talente'">
                <li v-for="skillEl in talentData.Skills">{{ skillEl.Talent_Profil_Skills_id.skill }}</li>
              </ul>

              <ul class="iwq-checklist split-3"
                  v-if="userType === 'Unternehmen'">
                <li v-for="skillEl in unternehmenData.Skills">{{ skillEl.Company_Profile_Skills_id.skill }}</li>
                </ul>
            </div>

          <div class="profile-section"
               v-if="talentData?.Weitere_Dateien?.length > 0 || userType === 'Talente' && talentData.Lebenslauf">
                <div class="profile-section-edit" @click="editModalOpen = true"><img src="~/assets/icons/edit-icon.svg" alt="Dokumente bearbeiten"></div>
                <h2 class="profile-section-headline">Angehangene Dokumente</h2>

                <div class="profile-documents">

                  <NuxtLink v-if="talentData.Lebenslauf" :to="`${talentData.Lebenslauf}`" target="_blank">
                    <img src="/icons/files/pdf.svg" alt="Lebenslauf">
                    <span>Lebenslauf</span>
                  </NuxtLink>

                  <template v-if="talentData.Weitere_Dateien">
                    <NuxtLink v-for="(doc, i) in talentData.Weitere_Dateien" :key="i"
                              :to="`${config.public.directusUrl}/assets/${doc.directus_files_id.id}`" target="_blank">
                      <img src="/icons/files/pdf.svg" alt="Datei">
                      <span>{{ doc.directus_files_id.filename_download }}</span>
                    </NuxtLink>
                  </template>
                </div>
            </div>
        </section>
    </div>

  <Modal v-if="editModalOpen" @close="editModalOpen = false">
        <p class="modal-title">Profil bearbeiten</p>

        <form class="iwq-form" ref="form">
            <div class="iwq-form-row">
              <template v-if="userType === 'Talente'">
                <div>
                  <label for="user[name]">Vorname*</label>
                  <input type="text" id="user[name]" name="user[name]" required v-model="talentData.Vorname">
                </div>
                <div>
                  <label for="user[lastname]">Nachname*</label>
                  <input type="text" id="user[lastname]" name="user[lastname]" required v-model="talentData.Nachname">
                </div>
              </template>
              <div v-if="userType === 'Unternehmen'">
                <label for="user[unternehmen]">Unternehmen*</label>
                <input type="text" id="user[unternehmen]" name="user[unternehmen]" required
                           v-model="unternehmenData.Unternehmen">
                </div>
            </div>


            <div class="iwq-form-row">
                <div>
                  <label for="user[zip]">PLZ*</label>

                  <template v-if="userType === 'Talente'">
                    <input type="number" id="user[zip]" name="user[zip]" pattern="^\d{5}$" required
                           v-model="talentData.PLZ">
                  </template>
                  <template v-if="userType === 'Unternehmen'">
                    <input type="number" id="user[zip]" name="user[zip]" pattern="^\d{5}$" required
                           v-model="unternehmenData.PLZ">
                  </template>
                </div>

                <div>
                  <label for="user[city]">Ort*</label>
                  <template v-if="userType === 'Talente'">
                    <input type="text" id="user[city]" name="user[city]" required v-model="talentData.Ort">
                  </template>
                  <template v-if="userType === 'Unternehmen'">
                    <input type="text" id="user[city]" name="user[city]" required v-model="unternehmenData.Ort">
                  </template>
                </div>

                <div v-if="userType === 'Talente'">
                  <label for="user[radius]">maxmimale Entfernung (in km)*</label>
                  <select name="user[radius]" id="user[radius]"
                          v-model="talentData.Wie_weit_soll_der_Arbeitsort_maximal_entfernt_sein" required>
                    <option value="maximal 20 Kilometer">maximal 20 Kilometer</option>
                    <option value="maximal 50 Kilometer">maximal 50 Kilometer</option>
                    <option value="100 Kilometer und mehr">100 Kilometer und mehr</option>
                    <option value="Nach Absprache">Nach Absprache</option>
                  </select>
                </div>
            </div>

          <template v-if="userType === 'Unternehmen'">
            <br>
            <br>
            <p><b>Wähle <u>drei</u> Begriffe aus, die auf dein Unternehmen zutreffen</b></p>
            <div class="profile-form-descriptions">
              <div
                v-for="skill in companySkills" :key="skill.id"
                class="profile-form-description"
                :class="{marked: checkIfSkillIsMarked(skill)}"
                @click="toggleCompanySkill(skill)">
                {{ skill.skill }}
              </div>
            </div>
          </template>

          <template v-if="userType === 'Talente'">
            <br>
            <br>
            <p><b>Wähle <u>drei</u> Begriffe aus, die Dich beschreiben</b></p>
            <div class="profile-form-descriptions">
                <div
                  v-for="skill in talentSkills" :key="skill.id"
                  class="profile-form-description"
                  :class="{marked: checkIfSkillIsMarked(skill)}"
                  @click="toggleTalentSkill(skill)">
                  {{ skill.skill }}
                </div>
            </div>

            <br>
            <br>
            <p><b>Dokumente anhängen</b></p>

            <div class="custom-dropzone-container" :class="{drag: activeDrag}">
                <div class="custom-dropzone">
                    <img v-if="filesToUpload === null" src="~/assets/icons/upload-document-primary.svg" alt="Klicken oder draufziehen zum Hochladen">
                    <p v-if="filesToUpload === null" class="custom-dropzone-title"><span class="mobile-hide">Drag and Drop oder <u>Datei aussuchen</u></span><span class="mobile-show">Datei zum hochladen auswählen</span></p>

                    <div class="custom-dropzone-files" v-if="filesToUpload">
                        <div class="custom-dropzone-file" v-for="(file, index) in filesToUpload" :key="index">
                            <img src="~/assets/icons/files/document.svg" alt="Datei">
                            <p>{{ file.name }}</p>
                        </div>
                    </div>
                </div>
                <input 
                    @dragenter="activeDrag = true" 
                    @drop="activeDrag = false" 
                    @dragleave="activeDrag = false"
                    @change="handleFileDrop($event)" 
                    type="file"
                    id="documents-n-files"
                    name="documents"
                    multiple
                    >
            </div>
          </template>

            <ModalButtons>
              <button type="button" class="custom-button small" @click="saveSettings()">Änderungen
                    speichern
                </button>
                <button class="custom-button small inverted" @click="editModalOpen = false">abbrechen</button>
            </ModalButtons>
        </form>

        <hr class="divider">
        
        <div class="modal-teaser">
            <div>
                <h4>Unsicher?</h4>
                <p>Dann schau Dir unsere aktuellen Coaching Angebote an</p>
            </div>

            <div class="custom-button-holder">
                <NuxtLink class="custom-button small" to="/coaching">Zum Coaching</NuxtLink>
            </div>
        </div>
    </Modal>
</template>

<script setup>
import {useAuth} from "~/store/auth";
import {getImageFromDirectus, getUserTypeById, removeUnusedFields} from "~/utils/helper";
import {useNotificationStore} from "~/store/notifcations";

const auth = useAuth()
const userType = computed(() => getUserTypeById(auth.user.role))
const config = useRuntimeConfig()

const route = useRoute()
const editModalOpen = ref(false)
const activeDrag = ref(false)
const filesToUpload = ref(null)
const form = ref()

const {$directus} = useNuxtApp()

useHead({
    bodyAttrs: {
        class: computed(() => {
            return editModalOpen.value ? 'noscroll' : '';
        })
    }
})

function makeNewChat(partnerID) {
    // @TODO: Make new chat with partner by id
}


const toggleTalentSkill = (skill) => {
  if (checkIfSkillIsMarked(skill)) {
    talentData.value.Skills = talentData.value.Skills.filter(s => s.Talent_Profil_Skills_id.id !== skill.id);
  } else {
    talentData.value.Skills.push({
      Talent_Profil_Skills_id: {
        id: skill.id,
        skill: skill.skill
      }
    });
  }
}
const toggleCompanySkill = (skill) => {
  if (checkIfSkillIsMarked(skill)) {
    unternehmenData.value.Skills = unternehmenData.value.Skills.filter(s => s.Company_Profile_Skills_id.id !== skill.id);
  } else {
    unternehmenData.value.Skills.push({
      Company_Profile_Skills_id: {
        id: skill.id,
        skill: skill.skill
      }
    });
  }
}

const checkIfSkillIsMarked = (skill) => {
  if (userType.value === 'Talente') {
    return talentData.value.Skills.some(s => s.Talent_Profil_Skills_id.id === skill.id);
  }
  if (userType.value === 'Unternehmen') {
    return unternehmenData.value.Skills.some(s => s.Company_Profile_Skills_id.id === skill.id);
  }
}

function handleFileDrop(event) {
  filesToUpload.value = event.target.files
}

const saveSettings = async () => {
  if (userType.value === 'Talente') {
    await updateTalentSettings()
  } else if (userType.value === 'Unternehmen') {
    await updateUnternehmenSettings()
  }
}

const uploadFilesToDirectus = async (files) => {
  console.log('Files to upload:', files); // Debug log
  const formData = new FormData();

  for (let file of files) {
    formData.append('files', file);
  }

  // Debug FormData
  for (const pair of formData.entries()) {
    console.log(pair[0] + ', ' + pair[1]);
  }

  try {
    const response = await $directus.files.createOne(formData);
    return response;
  } catch (e) {
    console.error('Error uploading file:', e);
    throw e;
  }
}

const updateTalentSettings = async () => {
  // create a copy of the talentData object
  const talent = {...talentData.value};
  // adjust skill structure
  talent.Skills = talent.Skills.map(skill => {
    return {
      Talent_Profil_Skills_id: {
        id: skill.Talent_Profil_Skills_id.id
      }
    }
  });
  // clear files array in temporary talent object
  talent.Weitere_Dateien = [];
  // check for files to upload
  try {
    if (filesToUpload.value) {
      console.log('Files to upload:', filesToUpload.value)
      // Upload each file
      for (let file of Object.values(filesToUpload.value)) {
        const uploadedFile = await uploadFilesToDirectus([file]);
        // Add the uploaded file to the array
        if (uploadedFile && uploadedFile.id) {
          talent.Weitere_Dateien.push({
            Talente_id: talent.id,
            directus_files_id: {
              id: uploadedFile.id
            }
          });
        }
      }
    }
    // remove unused fields
    const cleanTalentData  = removeUnusedFields(talent);
    // update talent
    await $directus.items('Talente').updateOne(talentData.value.id, cleanTalentData);
    notificationStore.addNotification('Erfolgreich', 'success', 'Ihre Änderungen wurden erfolgreich gespeichert.', true);
  } catch (e) {
    console.error('Error in updateTalentSettings:', e);
    notificationStore.addNotification('Fehler', 'error', e.message, true);
  } finally {
    editModalOpen.value = false;
    // reload page
    location.reload();
  }
}

const updateUnternehmenSettings = async () => {
  // create a copy of the unternehmenData object
  const unternehmen = {...unternehmenData.value};
  // adjust skill structure
  unternehmen.Skills = unternehmen.Skills.map(skill => {
    return {
      Company_Profile_Skills_id: {
        id: skill.Company_Profile_Skills_id.id
      }
    }
  });
  // remove unused fields
  const cleanUnternehmenData  = removeUnusedFields(unternehmen);
  try {
    await $directus.items('Unternehmen').updateOne(unternehmenData.value.id, cleanUnternehmenData);
    notificationStore.addNotification('Erfolgreich', 'success', 'Ihre Änderungen wurden erfolgreich gespeichert.', true);
  } catch (e) {
    console.error('Error in updateUnternehmenSettings:', e);
    notificationStore.addNotification('Fehler', 'error', e.message, true);
  } finally {
    editModalOpen.value = false;
  }
}

const fileInputImage = ref(null)

const handleFileInput = () => {
    fileInputImage.value.click();
}

const handleFileSelection = async (event) => {
  const file = event.target.files[0];

    let formData = new FormData();
    formData.append('title', 'Profile picture'); // Add the title
    formData.append('file', file); // Add the file

    try {
      const response = await $directus.files.createOne(formData);
      // link the file to the user
      if (userType.value === 'Talente') {
        await $directus.items('Talente').updateOne(talentData.value.id, {
          Profilbild: response.id
        });
        // add the file to the talentData object
        talentData.value.Profilbild = response.id;
        notificationStore.addNotification('Erfolgreich', 'success', 'Ihr Profilbild wurde erfolgreich geändert.', true);
      }
      if (userType.value === 'Unternehmen') {
        await $directus.items('Unternehmen').updateOne(unternehmenData.value.id, {
          Logo: response.id
        });
        // add the file to the unternehmenData object
        unternehmenData.value.Logo = response.id;
        notificationStore.addNotification('Erfolgreich', 'success', 'Ihr Logo wurde erfolgreich geändert.', true);
      }
    } catch (error) {
        console.error('An error occurred:', error);
      notificationStore.addNotification('Fehler', 'error', error.message, true);
    }
}
const notificationStore = useNotificationStore()

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
let talentData, unternehmenData, blacklistOptions, talentSkills, companySkills;
let talentPending, unternehmenPending, pendingBlOptions, pendingTalentSkills,
  pendingCompanySkills;
let talentError, unternehmenError, errorBlOptions, errorTalentSkills, errorCompanySkills;
// handle different user types
switch (userType.value) {
  case 'Talente':
    ({
      data: talentData,
      pending: talentPending,
      error: talentError
    } = await useAsyncData('talente', () => fetchDataFromDirectus('Talente', [
      'id',
      'Profilbild',
      'Vorname',
      'Nachname',
      'Ort',
      'PLZ',
      'Biografie',
      'Wie_weit_soll_der_Arbeitsort_maximal_entfernt_sein',
      'Weitere_Dateien.*',
      'Lebenslauf.*',
      'Skills.Talent_Profil_Skills_id.*',
      'Weitere_Dateien.directus_files_id.*'
    ])));

    ({
      data: talentSkills,
      pending: pendingTalentSkills,
      error: errorTalentSkills
    } = await useAsyncData('talenteSkills', () => fetchDataFromDirectus('Talent_Profil_Skills', ['id', 'skill'], false)));

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
    } = await useAsyncData('unternehmen', () => fetchDataFromDirectus('Unternehmen', [
      'id',
      'Unternehmen',
      'Standort',
      'Ort',
      'Logo',
      'PLZ',
      'Biografie',
      'Skills.Company_Profile_Skills_id.*',
    ])));

    ({
      data: companySkills,
      pending: pendingCompanySkills,
      error: errorCompanySkills
    } = await useAsyncData('companySkills', () => fetchDataFromDirectus('Company_Profile_Skills', ['id', 'skill'], false)));
    break;

  default:
    notificationStore.addNotification('Fehler', 'error', 'Unbekannter Benutzertyp', true);
    break;
}



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