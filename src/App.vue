<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useUser } from '@/stores/user'
import { watch } from 'vue';

const state = useUser();

// 当用户信息发生变化更新数据
watch(() => state.user, () => {
  window.sessionStorage.setItem("user", JSON.stringify(state.user));
});

// 当前在线人数
window.socket.on("online", (res:any) => {
  state.online = res.count;
  if(res.user.uuid === state.user.uuid) state.user.online = res.user.online;
})
</script>

<template>
  <RouterView />
</template>
