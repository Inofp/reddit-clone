'use client'

import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { CommentVoteRequest } from '@/lib/validators/vote'
import { usePrevious } from '@mantine/hooks'
import { CommentVote, VoteType } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { ArrowBigDown, ArrowBigUp } from 'lucide-react'
import { FC, useState } from 'react'
import { Button } from '@/components/ui/Button'

type PartialVote = Pick<CommentVote, 'type'>

interface ICommentVotes {
  commentId: string
  votesAmt: number
  currentVote?: PartialVote
}

const CommentVotes: FC<ICommentVotes> = ({ commentId, votesAmt: _votesAmt, currentVote: _currentVote, }) => {

  const { loginToast } = useCustomToasts()
  const [votesAmt, setVotesAmt] = useState<number>(_votesAmt)
  const [currentVote, setCurrentVote] = useState<PartialVote | undefined>(
    _currentVote
  )
  const prevVote = usePrevious(currentVote)

  const { mutate: vote } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentVoteRequest = {
        commentId,
        voteType,
      }

      await axios.patch('/api/subreddit/post/comment/vote', payload)
    },
    onError: (err, voteType) => {
      if (voteType === 'UP') setVotesAmt((prev) => prev - 1)
      else setVotesAmt((prev) => prev + 1)

      // reset current vote
      setCurrentVote(prevVote)

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      return toast({
        title: 'Something went wrong',
        description: 'Your vote was not registered, please try again',
        variant: 'destructive'
      })
    },
    onMutate: (type) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined)
        if (type === 'UP') setVotesAmt((prev) => prev - 1)
        else if (type === 'DOWN') setVotesAmt((prev) => prev + 1)
      } else {
        setCurrentVote({ type })
        if (type === 'UP') setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
        else if (type === 'DOWN') setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
      }
    }
  })

  return (
    <div className='flex gap-1 '>
      <Button onClick={() => vote('UP')} size='sm' variant='ghost' aria-label='upvote'>
        <ArrowBigUp className={cn('h-5 w-5 text-zinc-500', {
          'text-emerald-500 fill-emerald-500': currentVote?.type === 'UP',
        })} />
      </Button>

      <p className='text-center py-2 font-medium text-sm text-zinc-900'>
        {votesAmt}
      </p>

      <Button onClick={() => vote('DOWN')} size='sm' variant='ghost' aria-label='downvote'>
        <ArrowBigDown className={cn('h-5 w-5 text-zinc-500', {
          'text-rose-500 fill-rose-500': currentVote?.type === 'DOWN',
        })} />
      </Button>
    </div>
  )
}

export default CommentVotes