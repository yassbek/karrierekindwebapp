<template>
    <section class="iwq-container iwq-chats-container">
        <div class="iwq-intro">
            <h1>Chats</h1>
            <p class="mcenter maximizer-medium">Hier sehen Sie die Chatnachrichten von Unternehmen, deren Anfragen Sie angenommen haben. Sie haben auch einen Chat mit KarriereKind – hier erhalten Sie Hilfe und Tipps.</p>
        </div>        

        <div class="chat-container" :class="{extended: user.type === 'company'}">
            <div class="chat-collection inbox small" :class="{'inbox-in-front': inboxInFront}" v-if="user.type === 'company'">
                <h3>Posteingänge</h3>
                <div class="chats">
                    <div 
                        class="chat-inbox"
                        :class="{current: inbox.id === currentInbox}"
                        v-for="inbox in inboxes" 
                        :key="inbox.id"
                        @click="changeInbox(inbox.id)"
                        >
                        {{ inbox.title }}
                    </div>
                </div>
            </div>

            <div class="chat-collection people" :class="{'people-in-front': peopleInFront}">
                <h3>
                    <div class="chat-backbutton" @click="inboxInFront = true" v-if="user.type === 'company'"><img src="~/assets/icons/arrow-left-small.svg" alt="Zurück zu den Posteingängen"></div>
                    <span v-if="user.type === 'company'">Chats</span>
                    <span v-if="user.type === 'talent'">Alle Chats</span>
                </h3>
                <div class="chats">
                    <ChatTeaser v-for="chat in chats" @click="changeChat(chat)" :chat="chat" :key="chat.id" />
                </div>
            </div>

            <div class="chat-window">
                <ChatActive :chat="currentChat" @goBack="peopleInFront = true" @sendMessage="addMessage($event)"/>
            </div>

            <div class="chat-infos-container" :class="{expanded: infosInView}">
                <div class="chat-infos-toggle" :class="{'in-view':infosInView}" @click="infosInView = !infosInView">
                    <img src="~/assets/icons/closer-dark.svg" alt="Weniger Infos anzeigen" class="close">
                    <img src="~/assets/icons/info-i.svg" alt="Mehr Infos anzeigen" class="show">
                </div>
                <ChatInfos :chat="currentChat" @unmatch="removeMatchModalOpen = true" />
            </div>
        </div>

        <div class="dashboard-teaser">
            <div>
                <h3>Interessean einem Coaching?</h3>
                <p>Dann schaue Dir gerne unsere aktuellen Coachin Angebot an</p>
            </div>

            <div class="custom-button-holder">
                <NuxtLink class="custom-button" to="/coaching">Zum Coaching</NuxtLink>
            </div>
        </div>
    
    </section>

    <Modal v-if="removeMatchModalOpen" @close="removeMatchModalOpen = false">
        <h2>Kein match?</h2>
        <p class="maximizer-medium">Verfassen Sie eine Nachricht, wieso Sie das Match auflösen wollen oder nutzen Sie eine unserer Musternachrichten.</p>

        <div class="unmatch-prebuild-message" v-for="(message, index) in prebuildUnmatchMessages" :key="index" @click="unmatch(prebuildUnmatchMessages[index])">{{ message }}</div>
        
        <div class="iwq-form unmatch-custom-message">
            <input 
                type="text" 
                placeholder="Eigene Nachricht verfassen"
                v-model="customUnmatchMessage" 
                @focus="customUnmatchMessageInFocus = true"
                @blur="customUnmatchMessageInFocus = false"
                @keydown.enter="sendCustomUnmatchMessage"
            >
            <img @click="unmatch(customUnmatchMessage)" class="" src="~/assets/icons/send-primary.svg" alt="Senden">
        </div>

        <button class="custom-button small" @click="removeMatchModalOpen = false">zurück zum Chat</button>
    </Modal>
</template>


