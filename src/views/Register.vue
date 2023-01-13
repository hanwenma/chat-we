<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUser } from "@/stores/user";
import type { Ueser } from "@/stores/user";

const placeholder = '请输入你的昵称!';

const router = useRouter();
const state = useUser();
const name = ref('');

window.socket.on('register', (newUser: Ueser) => {
  // 非首次注册，相当于登录
  if (!newUser.first) {
    router.push('/chat');
    return
  }

  // 注册成功
  console.log("注册成功：", newUser);
  state.user = newUser;
  router.push('/chat');
})

const comfirmAction = () => {
  if (name.value) {
    window.socket.emit('register', name.value);
  } else {
    //@ts-ignore
    ElMessage({
      showClose: true,
      message: placeholder,
      type: 'error',
    })
  }
}
</script>

<template>
  <div class="register">
    <main class="main">
      <h1 class="gradient-text">Join Chat-We</h1>
      <el-input v-model="name" :placeholder="placeholder" clearable />
      <el-button type="primary" @click="comfirmAction">确认</el-button>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0 5vw;
  height: 100%;
  width: 100%;
  background-image: url(https://img1.baidu.com/it/u=3664896485,4160099446&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889);

  .gradient-text {
    font-weight: bold;
    background-image: linear-gradient(60deg, #E21143, #FFB03A);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .main {
    width: 80vw;
    height: 30vh;
    padding: 10px;
    background-color: rgba($color: #0aed68, $alpha: 0.2);
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    align-items: center;

    &:hover {
      transition: .5s;
      background-color: rgba($color: #0aed68, $alpha: 0.1);
    }

    .el-button--primary {
      margin-top: 20px;
      margin-left: 10px;
    }
  }
}
</style>