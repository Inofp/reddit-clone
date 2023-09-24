import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostDeleteValidator } from "@/lib/validators/post";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {

try {
    const session = await getAuthSession()

    if (!session?.user) {
        return new Response('Unauthorized', { status: 401 })
    }

    const body = await request.json()

    const { postId } = PostDeleteValidator.parse(body)

    
    await db.post.delete({
        where: {
            id: postId
        }
    })

    return new Response('OK', { status: 200 })

} catch (error) { 
    if (error instanceof z.ZodError) {
        return new Response('Invalid request data passed', { status: 422 })
    }

    return new Response('Could not delete post, please try again later', { status: 500 })
}
}