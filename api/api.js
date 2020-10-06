import http from "@/api/http";
import el from "element-ui/src/locale/lang/el";

const baseUrl = 'http://localhost:8082'

export const success_code = 10000;
export const failed_code = 40000;

export const getAdminInfo = () => {
  return http.requestGet(baseUrl + '/user/user_info/741626485537767424');
}

export const getCategories = () => {
  return http.requestGet(baseUrl + '/portal/article/categories');
}
export const getLoop = () => {
  return http.requestGet(baseUrl + '/portal/web_site_info/loop');
}
export const getTopArticle = () => {
  return http.requestGet(baseUrl + '/portal/article/top');
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
