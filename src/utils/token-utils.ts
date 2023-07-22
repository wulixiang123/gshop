const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token: string) {
  return localStorage.setItem(TokenKey, token)
}

// 删除token
export function removeToken() {
  return localStorage.removeItem(TokenKey)
}
