<template>
  <main>
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useRouter } from "vue-router";

const router = useRouter();
onMounted(() => router.push("/"));
</script>
