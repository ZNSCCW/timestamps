/**
 * 站点集中配置 — 部署前请修改这里的占位值。
 *
 * 修改这个文件即可适配你的真实环境，无需改动业务代码。
 * 所有需要"你手动改"的值都集中在这里。
 */
export const siteConfig = {
  /** 站点名称 */
  name: 'TimeForge',

  /** 站点根 URL（结尾不要带斜杠）。
   *  部署到 Cloudflare Pages 子域名时填 https://your-project.pages.dev
   *  绑定自定义域名后改成 https://yourdomain.com
   */
  siteUrl: 'https://timestamps-upe.pages.dev',

  /** 联系邮箱 — 用于隐私政策与 AdSense 审核。
   *  请改成真实邮箱，AdSense 审核员会验证可联系性。
   */
  contactEmail: '3259404838@qq.com',

  /** GitHub 仓库地址（用于 Footer 与隐私政策联系入口）。
   *  部署后改成你的真实仓库。
   */
  githubUrl: 'https://github.com/ZNSCCW/timestamps',

  /** Google AdSense Publisher ID（格式: ca-pub-XXXXXXXXXXXXXXXX）。
   *  暂未接入时保持空字符串，广告位组件不会渲染实际广告。
   *  申请通过后填入 ID，并在 <head> 注入 AdSense 脚本即可激活。
   */
  adsensePublisherId: '',

  /** 是否启用广告位渲染（即使 ID 为空也渲染占位容器用于布局预览）。
   *  申请通过 AdSense 后改成 true。
   */
  adsenseEnabled: false,

  /** 默认语言 */
  defaultLang: 'zh' as 'zh' | 'en',
} as const;

export type SiteConfig = typeof siteConfig;
