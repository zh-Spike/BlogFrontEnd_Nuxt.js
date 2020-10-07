import http from "@/api/http";
import el from "element-ui/src/locale/lang/el";

const baseUrl = 'http://localhost:8082'

export const success_code = 10000;
export const failed_code = 40000;

export const getAdminInfo = () => {
  if (process.client) {
    return http.requestGet('/user/user_info/741626485537767424');
  } else {
    return http.requestGet(baseUrl + '/user/user_info/741626485537767424');
  }
}
export const getCategories = () => {
  if (process.client) {
    return http.requestGet('/portal/article/categories');
  } else {
    return http.requestGet(baseUrl + '/portal/article/categories');
  }
}
export const getLoop = () => {
  if (process.client) {
    return http.requestGet('/portal/web_site_info/loop');
  } else {
    return http.requestGet(baseUrl + '/portal/web_site_info/loop');
  }
}
export const getLabList = () => {
  if (process.client) {
    return http.requestGet('/portal/lab/list');
  } else {
    return http.requestGet(baseUrl + '/portal/lab/list');
  }
};

export const getUserAppointmentsList = () => {
  if (process.client) {
    return http.requestGet('/portal/appointment/list/');
  } else {
    return http.requestGet(baseUrl + '/portal/appointment/list/');
  }
};
export const getTopArticle = () => {
  if (process.client) {
    return http.requestGet(+'/portal/article/top');
  } else {
    return http.requestGet(baseUrl + '/portal/article/top');
  }
}
export const getLabels = (count) => {
  return http.requestGet('/portal/article/label/' + count);
}
export const getArticles = (page, size) => {
  if (process.client) {
    // 客户端
    return http.requestGet('/portal/article/list/' + page + '/' + size);
  } else {
    // 服务端
    return http.requestGet(baseUrl + '/portal/article/list/' + page + '/' + size);
  }
}
export const doLogin = (verifyCode, captchaKey, user) => {
  return http.requestPost('/user/login/' + verifyCode + '/' + captchaKey + '?from=p_', user);
}
export const checkToken = () => {
  return http.requestGet('/user/check_token');
}
