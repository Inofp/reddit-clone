import { z } from 'zod'

export const PostValidator = z.object({
    title: z.string().min(3, { message: 'Title must be longer than 3 characters' }).max(128, { message: 'Title must be no more than 128 characters.' }),
    subredditId: z.string(),
    content: z.any(),
})

export const PostDeleteValidator = z.object({
    postId: z.string(),
})

export type PostCreationRequest = z.infer<typeof PostValidator>
export type PostDeleteRequest = z.infer<typeof PostDeleteValidator>