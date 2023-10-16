<template>
  <div class="request">
    <div class="request-image" :style="`background-image: url('${request.author.img}');`"></div>
    <div class="request-body">
      <div class="request-head">
        <div>
          <p class="requester">{{ request.author.name }} von {{ request.author.company }}</p>
          <p class="request-position">{{ request.author.position }}</p>
        </div>

        <p class="request-date">Anfrage vom {{ request.date }}</p>
      </div>

      <p class="request-message truncate-2">"{{ request.message }}"</p>

      <div class="custom-button-holder align_right">
        <NuxtLink class="custom-button small" :to="`/request/${request.id}`">Anfrage ansehen</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>

  const { request } = defineProps(['request'])

</script>

<style lang="scss" scoped>

  .request {
    @include shadow;
    @include flexMe(flex-start);
    gap: 20px;
    width: 100%;
    max-width: 960px;
    padding: 20px;
    background-color: white;
    text-align: left;


    &-body {
      flex: 1;

      p {
        margin: 0;
      }

      .custom-button {
        margin-top: $paddingSmall;
      }
    }

    &-date {
      font-style: italic;
    }

    &-head {
      @include flexMe(space-between, flex-start);
      margin-bottom: 20px;
    }

    &-image {
      @include box(50px);
      @include bg(false, cover);
      border-radius: 50px;
    }

    &-message {
      font-weight: 600;
    }

    &-position {
      font-style: italic;
      opacity: 0.5;
    }

    &er {
      font-weight: bold;
      color: darken($primary, 20%);
    }
  }

  @media screen and (max-width: 768px) {
    .request {
      
      &-head {
        flex-direction: column;
        gap: 10px;
      }

      &-image {
        @include box(70px);
        border-radius: 5px;
        margin-left: -30px;
      }

      .custom-button-holder {
        justify-content: flex-start;
      }
    }
  }

</style>