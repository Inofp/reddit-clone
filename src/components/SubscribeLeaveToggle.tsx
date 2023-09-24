"use client"

import { FC, startTransition } from 'react'
import { Button } from './ui/Button'
import { useMutation } from '@tanstack/react-query'
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit'
import axios, { AxiosError } from 'axios'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface ISubscribeLeaveToggle {
    subredditId: string,
    subredditName: string,
    isSubscribed: boolean,
}

const SubscribeLeaveToggle: FC<ISubscribeLeaveToggle> = ({ subredditId, subredditName, isSubscribed }) => {
    const { loginToast } = useCustomToasts()
    const router = useRouter()

    const { mutate: subscribe, isLoading: isSubLoading} = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId,
            }

            const { data } = await axios.post('/api/subreddit/subscribe', payload)
            return data as string
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }
            return toast({
                title: 'There was a problem',
                description: 'Something went wrong, please try again.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })

            return toast({
                title: 'Subscribed',
                description: `You are now subscribed to r/${subredditName}`,
                variant: 'default'
            })
        }

    })

    const { mutate: unsubscribe, isLoading: isUnsubLoading} = useMutation({
        mutationFn: async () => {
            const payload: SubscribeToSubredditPayload = {
                subredditId,
            }

            const { data } = await axios.post('/api/subreddit/unsubscribe', payload)
            return data as string
        },
        onError: (err) => {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    return loginToast()
                }
            }
            return toast({
                title: 'There was a problem',
                description: 'Something went wrong, please try again.',
                variant: 'destructive'
            })
        },
        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })

            return toast({
                title: 'Unsubscribed',
                description: `Unsubscribed from r/${subredditName}`,
                variant: 'default'
            })
        }

    })

    return isSubscribed ?
        (<Button className='w-full mt-1 mb-4' onClick={() => unsubscribe()} isLoading={isUnsubLoading}>Leave community</Button>)
        :
        (<Button className='w-full mt-1 mb-4' onClick={() => subscribe()} isLoading={isSubLoading}>Join to post</Button>)
}

export default SubscribeLeaveToggle