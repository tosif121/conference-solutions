'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import ThemeToggle from './ThemeProvider';
import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  LogOut,
  ChevronDown,
  User,
  Settings,
  Shield,
  LayoutDashboard,
  Users,
  Phone,
  HeadsetIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<'super_admin' | 'admin' | null>(null);

  useEffect(() => {
    const conferenceToken = Cookies.get('conference_token');
    const role = Cookies.get('user_role');

    if (conferenceToken) {
      if (role === 'super_admin') {
        setUserRole('super_admin');
      } else if (role === 'admin') {
        setUserRole('admin');
      } else {
        Cookies.remove('conference_token', { path: '/' });
        Cookies.remove('user_role', { path: '/' });
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  const getNavLinks = () => {
    const commonLinks = [
      {
        name: 'Dashboard',
        href: userRole === 'admin' ? '/admin/dashboard' : '/super-admin/dashboard',
        icon: <LayoutDashboard className="w-4 h-4" />,
      },
    ];

    const superAdminLinks = [
      {
        name: 'Manage Admins',
        href: '/super-admin/users',
        icon: <Users className="w-4 h-4" />,
      },
      {
        name: 'Assign DIDs',
        href: '/super-admin/dids',
        icon: <Phone className="w-4 h-4" />,
      },
    ];

    const adminLinks = [
      {
        name: 'Conferences',
        href: '/admin/conferences',
        icon: <HeadsetIcon className="w-4 h-4" />,
      },
    ];
    if (userRole === 'super_admin') {
      return [...commonLinks, ...superAdminLinks];
    } else if (userRole === 'admin') {
      return [...commonLinks, ...adminLinks];
    }

    return commonLinks;
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  const handleLogout = () => {
    Cookies.remove('conference_token', { path: '/' });
    Cookies.remove('user_role', { path: '/' });
    toast.success('Logged out!');
    router.push('/');
  };

  const navLinks = getNavLinks();

  return (
    <header className="w-full bg-white dark:bg-slate-900 shadow-md border-b border-border sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between h-16">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-bold text-slate-800 dark:text-white hidden sm:block">Call Conference</span>
          <span className="text-sm font-medium text-primary/80 hidden sm:block">
            | {userRole === 'super_admin' ? 'Super Admin' : 'Admin'}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <nav className="flex gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5',
                    isActive
                      ? 'bg-primary dark:bg-slate-500 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60'
                  )}
                >
                  {link.icon}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="h-6 w-px bg-border mx-1"></div>

          <div className="relative">
            <Button variant="ghost" size="sm" onClick={toggleUserMenu} className="flex items-center gap-1.5 px-3 py-2">
              <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="hidden sm:inline">{userRole === 'super_admin' ? 'Super Admin' : 'Admin'}</span>
              <ChevronDown className={cn('w-4 h-4', userMenuOpen && 'rotate-180')} />
            </Button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-border rounded-md shadow-md z-50">
                <div className="py-1">
                  <Link
                    href={userRole === 'super_admin' ? '/super-admin/profile' : '/admin/profile'}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                  >
                    <User className="w-4 h-4" />
                    Your Profile
                  </Link>
                  <Link
                    href={userRole === 'super_admin' ? '/super-admin/settings' : '/admin/settings'}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </div>
                <div className="py-1 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />
        </div>

        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button onClick={toggleMobileMenu} className="p-1.5 rounded-md hover:bg-muted">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-border px-4 py-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm',
                  isActive ? 'bg-primary text-white' : 'hover:bg-muted'
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-muted"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}
