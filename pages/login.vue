<template>
    <div class="iwq-container login-wrapper center">
        <h1>Anmelden</h1>
        <p class="maximizer-medium mcenter">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda eos iure
            ad tenetur molestiae eligendi dolorum sapiente. Sit, aut aliquid!</p>

        <form action="" class="iwq-form login-form" id="login_form" name="loginForm" @submit="onSubmit($event)">
            <input type="email" name="email" placeholder="E-Mail Adresse" required>
            <input type="password" name="password" placeholder="Passwort" required>

            <button type="submit" class="custom-button">Anmelden</button>

            <NuxtLink to="/forgot-password">Passwort vergessen</NuxtLink>

            <div class="iwq-form-message-container" v-if="errors.length">
                <p class="iwq-form-message error">Nutzername und Passwort stimmen nicht überein.</p>
            </div>
        </form>
        <p class="register-notice">Noch keinen Account? <NuxtLink to="/register"><u>Jetzt registrieren</u></NuxtLink></p>
    </div>
</template>


<script setup>
import {useAuth} from '~~/store/auth'
import {useNotificationStore} from "~/store/notifcations";

const auth = useAuth()
const errors = ref([])
const notificationStore = useNotificationStore()
const route = useRoute()
const redirect = route.query.redirectTo ? route.query.redirectTo : '/dashboard'

const onSubmit = async (event) => {
  event.preventDefault()
  let form = event.target
  if (!form.reportValidity()) return

  try {
    // Login
    await auth.login({
      email: form.email.value,
      password: form.password.value,
      redirect: redirect
    })
    /*
    notificationStore.addNotification(
      'Login erfolgreich',
      'success',
      'Sie wurden erfolgreich eingeloggt',
      true
    )
    */
  } catch (e) {
    errors.value.push(e.message)
    console.warn(e)

    notificationStore.addNotification(
      'Fehler beim Login',
      'error',
      e.message,
      true
    )
  }
};

</script>


<style lang="scss" scoped>

    .login {

        &-form {
            @include shadow;
            @include flexMe(center);
            flex-direction: column;
            margin: $paddingMedium auto;
            width: 100%;
            max-width: 640px;
            background-color: white;
            border-radius: 10px;
            padding: $paddingMedium;

            a {
                text-decoration: underline;
                margin-top: 30px;
                font-size: 16px;
                font-weight: normal;
            }
            
            button {
                margin-top: 30px;
            }
        }

        &-wrapper {
            text-align: center;
        }
    }

    @media screen and (max-width: 768px) {
        
        .login {
            
            &-form {
                padding: $paddingSmall;
            }
        }
    }

</style>