<template>
  <el-container id="background" class="viewMain">
    <el-header class="viewHeader">
      <div class="viewTitle">机械臂上位机</div>
    </el-header>
    <el-container>
      <el-aside width="200px" class="viewAside">
        <img src="public\img\logo.png" width="150" />

        <div style="display: flex; flex-direction: column">
          <ButtonStripe text="连接服务器" @click="connectArm" />
          <ButtonStripe text="发送信息" @click="handleEmit" />
          <ButtonStripe text="播放视频" @click="playVideo" />
          <ButtonStripe text="连接断开" @click="disconnectArm" />
        </div>
      </el-aside>
      <el-container>
        <el-main>
          <img v-if="isShow" src="public\img\yahboom.jpg" width="400" />
          <div v-if="!isShow">
            <!-- 用于展示视频的video标签 -->
            <video ref="videoElement" width="640" height="480" autoplay></video>
          </div>
        </el-main>
        <!-- <el-footer>Footer</el-footer> -->
      </el-container>
    </el-container>
  </el-container>
</template>
<script setup>
import { ref, onMounted, nextTick } from "vue";
import { IPconfig } from "../../public/IPconfig.js";
import { io } from "socket.io-client";
import ButtonStripe from "../components/buttons/ButtonStripe.vue";

const isShow = ref(true);
const videoElement = ref(null); // 用于引用video标签的ref变量
let videoChunks = []; // 用于存储视频流数据块
const socket = io("http://" + IPconfig.testIP, {
  autoConnect: false,
});
// 连接机械臂
const connectArm = function () {
  socket.connect();
  // 监听自定义事件
  socket.on("connect", function (data) {
    console.log("连接成功!", data);
    isShow.value = false;
    // 清除连接超时定时器
    clearTimeout(connectTimer);
  });
  // 实时接收后台返回的数据
  socket.on("chat message", function (msg) {
    console.log("接收消息", msg);
  });
  // 监听video_chunk事件
  socket.on("video_chunk", (data) => {
    console.log("解码数据块并存储");
    // 解码数据块并存储
    const chunk = atob(data.data);
    videoChunks.push(chunk);
    // 将视频流数据块拼接成完整的视频流
    const videoBlob = new Blob([videoChunks], { type: "video/mp4" });
    const videoURL = URL.createObjectURL(videoBlob);
    // 设置视频流源
    videoElement.value.src = videoURL;
  });
  // 监听错误事件
  socket.on("error", function (error) {
    console.error("Socket error:", error);
    // 执行处理错误的操作
  });
  // 监听连接超时事件
  const connectTimer = setTimeout(function () {
    console.error("连接超时");
    socket.disconnect();
  }, 5000);
  socket.emit("VideoStream"); // 请求视频流
};
// 向后台发送信息， response：响应信息
const handleEmit = function () {
  socket.emit("chatMessage", "test-value", (response) => {
    console.log(response, "发送消息，接收发送成功响应信息");
  });
};
// 断开与服务器的连接
const disconnectArm = function () {
  isShow.value = true;
  socket.disconnect();
};
// 手动触发视频播放
const playVideo = () => {
  videoElement.value.play();
};
onMounted(async () => {});
</script>

<style>
body {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: sans-serif;
  z-index: 0;
}

canvas {
  z-index: 1;
}
.viewMain {
  width: 100%;
  height: 100vh;
  background: url("../../public/img/background.png");
  background-size: cover;
  opacity: 0.8;
  position: relative;
  z-index: 5;
}
.viewHeader {
  height: 100%;
  width: 100%;
  padding: 0 !important;
  display: flex;
  align-items: center;
  position: relative;
  z-index: 5;
}
.viewTitle {
  height: 100%;
  width: 100%;
  font-size: 30px;
  font-weight: bolder;
  color: #ffffff;
  margin: auto;
  background: rgb(0, 13, 36);
  background: linear-gradient(
    90deg,
    rgba(0, 13, 36, 0) 0%,
    rgba(9, 58, 121, 0.29735644257703087) 22%,
    rgba(0, 212, 255, 1) 100%
  );
  word-spacing: 10px;
  letter-spacing: 10px;
  position: relative;
  z-index: 10;
}
.viewAside {
  position: relative;
  height: 80vh;
  padding: 20px;
  overflow: hidden !important;
  z-index: 10;
}

.viewAside::before,
.viewAside::after {
  content: "";
  position: absolute;
  width: 30px;
  height: 30px;
  animation: div1Ani 5000ms infinite linear;
}

.viewAside::before {
  top: 5px;
  left: 5px;
  border-top: 1px solid #0b7ffe;
  border-left: 1px solid #0b7ffe;
}

.viewAside::after {
  right: 5px;
  bottom: 5px;
  border-bottom: 1px solid #0b7ffe;
  border-right: 1px solid #0b7ffe;
}

@keyframes div1Ani {
  0% {
    width: 30px;
    height: 30px;
  }
  50% {
    width: calc(100% + 9px);
    height: calc(100% + 9px);
  }
  100% {
    width: 30px;
    height: 30px;
  }
}
</style>
