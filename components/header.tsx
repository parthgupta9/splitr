"use client";

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Authenticated, Unauthenticated } from 'convex/react';
import { SignIn, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Button } from "@/components/ui/button"
import { LayoutDashboard } from 'lucide-react';

const header = () => {
  const path=usePathname();
  return (
    <div>
       <header className="fixed top-0 w-full border-b bg-white/95 backdrop-blur z-50 supports-backdrop-filter:bg-white/60 ">
       <nav className="container mx-auto px-4 h-16 flex items-center justify-between p-4">
        <Link href="/" className="flex items-center justify-between">
        <Image src="/logos/logo.png" alt="Splitr Logo" width={200} height={60}
        className="object-contain h-11 w-auto" />
        </Link>
        {path=='/' && (
          <div className='hidden md:flex items-center gap-6'>
            <Link href="#features" className="text-sm font-medium hover:text-green-600 transition">Features</Link>
                     <Link href="#how-it-works" className="text-sm font-medium hover:text-green-600 transition">How It works</Link>
          </div>
        )}
        <div className="flex items-center gap-4">
          <Authenticated>
          <Link href="/">
          <Button className="text-black bg-green-600 hover:bg-green-800 border-none">
            <LayoutDashboard className=" h-4 w-4"/>
            Dashboard</Button>
            <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
            <LayoutDashboard className=" h-5 w-5"/>
            </Button>
          </Link>
          <UserButton />
          </Authenticated>
        <Unauthenticated>
          <SignInButton>
         <Button variant="ghost">Sign In</Button>
         </SignInButton>
         <SignUpButton>
         <Button className=" bg-green-600 hover:bg-green-800 border-none">Get Started</Button>
         </SignUpButton>
        </Unauthenticated>
        </div>
       </nav>
       </header>
    </div>
  )
}

export default header