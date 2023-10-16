<template>
    <div class="iwq-container register-wrapper center">
    
        <form action="" class="iwq-form register-form" id="register_form" name="registerForm" @submit="submitRegisterForm($event)">
            <div class="register-form-layer" v-if="layer === 1">
                <h1>Registrierung</h1>
                <p class="maximizer-medium mcenter">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda eos iure ad tenetur molestiae eligendi dolorum sapiente. Sit, aut aliquid!</p>

                <div class="register-form-bigbutton-container">
                    <input type="radio" class="custom-radio" name="userType" id="candidate_choice" value="candidate" @change="changeChoice($event)">
                    <label for="candidate_choice" class="register-form-bigbutton">Jobsuchende</label>

                    <input type="radio" class="custom-radio" name="userType" id="company_choice" value="company" @change="changeChoice($event)">
                    <label for="company_choice" class="register-form-bigbutton">Unternehmen</label>
                </div>
            </div>

            <div class="register-form-layer" v-if="layer === 2">
                <h2 v-if="userTypeChoice === 'candidate'">Registerierung für Jobsuchende</h2>
                <h2 v-if="userTypeChoice === 'company'">Registerierung für Unternehmen</h2>

                <p class="maximizer-medium mcenter">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>

                <p class="register-login-notice">Account vorhanden? <NuxtLink to="/login"><u>Hier anmelden.</u></NuxtLink></p>

                <div class="register-form-sub">
                    <input type="email" name="email" placeholder="E-Mail Adresse" required>
                    <input type="password" name="password" placeholder="Passwort" required>
                    <input type="password" name="password-repeat" placeholder="Passwort wiederholen" required>

                    <label for="dsgvo_check" class="custom-checkbox-container">
                        <input type="checkbox" name="dsgvo_check" id="dsgvo_check" required>
                        <label for="dsgvo_check" class="custom-checkbox"></label>
                        <span>Ich akzeptiere die <NuxtLink to="/agb" target="_blank">AGB</NuxtLink> / <NuxtLink to="/datenschutz" target="_blank">Datenschutzerklärung</NuxtLink></span>
                    </label>

                    <button class="custom-button" type="submit">Registrieren</button>
                </div>
            </div>

            <div class="register-form-layer boxed-section" v-if="layer === 3">
                <p v-if="error" class="maximizer-medium mcenter">{{ error }}</p>
                <h2>Registrierung erfolgreich</h2>
                <p class="maximizer-mcenter" style="text-align: center;">Bitte die Email Adresse bestätigen um die Registrierung abzuschließen</p>

                <br>
                <div class="custom-button-holder align_center">
                    <NuxtLink to="login" class="custom-button small">Zum Login</NuxtLink>
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import {useAuth} from "~/store/auth";
import {useNotificationStore} from "~/store/notifcations";

const layer = ref(1)
const userTypeChoice = ref(null)

const changeChoice = (event) => {
  if (event.target.checked) {
    userTypeChoice.value = event.target.value
  }
  layer.value++
}

const auth = useAuth()
const error = ref(null);
const notificationStore = useNotificationStore()

const submitRegisterForm = async (event) => {
  event.preventDefault()
  let form = event.target
  if (!form.reportValidity()) return

  try {
    const response = await $fetch('api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: form.email.value,
        password: form.password.value,
        userType: userTypeChoice.value
      })
    })
    // If the response has status property and it's not a success code (2xx)
    if (response.status && !(response.status >= 200 && response.status < 300)) {
      // Handle server errors
      notificationStore.addNotification(
        'Fehler',
        'error',
        response.message,
        true
      )
      // return to prevent further execution
      return
    }

    layer.value++
    try {
      // if response is ok, login and redirect to complete registration
      await auth.login({
        email: form.email.value,
        password: form.password.value,
        redirect: '/complete-registration'
      })
      notificationStore.addNotification(
        'Erfolgreich registriert',
        'success',
        '',
        true
      )
      // clear form
      form.reset()
    } catch (e) {
      console.warn(e)
      // show error
      notificationStore.addNotification(
        'Fehler',
        'error',
        e.message,
        true
      )
    }
  } catch (err) {
    error.value = err.message
    console.warn(err)
    notificationStore.addNotification(
      'Fehler',
      'error',
      err.message,
      true
    )
  }
}

</script>

<style lang="scss" scoped>

    .boxed {

        &-section {
            padding: $paddingMedium $paddingSmall;
            border-radius: 10px;
            background-color: rgba($dark, .1);
        }
    }

    .register {

        &-form {
            width: 100%;
            max-width: 960px;
            margin-left: auto;
            margin-right: auto;

            &-bigbutton {
                @include flexMe(center);
                @include trans();
                min-height: 250px;
                background-color: darken($light, 5%);
                color: $primary;
                font-weight: bold;
                font-size: 24px;
                cursor: pointer;

                &:hover {
                    @include shadow;
                    color: white;
                    background-color: $primary;
                    transform: scale(1.05);
                }
                
                &-container {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: $paddingSmall;
                    margin: $paddingMedium auto;
                }
            }

            &-sub {
                @include shadow;
                @include flexMe(center);
                flex-direction: column;
                border-radius: 10px;
                padding: $paddingMedium;
                width: 100%;
                max-width: 640px;
                margin: $paddingMedium auto;
                background-color: white;

                input {
                    width: 100%;
                }
            }
        }

        &-wrapper {
            text-align: center;
        }
    }

    .custom {

        &-checkbox {
            @include box(25px);
            box-shadow: none !important;
            border-radius: 3px;
            border: 1px solid darken($primaryLight, 10%);
            display: inline-block;
            
            &-container {
                @include flexMe(center);
                gap: 10px;
                margin: 30px 0;
                
                input[type="checkbox"] {
                    @include box(1px);
                    opacity: 0;
                    margin-right: -25px;

                    &:checked + .custom-checkbox {
                        background-color: $primary;
                        position: relative;

                        &:before {
                            content: "";
                            @include box(100%);
                            @include pos(0);
                            @include bg('~/assets/icons/check-icon.svg', 55%);
                        }
                    }
                }
            }
        }

        &-radio {
            display: none;        
        }
    }


    @media screen and (max-width: 768px) {

        .custom-checkbox {

            &-container {

                & > span {
                    width: calc(100% - 25px - 10px);
                    text-align: left;
                    word-wrap: break-word;
                    hyphens: auto;
                }
            }
        }

        .register {

            &-form {

                &-bigbutton {
                    min-height: 120px;

                    &-container {
                        grid-template-columns: repeat(1, 1fr);
                        gap: 20px;
                    }
                }

                &-sub {
                    padding: $paddingSmall;
                    align-items: flex-start;
                }
            }
        }
    }

</style>