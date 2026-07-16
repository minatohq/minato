import { drizzle } from 'drizzle-orm/postgres-js'

export function createDatabaseClient(connectionString: string) {
  return drizzle(connectionString)
}
