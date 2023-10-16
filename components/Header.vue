<template>
    <header class="header" :class="{user: userIsLoggedIn, nouser: !userIsLoggedIn, open: (!userIsLoggedIn && mobileMenuOpen)}">
        <div class="header-wrapper">
            <NuxtLink to="/" class="header-logo">
                <img src="/imgs/KarriereKind-Logo.svg" alt="KarriereKind Portal">
            </NuxtLink>

            <div class="header-menu">

                <nav v-if="!userIsLoggedIn">
                    <ul>
                        <li><NuxtLink to="/searching">Für Jobsuchende</NuxtLink></li>
                        <li><NuxtLink to="/for-companies">Für Unternehmen</NuxtLink></li>
                        <li><NuxtLink to="/magazine">Magazin</NuxtLink></li>
                        <li><NuxtLink to="/login" class="login">Anmelden</NuxtLink></li> 
                    </ul>
                </nav>

                <nav v-if="userIsLoggedIn">
                    <ul v-if="userType === 'Talente'">
                        <li class="multi">
                            <NuxtLink to="/job-requests">
                                <div class="header-menu-item-image">
                                    <svg viewBox="0 0 75.89 75.89"><g id="uuid-8a716e33-1db1-4561-8ec2-666bea515df8"><path d="m75.44,41.77l-8.73-8.73c-.6-.6-1.58-.6-2.18,0l-26.66,26.66c-1.94,1.94-3.26,4.4-3.8,7.09l-1.45,7.24c-.1.51.06,1.03.42,1.39.29.29.69.45,1.09.45.1,0,.2,0,.3-.03l7.24-1.45c2.7-.54,5.15-1.85,7.09-3.8l26.66-26.66c.29-.29.45-.68.45-1.09s-.16-.8-.45-1.09Zm-28.85,26.66c-1.51,1.51-3.42,2.53-5.52,2.95l-4.97.99.99-4.97c.42-2.1,1.44-4,2.95-5.52l25.57-25.57,6.54,6.54-25.57,25.57Z" style="fill:#2a2a2a;"/><path d="m21.55,72.81H7.71c-2.55,0-4.63-2.08-4.63-4.63V7.71c0-2.55,2.08-4.63,4.63-4.63h29.31v10.8c0,4.25,3.46,7.71,7.71,7.71h10.8v3.64c0,.85.69,1.54,1.54,1.54s1.54-.69,1.54-1.54v-5.18s0-.03,0-.05c0-.02,0-.04,0-.06,0-.06-.01-.13-.02-.19,0,0,0,0,0,0-.01-.07-.03-.13-.05-.2,0-.01,0-.02-.01-.04-.02-.06-.05-.12-.08-.18,0,0,0,0,0-.01-.03-.06-.07-.12-.11-.17,0-.01-.02-.02-.03-.04-.04-.06-.09-.11-.14-.16L39.65.45s0,0,0,0c-.05-.05-.1-.09-.15-.13-.01,0-.02-.02-.04-.03-.05-.04-.11-.08-.17-.11,0,0,0,0-.01,0-.06-.03-.12-.06-.18-.08-.01,0-.02,0-.04-.01-.06-.02-.13-.04-.2-.05,0,0,0,0,0,0-.06-.01-.13-.02-.19-.02-.02,0-.03,0-.05,0-.02,0-.03,0-.05,0H7.71C3.46,0,0,3.46,0,7.71v60.47c0,4.25,3.46,7.71,7.71,7.71h13.84c.85,0,1.54-.69,1.54-1.54s-.69-1.54-1.54-1.54Zm23.18-54.3c-2.55,0-4.63-2.08-4.63-4.63V5.27l13.24,13.24h-8.62Z" style="fill:#2a2a2a;"/><path d="m46.28,31.16c0-.85-.69-1.54-1.54-1.54H13.88c-.85,0-1.54.69-1.54,1.54s.69,1.54,1.54,1.54h30.85c.85,0,1.54-.69,1.54-1.54Z" style="fill:#2a2a2a;"/><path d="m13.88,41.96c-.85,0-1.54.69-1.54,1.54s.69,1.54,1.54,1.54h24.93c.85,0,1.54-.69,1.54-1.54s-.69-1.54-1.54-1.54H13.88Z" style="fill:#2a2a2a;"/><path d="m27.14,54.3h-13.26c-.85,0-1.54.69-1.54,1.54s.69,1.54,1.54,1.54h13.26c.85,0,1.54-.69,1.54-1.54s-.69-1.54-1.54-1.54Z" style="fill:#2a2a2a;"/></g></svg>
                                </div>
                                <span>Jobanfragen</span>
                            </NuxtLink>
                            <ul>
                                <li><NuxtLink to="/job-requests?status=open">Offene Anfragen</NuxtLink></li>
                                <li><NuxtLink to="/job-requests?status=accepted">Angenommene Anfragen</NuxtLink></li>
                                <li><NuxtLink to="/job-requests?status=declined">Abgelehnte Anfragen</NuxtLink></li>
                            </ul>
                        </li>
                        <li>
                            <NuxtLink to="/chats">
                                <div class="header-menu-item-image">
                                    <svg viewBox="0 0 68.89 75.89"><g id="uuid-b82031ef-51bf-46e3-af07-878a37c968aa"><path d="m63.83,0H5.06C2.27,0,0,2.26,0,5.06v70.83l12.7-12.7h51.13c2.8,0,5.06-2.26,5.06-5.06V5.06c0-2.8-2.26-5.06-5.06-5.06Zm-28.7,45.48h-18.96c-.85,0-1.54-.69-1.54-1.55s.69-1.54,1.54-1.54h18.96c.85,0,1.54.69,1.54,1.54s-.69,1.55-1.54,1.55Zm11.67-12.34h-30.63c-.85,0-1.54-.69-1.54-1.55s.69-1.54,1.54-1.54h30.63c.85,0,1.54.69,1.54,1.54s-.69,1.55-1.54,1.55Zm5.92-12.34H16.17c-.85,0-1.54-.69-1.54-1.55s.69-1.54,1.54-1.54h36.55c.85,0,1.54.69,1.54,1.54s-.69,1.55-1.54,1.55Z" style="fill:#2a2a2a;"/></g></svg>
                                </div>
                                <span>Chats</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/interviews">
                                <div class="header-menu-item-image">
                                    <svg viewBox="0 0 81.74 47.95"><g id="uuid-cfe438ed-a144-4570-acf8-99f7845aceba"><rect width="63.19" height="47.95" rx="2.86" ry="2.86" style="fill:#2a2a2a;"/><path d="m77.76,37.4l-9.06-3.87c-1.05-.45-1.73-1.48-1.73-2.63v-13.86c0-1.14.68-2.18,1.73-2.63l9.06-3.87c1.88-.8,3.98.58,3.98,2.63v21.59c0,2.05-2.09,3.43-3.98,2.63Z" style="fill:#2a2a2a;"/></g></svg>
                                </div>
                                <span>Interviews</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/coaching">
                                <div class="header-menu-item-image">
                                    <svg viewBox="0 0 30.89 46.76"> <g> <path d="m19.67,42.12c0,1.44-.46,2.58-1.39,3.4-.93.83-2,1.23-3.21,1.23s-2.36-.4-3.29-1.22c-.94-.8-1.42-1.94-1.42-3.41,0-1.29.46-2.39,1.36-3.27.92-.87,2.03-1.32,3.34-1.32s2.39.44,3.27,1.32c.87.89,1.32,1.98,1.32,3.27Z" style="fill:#2a2a2a;" /> <path d="m30.89,12.32c.01,1.75-.35,3.29-1.05,4.61-.71,1.32-1.55,2.46-2.54,3.41-.97.96-2.73,2.57-5.27,4.83-.69.64-1.25,1.21-1.68,1.68-.42.49-.74.93-.94,1.33-.21.4-.36.8-.47,1.21-.11.4-.29,1.11-.51,2.12-.39,2.14-1.61,3.21-3.68,3.21-1.07,0-1.97-.35-2.71-1.05-.72-.69-1.1-1.73-1.1-3.11,0-1.73.28-3.23.8-4.5.54-1.28,1.25-2.39,2.14-3.34.89-.96,2.08-2.1,3.58-3.41,1.32-1.15,2.28-2.03,2.86-2.61.58-.58,1.08-1.25,1.48-1.96.4-.72.6-1.51.6-2.36,0-1.64-.61-3.04-1.83-4.16-1.23-1.14-2.82-1.71-4.75-1.71-2.26,0-3.94.58-5.01,1.72-1.07,1.14-1.97,2.83-2.72,5.05-.69,2.33-2.03,3.5-3.98,3.5-1.15,0-2.12-.42-2.91-1.22-.79-.82-1.19-1.69-1.19-2.65,0-1.96.62-3.94,1.89-5.94,1.25-2.01,3.08-3.68,5.49-4.99,2.41-1.32,5.22-1.97,8.44-1.97,2.98,0,5.62.54,7.91,1.65,2.29,1.1,4.05,2.59,5.3,4.5,1.23,1.89,1.86,3.95,1.86,6.17Z" style="fill:#2a2a2a;" /></g></svg>
                                </div>
                                <span class="desktop-view">Coaching</span>
                                <span class="mobile-view">Hilfe</span>
                            </NuxtLink>
                        </li> 
                    </ul>

                    <ul v-if="userType === 'Unternehmen'">
                        <li>
                            <NuxtLink to="/open-jobs">
                                <div class="header-menu-item-image">
                                    <svg viewBox="0 0 46.3 47.95"><g><path d="m45.59,43.68l-11.41-11.87c2.93-3.49,4.54-7.88,4.54-12.45C38.72,8.69,30.04,0,19.36,0S0,8.69,0,19.36s8.69,19.36,19.36,19.36c4.01,0,7.83-1.21,11.09-3.5l11.5,11.96c.48.5,1.13.77,1.82.77.66,0,1.28-.25,1.75-.7,1-.97,1.04-2.57.07-3.57ZM19.36,5.05c7.89,0,14.31,6.42,14.31,14.31s-6.42,14.31-14.31,14.31-14.31-6.42-14.31-14.31,6.42-14.31,14.31-14.31Z" style="fill:#2a2a2a;"/></g></svg>
                                </div>
                                <span><span class="mobile-hide">Offene </span>Stellen</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/chats">
                                <div class="header-menu-item-image">
                                    <svg viewBox="0 0 68.89 75.89"><g id="uuid-b82031ef-51bf-46e3-af07-878a37c968aa"><path d="m63.83,0H5.06C2.27,0,0,2.26,0,5.06v70.83l12.7-12.7h51.13c2.8,0,5.06-2.26,5.06-5.06V5.06c0-2.8-2.26-5.06-5.06-5.06Zm-28.7,45.48h-18.96c-.85,0-1.54-.69-1.54-1.55s.69-1.54,1.54-1.54h18.96c.85,0,1.54.69,1.54,1.54s-.69,1.55-1.54,1.55Zm11.67-12.34h-30.63c-.85,0-1.54-.69-1.54-1.55s.69-1.54,1.54-1.54h30.63c.85,0,1.54.69,1.54,1.54s-.69,1.55-1.54,1.55Zm5.92-12.34H16.17c-.85,0-1.54-.69-1.54-1.55s.69-1.54,1.54-1.54h36.55c.85,0,1.54.69,1.54,1.54s-.69,1.55-1.54,1.55Z" style="fill:#2a2a2a;"/></g></svg>
                                </div>
                                <span>Chats</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/interviews">
                                <div class="header-menu-item-image">
                                    <svg viewBox="0 0 81.74 47.95"><g id="uuid-cfe438ed-a144-4570-acf8-99f7845aceba"><rect width="63.19" height="47.95" rx="2.86" ry="2.86" style="fill:#2a2a2a;"/><path d="m77.76,37.4l-9.06-3.87c-1.05-.45-1.73-1.48-1.73-2.63v-13.86c0-1.14.68-2.18,1.73-2.63l9.06-3.87c1.88-.8,3.98.58,3.98,2.63v21.59c0,2.05-2.09,3.43-3.98,2.63Z" style="fill:#2a2a2a;"/></g></svg>
                                </div>
                                <span>Interviews</span>
                            </NuxtLink>
                        </li>
                        <li>
                            <NuxtLink to="/consulting">
                                <div class="header-menu-item-image">
                                    <svg viewBox="0 0 30.89 46.76"> <g> <path d="m19.67,42.12c0,1.44-.46,2.58-1.39,3.4-.93.83-2,1.23-3.21,1.23s-2.36-.4-3.29-1.22c-.94-.8-1.42-1.94-1.42-3.41,0-1.29.46-2.39,1.36-3.27.92-.87,2.03-1.32,3.34-1.32s2.39.44,3.27,1.32c.87.89,1.32,1.98,1.32,3.27Z" style="fill:#2a2a2a;" /> <path d="m30.89,12.32c.01,1.75-.35,3.29-1.05,4.61-.71,1.32-1.55,2.46-2.54,3.41-.97.96-2.73,2.57-5.27,4.83-.69.64-1.25,1.21-1.68,1.68-.42.49-.74.93-.94,1.33-.21.4-.36.8-.47,1.21-.11.4-.29,1.11-.51,2.12-.39,2.14-1.61,3.21-3.68,3.21-1.07,0-1.97-.35-2.71-1.05-.72-.69-1.1-1.73-1.1-3.11,0-1.73.28-3.23.8-4.5.54-1.28,1.25-2.39,2.14-3.34.89-.96,2.08-2.1,3.58-3.41,1.32-1.15,2.28-2.03,2.86-2.61.58-.58,1.08-1.25,1.48-1.96.4-.72.6-1.51.6-2.36,0-1.64-.61-3.04-1.83-4.16-1.23-1.14-2.82-1.71-4.75-1.71-2.26,0-3.94.58-5.01,1.72-1.07,1.14-1.97,2.83-2.72,5.05-.69,2.33-2.03,3.5-3.98,3.5-1.15,0-2.12-.42-2.91-1.22-.79-.82-1.19-1.69-1.19-2.65,0-1.96.62-3.94,1.89-5.94,1.25-2.01,3.08-3.68,5.49-4.99,2.41-1.32,5.22-1.97,8.44-1.97,2.98,0,5.62.54,7.91,1.65,2.29,1.1,4.05,2.59,5.3,4.5,1.23,1.89,1.86,3.95,1.86,6.17Z" style="fill:#2a2a2a;" /></g></svg>
                                </div>
                                <span class="desktop-view">Unternehmensberatung</span>
                                <span class="mobile-view">Hilfe</span>
                            </NuxtLink>
                        </li> 
                    </ul>
                </nav>

                <!-- TODO: auslagern in Komponente -->
                <div class="header-profile" v-if="userIsLoggedIn">
                    <div class="header-profile-view">
                        <div class="header-profile-image"
                             :style="[`backgroundImage:url(${getImageFromDirectus(userType === 'Talente' ? talentData?.Profilbild : ansprechpartnerData?.Profilbild, 'png')})`]">
                        ></div>
                        <div class="header-profile-name">{{ auth?.userProfile?.Vorname }} {{ ' ' }}
                            {{ auth?.userProfile?.Nachname }}
                        </div>
                        <div class="header-profile-indicator">Profil</div>
                    </div>

                    <ul class="header-profile-dropdown" :class="{'company-view': userType === 'company'}">
                        <li v-if="userType === 'Unternehmen'">
                            <NuxtLink to="/profile" class="company">Unternehmensprofil</NuxtLink>
                        </li>

                        <li v-if="userType === 'Talente'">
                            <NuxtLink to="/profile">Mein Profil</NuxtLink>
                        </li>

                        <li>
                            <NuxtLink to="/profile/settings" class="settings">Einstellungen</NuxtLink>
                        </li>

                        <li class="logout">
                            <button class="logout" @click="logoutUser">Abmelden</button>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="header-burger-menu" v-if="!userIsLoggedIn" @click="mobileMenuOpen = !mobileMenuOpen">
                <div class="header-burger-menu-stripe"></div>
                <div class="header-burger-menu-stripe"></div>
                <div class="header-burger-menu-stripe"></div>
            </div>
        </div>
    </header>
