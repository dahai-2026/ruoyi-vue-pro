// 登录令牌的存取统一走这里：键名集中定义，避免各处散落字面量导致
// 「写入令牌」与「读取令牌」（如 axios 拦截器拼装请求头）用的键名不一致，
// 那样后续请求的鉴权头会一直为空、接口全部返回 401。
// 后端 SecurityProperties.tokenHeader 为 Authorization，取值为 Bearer + accessToken。

/** 访问令牌的存储键名 */
export const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN'

/** 刷新令牌的存储键名 */
export const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN'

/** 读取访问令牌 */
export const getAccessToken = (): string | null => localStorage.getItem(ACCESS_TOKEN_KEY)

/** 写入访问令牌 */
export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
}

/** 读取刷新令牌 */
export const getRefreshToken = (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY)

/** 写入刷新令牌 */
export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}
