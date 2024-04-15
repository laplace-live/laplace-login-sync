export type Action = 'up' | 'pause'

export interface ConfigProps {
  endpoint: string
  password: string
  /**
   * 上传周期，分钟
   */
  interval: number
  domains: string
  uuid: string
  /**
   * 动作类型
   */
  type: Action
  /**
   * 后台保活链接
   */
  keep_live: string
  with_storage: number
  blacklist: string
  headers: string
  /**
   * 是否强制更新，主要用于手动上传
   */
  forceUpdate: boolean
}
