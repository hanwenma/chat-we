import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

let userList = [];
const chatList = [];

const io = new Server({ cors: true });

// 获取当前在线人数
function getOnline(cb) {
  let count = 0;
  userList.forEach((v) => {
    cb && cb(v);
    if (v.online) count++;
  });
  return count;
}

io.on("connection", (socket) => {
  // 获取当前连接的客户端数量
  const count = io.engine.clientsCount;

  // 注册
  socket.on("register", (name) => {
    let user = userList.find((v) => v.name === name);

    if (!user) {
      console.log(`用户【${name}】注册完成`);
      // 构建用户信息
      user = {
        uuid: uuidv4(),
        name,
        online: true,
        first: true,
      };

      // 添加用户
      userList.push(user);
    } else {
      console.log(`用户【${name}】已登录`);
      user.first = false;
      user.online = true;
    }

    // 响应注册操作
    socket.emit("register", user);
    io.emit("online", {
      count: getOnline(),
      user,
    });
  });

  // 群聊
  socket.on("chat", (content) => {
    chatList.push(content);
    // 利用广播的方式发送消息
    socket.broadcast.emit("chat", content);
  });

  // 同步群聊数据
  socket.on("sync", (user) => {
    const exist = chatList.find((v) => v.uuid === user.uuid && v.wellcom);

    if (exist) {
      exist.online = true;
      io.emit("online", {
        count: getOnline(),
        user,
      });
      socket.emit("sync", chatList);
      return;
    }

    io.emit("online", {
      count: getOnline(),
      user,
    });

    const wellcom = {
      ...user,
      wellcom: `欢迎【${user.name}】加入群聊 ~~`,
    };
    chatList.push(wellcom);
    socket.emit("sync", chatList);
    socket.broadcast.emit("chat", wellcom);
  });

  // 更换头像
  socket.on("avatar", (user) => {
    const currUser = userList.find((v) => v.uuid === user.uuid);
    if (currUser) {
      currUser.avatar = user.avatar;
      chatList.forEach(v => {
        if(v.uuid === user.uuid) v.avatar = user.avatar;
      });
      io.emit("sync", chatList);
    }
  });

  // 用户离开
  socket.on("leave", (user) => {
    io.emit("online", {
      count: getOnline((v) => {
        if (v.uuid === user.uuid && v.online) {
          v.online = false;
          console.log(`用户【${user.name}】已离线！`);
        }
      }),
      user,
    });
  });

  // 断开连接
  socket.on("disconnecting", () => {
    console.log("用户已离开或连接断开");
  });
});

io.listen(3000, () => {
  console.log("srever running...");
});
