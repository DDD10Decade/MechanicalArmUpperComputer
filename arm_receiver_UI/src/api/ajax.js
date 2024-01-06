import axios from "axios";
import { ElMessage } from "element-plus";
import IPconfig from "public/IPconfig.js";

//封装请求
const base = IPconfig.armIP;
//post
export const post = (url, params) => {
  return axios({
    method: "post",
    url: "${base}${url}",
    data: params,
  });
};

//put
export const put = (url, params) => {
  return axios({
    method: "put",
    url: "${base}${url}",
    data: params,
  });
};

//get
export const get = (url, params) => {
  return axios({
    method: "get",
    url: "${base}${url}",
    data: params,
  });
};

//del
export const del = (url, params) => {
  return axios({
    method: "delete",
    url: "${base}${url}",
    data: params,
  });
};

//请求拦截器
axios.interceptors.request.use(
  (config) => {
    //如果存在token，请求携带token
    if (window.sessionStorage.getItem("tokenStr")) {
      config.headers["Authorization"] =
        window.sessionStorage.getItem("tokenStr");
    }
    return config;
  },
  (error) => {
    ElMessage.error({ ElMessage: error });
  }
);

//api接口 响应成功 / 响应失败 【响应拦截器】
//后端提供：响应码，响应信息，对象
axios.interceptors.response.use(
  (success) => {
    if (success.status && success.status == 200) {
      if (
        success.data.code == 500 ||
        success.data.code == 401 ||
        success.data.code == 403
      ) {
        //接口请求成功，业务逻辑错误
        ElMessage.error({ message: success.data.message, showClose: true });
        return;
      }
      if (success.data.ElMessage) {
        ElMessage({ message: success.data.message, showClose: true });
      }
    }
    return success.data;
  },
  (error) => {
    if (error.response.code == 504 || error.response.code == 404) {
      ElMessage.error({ message: "服务器被吃了( ╯□╰ )", showClose: true });
    } else if (error.response.code == 403) {
      ElMessage.error({ message: "权限不足，请联系管理员", showClose: true });
    } else {
      if (error.response.message) {
        ElMessage({ message: error.response.message, showClose: true });
      } else {
        ElMessage({ message: "该错误触及盲区(●ˇ∀ˇ●)", showClose: true });
      }
    }
  }
);