</template>


<script setup>

import {useAuth} from "~/store/auth";
import {getImageFromDirectus, getUserTypeById} from "~/utils/helper";
import {useNotificationStore} from "~/store/notifcations";

const auth = useAuth()
const route = useRoute()
const userIsLoggedIn = computed(() => auth.isLoggedIn)
const mobileMenuOpen = ref(false)
//const userType = ref(route.query.usertype ? route.query.usertype : 'talent')
const userType = computed(() => getUserTypeById(auth.user.role))
const notificationStore = useNotificationStore()

watch(route, () => {
    mobileMenuOpen.value = false
})

const logoutUser = () => {
    auth.logout()
    mobileMenuOpen.value = false
}

const {$directus} = useNuxtApp()
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
let talentData, ansprechpartnerData;
let talentPending, ansprechpartnerPending;
let talentError, ansprechpartnerError;

switch (userType.value) {
  case 'Talente':
    ({
      data: talentData,
      pending: talentPending,
      error: talentError
    } = await useAsyncData('talenteH', () => fetchDataFromDirectus('Talente', [
      'id',
      'Profilbild',
      'Vorname',
      'Nachname',
    ])));
    break;

  case 'Unternehmen':
    ({
      data: ansprechpartnerData,
      pending: ansprechpartnerPending,
      error: ansprechpartnerError
    } = await useAsyncData('ansprechpartnerH', () => fetchDataFromDirectus('Ansprechpartner', [
      'id',
      'Profilbild',
      'Vorname',
      'Nachname',
    ])));
    break;

}

