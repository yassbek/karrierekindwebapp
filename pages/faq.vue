<template>
    <div class="iwq-wrapper">
        <div class="iwq-intro">
            <h1>Sie haben Fragen?</h1>
            <p class="maximizer-medium mcenter">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.</p>
        </div>

        <section class="iwq-section">
            <h2>Antworten für Arbeitssuchende</h2>
            <Dropdown v-for="question in questions" :title="question.title">
                {{ question.title }}
            </Dropdown>
        </section>
        
        <section class="iwq-section">
            <h2>Antworten für Arbeitgeber:innen</h2>
            <Dropdown v-for="question in questions" :title="question.title">
                {{ question.title }}
            </Dropdown>
        </section>
    </div>
</template>

<script setup>
    const questions = [
        {title: "FAQ Frage Vidunt ut labore et dolore magna", content: "Iguodala to Curry, back to Iguodala, up for the layup! Oh! Blocked by James! LeBron James with the rejection!"},
        {title: "FAQ Frage Vidunt ut labore et dolore magna", content: "Iguodala to Curry, back to Iguodala, up for the layup! Oh! Blocked by James! LeBron James with the rejection!"},
        {title: "FAQ Frage Vidunt ut labore et dolore magna", content: "Iguodala to Curry, back to Iguodala, up for the layup! Oh! Blocked by James! LeBron James with the rejection!"},
        {title: "FAQ Frage Vidunt ut labore et dolore magna", content: "Iguodala to Curry, back to Iguodala, up for the layup! Oh! Blocked by James! LeBron James with the rejection!"},
    ]
</script>

<style lang="scss" scoped>
    .iwq-section {
        margin: $paddingMedium auto;
        padding: $paddingMedium;
        text-align: center;

        h2 {
            margin-bottom: $paddingMedium !important;
        }

        .dropdown {
            max-width: 960px;
            margin-left: auto;
            margin-right: auto;
            text-align: left;
        }
    }


    @media screen and (max-width: 768px) {
        
        .iwq-section {
            padding: $paddingSmall 20px;

            h2 {
                margin-bottom: $paddingSmall !important;
            }
        }
    }
</style>