import { toast } from "@/hooks/use-toast"
import { PostDeleteRequest } from "@/lib/validators/post"
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import { Post, User } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { MoreVertical } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FC } from "react"

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
    <Dropdown >
      <DropdownTrigger > 
        <div className="cursor-pointer">
          <MoreVertical />
        </div>
      </DropdownTrigger>

      <DropdownMenu  variant="flat" aria-label="Post settings" disabledKeys={(isUserPostAuthor || isUserAdmin) ? [] : ["delete"]}>
        <DropdownItem key="report" startContent={<Link href='/' className="w-full h-full">Report</Link>} />
        <DropdownItem key="share" startContent={<Link href='/' className="w-full h-full">Share</Link>} showDivider={(isUserPostAuthor || isUserAdmin)} />
        <DropdownItem key="delete" className="w-full h-full">
          <button onClick={() => deletePost({ postId: post.id })}>Delete</button>
        </DropdownItem>

      </DropdownMenu>
    </Dropdown>
  )
}

export default DotMenu