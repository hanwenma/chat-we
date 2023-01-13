<template>
    <div class="chat">
        <header class="header">
            <h1>WE CHAT</h1>
            <h3>online: {{ state.online }}</h3>
        </header>

        <main class="main" ref="mainRef">
            <div class="message-item"
                :class="{ 'user': item.uuid === user.uuid && !item.wellcom, 'wellcom': item.wellcom }"
                v-for="item in data" :key="item.uuid">
                <!-- 欢迎入群 -->
                <template v-if="item.wellcom">
                    <div class="wellcom-tips">{{ item.wellcom }}</div>
                </template>
                <!-- 群聊信息 -->
                <template v-else>
                    <el-avatar v-if="item.uuid !== user.uuid" :size="50" :src="item.avatar" />
                    <div class="message-info">
                        <p class="name">{{ item.name }}</p>
                        <div class="display" v-html="formatMessage(item.message)">
                        </div>
                        <p class="date">{{ item.date }}</p>
                    </div>
                    <el-upload v-if="item.uuid === user.uuid" ref="upload" class="upload-demo" :show-file-list="false"
                        :on-change="onFileChange" :limit="1" :auto-upload="false">
                        <template #trigger>
                            <el-avatar :size="50" :src="item.avatar" />
                        </template></el-upload>
                </template>
            </div>
        </main>

        <footer class="footer">
            <el-popover popper-class="emo_popover" placement="top" :width="380" v-model:visible="visible"
                trigger="click">
                <img class="emo_item pointer" v-for="item in emotions" :key="item.title" @click="chooseEmo(item)"
                    :src="item.emot" />
                <template #reference>
                    <img class="pointer" :src="emotions[0].emot" />
                </template></el-popover>
            <el-input v-model="message" type="textarea" placeholder="Please input" :autosize="{ maxRows: 2 }" />
            <el-button v-show="message" type="primary" round @click="sendAction">发送</el-button>
        </footer>
    </div>
</template>
    
<script setup lang='ts'>
import { onBeforeUnmount, ref } from 'vue';
import { dayjs } from 'element-plus';
import type { UploadInstance, UploadFile } from 'element-plus'
import { useUser } from '@/stores/user';
import type { Ueser } from '@/stores/user'
import useData from './composable/useData';
import useEmotion from './composable/useEmotion';
import useMessage from './composable/useMessage';

let avatar = 'https://img1.baidu.com/it/u=4035421571,4160111639&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500';

const visible = ref(false);
const mainRef = ref(null);
const upload = ref<UploadInstance>()

const { emotions, emotMap } = useEmotion();
const { message, chooseEmo, formatMessage } = useMessage(visible, emotMap);
const state = useUser();
const user: Ueser = state.user;
const data = useData(user, mainRef);

// 避免用户在当前页面刷新
if (user.name) window.socket.emit("register", user.name);

onBeforeUnmount(() => {
    // 用户离开
    window.socket.emit('leave', user)
});

// 发送消息
const sendAction = () => {
    const info = {
        uuid: user.uuid,
        name: user.name,
        message: message.value,
        date: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        avatar
    };

    data.value.push(info);
    message.value = '';

    window.socket.emit('chat', info);
}

// file 转 base64
const fileToBase64Async = (file: File) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            resolve(e.target?.result);
        };
        reader.onerror = () => {
            resolve('');
        }
    });
}

// 处理头像变更
const onFileChange = async (uploadFile: UploadFile) => {
    const data: any = await fileToBase64Async((uploadFile.raw as File));
    if (data) {
        avatar = user.avatar = data;
        window.socket.emit('avatar', user);
    }
}

</script>
    
<style lang="scss">
.chat {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;

    .header,
    footer {
        padding: 2px 5px;
        min-height: 10vh;
        display: flex;
        justify-content: center;
        align-items: center;
        color: aliceblue;
        background-image: linear-gradient(60deg, #E21143, #FFB03A);
    }

    .header {
        flex-direction: column;
    }

    .main {
        flex: 1;
        overflow-y: scroll;
        background-color: rgba(30, 128, 255, .05);

        .message-item {
            padding: 0 5px;
            margin: 20px 0;
            display: flex;
            align-items: flex-start;

            .message-info {
                margin-left: 10px;
                width: 80vw;
            }

            .name {
                max-width: 80vw;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                margin-bottom: 5px;
            }

            .date {
                font-size: 12px;
                color: #989fb1;
            }

            .display {
                display: inline-block;
                background-color: #fff;
                border-radius: 5px;
                min-height: 30px;
                max-width: 80vw;
                word-break: break-word;
                padding: 5px;
                box-shadow: 0px 0px 5px rgba($color: #000000, $alpha: 0.3);
            }

            .emot_msg {
                cursor: pointer;
                vertical-align: bottom;
            }

            &.wellcom {
                text-align: center;
                justify-content: center;
                color: #989fb1;
            }

            &.user {
                text-align: right;
                justify-content: flex-end;

                .name {
                    text-align: right;
                }

                .message-info {
                    margin-left: 0;
                    margin-right: 10px;
                }
            }
        }
    }

    .footer {
        min-height: 10vh;

        .el-textarea {
            flex: 1;
            margin: 0 5px;
        }
    }
}

.pointer {
    cursor: pointer;
}

.emo_popover {
    max-width: 95vw;

    .emo_item {
        margin: 5px;
    }
}
</style>