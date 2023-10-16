<template>
  <div class="iwq-container request-wrapper">

    <h1>Jemand interessiert sich für Dich!</h1>
    <p class="maximizer-medium mcenter">Wenn Du die Anfrage annimmst, kannst Du mit dem Unternehmen chatten. Wenn Du die Anfrage ablehnst, kann das Unternehmen Dich nicht kontaktieren.</p>

    <div class="request">

      <div class="request-box request-box-actions">
        <div class="request-box-actions-head">
          <h2 class="request-box-title">HubSpot Consultant (m/w/d)</h2>
          <p class="request-box-actions-head-date">13.05.23</p>
        </div>

        <div class="request-box-actions-body">
          <div class="request-box-actions-body-company">
            <div class="request-box-actions-body-company-image" style="background-image: url('/imgs/placeholder.webp');"></div>
            <p class="request-box-actions-body-company-infos">
              JUNGMUT GmbH <br>
              Hansaring 20, 50670 Köln <br>
              <a href="https://jungmut.com" target="_blank">www.jungmut.com</a>
            </p>
          </div>

          <div class="request-box-actions-body-buttons">
            <button class="custom-button secondary small" @click="declineRequest">Ablehnen</button>
            <button class="custom-button small" @click="accetpsRequest">Annehmen</button>
          </div>
        </div>
      </div>

      <div class="request-box request-box-teaser">
        <div>
          <h2 class="request-box-title">Interesse an einem Coaching?</h2>
          <p>Dann schauen Sie sich unsere aktuellen Coaching Angebote an</p>
        </div>
        <NuxtLink class="custom-button small" to="/coaching/11">zum Coaching</NuxtLink>
      </div>
      
      <div class="request-box">
        <h2 class="request-box-title">Infos zum Job</h2>
        <p class="request-box-description">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet</p>
        <br>
        <ul>
          <li>Lorem ipsum dolor sit amet, consetetur sadipscing elitr,</li>
          <li>sed diam nonumy eirmod tempor invidunt ut labore et</li>
          <li>dolore magna aliquyam erat, sed diam voluptua. At vero eos et</li>
          <li>accusam et justo duo dolores et ea rebum.</li>
          <li>Stet clita kasd gubergren, no sea takimata sanctus est</li>
          <li>Lorem ipsum dolor sit amet.</li>
        </ul>
      </div>

      <div class="request-box">
        <h2 class="request-box-title">Infos zum Unternehmen</h2>
        <p class="request-box-description">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet</p>
        
        <br>
        <br>
        <p><b>Benefits</b></p>
        <ul>
          <li>Lorem ipsum dolor sit amet, consetetur sadipscing elitr,</li>
          <li>sed diam nonumy eirmod tempor invidunt ut labore et</li>
          <li>dolore magna aliquyam erat, sed diam voluptua. At vero eos et</li>
          <li>accusam et justo duo dolores et ea rebum.</li>
          <li>Stet clita kasd gubergren, no sea takimata sanctus est</li>
          <li>Lorem ipsum dolor sit amet.</li>
        </ul>
      </div>

    </div>

  </div>

  <Modal v-if="modalOpen" @close="modalOpen = false">
    <h3>Bist Du sicher, dass Du die Anfrage ablehnen willst?</h3>
    <p>Wenn Sie ablehnen, kann es sein, dass das Unternehmen Sie zu einem späteren Zeitpunkt nicht mehr berücksichtigt</p>

    <ModalButtons>
      <button class="custom-button small" @click="modalOpen = false">zurück zur Anfrage</button>
      <button class="custom-button inverted small" @click="declineRequestFinal">Ablehnen</button>
    </ModalButtons>
  </Modal>
</template>


<script setup>

  const { id } = useRoute().params
  const params = useRoute().query
  const modalOpen = ref(false)

  function scanURLForActions() {
    if( !params.hasOwnProperty('action') || !params.hasOwnProperty('token') ) {
      return
    }

    if( params.action === 'accept' ) {
      accetpsRequest()
    }

    if( params.action === 'decline' ) {
      declineRequest()
    }
  }

  onMounted(() => {
    scanURLForActions()
  })

  function accetpsRequest() {
    console.log('accepted request with ID: ' + id)
  }

  function declineRequestFinal() {
    modalOpen.value = true
  }

  function declineRequest() {
    modalOpen.value = true
    console.log(`Declined`)
  }

  useHead({
    bodyAttrs: {
      class: computed(() => {
        return modalOpen.value ? 'noscroll' : '';
      })
    }
  })

</script>


<style lang="scss" scoped>

  .request {
    @include flexMe(center);
    flex-direction: column;
    gap: 15px;
    margin-top: $paddingMedium;

    &-box {
      padding: $paddingSmall;
      border-radius: 5px;
      background-color: darken($light, 5%);
      width: 100%;
      max-width: 960px;
      text-align: left;

      &-actions {

        &-body {

          &-company {
            @include flexMe(flex-start);
            gap: 15px;
            margin-bottom: 20px;
            
            p {
              margin: 0;
              font-weight: 600;
            }

            &-image {
              @include box(50px);
              @include shadow;
              @include bg(false, cover);
              border-radius: 50px;
            }
          }

          &-buttons {
            @include flexMe(flex-end, center);
            gap: 15px;
          }
        }

        &-head {
          @include flexMe(space-between, center);
          flex-wrap: nowrap;
          margin-bottom: $paddingSmall;

          &-date {
            margin-top: 0;
            font-style: italic;
            font-weight: 600;
          }

          p {
            margin: 0;
          }
        }
      }

      &-teaser {
        @include flexMe(space-between, center);
        flex-wrap: nowrap;
        gap: $paddingSmall;
        background-color: $primaryLight;
      }

      &-title {
        margin-top: 0;
        margin-bottom: 0 !important;
        font-size: 22px;
        color: darken($primary, 20%);
        line-height: 1.2em !important;
      }
    }

    &-wrapper {
      text-align: center;
    }

    ul {
      
      li {
        list-style-type: disc;
        margin-bottom: 5px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }
  }

  @media screen and (max-width: 1024px) {
    
    .request {

      &-box {

        &-teaser {
          flex-direction: column;
          text-align: center;
        }
      }
    }
  }


  @media screen and (max-width: 768px) {
    
    .request {

      &-box {

        &-actions {

          &-body {

            &-buttons {
              margin-top: 30px;
              justify-content: flex-end;
              flex-direction: row-reverse;
            }
          }

          &-head {
            flex-direction: column;
            align-items: flex-start;
            gap: 0;
          }
        }

        &-teaser {
          text-align: left;
          align-items: flex-start;
        }

        &-title {
          margin-bottom: 5px !important; 
        }
      }
    }
  }

  @media screen and (max-width: 500px) {
    .request {

      &-box {

        &-actions {

          &-body {

            &-buttons {
              flex-direction: column-reverse;
              align-items: flex-start;

              button {
                width: 100%;
              }
            }
          }
        }
      }
    }
  }

</style>