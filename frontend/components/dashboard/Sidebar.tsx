'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  Flame,
  CheckSquare,
  ListChecks,
  BarChart3,
  X,
  Menu,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard',           label: 'Overview',  icon: LayoutDashboard },
  { href: '/dashboard/habits',    label: 'Habits',    icon: Flame           },
  { href: '/dashboard/tasks',     label: 'Tasks',     icon: CheckSquare     },
  { href: '/dashboard/routines',  label: 'Routines',  icon: ListChecks      },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3       },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700/50">
        <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-lg">
          <Zap size={16} className="text-white" />
        </div>
        <span className="text-white font-bold text-lg tracking-tight">Dashboard</span>
        <button
          className="ml-auto lg:hidden text-gray-400 hover:text-white"
          onClick={onMobileClose}
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onMobileClose}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/60'
              )}
            >
              <Icon size={18} className="shrink-0" />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
            U
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">User</p>
            <p className="text-xs text-gray-400 truncate">user@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 border-r border-gray-700/50 shrink-0">
        <NavContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="relative flex flex-col w-64 bg-gray-900 z-50 animate-slide-in">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
