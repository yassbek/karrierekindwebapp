<script setup>
import {useNotificationStore} from "~/store/notifcations";

const route = useRoute()
const token = route.params.token[0]
const error = ref(false)
const router = useRouter()
const needsNewPassword = ref(false)
const notificationStore = useNotificationStore()
const isVerified = ref(false)

const verify = async () => {
  try {
    const res = await $fetch('/api/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token
      })
    })
    // show notification
    notificationStore.addNotification(
      'Erfolgreich',
      'success',
      'Email wurde verifiziert',
      true
    )
    // check if user needs to set a new password
    if (res.needsNewPassword) {
      needsNewPassword.value = true
      return
    }
    // navigate to login page
    isVerified.value = true
    setTimeout(() => {
      router.push('/login') // <-- navigate with the router instance
    }, 3000)
  } catch (e) {
    console.warn(e)
    notificationStore.addNotification(
      'Fehler',
      'error',
      `Irgendwas ist schief gelaufen. ${e.message}`,
      true
    )
  }
}

await verify()

const newPassword = ref('')
const newPasswordRepeat = ref('')
const activateUser = async (event) => {
  event.preventDefault()
  // check if passwords are matching
  if (newPassword.value !== newPasswordRepeat.value) {
    notificationStore.addNotification(
      'Fehler',
      'error',
      'Die Passwörter stimmen nicht überein',
      true
    )
    return
  }
  // validate password
  const passwordValidation = validatePassword(newPassword.value)
  if (passwordValidation !== true) {
    notificationStore.addNotification(
      'Fehler',
      'error',
      passwordValidation,
      true
    )
    return
  }
  // send request to server
  try {
    await $fetch('/api/activate-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        password: newPassword.value
      })
    })
    notificationStore.addNotification(
      'Erfolgreich',
      'success',
      'Der Account wurde aktiviert',
      true
    )
    setTimeout(() => {
      router.push('/login') // <-- navigate with the router instance
    }, 2000)
  } catch (e) {
    console.warn(e)
    notificationStore.addNotification(
      'Fehler',
      'error'
        `Irgendwas ist schief gelaufen. ${e.message}`,
      true
    )
  }
}
</script>

<template>
  <div>
    <div v-if="needsNewPassword" class="iwq-container login-wrapper center">
      <div class="iwq-container login-wrapper center">
        <h1>Passwort wählen</h1>
        <p class="maximizer-medium mcenter">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda eos iure
          ad tenetur molestiae eligendi dolorum sapiente. Sit, aut aliquid!</p>

        <form action="" class="iwq-form login-form" id="login_form" name="loginForm" @submit="activateUser($event)">
          <input type="password" name="new-pw" id="new-pw" placeholder="Neues Passwort" v-model="newPassword" required>
          <input type="password" name="new-pw-repeat" id="new-pw-repeat" placeholder="Neues Passwort wiederholen" v-model="newPasswordRepeat" required>

          <button type="submit" class="custom-button">Account aktivieren</button>
        </form>
      </div>
    </div>
    <div v-else-if="isVerified">
      <p class="maximizer-medium mcenter">Ihre Email wurde verifiziert</p>
    </div>
  </div>

</template>

<style scoped lang="scss">

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