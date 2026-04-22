"use client";

import React from "react";
import { Search, Plus, Bell, Settings, LogOut, User } from "lucide-react";
import { useAuth } from "./auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { Button, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Separator } from "@heroui/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <nav className="h-16 border-b border-white/5 bg-bg-dark/40 backdrop-blur-xl sticky top-0 z-50 px-6 flex items-center justify-between">
      {/* Left: Brand / Title */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
            <img src="/favicon.png" alt="N" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">Next Note</span>
        </Link>
        <Separator orientation="vertical" className="h-6 bg-white/10 mx-2" />
        <div className="text-sm font-medium text-text-muted hidden md:flex items-center gap-1">
          <span className="opacity-50">App</span>
          <span className="opacity-30">/</span>
          <span className="text-white capitalize">{pathname.split("/").filter(Boolean)[0] || "Dashboard"}</span>
        </div>
      </div>

      {/* Center: Search Placeholder */}
      <div className="flex-1 max-w-xl px-8 hidden sm:block">
        <div 
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true });
            document.dispatchEvent(event);
          }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer text-text-muted group"
        >
          <Search size={14} className="group-hover:text-white transition-colors" />
          <span className="text-sm flex-1">Search or jump to...</span>
          <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/5 text-text-muted">⌘K</kbd>
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3">
        <Button 
          variant="light" 
          isIconOnly 
          className="text-text-muted hover:text-white"
          onClick={() => router.push("/new")}
        >
          <Plus size={20} />
        </Button>
        <Button 
          variant="light" 
          isIconOnly 
          className="text-text-muted hover:text-white"
        >
          <Bell size={20} />
        </Button>
        
        <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <div className="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-white/5 transition-all">
              <Avatar
                src={user?.photoURL || undefined}
                name={user?.displayName?.[0] || user?.email?.[0]?.toUpperCase()}
                className="w-8 h-8 text-xs bg-brand-primary"
              />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="User actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold text-brand-primary">{user?.email}</p>
            </DropdownItem>
            <DropdownItem key="settings" startContent={<Settings size={16} />}>
              Account Settings
            </DropdownItem>
            <DropdownItem 
              key="logout" 
              className="text-danger" 
              color="danger"
              startContent={<LogOut size={16} />}
              onPress={() => logout().then(() => router.push("/login"))}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </nav>
  );
}
