<template>
    <div class="iwq-container">
        <div class="iwq-intro">
            <h1>Sie haben eine Frage?</h1>
            <p class="maximiuzer-medium mcenter">Schreib uns!</p>
            <p class="maximizer-medium mcenter">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Praesentium amet aliquam nisi voluptatem quasi corporis ab enim dicta molestias suscipit.</p>
        </div>

        <div class="contact-container iwq-section medium">
            <form class="iwq-form" ref="contactForm" @submit.prevent="sendRequest($event)">
                <h2 class="h3">Kontaktformular</h2>

                <div class="iwq-form-row-wide">
                    <label for="type_talent" class="custom-radio-holder">
                        <input type="radio" id="type_talent" name="type" value="talent" v-model="type">
                        <label for="type_talent" class="custom-radio"></label>
                        <span>Talent</span>
                    </label>

                    <label for="type_company" class="custom-radio-holder">
                        <input type="radio" id="type_company" name="type" value="company" v-model="type">
                        <label for="type_company" class="custom-radio"></label>
                        <span>Unternehmen</span>
                    </label>
                    
                    <label for="type_else" class="custom-radio-holder">
                        <input type="radio" id="type_else" name="type" value="else" v-model="type">
                        <label for="type_else" class="custom-radio"></label>
                        <span>Sonstiges</span>
                    </label>
                </div>

                <select name="gender" id="gender" v-model="gender" required>
                    <option value="" selected disabled>Geschlecht*</option>
                    <option value="male">Männlich</option>
                    <option value="female">Weiblich</option>
                    <option value="diverse">Divers</option>
                </select>

                <input type="text" name="prename" id="prename" v-model="prename" required placeholder="Vorname*">

                <input type="text" name="lastname" id="lastname" v-model="lastname" required placeholder="Nachname*">
                
                <input type="text" name="subject" id="subject" v-model="subject" required placeholder="Nachname*">

                <select name="contact-type" id="contact_type" v-model="contactType" required>
                    <option value="" disabled>Wie können wir Dich erreichen*</option>
                    <option value="tel">Telefon</option>
                    <option value="female">E-Mail Adresse</option>
                    <option value="diverse">Divers</option>
                </select>

                <label for="dsgvo_check" class="custom-checkbox-holder">
                    <input type="checkbox" name="dsgvo_check" id="dsgvo_check" required>
                    <label for="dsgvo_check" class="custom-checkbox"></label>
                    <span>Hiermit bestätige ich, dass meine Daten gemäß der DSGVO und den <a href="/datenschutz" target="_blank">Datenschutzerklärung</a> von KarriereKind verarbeitet und gespeichert werden dürfen.*</span>
                </label>
                <br>

                <p><b>*Pflichtfeld</b></p>                
                <br><br>

                <div class="custom-button-holder">
                    <button class="custom-button">Formular absenden</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
    const contactType = ref('')
    const gender = ref('')
    const type = ref('talent')
    const prename = ref('')
    const lastname = ref('')
    const subject = ref('')
    const contactForm = ref()

    const sendRequest = (event) => {
        if( !event.target.reportValidity() ) return
        
        let formData = new FormData()
        
        formData.append('contact-type', contactType.value)
        formData.append('gender', gender.value)
        formData.append('type', type.value)
        formData.append('prename', prename.value)
        formData.append('lastname', lastname.value)
        formData.append('subject', subject.value)
        
        // TODO: submit form to api / script       
        // const { data } = useFetch('url/for-form/to-submit-to')

    }
</script>

<style lang="scss" scoped>

    .contact {

        &-container {
            margin-top: $paddingMedium;

            form {
                max-width: 640px;
                margin: $paddingSmall auto;
            }
        }
    }

    @media screen and (max-width: 500px) {
        
        .contact {
            
            &-container {
                width: calc(100% + (2 * #{$paddingSmall}));
                margin-left: -30px;
                margin-right: -30px;
            }
        }
        
    }

</style>