import { drizzle } from 'drizzle-orm/postgres-js'
import { authRelations } from './schema'

export function createDatabaseClient(connectionString: string) {
  return drizzle(connectionString, {
    relations: {
      ...authRelations,
    },
  })
}
