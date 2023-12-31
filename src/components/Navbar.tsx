import Link from 'next/link'
import { Icons } from './Icons'
import { buttonVariants } from './ui/Button'
import { getAuthSession } from '@/lib/auth'
import UserAccountNav from './UserAccountNav'
import SearchBar from './SearchBar'

const Navbar = async () => {

  const session = await getAuthSession();

  return (
    <div className='fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[10] py-2 box-border'>
      <div className='container max-w-7xl h-full flex items-center justify-between gap-2 mx-auto'>
        {/* logo */}
        <Link href='/' className='flex gap-2 items-center'>
          <Icons.logo className='h-4 w-4 sm:h-10 sm:w-10' />
          <p className='hidden text-zinc-700 text-sm font-medium md:block'>Reddit</p>
        </Link>

        <SearchBar />

        {session?.user ?
          (
            <UserAccountNav user={session.user}/>
          )
          :
          (
            <Link href='/sign-in' className={buttonVariants()}>Sign In</Link>
          )}
      </div>
    </div >
  )
}

export default Navbar