import { pgTable, serial, text, integer } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
    id: serial('id').primaryKey(),
    age: integer('age'),
})

export const character = pgTable('character', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
})

export const smallEvent = pgTable('small_event', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    characterIds: integer('character_ids')
        .array()
        .references(() => character.id),
    id_parent: integer('id_parent').references(() => bigEvent.id),
})

export const bigEvent = pgTable('big_event', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    id_children: integer('id_children')
        .array()
        .references(() => smallEvent.id),
})
