import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

export const initSocket = (target: string) => {
  // 与目标服务建立连接
  const socket: Socket = io(target);

  // 建立连接
  socket.on("connect", () => {
    console.log("连接成功：", socket.id);
  });

  // 断开连接
  socket.on("disconnect", () => {
    console.log("连接中断...");
  });

  window.socket = socket;
};
