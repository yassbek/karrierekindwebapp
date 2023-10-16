<template>
  <div>
    <div class="questions-container">
      <flow-form
        ref="form"
        v-bind:questions="questions"
        v-bind:language="language"
        v-bind:navigation="true"
        v-bind:standalone="false"
        @submit="submitQuestions"        
      ></flow-form>

      <div v-show="submitSuccess" style="text-align: center;">
          <h2 class="h3">Fast am Ziel!</h2>
          <p class="maximizer-medium mcenter">Der Matchingprozess kann gleich gestartet werden. Nur noch die Anfrage abschicken und los gehts.</p>
        </div>
    </div>
  </div>
</template>


<script setup>
  import { FlowForm, QuestionModel, QuestionType, ChoiceOption, LanguageModel } from '@ditdot-dev/vue-flow-form'

  const submitSuccess = ref(false)
  const jobFields = ref([])
  const languages = ref([])

  const getJobFields = async () => {
    const options = [
      new ChoiceOption({
        label: "Handwerk"
      }),
      new ChoiceOption({
        label: "Office"
      }),
      new ChoiceOption({
        label: "Manager"
      }),
      new ChoiceOption({
        label: "Fernfahrer"
      }),
    ]

    // TODO: Get job fields from directus and push to options

    options.forEach(option => jobFields.value.push(option))
  }
  await getJobFields()

  const fillLanguageArrray = async () => {
    const langs = [
      'Afrikaans',
      'Arabisch',
      'Bulgarisch',
      'Chinesisch',
      'Dari',
      'Deutsch',
      'Englisch',
      'Französisch',
      'Griechisch',
      'Hindi',
      'Italienisch',
      'Portugiesisch',
      'Kurdisch',
      'Niederländisch',
      'Persisch',
      'Polnisch',
      'Rumänisch',
      'Russisch',
      'Spanisch',
      'Tamilisch',
      'Thailändisch',
      'Tigrinja',
      'Tschechisch',
      'Türkisch',
      'Ukrainisch',
      'Vietnamesisch',
    ] // TODO: Languages from directus

    langs.forEach( lang => languages.value.push(new ChoiceOption({label: lang})) )
  }
  await fillLanguageArrray()

  const submitQuestions = () => {
    const data = []

    questions.value.forEach(question => {
      if( question.title ) {
        let answer = question.answer

        if( Array.isArray(answer) ) {
          answer = answer.join(', ')
        }

        data.push({question: question.title, answer: answer})
      }
    })

    // TODO: Send data to database
  }

  const questions = ref([
    new QuestionModel({
      id: "1",
      title: "In welchem Bereich ist Ihr Unternehmen tätig?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: jobFields.value,
    }),
    new QuestionModel({
      id: "2.1",
      title: "Welches Beschäftigungsverhältnis bieten Sie an?",
      type: QuestionType.MultipleChoice,
      multiple: true,
      required: true,
      options: [
        new ChoiceOption({
          label: "Vollzeit"
        }),
        new ChoiceOption({
          label: "Teilzeit"
        }),
        new ChoiceOption({
          label: "Minijob"
        }),
        new ChoiceOption({
          label: "Praktikum"
        }),
        new ChoiceOption({
          label: "nach Absprache"
        })
      ]
    }),
    new QuestionModel({
      id: "2.2",
      title: "Wie viele Mitarbeiter suchen Sie?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: [
        new ChoiceOption({
          label: "1"
        }),
        new ChoiceOption({
          label: "2 - 5"
        }),
        new ChoiceOption({
          label: "6 - 10"
        }),
        new ChoiceOption({
          label: "über 10"
        })
      ]
    }),
    new QuestionModel({
      id: "2.3",
      title: "Ist die Stelle befristet?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: [
        new ChoiceOption({
          label: "Ja"
        }),
        new ChoiceOption({
          label: "Nein"
        })
      ]
    }),
    new QuestionModel({
      id: "2.4",
      title: "Gibt es ein Einstiegsdatum/ Eintrittstermin?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: [
        new ChoiceOption({
          label: "Ja",
          value: "ja"
        }),
        new ChoiceOption({
          label: "Ab sofort"
        })
      ],
      jump: {
        ja: "2.4.1",
        _other: "2.5"
      }
    }),
    new QuestionModel({
      id: "2.4.1",
      title: "Bitte tragen Sie das / den frühstmögliche(n) Einstiegsdatum / Eintrittstermin ein.",
      type: QuestionType.Date,
      placeholder: 'Datumsformat: tt/mm/yyyy (Beispiel: 13.05.2023)'
    }),
    new QuestionModel({
      id: "2.5",
      title: "Welche Arbeitszeiten hat die Beschäftigung?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: [
        new ChoiceOption({
          label: "flexible Arbeitszeiten"
        }),
        new ChoiceOption({
          label: "feste Arbeitszeiten"
        }),
        new ChoiceOption({
          label: "Schichtsystem"
        }),
        new ChoiceOption({
          label: "Wochenendarbeit"
        }),
      ]
    }),
    new QuestionModel({
      id: "3.1",
      title: "Entspricht der Arbeitsort einem der Orte den Sie im Profil hinterlegt haben?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: [
        new ChoiceOption({
          label: "Ja",
          value: "ja"
        }),
        new ChoiceOption({
          label: "Nein",
          value: "nein"
        }),
      ],
      jump: {
        ja: "3.2",
        nein: "3.1.1"
      }
    }),
    new QuestionModel({
      id: "3.1.1",
      title: "Bitte geben Sie die Adresse ein",
      type: QuestionType.Text,
    }),
    new QuestionModel({
      id: "3.2",
      title: "Gibt es Reisetätigkeiten?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: [
        new ChoiceOption({
          label: "Ja",
        }),
        new ChoiceOption({
          label: "Nein",
        }),
      ]
    }),
    new QuestionModel({
      id: "3.3",
      title: "Ist Home- bzw. Remotearbeit möglich?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: [
        new ChoiceOption({
          label: "Ja",
        }),
        new ChoiceOption({
          label: "Nein",
        }),
      ]
    }),
    new QuestionModel({
      id: "4.1",
      title: "Wie viele Mitarbeiter hat Ihr Unternehmen?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: [
        new ChoiceOption({
          label: "bis 20 Mitarbeiter",
        }),
        new ChoiceOption({
          label: "bis 100 Mitarbeiter",
        }),
        new ChoiceOption({
          label: "über 100 Mitarbeiter",
        }),
      ]
    }),
    new QuestionModel({
      id: "4.2",
      title: "Welche Werte vertritt Ihr Unternehmen?",
      type: QuestionType.MultipleChoice,
      multiple: true,
      required: true,
      max: 3,
      options: [
        new ChoiceOption({
          label: "Familienfreundlich",
        }),
        new ChoiceOption({
          label: "Wertschätzend",
        }),
        new ChoiceOption({
          label: "Sozialer Arbeitgeber",
        }),
        new ChoiceOption({
          label: "Kollegial und teamorientiert",
        }),
      ]
    }),
    new QuestionModel({
      id: "5.1",
      title: "Wird ein Schulabschluss benötigt?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: [
        new ChoiceOption({
          label: "Ja",
          value: "ja",
        }),
        new ChoiceOption({
          label: "Nein",
          value: "nein",
        }),
      ],
      jump: {
        ja: "5.1.1",
        nein: "5.2",
      }
    }),
    new QuestionModel({
      id: "5.1.1",
      title: "Welcher Schulabschluss wird benötigt?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      options: [
        new ChoiceOption({
          label: "Hauptschulabschluss"
        }),
        new ChoiceOption({
          label: "Realschulabschluss"
        }),
        new ChoiceOption({
          label: "Fachabitur"
        }),
        new ChoiceOption({
          label: "Abitur"
        }),
        new ChoiceOption({
          label: "Anderer Abschluss? z.B. im Ausland"
        }),
      ]
    }),
    new QuestionModel({
      id: "5.2",
      title: "Ist ein Ausbildungs-abschluss oder Studium erforderlich?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: [
        new ChoiceOption({
          label: "Ja",
          value: "ja"
        }),
        new ChoiceOption({
          label: "Nein",
          value: "nein"
        }),
      ],
      jump: {
        ja: "5.2.1",
        nein: "5.3",
      }
    }),
    new QuestionModel({
      id: "5.2.1",
      title: "Welche Ausbildung oder welches Studium wird benötigt?",
      type: QuestionType.Text,
      placeholder: "Name der Ausbildung",
      jump: () => {
        return "5.2.2"
      }
    }),
    new QuestionModel({
      id: "5.2.2",
      title: "Wie würden Sie beschreiben was Ihr zukünftiges Talent in der Ausbildung getan haben sollte? Was soll Ihrem zukünftigen Talent am meisten gefallen haben?",
      subtitle: "(Bspw.: Verkauf, handwerkliche Tätigkeiten, Kommunikation, Administration, etc.)",
      type: QuestionType.LongText,
      jump: () => {
        return "5.3"
      }
    }),
    new QuestionModel({
      id: "5.3",
      title: "Ist Berufserfahrung erforderlich?",
      type: QuestionType.MultipleChoice,
      required: true,
      options: [
        new ChoiceOption({
          label: "Ja",
          value: "ja",
        }),
        new ChoiceOption({
          label: "Nein",
          value: "nein",
        }),
      ],
      jump: {
        ja: "5.3.1",
        nein: "5.4",
      }
    }),
    new QuestionModel({
      id: "5.3.1",
      title: "Wie viel Berufserfahrung wird benötigt?",
      type: QuestionType.MultipleChoice,
      options: [
        new ChoiceOption({
          label: "weniger als 1 Jahr"
        }),
        new ChoiceOption({
          label: "über 1 Jahr"
        }),
        new ChoiceOption({
          label: "mehr als 3 Jahre"
        }),
      ],
      jump: () => {
        return "5.3.2"
      }
    }),
    new QuestionModel({
      id: "5.3.2",
      title: "Was soll ihrem zukünftigen Talent von den bisherigen Tätigkeiten am meisten Spaß gemacht haben?",
      subtitle: "(Bsp. Verkauf, Warenpräsentation, handwerkliche Tätigkeiten, Warenannahme, mit Menschen arbeiten, Kundenkontakt, Teamarbeit)",
      type: QuestionType.Text,
      jump: () => {
        return "5.4"
      }
    }),
    new QuestionModel({
      id: "5.4",
      title: "Welche Sprachkenntnisse hast du?",
      type: QuestionType.MultipleChoice,
      options: languages.value,
      multiple: true
    }),
    new QuestionModel({
      id: "5.4.1",
      title: "Welches Sprachlevel hast Du?",
      type: QuestionType.MultipleChoice,
      options: [
        new ChoiceOption({
          label: "Grundkenntnisse"
        }),
        new ChoiceOption({
          label: "Gut"
        }),
        new ChoiceOption({
          label: "Sehr gut"
        }),
      ]
    })
  ])

  const language = new LanguageModel({
    enterKey: 'Enter',
    shiftKey: 'Umschalt',
    ok: 'Weiter',
    continue: 'Weiter',
    skip: 'Überspringen',
    pressEnter: 'Drücke :enterKey',
    multipleChoiceHelpText: 'Wähle so viele wie Du möchtest',
    multipleChoiceHelpTextSingle: 'Wähle nur eine Antwort',
    otherPrompt: 'Andere',
    placeholder: 'Gib hier Deine Antwort ein...',
    submitText: 'Ergebnise abschicken',
    longTextHelpText: ':shiftKey + :enterKey für einen Zeilenumbruch.',
    prev: 'Zurück',
    next: 'Weiter',
    percentCompleted: ':percent% abgeschlossen',
    invalidPrompt: 'Bitte fülle das Feld korrekt aus',
    thankYouText: 'Vielen Dank!',
    successText: 'Angaben wurden erfolgreich abgeschickt.',
    ariaOk: 'Drücke zum Fortfahren',
    ariaRequired: 'Dieser Schritt ist erforderlich',
    ariaPrev: 'Vorheriger Schritt',
    ariaNext: 'Nächster Schritt',
    ariaSubmitText: 'Drücke zum Absenden',
    ariaMultipleChoice: 'Drücke :letter zum Auswählen',
    ariaTypeAnswer: 'Gib hier Deine Antwort ein',
    errorAllowedFileTypes: 'Ungültiger Dateityp. Erlaubte Dateitypen: :fileTypes.',
    errorMaxFileSize: 'Datei(en) zu groß. Maximale Dateigröße: :size.',
    errorMinFiles: 'Zu wenige Dateien hinzugefügt. Mindestanzahl erlaubter Dateien: :min.',
    errorMaxFiles: 'Zu viele Dateien hinzugefügt. Maximale Anzahl erlaubter Dateien: :max.'
  })

