'use client';

import * as React from 'react';
import { ExternalLink, HelpCircle, Keyboard, Search } from 'lucide-react';

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { RiBox3Fill, RiLinkedinFill, RiThreadsFill, RiTwitterXFill } from '@remixicon/react';

export function HelpButton() {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
               <HelpCircle className="size-4" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" className="w-60">
            <div className="p-2">
               <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search for help..." className="pl-8" />
               </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Shortcuts</DropdownMenuLabel>
            <DropdownMenuItem>
               <Keyboard className="mr-2 h-4 w-4" />
               <span>Keyboard shortcuts</span>
               <span className="ml-auto text-xs text-muted-foreground">⌘/</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Follow me</DropdownMenuLabel>
            <DropdownMenuItem asChild>
               <Link href="https://x.com/ln_dev7" target="_blank">
                  <RiTwitterXFill className="mr-2 h-4 w-4" />
                  <span>X - Twitter</span>
                  <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
               </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link href="https://threads.net/@ln_dev7" target="_blank">
                  <RiThreadsFill className="mr-2 h-4 w-4" />
                  <span>Threads</span>
                  <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
               </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link href="https://linkedin.com/in/lndev" target="_blank">
                  <RiLinkedinFill className="mr-2 h-4 w-4" />
                  <span>LinkedIn</span>
                  <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
               </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
               <Link href="https://ecaefmew.mychariow.shop/prd_3cu1s0" target="_blank">
                  <RiBox3Fill className="mr-2 h-4 w-4" />
                  <span>Support project</span>
               </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>What&apos;s new</DropdownMenuLabel>
            <DropdownMenuItem asChild>
               <Link href="https://ui.lndev.me" target="_blank" className="flex items-center">
                  <div className="mr-2 flex h-4 w-4 items-center justify-center">
                     <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  </div>
                  <span>Launch lndev-ui</span>
               </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link href="https://lndev.me" target="_blank" className="flex items-center">
                  <div className="mr-2 flex h-4 w-4 items-center justify-center">
                     <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                  </div>
                  <span>New portfolio</span>
               </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Link
                  href="https://github.com/ln-dev7/circle"
                  target="_blank"
                  className="flex items-center"
               >
                  <div className="mr-2 flex h-4 w-4 items-center justify-center">
                     <div className="h-1.5 w-1.5 rounded-full bg-transparent"></div>
                  </div>
                  <span>GitHub</span>
                  <ExternalLink className="ml-2 h-3 w-3 text-muted-foreground" />
               </Link>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
