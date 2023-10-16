<script setup>
const { $directus } = useNuxtApp()
const fetchJobs = async () => {
    return await $directus.items('Jobs').readByQuery({
        fields: ['*.*'],
    })
}

const jobs = ref(await fetchJobs())
</script>

<template>
<div>
    <h1>Jobs</h1>
    <p>Hier werden alle jobs gerendert</p>
    {{ jobs }}
</div>
</template>

<style scoped lang="scss">

</style>