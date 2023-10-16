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
          <h2 class="h3">Super, das hat geklappt! Der Matchingprozess wird nun gestartet.</h2>
          <p class="maximizer-medium mcenter">Wir benachrichtigen Sie, sobald wir passende Talente für Ihre Stelle gefunden haben.</p>
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

  const fillLanguageArrray = () => {
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
  fillLanguageArrray()

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
      id: "1.1",
      type: QuestionType.MultipleChoice,
      multiple: false,
      requred: true,
      title: "Welche Art der Arbeit suchst Du?",
      options: [
        new ChoiceOption({
          label: 'Vollzeit',
        }),
        new ChoiceOption({
          label: 'Teilzeit',
        }),
        new ChoiceOption({
          label: 'Minijob',
        }),
        new ChoiceOption({
          label: 'Praktikum',
        }),
      ]
    }),
    new QuestionModel({
      id: "1.2",
      title: "Ab wann könntest du in einen neuen Job starten?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: [
        new ChoiceOption({
          label: "ab sofort"
        }),
        new ChoiceOption({
          label: "in 4 Wochen"
        }),
        new ChoiceOption({
          label: "in 3 Monaten oder später "
        }),
      ]
    }),
    new QuestionModel({
      id: "1.3",
      title: "Wie soll deine Arbeitszeit gestaltet sein?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: [
        new ChoiceOption({
          label: "fest"
        }),
        new ChoiceOption({
          label: "flexibel"
        }),
      ]
    }),
    new QuestionModel({
      id: "1.4",
      title: "Bist du bereit für Schichtarbeit und/oder Wochenendarbeit?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: [
        new ChoiceOption({
          label: "Ja"
        }),
        new ChoiceOption({
          label: "Nein"
        }),
      ]
    }),
    new QuestionModel({
      id: "1.5",
      title: "Auf welche Extras legst du (besonderen) wert?",
      type: QuestionType.MultipleChoice,
      multiple: true,
      required: true,
      options: [
        new ChoiceOption({
          label: "Bahnticket"
        }),
        new ChoiceOption({
          label: "kostenloser Parkplatz"
        }),
        new ChoiceOption({
          label: "Diensthandy"
        }),
        new ChoiceOption({
          label: "Fort-/ Weiterbildungen"
        }),
      ]
    }),
    new QuestionModel({
      id: "2.1",
      title: "Bist du bereit umzuziehen?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      required: true,
      options: [
        new ChoiceOption({
          label: "Ja"
        }),
        new ChoiceOption({
          label: "Egal"
        }),
        new ChoiceOption({
          label: "Nein"
        }),
      ],
      jump: {
        Ja: '2.1.1',
        _other: '2.2'
      }
    }),
    new QuestionModel({
      id: "2.1.1",
      title: "Hast du einen Wunschort?",
      type: QuestionType.MultipleChoice,
      multiple: false,
      options: [
        new ChoiceOption({
          label: "Auswahl (20 größten Städte)"
        }),
        new ChoiceOption({
          label: "Anderer Ort",
          value: "freetext"
        }),
        new ChoiceOption({
          label: "Egal"
        }),
      ],
      jump: {
        freetext: '2.1.2',
        _other: '2.2',
      }
    }),
    new QuestionModel({
      id: "2.1.2",
      title: "Gib hier den Ort ein, an den Du umziehen würdest.",
      type: QuestionType.Text,
      jump: () => {
        return "2.2"
      }
    }),
    new QuestionModel({
      id: "2.2",
      title: "Wie weit soll dein Arbeitsort maximal von deinem Wohnort entfernt sein?",
      type: QuestionType.MultipleChoice,
      required: true,
      multiple: false,
      options: [
        new ChoiceOption({
          label: "Umkreis 20km"
        }),
        new ChoiceOption({
          label: "Umkreis 50km"
        }),
        new ChoiceOption({
          label: "Umkreis 100km und mehr"
        }),
        new ChoiceOption({
          label: "Nach Absprache"
        })
      ]
    }),
    new QuestionModel({
      id: "2.3",
      title: "Bist du bereit auch von Zuhause aus zu arbeiten?",
      type: QuestionType.MultipleChoice,
      required: true,
      multiple: false,
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
      id: "3",
      title: "In welchem Bereich möchtest du arbeiten?",
      type: QuestionType.MultipleChoice,
      required: true,
      multiple: true,
      options: jobFields.value
    }),
    new QuestionModel({
      id: "4.1",
      title: "Ist dir die Größe des Unternehmens wichtig?",
      type: QuestionType.MultipleChoice,
      required: true,
      multiple: false,
      options: [
        new ChoiceOption({
          label: "Ja"
        }),
        new ChoiceOption({
          label: "Nein"
        }),
      ]
    }),
    new QuestionModel({
      id: "4.2",
      title: "Welche Unternehmensgröße wünscht du dir?",
      type: QuestionType.MultipleChoice,
      required: true,
      multiple: false,
      options: [
        new ChoiceOption({
          label: "bis 20 Mitarbeiter"
        }),
        new ChoiceOption({
          label: "bis 100 Mitarbeiter"
        }),
        new ChoiceOption({
          label: "über 100 Mitarbeiter"
        }),
      ]
    }),
    new QuestionModel({
      id: "5.1",
      title: "Hast du einen Schulabschluss?",
      type: QuestionType.MultipleChoice,
      required: true,
      multiple: false,
      options: [
        new ChoiceOption({
          label: "Ja",
          value: "ja"
        }),
        new ChoiceOption({
          label: "Nein",
          value: "nein"
        })
      ],
      jump: {
        ja: "5.1.1",
        nein: "5.2",
      }
    }),
    new QuestionModel({
      id: "5.1.1",
      title: "Was ist dein höchster Schulabschluss?",
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
        })
      ]
    }),
    new QuestionModel({
      id: "5.2",
      title: "Hast du eine Ausbildung oder Studium?",
      type: QuestionType.MultipleChoice,
      options: [
        new ChoiceOption({
          label: "Ja",
          value: "ja"
        }),
        new ChoiceOption({
          label: "Nicht abgeschlossen",
          value: "not_completed"
        }),
        new ChoiceOption({
          label: "Nein",
          value: "nein"
        })
      ],
      jump: {
        nein: "5.3",
        _other: "5.2.1",
      }
    }),
    new QuestionModel({
      id: "5.2.1",
      title: "Name der Ausbildung oder des Studiums",
      type: QuestionType.Text,
      jump: () => {
        return "5.2.2"
      }
    }),
    new QuestionModel({
      id: "5.2.2",
      title: "Wie würdest du beschreiben was Du in deiner Ausbildung getan hast? Was hat dir am meisten gefallen? (Bsp: Verkauf, handwerkliche Tätigkeiten, Kommunikation, Adminsitration etc.)",
      subtitle: "Mit Komma separieren",
      type: QuestionType.LongText,
      jump: () => {
        return "5.2.3"
      }
    }),
    new QuestionModel({
      id: "5.2.3",
      title: "Hast du noch eine weitere Ausbildung oder ein weiteres Studium, welche(s) du hinzufügen möchtest? (max 4)",
      subtitle: "Maximal 4 | Mit Komma separieren",
      type: QuestionType.Text,
    }),
    new QuestionModel({
      id: "5.3",
      title: "Hast du Berufserfahrung?",
      type: QuestionType.MultipleChoice,
      required: true,
      multiple: false,
      options: [
        new ChoiceOption({
          label: "Ja",
          value: "ja"
        }),
        new ChoiceOption({
          label: "Nein",
          value: "nein"
        })
      ],
      jump: {
        ja: "5.3.1",
        nein: "5.4",
      }
    }),
    new QuestionModel({
      id: "5.3.1",
      title: "Wie viel Berufserfahrung hast du?",
      type: QuestionType.MultipleChoice,
      multiple: false,
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
      ]
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