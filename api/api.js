import http from "@/api/http";

const baseUrl = 'http://localhost:8082'

export const success_code = 10000;
export const scan_code = 60002;
export const failed_code = 40000;
export const waiting_for_scan = 40005;
export const qr_code_deprecate = 40006;
export const join_in_success = 60001;

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
}

export const getUserAppointmentsList = () => {
  return http.requestGet('/portal/appointment/list');
}

export const getTopArticle = () => {
  if (process.client) {
    return http.requestGet('/portal/article/top');
  } else {
    return http.requestGet(baseUrl + '/portal/article/top');
  }
}

export const getLabels = (count) => {
  return http.requestGet('/portal/article/label/' + count);
}

export const getArticles = (categoryId, page, size) => {
  if (categoryId !== '') {
    return http.requestGet('/portal/article/list/' + categoryId + '/' + page + '/' + size);
  }
  if (process.client) {
    // 客户端
    return http.requestGet('/portal/article/list/' + page + '/' + size);
  } else {
    // 服务端
    return http.requestGet(baseUrl + '/portal/article/list/' + page + '/' + size);
  }
}

export const doLogin = (verifyCode, user) => {
  return http.requestPost('/user/login/' + verifyCode + '/' + '?from=p_', user);
}

export const checkToken = () => {
  return http.requestGet('/user/check_token');
}

export const doLogOut = () => {
  return http.requestGet('/user/logout');
}

export const getLinkList = () => {
  if (process.client) {
    return http.requestGet('/portal/web_site_info/friend_link');
  } else {
    return http.requestGet(baseUrl + '/portal/web_site_info/friend_link');
  }
}

export const getSearchContent = (categoryId, keyword,
                                 page, size, sort) => {
  if (process.client) {
    return http.requestGet('/portal/search?categoryId=' + categoryId +
      '&keyword=' + encodeURIComponent(keyword) + '&page=' + page +
      '&size=' + size + '&sort=' + sort);
  } else {
    return http.requestGet(baseUrl + '/portal/search?categoryId=' + categoryId +
      '&keyword=' + encodeURIComponent(keyword) + '&page=' + page +
      '&size=' + size + '&sort=' + sort);
  }
}

export const getLoginQrCode = () => {
  return http.requestGet('/user/pc_login_qr_code');
}

export const checkScanLoginState = (loginId) => {
  return http.requestGet('/user/qr_code_state/' + loginId);
}

export const sendEmailCode = (captchaCode, email, type) => {
  return http.requestGet('/user/verify_code?captchaCode=' + captchaCode
    + '&email=' + email + '&type=' + type);
}

export const checkUserName = (userName) => {
  return http.requestGet('/user/user_name?userName=' + userName);
}

export const updateUserInfo = (user, userId) => {
  return http.requestPut('/user/user_info/' + userId, user);
}

export const registerUser = (captchaCode, emailCode, user) => {
  return http.requestPost('/user/sign_up?captcha_code=' + captchaCode
    + '&email_code=' + emailCode, user);
}

export const checkVerifyCode = (captchaCode, email, emailCode) => {
  return http.requestGet('/user/check_email_code?captchaCode=' + captchaCode
    + '&email=' + email + '&emailCode=' + emailCode);
}

export const updatePassword = (verifyCode, user) => {
  return http.requestPut('/user/password/' + verifyCode, user);
}

export const getArticleDetailById = (articleId) => {
  return http.requestGet(baseUrl + '/portal/article/' + articleId);
}

export const getRecommendArticle = (articleId, size) => {
  return http.requestGet(baseUrl + '/portal/article/recommend/' + articleId + '/' + size);
}

export const getCommentByArticleId = (articleId, page, size) => {
  if (process.client) {
    return http.requestGet('/portal/comment/list/' + articleId + '/' + page + '/' + size);
  } else {
    return http.requestGet(baseUrl + '/portal/comment/list/' + articleId + '/' + page + '/' + size);
  }
}

export const postComment = (articleComment) => {
  return http.requestPost('/portal/comment', articleComment);
}

export const getUserInfo = (userId) => {
  if (process.client) {
    return http.requestGet('/user/user_info/' + userId);
  } else {
    return http.requestGet(baseUrl + '/user/user_info/' + userId);
  }
}

export const deleteAppointment = (deleteArticleId) => {
  if (process.client) {
    return http.requestDelete('/portal/appointment/' + deleteArticleId);
  } else {
    return http.requestDelete(baseUrl + '/portal/appointment/' + deleteArticleId);
  }
}
// 添加预约
export const postAppointment = (appointment) => {
  return http.requestPost('/portal/appointment', appointment);
};
