<template>
    <div class="iwq-container login-wrapper center">
        <h1>Passwort vergessen</h1>
        <p class="maximizer-medium mcenter">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Assumenda eos iure ad tenetur molestiae eligendi dolorum sapiente. Sit, aut aliquid!</p>

        <form action="" class="iwq-form login-form" id="login_form" name="loginForm" @submit="onSubmit($event)">
            <input type="email" ref="email" name="email" placeholder="E-Mail Adresse" required>

            <button class="custom-button" type="submit">Passwort zurücksetzen</button>

            <div class="iwq-form-message-container" v-if="error">
                <p class="iwq-form-message error">{{error}}</p>
            </div>
            <div class="iwq-form-message-container" v-if="isRequested">
                <p class="iwq-form-message error">Wir haben dir eine E-Mail mit einem Link zum Zurücksetzen deines Passworts gesendet.</p>
            </div>
        </form>

        <p class="register-notice">Noch keinen Account? <NuxtLink to="/register"><u>Jetzt registrieren</u></NuxtLink></p>
    </div>
</template>


<script setup>
const error = ref(null)
const isRequested = ref(false)

const onSubmit = async (event) => {
    event.preventDefault()
    let form = event.target
    if (!form.reportValidity()) return

    try {
        await $fetch('api/forgot-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: form.email.value,
            })
        })
        isRequested.value = true
    } catch (err) {
        error.value = err.message
        console.warn(err)
    }
}

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