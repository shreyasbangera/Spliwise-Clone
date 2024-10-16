'use client'
import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useAuth } from "./AuthProvider";
import { useRequireAuth } from "./useRequireAuth";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const  user  = useRequireAuth()
    const router = useRouter()

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
          alert(error.message);
        } else {
          alert('You have been signed out successfully!');
          // Optional: Redirect to the login page or another route after sign-out
          router.push('/login');
        }
      };

  return (
    <header className="flex items-center justify-between border-b border-solid border-b-[#e7eef4] px-10 py-3">
      <div onClick={() => router.push('/')} className="flex items-center gap-4 cursor-pointer">
        <svg
          className="w-4 h-4"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
            fill="currentColor"
          ></path>
        </svg>
        <h2 className="text-lg font-bold">BillSplittr</h2>
      </div>
      {user && <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:outline-none flex items-center gap-3">
            <Image className="rounded-full aspect-square" src={user?.user_metadata.avatar_url} width={30} height={30} alt='avatar'/>
          <span className="text-sm lg:flex hidden">{user?.user_metadata.full_name}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mr-5'>
          <DropdownMenuLabel className='font-medium'>{user?.user_metadata.full_name}</DropdownMenuLabel>
          <DropdownMenuLabel className='font-thin text-xs py-1'>{user?.user_metadata.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className='text-red-500'>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>}
    </header>
  );
};

export default Navbar;
