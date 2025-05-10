'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { Eye, EyeOff, Lock, User, Shield, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });
  const router = useRouter();

  const validate = () => {
    let valid = true;
    let newErrors = { username: '', password: '' };

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    // Simulate API call with small delay
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        Cookies.set('admin_token', 'your-token-value', {
          expires: 1, // 1 day
          path: '/',
        });
        toast.success('Login Successful');
        router.push('/admin/dashboard');
      } else {
        toast.error('Invalid credentials');
        setIsLoading(false);
      }
    }, 800);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-3 rounded-full">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>

        <Card className="w-full shadow-2xl border-0 overflow-hidden">
          {/* Header Strip */}
          <div className="h-2.5 bg-primary w-full"></div>

          <CardContent className="p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
              <p className="text-sm text-muted-foreground mt-2">Call Conference Controls</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username.replace(/\s+/g, '')}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 px-4"
                  required
                  autoComplete="username"
                  disabled={isLoading}
                />
                {errors.username && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium flex items-center gap-1.5">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password.replace(/\s+/g, '')}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 px-4 pr-10"
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-0"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:text-primary/80 hover:underline"
                  onClick={() => toast('Password reset functionality not implemented')}
                >
                  Forgot password?
                </button>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full h-12 font-medium transition-all" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                      Authenticating...
                    </div>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </Button>
              </div>

              <div className="pt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Protected admin area. Unauthorized access is prohibited and all actions are monitored.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} iotcom. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
