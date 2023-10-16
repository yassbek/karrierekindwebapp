<template>
  <div>
    <MatchingQuestionsTalent v-if="type === 'talent'"/>
    <MatchingQuestionsCompany v-if="type === 'company'"/>

    <button @click="type = type === 'talent' ? 'company' : 'talent'">Switch Views</button>
  </div>
</template>


<script setup>
  const route = useRoute()
  const router = useRouter()
  const type = ref( route.query.type ? route.query.type : 'talent' )

  watch(type, (type, previous) => {
    router.push({
      path: '/questions',
      query: { type: type },
    })
  })

</script>


<style lang="scss" scoped>

</style>