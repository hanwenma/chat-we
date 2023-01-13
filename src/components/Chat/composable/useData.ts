import { onMounted, nextTick, watch, ref } from "vue";
import type { Ref } from "vue";
import type { Ueser } from "@/stores/user";

export default function (user: Ueser, mainRef: Ref) {
  const data: any = ref([]);

  // 保证聊天信息一直显示最新消息
  const keepBottom = () =>
    nextTick(() => {
      const el: HTMLElement = mainRef.value!;
      el.scrollTop = el.scrollHeight;
    });

  // 当数据变化，保证滚动条在最底部
  watch(data, keepBottom, { deep: true });

  onMounted(() => {
    // 发起同步消息
    window.socket.emit("sync", user);

    // 同步群聊数据
    window.socket.on("sync", (chatData: any[]) => {
      data.value = chatData;
    });

    // 处理响应
    window.socket.on("chat", (chatInfo: any[]) => {
      data.value.push(chatInfo);
    });
  });

  return data;
}
