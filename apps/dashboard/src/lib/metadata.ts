import { APP_NAME } from '@repo/constants/app'

export function createPageTitle(title: string) {
  return `${title} | ${APP_NAME}`
}
