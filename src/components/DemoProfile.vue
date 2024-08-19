<template>
  <div
    v-if="isAuthenticated"
    class="mx-5 mt-20 flex min-h-[calc(100vh-180px)] flex-col pb-5 lg:mx-32 lg:mt-24 xl:pb-16"
  >
    <div class="flex flex-col gap-6 items-center rounded-2xl bg-white p-6 shadow-default">
      <h1>Hi, {{ user?.given_name }}!</h1>
      <h3 class="text-xl font-semibold">Your Profile</h3>
      <p>Name: {{ user?.given_name }} {{ user?.family_name }}</p>
      <p>Email: {{ user?.email }}</p>
      <UiButton rounded size="small" @click="callApi"
        >Call a BE endpoint using Access Token</UiButton
      >
      <h3 v-if="responseFromBE">Response: {{ responseFromBE }}</h3>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'
import { UiButton } from '@dpa-id-components/dpa-shared-components'
import axios from 'axios'
import { ref } from 'vue'

const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()
const accessToken = await getAccessTokenSilently()
const responseFromBE = ref<string>()

const axiosInstance = axios.create({
  baseURL: 'https://backend-demo.dpa-id.de/',
  headers: {
    'Content-type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  }
})

const callApi = async () => {
  const res = await axiosInstance.get('/authorization/v1/spa/hello-world')
  responseFromBE.value = res.data
}
</script>
