'use client'

import { FC, useState } from 'react'
import { Button } from './ui/Button'
import { Brush, Slack } from 'lucide-react'
import GeneralFeed from './GeneralFeed'
import CustomFeed from './CustomFeed'

interface IArimafp {
    session: boolean
}

const Arimafp: FC<IArimafp> = ({ session }) => {

    const [generalActive, setGeneralActive] = useState(session)

    return (
        <>
            <div className='rounded bg-white shadow mb-6'>
                <div className='px-6 py-4 gap-6  flex'>
                    <Button variant={generalActive ? 'outline' : 'ghost'} onClick={() => setGeneralActive(true)}>
                        <Slack className='h-4 w-4 mr-1' />
                        <p className='text-xl'>General feed</p>
                    </Button>
                    <Button variant={generalActive ? 'ghost' : 'outline'} onClick={() => setGeneralActive(false)}>
                        <Brush className='h-5 w-5 mr-1' />
                        <p className='text-xl'>Custom feed</p>
                    </Button>
                </div>
            </div>

        </>
    )
}

export default Arimafp