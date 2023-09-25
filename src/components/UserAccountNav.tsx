'use client'

import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react"
import { User } from 'next-auth'
import { signOut } from "next-auth/react"
import Link from 'next/link'
import { FC } from 'react'
import { UserAvatar } from "./UserAvatar"

interface IUserAccountNav {
  user: Pick<User, 'name' | 'image' | 'email'>
}

const UserAccountNav: FC<IUserAccountNav> = ({ user }) => {


  return (
    <Dropdown >
      <DropdownTrigger>
        <div className="cursor-pointer">
          <UserAvatar className='h-9 w-9'
            user={{
              name: user.name || null,
              image: user.image || null,
            }} />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Custom item styles"
        disabledKeys={["profile"]}
        itemClasses={{
          base: [
            "rounded-md",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "data-[hover=true]:bg-default-100",
            "dark:data-[hover=true]:bg-default-50",
            "data-[selectable=true]:focus:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[focus-visible=true]:ring-default-500",
          ],
        }}
      >

        <DropdownItem
          isReadOnly
          key="profile"
          className="h-14 gap-2 opacity-100"
          showDivider
        >
          <div className='flex items-center justify-start '>
            <div className='flex flex-col space-y-1 leading-none'>
              {user.name && <p className='font-semibold text-[16px] text-zinc-900'>{user.name}</p>}
              {user.email && <p className=' truncate text-sm text-zinc-700'>{user.email}</p>}
            </div>
          </div>
        </DropdownItem>



        <DropdownItem key="feed" startContent={<Link href='/' className="w-full h-full">Feed</Link>}></DropdownItem>
        <DropdownItem key="create" startContent={<Link href='/r/create' className="w-full h-full">Create community</Link>}></DropdownItem>
        <DropdownItem key="settings" startContent={<Link href='/settings' className="w-full h-full">Settings</Link>}></DropdownItem>
        <DropdownItem key="logout" className="text-danger" color="danger" onClick={(event => {
          event.preventDefault()
          signOut({
            callbackUrl: `${window.location.origin}/sign-in`,
          })
        })}>
          Sign out
        </DropdownItem>

      </DropdownMenu>
    </Dropdown>
  );

}

export default UserAccountNav
