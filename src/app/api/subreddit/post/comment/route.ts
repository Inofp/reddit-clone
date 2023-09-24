import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommentValidator } from "@/lib/validators/comment"

export async function PATCH(req:Request) {
    try {
        const body = await req.json()

        const { postId, text, replyToId } = CommentValidator.parse(body)
        
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        await db.comment.create({
            data: {
                text,
                authorId: session.user.id,
                postId,
                replyToId,
            }
        })

        return new Response('OK', { status: 200 })
    } catch (error) {
        if (error instanceof Error) {
            return new Response(error.message, { status: 400 })
        }
        
        return new Response('Could not create comment, please try again later', { status: 500 })
    }
}