<script setup>
import {ChoiceOption, FlowForm, LanguageModel, QuestionModel, QuestionType} from '~/components/FlowForm'
import {useAuth} from "~/store/auth";

const props = defineProps({
  collection: String,
  langModel: {
    type: Object,
    required: true
  },
  jobId: Number,
})

const auth = useAuth()
const emit = defineEmits(['update:answers'])
const {$directus} = useNuxtApp()
const flowFormRef = ref(null)

const extractAfterUnderscore = (str) => {
  if (!str) {
    console.warn("Error during attribute extraction: ", str)
    return ""
  }
  const index = str.indexOf("_");
  if (index !== -1) {
    return str.substring(index + 1);
  } else {
    return str;
  }
}

const fetchLanguages = async () => {
  console.log("fetching languages")
  try {
    const response = await $directus.items('Sprachen').readByQuery({
      fields: ['id', 'Sprache', 'Abkuerzung'],
      limit: -1
    })
    return response.data.map(language => {
      return {
        value: language.id,
        label: language.Sprache
      }
    })
  } catch (e) {
    console.error(e)
  }
}
const fetchBerufe = async () => {
  try {
    const response = await $directus.items('Berufe').readByQuery({
      fields: ['id', 'Berufsbezeichnung'],
      limit: -1
    })
    return response.data.map(beruf => {
      return {
        value: beruf.id,
        label: beruf.Berufsbezeichnung
      }
    })
  } catch (e) {
    console.error(e)
  }
}
const fetchQuestions = async () => {
  const response = await auth.fetchData(props.collection, {
    fields: [
      'Rubriken.Rubriken_id.Fragen.Fragen_id.*,Rubriken.Rubriken_id.Fragen.Fragen_id.Antworten.Antworten_id.*',
      'Rubriken.Rubriken_id.Fragen.Fragen_id.Attribut.*'
    ],
  });

  const questions = response.data.Rubriken.flatMap(rubrik => rubrik.Rubriken_id.Fragen);

  for (const question of questions) {
    if (question.Fragen_id.Antwort_Art === 'api' || question.Fragen_id.Antwort_Art === 'combobox') {
      if (question.Fragen_id.Collection_API === 'Sprachen') {
        question.Fragen_id.Antworten = await fetchLanguages();
      }
      if (question.Fragen_id.Collection_API === 'Berufe') {
        question.Fragen_id.Antworten = await fetchBerufe();
      } else {
        console.warn('No API defined for question', question)
        // TODO: check if this can work for all collections
        /*
        const response = await $directus.items(question.Fragen_id.Collection_API).readByQuery({
          fields: ['id', question.Fragen_id.Collection_Attribut],
          limit: -1
        })
        question.Fragen_id.Antworten = response.data.map(item => {
          return {
            value: item.id,
            label: item[question.Fragen_id.Collection_Attribut]
          }
        })
         */
      }
    }
  }
  console.log(questions)
  return questions;
};

const onAnswer = (data) => {
  const options = data.options
  const answer = data.answer
  if (options) {
    const foundOption = options.find(option => option.value === answer)
    if (foundOption && foundOption.skip) {
      delay(100).then(() => {
        flowFormRef.value.goToNextQuestion();
      })
    }
  }
}