</script>  


<style lang="scss" scoped>
    .header {
        @include flexMe(center);
        @include pos(0, 0, tl, fixed);
        width: 100%;
        padding: 15px $paddingBig;
        background-color: darken($light, 5%);
        z-index: 99;

        &-burger-menu {
            display: none;
        }

        &-logo {
            display: inline-block;

            img {
                width: auto;
                height: 45px;
            }
        }

        &-menu {
            @include flexMe(flex-end, center);
            gap: 30px;
            
            nav {

                & > ul {
                    margin: 0;
                    padding: 0;

                    & > li {
                        display: inline-block;
                        position: relative;

                        &:hover {
                            
                            & > ul {
                                opacity: 1;
                                pointer-events: auto;
                                transform: translateY(0);
                            }
                        }

                        & > a {
                            padding: 5px 25px;
                            color: $dark;

                            &:hover {
                                color: $primary;
                            }

                            &.router-link-active {
                                color: $primary;
                            }
                        }

                        & > ul {
                            @include pos(calc(100% + 30px), 0);
                            @include trans;
                            @include shadow;
                            border-radius: 10px;
                            min-width: 100%;
                            width: max-content;
                            opacity: 0;
                            pointer-events: none;
                            transform: translateY(-30px);
                            background-color: white;
                            padding: 10px 0;
                            margin: 0;

                            &:before {
                                content: "";
                                @include box(100%, 30px);
                                @include pos(-30px, 0);
                            }

                            & > li {

                                & > a {
                                    color: $dark;
                                    padding: 5px 20px;
                                    display: block;
                                    font-size: 14px;

                                    &:hover {
                                        background-color: rgba($dark, .05);
                                        color: $primary;
                                        padding-left: 25px;
                                        padding-right: 15px;
                                    }
                                }
                            }
                        }

                        &.multi {

                            & > a:after {
                                content: "";
                                @include box(12px);
                                @include bg('~/assets/icons/arrow-down-small.svg');
                                display: inline-block;
                                margin-left: 8px;
                                transform: translateY(1px);
                            }
                        }
                    }
                }
            }

            &-item-image {
                display: none;
            }
        }

        &-profile {
            width: auto;
            max-width: 230px;
            position: relative;

            &:hover &-dropdown {
                opacity: 1;
                transform: translateY(0);
                pointer-events: auto;
            }

            &-dropdown {
                @include trans;
                @include pos(calc(100% + 30px), 0);
                @include shadow;
                background-color: white;
                border-radius: 10px;
                min-width: 100%;
                opacity: 0;
                transform: translateY(-30px);
                pointer-events: none;
                margin: 0;
                padding: 10px 0;

                &:before {
                    content: "";
                    @include box(100%, 30px);
                    @include pos(-30px, 0);
                }

                li {

                    a, button {
                        @include font;
                        @include trans;
                        border: none;
                        background: none;
                        font-size: 18px;
                        color: $dark;
                        font-weight: 600 !important;
                        padding: 5px 20px;
                        display: block;
                        width: 100%;
                        text-align: left;
                        cursor: pointer;

                        &:hover {
                            background-color: rgba($dark, .05);
                            color: $primary;
                        }
                    }
                }

                &.company-view {

                    li a,
                    li button {
                        padding: 15px 20px;
                        padding-left: 50px;
                        position: relative;

                        &:before {
                            content: "";
                            @include box(20px);
                            @include pos(15px);
                        }
                    }

                    .company:before {
                        @include bg('~/assets/icons/company-icon.svg');
                    }

                    .logout {

                        &:before {
                            @include bg('~/assets/icons/logout-icon.svg');
                        }

                        &:hover {
                            color: $error;
                        }
                    }

                    .settings:before {
                        @include bg('~/assets/icons/settings-icon.svg');
                    }
                    
                }
            }

            &-image {
                @include box(50px);
                @include shadow;
                @include bg(false, cover, center);
                border-radius: 50px;
                overflow: hidden;
                flex: 0 0 50px;
            }

            &-indicator {
                display: none;
            }

            &-name {
                font-weight: bold;
                color: darken($primary, 10%);
            }
            
            &-view {
                @include flexMe(flex-start, center);
                @include bg('~/assets/icons/arrow-down-small-primary.svg', auto 7px, right center);
                flex-wrap: nowrap;
                gap: 10px;
                width: 100%;
                padding-right: 30px;
                cursor: pointer;
            }
        }

        &-wrapper {
            @include flexMe(space-between, center);
            width: 100%;
            max-width: $maxWidth;
            margin-left: auto;
            margin-right: auto;
        }
    }

    .mobile-view {
        display: none;
    }

    @media screen and (max-width: 1200px) {
        .header {

            &-menu {

                nav {

                    & > ul {

                        & > li {

                            & > a {
                                padding: 10px 25px;
                            }
                        }
                    }
                }
            }

            &-profile {

                &-name {
                    display: none;
                }
            }
        }
    }

    @media screen and (max-width: 1025px) {
        .header {
            padding-left: $paddingMedium;
            padding-right: $paddingMedium;
            min-height: 80px;

            &-burger-menu {
                @include box(30px, 21px);
                @include trans;
                display: block;
                position: relative;
                cursor: pointer;

                &:hover {
                    scale: 1.1;
                }

                &-stripe {
                    @include box(30px, 3px);
                    @include trans;
                    background-color: $primary;
                    display: block;

                    &:nth-of-type(2) {
                        margin: 6px 0;
                    }
                }
            }

            &-menu {

                nav > ul {

                    & > li {

                        &.multi {

                            & > a:after {
                                display: none;
                            }
                        }
                    }
                }
            }

            &.user .header {
                
                
                &-menu {
                    --header-image-size: 30px;
                    @include pos(0, 0, bl, fixed);
                    @include shadow;
                    z-index: 999;
                    width: 100%;
                    padding: 10px $paddingMedium;
                    background-color: darken($light, 5%);
                    grid-template-rows: 1fr;
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    gap: 10px;

                    &-item {

                        &-image {
                            @include box(var(--header-image-size));
                            @include flexMe(center);
                            object-fit: contain;

                            svg {
                                max-height: 100%;
                                max-width: 100%;
                            }
                        }
                    }

                    nav {
                        grid-area: 1 / 1 / 2 / 5;

                        ul {
                            display: grid;
                            grid-template-columns: repeat(4, 1fr);
                            gap: 10px;

                            li {
                                
                                a {
                                    @include flexMe(center);
                                    gap: 5px;
                                    text-align: center;
                                    flex-direction: column;
                                    font-size: 12px;
                                    padding: 0;

                                    &.router-link-active {

                                        svg {

                                            polygon, path, rect {
                                                fill: $primary !important;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                &-profile {
                    @include flexMe(center);
                    grid-area: 1 / 5 / 2 / 6;

                    &-name {
                        display: none;
                    }

                    &-dropdown {
                        bottom: calc(100% + 30px);
                        left: auto;
                        right: 0;
                        top: auto;
                        padding: 5px 0;

                        &:before {
                            @include pos(-30px, 0, br);
                        }

                        li {

                            a, button {
                                padding: 5px 15px;
                                font-size: 16px;

                                &:before {
                                    display: none;
                                }
                            }
                        }
                    }

                    &-image {
                        @include box(var(--header-image-size));
                        flex: none;
                    }
                    
                    &-indicator {
                        display: block;
                        font-weight: bold;
                        font-size: 12px;
                    }

                    &-view {
                        @include flexMe(center);
                        flex-direction: column;
                        padding: 0;
                        background: none;
                    }
                }

            }

            &.nouser {
                position: relative;
            }

            &.nouser .header {

                &-menu {
                    @include pos(80px, 0);
                    @include box(100%, calc(100vh - 80px));
                    @include trans;
                    justify-content: center;
                    align-items: flex-start;
                    background-color: darken($light, 10%);
                    padding: $paddingMedium;
                    opacity: 0;
                    z-index: -1;
                    pointer-events: none;
                    
                    nav ul {
                        @include flexMe(flex-start, center);
                        flex-direction: column;

                        li {

                            & > a {
                                padding: 10px 20px;
                                display: block;
                                
                                &.login {
                                    @include colorize($primary);
                                    color: white;
                                }
                            }
                        }
                    }
                }

            }

            &.open .header-menu {
                opacity: 1;
                z-index: auto;
                pointer-events: auto;
            }

            &.open .header-burger-menu {

                &-stripe {

                    &:nth-of-type(1) {
                        @include pos(calc(50% - 1.5px), 0);
                        rotate: 45deg;
                    }

                    &:nth-of-type(2) {
                        @include pos(calc(50% - 1.5px), 0);
                        margin: 0;
                        opacity: 0;
                    }

                    &:nth-of-type(3) {
                        @include pos(calc(50% - 1.5px), 0);
                        rotate: -45deg;
                    }
                }
            }
        }

        .desktop-view {
            display: none;
        }

        .mobile-view {
            display: inline-block;
        }
    }

    @media screen and (max-width: 769px) {
        .header {
            padding: 5px $paddingSmall;
            min-height: 65px;

            &.user & {

                &-logo {
                    height: 35px;

                    img {
                        height: 35px;
                    }
                }

                &-menu {
                    padding-left: $paddingSmall;
                    padding-right: $paddingSmall;
                }

                &-wrapper {
                    justify-content: center;
                }
            }

        }

        .mobile-hide {
            display: none;
        }
    }

    @media screen and (max-width: 600px) {
        
        .header {

            &.user & {

                &-menu {
                    --header-image-size: 25px;
                    padding: 10px;

                    &-item {

                        &-image {

                        }
                    }
                }
            }

        }
    }
    
</style>