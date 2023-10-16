<template>
    <footer class="footer">
        <div class="footer-wrapper">
            <p>&copy; KarriereKind by IWQ</p>

            <ul>
                <li><NuxtLink to="/faq">FAQ</NuxtLink></li>
                <li><NuxtLink to="/contact">Kontakt</NuxtLink></li>
                <li><NuxtLink to="/impressum">Impressum</NuxtLink></li>
                <li><NuxtLink to="/datenschutz">Datenschutz</NuxtLink></li>
            </ul>
        </div>
    </footer>
</template>

<script setup>

</script>

<style lang="scss" scoped>
    .footer {
        background-color: darken($light, 5%);
        padding: 20px $paddingBig;

        &-wrapper {
            @include flexMe(space-between, center);
            width: 100%;
            max-width: $maxWidth;
            margin-left: auto;
            margin-right: auto;

            & > p {
                font-weight: bold;
            }

            ul {
                margin: 0;
                padding: 0;

                li {
                    display: inline-block;

                    a {
                        padding: 5px 20px;
                        color: $dark;
                        cursor: pointer;

                        &:hover {
                            color: $primary;
                        }
                    }
                }
            }
        }
    }

    @media screen and (max-width: 1025px) {
        .footer {
            padding-left: $paddingMedium;
            padding-right: $paddingMedium;
        }
    }

    @media screen and (max-width: 769px) {
        .footer {
            padding-left: $paddingSmall;
            padding-right: $paddingSmall;

            &-wrapper {
                @include flexMe(center);
                flex-direction: column; 
                gap: 15px;

                ul {

                    li {

                        a {
                            padding: 10px 15px;
                        }
                    }
                }
            }
        }
    }

</style>