const mapToQuestionModel = (questionData) => {
  const typeMapping = {
    Text: QuestionType.Text,
    LongText: QuestionType.LongText,
    Number: QuestionType.Number,
    MultipleChoice: QuestionType.MultipleChoice,
    Date: QuestionType.Date,
    api: QuestionType.Dropdown,
    combobox: QuestionType.AutoComplete
  };

  return new QuestionModel({
    id: questionData.id.toString(),
    title: questionData.Frage,
    directusAttribute: extractAfterUnderscore(questionData.Attribut.Attribut_Value),
    multipleAllowed: questionData.multiple_allowed,
    type: typeMapping[questionData.Antwort_Art],
    relation: questionData.Antwort_Art === 'api' || questionData.Antwort_Art === 'combobox' ? questionData.Collection_API : undefined,
    required: questionData.required,
    options: ['MultipleChoice', 'api', 'combobox'].includes(questionData.Antwort_Art)
      ? questionData.Antworten.map(answer => {
        const answerObj = questionData.Antwort_Art === 'api' || questionData.Antwort_Art === 'combobox' ? answer : answer.Antworten_id;
        let value, label;
        let collectionId;
        if (questionData.Antwort_Art === 'api' || questionData.Antwort_Art === 'combobox') {
          value = answerObj.value;
          label = answerObj.label;
          collectionId = questionData.Collection_API;
        }
        else if (questionData.Attribut.Attribut_Value === 'skill') {
          value = answerObj.id;
          label = answerObj.Antwort;
        } else {
          // TODO: check if this can work for all collections
          value = answerObj.Antwort
          label = answerObj.Antwort;
          collectionId = undefined; // collectionId is undefined for non-'api' questions
        }
        return new ChoiceOption({
          label: label,
          value: value,
          skip: answerObj.skip,
          collectionId: collectionId
        });
      })
      : undefined,
    ratings: questionData.Bewertung ? questionData.Bewertungen : undefined,
    multiple: questionData.multiple_allowed
  });
};

const mapToFetchedQuestions = (response) => {
  // Extract all Fragen from each Fragen_id object
  const allFragen = response.map(rubrik => rubrik.Fragen_id);
  // Map each Frage to a QuestionModel
  const mappedQuestion = allFragen.map(mapToQuestionModel);
  console.log('mapped', mappedQuestion)
  return mappedQuestion;
}


const fetchJob = async () => {
  const response = await $directus.items('Jobs').readByQuery({
    fields: [
      '*.*',
      'Unternehmen_und_Standort.*'
      //'Job.*',
      //'Job.Passende_Talente.*',
    ],
    filter: {
      id: {
        _eq: props.jobId
      }
    }
  })
  return response.data[0];
}

const fetchJobsAntworten = async () => {
  const response = await $directus.items('Jobs_Antworten').readByQuery({
    fields: [
      '*.*',
      'Antworten.Antworten_id.*'
    ],
    filter: {
      Job: {
        id: {
          _eq: props.jobId
        }
      }
    }
  })
  return response.data[0];
}

const prefillAnswersFromJob = async () => {
  const jobData = await fetchJob();
  // const skills = await fetchJobsAntworten();
  for (let jobAttribute in jobData) {
    // find the question with the same name as the job attribute
    const question = questions.find(question => question.directusAttribute === jobAttribute);
    // paste the value of the job attribute into the answer of the question with the same name
    // but only if the value is not empty
    if (question && jobData[jobAttribute]) {
      question.answer = jobData[jobAttribute];
    }
  }
  // TODO: check if this can work or if we need to add a new attribute for skills for recognition
  /*
  if (skills) {
    const skillQuestion = questions.find(question => question.directusAttribute === 'skill');
    if (skillQuestion) {
      skillQuestion.answer = skills.Antworten.map(antwort => antwort.Antworten_id.id);
    }
  }

   */
}

const fetchedQuestions = await fetchQuestions()
const questions = mapToFetchedQuestions(fetchedQuestions)
// preflll if jobId is given
if (props.jobId) await prefillAnswersFromJob()

const submit = async (data) => {
  console.log(data)
  emit('update:answers', data)
}


const language = new LanguageModel(props.langModel)

</script>

<template>
  <div class="questions-container">
    <flow-form
      ref="flowFormRef"
      :navigation="false"
      v-bind:questions="questions"
      v-bind:language="language"
      v-bind:navigation="true"
      v-bind:standalone="false"
      @answer="onAnswer($event)"
      @submit="submit($event)"
    ></flow-form>
  </div>
</template>

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

        &-arrow-down {
          display: none;
        }

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
          text-align: left;
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