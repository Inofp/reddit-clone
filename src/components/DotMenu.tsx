import { toast } from "@/hooks/use-toast"
import { PostDeleteRequest } from "@/lib/validators/post"
import { Post, User } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { MoreVertical } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { FC } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface IDotMenu {
  post: Post & {
    author: User,
  }
}

const DotMenu: FC<IDotMenu> = ({ post }) => {

  const { data: session } = useSession()
  const isUserPostAuthor = session?.user?.id === post.author.id
  // TODO: add normal admin implementation
  const isUserAdmin = session?.user?.id == 'cllzh2frj0000vpk4ui5f4ee8'
  const router = useRouter()

  const { mutate: deletePost } = useMutation({
    mutationFn: async ({ postId }: PostDeleteRequest) => {
      const payload: PostDeleteRequest = {
        postId
      }
      
      const { data } = await axios.post('/api/subreddit/post/delete', payload)

      return data
    },
    onError: () => {
      return toast({
        title: 'Something went wrong',
        description: 'Post not deleted, please try again later.',
        variant: 'destructive'
      })
    },
    onSuccess: () => {
      router.refresh()

      return toast({
        description: 'Post has been deleted',
      })
    }
  })

  return (
    <DropdownMenu >
      <DropdownMenuTrigger >
        <MoreVertical />
      </DropdownMenuTrigger>

      <DropdownMenuContent className='bg-white' align='center'>

        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href='/'>Report</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className='cursor-pointer'>
          <Link href='/r/create'>Share</Link>
        </DropdownMenuItem>

        {(isUserPostAuthor || isUserAdmin) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className='cursor-pointer w-full'>
              <button onClick={() => deletePost({ postId: post.id })}>Delete</button>
            </DropdownMenuItem>
          </>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DotMenu