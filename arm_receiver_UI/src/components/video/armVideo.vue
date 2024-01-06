<template>
  <div class="video-js" style="width: 600px">
    <video-player
      class="video-player vjs-custom-skin"
      ref="videoPlayer"
      :playsinline="true"
      :options="playerOptions"
    >
    </video-player>
  </div>
</template>

<script>
import base from "../../../js/global.js";
import axios from "axios";
import laydate from "layui-laydate";
import moment from "moment";
import $ from "jquery";
import crypto from "crypto";
import qs from "qs";
import _ from "lodash";

import videojs from "video.js";
import "video.js/dist/video-js.css";
import "vue-video-player/src/custom-theme.css";
import { videoPlayer } from "vue-video-player";
import "videojs-flash";
import SWF_URL from "videojs-swf/dist/video-js.swf";

videojs.options.flash.swf = SWF_URL; // 设置flash路径，Video.js会在不支持html5的浏览中使用flash播放视频文件

export default {
  name: "videojs",
  components: {
    videoPlayer,
  },

  data() {
    /* 定义全局变量 */
    return {
      userInfo: "",
      uthObj: "",
      player: "",
      videoSrc: "",
      playerOptions: {
        live: true,
        autoplay: true, // 如果true，浏览器准备好时开始播放
        muted: false, // 默认情况下将会消除任何音频
        loop: false, // 是否视频一结束就重新开始
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        language: "zh-CN",
        poster:
          "https://file.digitaling.com/eImg/uimages/20150907/1441607120885946.gif",
        controlBar: {
          timeDivider: false,
          durationDisplay: false,
          remainingTimeDisplay: false,
          currentTimeDisplay: false, // 当前时间
          volumeControl: false, // 声音控制键
          playToggle: false, // 暂停和播放键
          progressControl: true, // 进度条
          fullscreenToggle: true, // 全屏按钮
        }, //techOrder: ['flash'], // 兼容顺序
        techOrder: ["flash", "html5"], //设置顺序，
        flash: { hls: { withCredentials: false }, swf: SWF_URL },
        html5: { hls: { withCredentials: false } },
        sources: [
          {
            type: "rtmp/flv",
            src: "", // 视频地址-改变它的值播放的视频会改变
          },
        ],
        notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
    };
  },
  /* 定义参数回调函数 */
  filters: {},
  props: ["videoUrl"], //获取父组件的参数
  /* 定义上下文方法，可定义同步和异步方法 */
  methods: {
    /* 同步方法 */
    test01: async function () {},
    /* 异步方法 */
    test02() {},
  },
  watch: {
    /*test: function(val, oldVal){},*/
  },
  /* 页面初始化执行方法：此方法可写同步方法，有先后加载顺序的逻辑建议用同步方法 */
  mounted: function () {
    const localstorage = window.localStorage;
    const userInfo = JSON.parse(localstorage.getItem("userInfo"));
    this.userInfo = userInfo;
    const authValue = "Bearer " + userInfo.authorization;
    this.authObj = {
      "Authorization-Back": authValue,
    };
    var that = this;

    console.log("父组件传值：", this.videoUrl);
    this.playerOptions.sources[0].src = this.videoUrl;
    //this.playerOptions.autoplay = true; //再次告诉是自动播放
  },
};
</script>

<style lang="scss" scoped>
/* 这里引入sscc */
@import "./monitor.scss";
</style>
