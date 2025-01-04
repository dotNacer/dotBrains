export type Note = {
    id: number
    title: string
    content: string
    tags: string[]
    createdAt: Date
    updatedAt: Date
}

export type CreateNoteDto = {
    title: string
    content: string
    tags: string[]
}
