<template>
  <div
    class="border-shadow flex h-16 w-full basis-full items-center bg-white lg:h-20"
  >
    <div class="my-6 flex w-full justify-between px-5 lg:px-32">
      <div class="flex flex-row items-center justify-start">
        <div class="flex h-6 flex-row justify-start lg:h-8">
          <img src="../assets/dpa-id-logo.svg" alt="dpa-ID" />
        </div>
      </div>
      <div class="flex h-6 flex-row items-center justify-end lg:h-8">
        <DpaIdAppswitcher
          stage="devel"
          overlay-top="12px"
          class="mr-2 items-center"
        />
        <DpaIdUsericon
          v-if="isAuthenticated"
          class="m-1"
          :client-id="AUTH0_CLIENT_ID"
          :firstname="auth0.user.value?.name"
          :img-url="
            auth0.user.value?.picture ? auth0.user.value?.picture : undefined
          "
          :initials="auth0.user.value?.initials"
          :lastname="auth0.user.value?.lastName"
          :overlay-right="'-7px'"
          :overlay-top="'16px'"
          :size="32"
          stage-useradmin="dev"
          stage-auth0="dev"
          @logout="logoutFunction"
        ></DpaIdUsericon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  DpaIdAppswitcher,
  DpaIdUsericon,
} from "@dpa-it/dpa-id-partner-components-vue";
import { useAuth0 } from "@auth0/auth0-vue";
import { computed } from "vue";

const AUTH0_CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID;
const auth0 = useAuth0();

const isAuthenticated = computed(() => {
  return !auth0.isLoading ? false : auth0.isAuthenticated.value;
});

const logoutFunction = async () => {
  await auth0.logout({ logoutParams: { returnTo: window.location.origin } });
};
</script>
<style>
.border-shadow {
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
}
</style>