</script>


<style lang="scss" scoped>
  .questions {

    &-container {
      width: 100%;
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      padding: $paddingMedium;
      background-color: $primaryLight;
      margin-top: $paddingMedium;
      border-radius: 5px;

      :deep() {

        .q {

          &-is-inactive {
            display: none;
          }
        }

        .f {

          &-answer {
            margin-top: 10px;
            
            input[type="text"],
            input[type="email"],
            input[type="tel"],
            input[type="date"],
            input[type="number"],
            input[type="time"],
            input[type="datetime"],
            input[type="password"],
            select,
            textarea {
              @include font;
              border: none;
              border-bottom: 3px solid rgba($dark, .1);
              background: none;
              display: block;
              margin-bottom: 20px;
              height: 50px;
              padding: 0 20px;
              outline: none !important;
              width: 100%;
              max-width: 640px;

              &:focus {
                border-color: $primary;
              }
            }

            textarea {
              min-height: 150px;
              background: rgba($dark, .05);
              padding: 20px;
            }
          }

          &-enter {
            @include flexMe(flex-start, center);
            gap: $paddingSmall;
            margin-top: $paddingSmall;

            &-desc {
              font-size: 14px;
              font-weight: 600;
              color: rgba($dark, .5);
            }
          }

          &-fade-in-up {
            opacity: 0;
            animation: 1s fadeUp ease forwards;
          }

          &-help {
            font-size: 14px;
            color: rgba($dark, .5);
            font-style: italic;
          }

          &-label {

            &-wrap {

              .f-key {
                margin-right: 5px;

                &:after {
                  content: ":"
                }
              }
            }
          }

          &-nav {
            @include flexMe(flex-start);
            margin-top: 30px;
            gap: 30px;

            .f-prev, .f-next {
              
              svg {
                height: 12px;
                width: auto;
                margin-right: 10px;

                path, polygon {
                  fill: $dark;
                }
              }
            }

          }

          &-progress-bar {
            height: 5px;
            background-color: rgba($dark, .1);
            margin-bottom: 5px;
            border-radius: 10px;
            overflow: hidden;

            &-inner {
              @include trans;
              background-color: $primary;
              height: 5px;
            }
          }

          &-radio {

            &s {
              @include flexMe(flex-start);
              gap: 20px;
              padding: 0;
              margin: 0;
              margin-top: $paddingSmall;

              li {
                @include trans;
                padding: $paddingSmall;
                border: 1px solid rgba($dark, .2);
                border-radius: 5px;
                min-width: 150px;
                text-align: center;
                cursor: pointer;
                font-weight: bold;
                word-wrap: break-word;
                hyphens: auto;
                -webkit-hyphens: auto;

                &:hover {
                  color: white;
                  background-color:rgba($dark, .5);
                }

                &.f-selected {
                  @include shadow;
                  border-color: $primary;
                  background-color: $primary;
                  color: white;
                }
              }
            }
          }

          &-required {
            color: $primary;
            font-weight: bold;
          }

          &-sub {
            @include flexMe(flex-start);
            flex-direction: column;
            margin-top: 10px;
            gap: 5px;
            margin-bottom: 30px;
          }

          &-text {
            font-size: 24px;
            font-weight: 600;
            display: block;
          }
          
        }

        .field-submittype {

          .fh2 {
            font-weight: bold;
            font-size: 26px;
            line-height: 1.4em;
            margin-bottom: 30px;
            display: block;
          }

          .f-enter-desc {
            margin-left: 20px;
          }
        }
        
        .o {

          &-btn {

            &-action {
              @include font;
              cursor: pointer;
              border: none;
              padding: 10px 20px;
              font-size: 14px;
              line-height: 1em;
              text-align: center;
              border-radius: $borderRadius;
              background-color: $primary;
              color: white !important;
              transition: .5s ease;
              outline: none !important;
              text-transform: uppercase;
              border: 3px solid $primary;
              font-weight: bold;
          
              &:hover {
                background-color: lighten($primary, 10%);
                border-color: lighten($primary, 10%);
              }
          
              &:active {
                background-color: darken($primary, 10%);
                border-color: darken($primary, 10%);
              }
          
            } 
          }
        }

        .vff {

          &-footer {
            @include flexMe(flex-end);
            margin-top: $paddingMedium;
            text-align: right;
            font-size: 12px;
            line-height: 1em;
          }
        }

      }
    }
  }

  @media screen and (max-width: 768px) {

    .questions {
      
      &-container {
        padding: $paddingMedium $paddingSmall $paddingSmall;        
      }
    }
  }

  @media screen and (max-width: 500px) {

    .questions {

      &-container {

        :deep() {

          .f {

            &-answer {

              input[type=text], 
              input[type=email], 
              input[type=tel], 
              input[type=date], 
              input[type=number], 
              input[type=time], 
              input[type=datetime], 
              input[type=password], 
              select, 
              textarea {
                padding-left: 10px;
                padding-right: 10px;
              }
            }

            &-radio {
              
              &s {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 20px;

                li {
                  padding: 15px;
                }
              }
            }
            
            &-text {
              font-size: 20px;
            }
          }

          .field-submittype {
            @include flexMe(center);
            flex-direction: column;
            text-align: center;

            .f-enter-desc {
              margin: 10px 0 0;
            }
          } 
          
        }
      }
    }
  }

  @media screen and (max-width: 400px) {

    .questions {

      &-container {

        :deep() {
        
          .f {

            &-radios {
              display: block;

              li {
                margin-bottom: 10px;
                font-size: 14px;

                &:last-of-type {
                  margin-bottom: 0;
                }
              }
            }
          }
        }
      }
      
    }
  }
</style>