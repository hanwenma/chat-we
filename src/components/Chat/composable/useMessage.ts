import { ref } from "vue";
import type { Ref } from "vue";

const regEmot = /(\[[^\[]+\])/g;

export default function (visible: Ref, emotMap: Record<string, string>) {
  const message = ref("");

  // 选择表情
  const chooseEmo = (emotion: Record<string, string>) => {
    message.value += emotion.title;
    visible.value = false;
  };

  // 格式化信息内容
  const formatMessage = (message: string) => {
    return message.replace(regEmot, (match) => {
      let src = emotMap[match];
      return src ? `<img class="emot_msg" src="${src}" />` : match;
    });
  };

  return {
    message,
    chooseEmo,
    formatMessage
  };
}