<script setup>
    const router = useRoute()
    const user = ref({type: router.query.usertype ? router.query.usertype : 'talent'})
    const partnerID = ref(router.query.id ?? null)
    const removeMatchModalOpen = ref(false)
    const customUnmatchMessage = ref('')
    const customUnmatchMessageInFocus = ref(false)
    const inboxInFront = ref(true)
    const infosInView = ref(false)
    const peopleInFront = ref(user.value.type != 'company')

    const chats = ref([
        {id: 1, author: 'Anthony Davis', company: 'JUNGMUT GmbH', position: 'Small Forward', img: '/imgs/placeholder.webp'},
        {id: 2, author: 'Anthony Davis', company: 'JUNGMUT GmbH', position: 'Small Forward', img: '/imgs/placeholder.webp'},
        {id: 3, author: 'Anthony Davis', company: 'JUNGMUT GmbH', position: 'Small Forward', img: '/imgs/placeholder.webp'},
        {id: 4, author: 'Anthony Davis', company: 'JUNGMUT GmbH', position: 'Small Forward', img: '/imgs/placeholder.webp'},
        {id: 5, author: 'Anthony Davis', company: 'JUNGMUT GmbH', position: 'Small Forward', img: '/imgs/placeholder.webp'},
        {id: 6, author: 'Anthony Davis', company: 'JUNGMUT GmbH', position: 'Small Forward', img: '/imgs/placeholder.webp'},
        {id: 7, author: 'Anthony Davis', company: 'JUNGMUT GmbH', position: 'Small Forward', img: '/imgs/placeholder.webp'},
        {id: 8, author: 'Anthony Davis', company: 'JUNGMUT GmbH', position: 'Small Forward', img: '/imgs/placeholder.webp'},
    ])

    const inboxes = ref([
        {id: 12, title: 'Software Engineer'},
        {id: 13, title: 'Data Scientist'},
        {id: 14, title: 'Cybersecurity Analyst'},
        {id: 15, title: 'Web Developer'},
        {id: 16, title: 'Network Administrator'},
        {id: 17, title: 'UX/UI Designer'},
        {id: 18, title: 'Systems Analyst'},
        {id: 19, title: 'IT Project Manager'},
        {id: 20, title: 'Artificial Intelligence Engineer'},
        {id: 21, title: 'DevOps Engineer'},
    ])

    const prebuildUnmatchMessages = ref([
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
    ])

    const currentInbox = ref(12)

    const currentChat = ref({
        id: 11,
        partner: {
            id: 69,
            name: 'Marcus Smart',
            img: '/imgs/placeholder.webp',
            position: 'Shooting Guard',
            company: {
                id: 420,
                name: 'Boston Celtics',
                address: 'Hansaring 20',
                city: '50670 Köln',
                website: {uri: 'https://jungmut.com', name: 'www.jungmut.com'},
            }
        },
        history: [
            {from: 'partner', message: 'Sollen wir uns Freitag dazu nochmal abstimmen?', datetime: new Date("2023-05-13 13:37:00")},
            {from: 'self', message: 'Mir würde Montag besser passen', datetime: new Date("2023-05-13 16:20:00")},
            {from: 'partner', message: 'Dann machen wir das Montag :)', datetime: new Date("2023-05-13 19:39:00")},
        ],
        subject: 'HubSpot Consultant (m/w/d)',
        description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua'
    })    

    useHead({
        bodyAttrs: {
            class: computed(() => {
                return removeMatchModalOpen.value ? 'noscroll' : '';
            })
        }
    })

    function addMessage(message) {
        //@ToDo: Do api call to send message to server
        currentChat.value.history.push({from: 'self', message: message, datetime: new Date()})
    }

    function changeChat(chat) {
        peopleInFront.value = false
    }

    function changeInbox(id) {
        currentInbox.value = id
        inboxInFront.value = false
        peopleInFront.value = true
        // TODO: Change inbox
    }

    function unmatch(message) {
        if( confirm(`Bist Du sicher, dass Du das Match mit ${currentChat.value.partner.name} aus folgendem Grund auflösen willst: \n \n${message}?`) ) {

            // api call to unmatch
            console.log("Ok, Du und " + currentChat.value.partner.name + " seid kein Match mehr")
        }
    }

    function sendCustomUnmatchMessage() {
        if( !customUnmatchMessageInFocus ) return

        unmatch(customUnmatchMessage.value)
    }

</script>


