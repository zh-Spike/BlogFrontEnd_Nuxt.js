import http from "@/api/http";

const baseUrl = 'http://localhost:8082'

export const success_code = 10000;
export const failed_code = 40000;

export const getAdminInfo = () => {
  return http.requestGet(baseUrl + '/user/user_info/741626485537767424');
}

export const getCategories = () => {
  return http.requestGet(baseUrl + '/portal/article/categories');
}
