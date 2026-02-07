'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Library,
    Calendar,
    Newspaper,
    Bot,
    UserCircle,
    Menu,
    X,
    LogOut
} from 'lucide-react';
import { useState } from 'react';
import { SignOutButton } from '@clerk/nextjs';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resources', href: '/dashboard/resources', icon: Library },
    { name: 'Appointments', href: '/dashboard/book', icon: Calendar },
    { name: 'Blog', href: '/dashboard/blog', icon: Newspaper },
    { name: 'AI Companion', href: '/dashboard/chat', icon: Bot },
    { name: 'Profile', href: '/dashboard/profile', icon: UserCircle },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle */}
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden fixed top-4 left-4 z-50 text-foreground"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

            {/* Sidebar Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen w-64 bg-zen-cream-dark dark:bg-card border-r border-border transition-transform duration-300 ease-in-out md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full p-4">
                    <div className="p-4 mb-6">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-zen-sage flex items-center justify-center text-white font-bold">
                                CC
                            </div>
                            <span className="text-xl font-bold text-foreground">CalmCove</span>
                        </Link>
                    </div>

                    <nav className="space-y-2 flex-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-zen-sage text-white shadow-sm"
                                                : "text-muted-foreground hover:bg-zen-sage/10 hover:text-foreground"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="pt-4 mt-auto border-t border-border">
                        <SignOutButton>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
                                <LogOut className="h-5 w-5 mr-3" />
                                Sign Out
                            </Button>
                        </SignOutButton>
                    </div>
                </div>
            </aside>
        </>
    );
}