<style lang="scss" scoped>
    .iwq-chats-container {
        text-align: center;
    }

    .dashboard {

        &-teaser {
            max-width: 1200px;
            margin-left: auto;
            margin-right: auto;
            text-align: left;
        }
    }

    .chat {

        &s {
            width: 100%;
            height: calc(750px - 40px - #{$paddingSmall});
            margin-top: $paddingSmall;
            padding: 0 10px;
            overflow-y: scroll;
        }

        &-backbutton {
            display: none;
        }

        &-collection {
            width: 300px;
            border-right: 2px solid darken($light, 10%);
            min-height: 500px;
            max-height: 750px;

            h3 {
                margin: 10px 20px 30px;
                font-size: 22px;
                line-height: 1.2em;
            }

            &.small {
                width: 200px;
            }
        }

        &-container {
            display: flex;
            justify-content: flex-start;
            width: 100%;
            max-width: 1200px;
            margin: $paddingBig auto;
            text-align: left;
            background-color: darken($light, 5%);
            border: 1px solid darken($light, 10%);
            border-radius: 10px;

            &.extended {
                max-width: $maxWidth;
            }
        }

        &-inbox {
            @include trans;
            padding: 10px;
            font-size: 12px;
            font-weight: 600;
            border-bottom: 1px solid rgba($dark, .1);
            cursor: pointer;

            &:hover {
                background-color:rgba($dark, .05);
            }

            &.current {
                color: $primary;
                border-color: $primary;
                font-weight: bold;
            }
        }

        &-infos {

            &-container {
                width: 300px;
                border-left: 2px solid darken($light, 10%);
                min-height: 500px;
                max-height: 750px;
            }
            
            &-toggle {
                display: none;
            }
        }

        &-window {
            flex: 1;
            position: relative;
        }
    }

    .unmatch {

        &-custom-message {
            @include flexMe(space-between, center);
            flex-wrap: nowrap;
            gap: 20px;
            margin: $paddingSmall 0;

            img {
                @include trans;
                cursor: pointer;
                height: 30px;

                &:hover {
                    scale: 1.1;
                }
            }

            input {
                margin-bottom: 0;
            }
        }

        &-prebuild-message {
            @include shadow;
            @include trans;
            border-radius: 5px 5px 5px 0;
            margin: 20px auto 40px;
            padding: $paddingSmall;
            padding-bottom: 50px;
            position: relative;
            background-color: white;
            cursor: pointer;

            &:hover {
                background-color: $primary;
                color: white;

                &:before {
                    background-color: $primary;
                }

                &:after {
                    filter: brightness(400%);
                }
            }

            &:before {
                content: "";
                @include box(20px);
                @include pos(-20px, 0, bl);
                @include trans;
                background-color: white;
                clip-path: polygon(0 0, 0% 100%, 100% 0);
            }

            &:after {
                content: "";
                @include trans;
                @include box(20px);
                @include pos(10px, 10px, br);
                @include bg('~/assets/icons/send-primary.svg');
            }

        }
    }



    @media screen and (max-width: 1400px) {
        
        .chat {

            &-backbutton {
                @include box(30px);
                @include trans;
                border-radius: 5px;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;

                &:hover {
                    background-color: rgba($dark, .1);
                }

                img {
                    width: auto;
                    height: 16px;
                }
            }

            &-collection {

                &.people {

                    h3 {
                        @include flexMe(flex-start, center);
                        gap: 10px;
                    }
                }

                &.inbox {
                    @include pos(0);
                    @include trans;
                    width: 300px;
                    background-color: $light;
                    border-radius: 10px 0 0 10px;
                    background-color: darken($light, 5%);
                    opacity: 0;
                    pointer-events: none;
                    transform: translateX(-100%);
                    z-index: 31;
                }

                &.inbox-in-front {
                    opacity: 1;
                    pointer-events: auto;
                    transform: translateX(0px);
                }
            }

            &-container {
                position: relative;
                overflow-x: hidden;
                &.extended {

                }
            }

            &-inbox {
                font-size: 16px;
            }

            &-infos {

                &-toggle {
                    @include box(30px);
                    @include pos(20px, 20px, tr);
                    @include trans;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 2px solid $dark;
                    border-radius: 30px;
                    padding: 5px;

                    &:hover {
                        background-color: rgba(white, .2);
                        border-color: $primary;
                    }

                    img {
                        display: block;
                        height: 100%;
                    }
                    
                    .close {
                        display: none;
                    }

                    &.in-view {

                        .close {
                            display: block;
                        }

                        .show {
                            display: none;
                        }
                    }
                }

                &-container {
                    @include trans;
                    position: relative;
                    width: 70px;

                    &.expanded {
                        width: 300px;

                        .chat-infos {
                            display: block;
                        }
                    }

                    .chat-infos {
                        display: none;
                    }
                }
            }

        }
    }

    @media screen and (max-width: 1024px) {


        .chat {

            &-collection {
                max-height: 100%;
                
                &.people, 
                &.inbox {
                    width: calc(100% + 2px);
                }

                &.people {
                    @include pos(0);
                    @include trans;
                    background-color: darken($light, 5%);
                    opacity: 0;
                    pointer-events: none;
                    transform: translateX(-100%);

                    &.people-in-front {
                        opacity: 1;
                        pointer-events: auto;
                        z-index: 30;
                        transform: translateX(0%);
                    }
                }
            }

            &-infos {
                max-height: 100%;
                overflow: scroll;

                &-container {
                    max-height: 550px;
                }
            }

            &-window {
                max-height: 550px;
            }
        }
    }

    @media screen and (max-width: 768px) {
        
        .dashboard-teaser,
        .iwq-intro {
            display: none;
        }

        .chat {

            &-container {
                margin: -65px -#{$paddingSmall} -60px;
                width: calc(100% + (2* #{$paddingSmall}));
                height: calc(100vh - 77px - 65px);
                border-radius: 0;

                :deep() {
                    .chat-main-appointment-button {
                        display: none;
                    }
                }
            }

            &-collection,
            &-infos-container,
            &-window {
                height: 100%;
                max-height: 100%;
            }

            &-infos {
                
                &-container {
                    @include pos(0, 0, tr);
                    width: 0;

                    &.expanded {
                        @include shadow;
                        z-index: 30;
                        background-color: darken($light, 5%);
                    }
                }
            }
        }

        
    }


</style>