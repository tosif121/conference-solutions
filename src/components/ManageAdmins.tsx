'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  UserPlus,
  Mail,
  User,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Loader2,
  Phone,
  Lock,
  AtSign,
  Plus,
  X,
  Hash,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Mock available DIDs
const availableDids = [
  '1001001001',
  '1001001002',
  '1001001003',
  '1001001004',
  '1001001005',
  '1001001006',
  '1001001007',
  '1001001008',
  '1001001009',
  '1001001010',
];

// Mock data for existing admins
const existingAdmins = [
  {
    id: '1',
    username: 'alicejohn',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    status: 'active',
    didCount: 3,
    phone: '+15551234567',
    assignedDids: ['1001001003', '1001001004', '1001001005'],
  },
  {
    id: '2',
    username: 'bobsmith',
    name: 'Bob Smith',
    email: 'bob@example.com',
    status: 'active',
    didCount: 2,
    phone: '+15552345678',
    assignedDids: ['1001001006', '1001001007'],
  },
  {
    id: '3',
    username: 'charlie',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    status: 'inactive',
    didCount: 0,
    phone: '+15553456789',
    assignedDids: [],
  },
  {
    id: '4',
    username: 'dianam',
    name: 'Diana Miller',
    email: 'diana@example.com',
    status: 'active',
    didCount: 4,
    phone: '+15554567890',
    assignedDids: ['1001001008', '1001001009', '1001001010', '1001001011'],
  },
  {
    id: '5',
    username: 'edwardw',
    name: 'Edward Williams',
    email: 'edward@example.com',
    status: 'pending',
    didCount: 0,
    phone: '+15555678901',
    assignedDids: [],
  },
  {
    id: '6',
    username: 'surya',
    name: 'Surya Rathore',
    email: 'surya@iotcom.io',
    status: 'active',
    didCount: 2,
    phone: '+919784428342',
    assignedDids: ['1001001001', '1001001002'],
  },
];

export default function ManageAdmins() {
  const [formData, setFormData] = useState<{
    username: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    assignedDids: string[];
  }>({
    username: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    assignedDids: [],
  });

  const [newDid, setNewDid] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showDidDropdown, setShowDidDropdown] = useState(false);

  // Get available DIDs (filtering out already assigned ones)
  const getAvailableDids = () => {
    const allAssignedDids = existingAdmins.flatMap((admin) => admin.assignedDids).concat(formData.assignedDids);

    return availableDids.filter((did) => !allAssignedDids.includes(did));
  };

  // Handle form field changes
  const handleChange = (e: { target: { id: any; value: any } }) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error when user types
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  // Add DID to assigned list
  const addDid = (didToAdd: string) => {
    if (!didToAdd.trim()) return;

    // Check if DID is already assigned
    if (formData.assignedDids.includes(didToAdd)) {
      toast.error('This DID is already assigned');
      return;
    }

    // Check if DID is assigned to someone else
    const isAssignedToOther = existingAdmins.some((admin) => admin.assignedDids.includes(didToAdd));

    if (isAssignedToOther) {
      toast.error('This DID is already assigned to another administrator');
      return;
    }

    // Validate DID format (assuming 10-digit number format)
    if (!/^\d{10}$/.test(didToAdd)) {
      toast.error('Invalid DID format. Should be a 10-digit number');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      assignedDids: [...prev.assignedDids, didToAdd],
    }));

    setNewDid('');
    setShowDidDropdown(false);
    toast.success(`DID ${didToAdd} assigned successfully`);
  };

  // Remove DID from assigned list
  const removeDid = (didToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      assignedDids: prev.assignedDids.filter((did) => did !== didToRemove),
    }));
    toast.success(`DID ${didToRemove} removed`);
  };

  // Form validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (existingAdmins.some((admin) => admin.username === formData.username)) {
      newErrors.username = 'Username already taken';
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Full name is required';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    } else if (existingAdmins.some((admin) => admin.email === formData.email)) {
      newErrors.email = 'Email already registered';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.password)) {
      newErrors.password = 'Password must have 6+ chars, uppercase, lowercase, number & special char';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must start with + and have 10-15 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateAdmin = (e: { preventDefault: () => void }) => {
    if (e) e.preventDefault();

    // Validate form first
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Creating admin:', formData);

      // Show success toast
      toast.success(`Admin ${formData.username} created successfully!`);

      // Reset form
      setFormData({
        username: '',
        name: '',
        email: '',
        password: '',
        phone: '',
        assignedDids: [],
      });

      setIsLoading(false);
    }, 1500);
  };

  const filteredAdmins = existingAdmins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'inactive':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      case 'inactive':
        return <XCircle className="w-3.5 h-3.5 mr-1" />;
      case 'pending':
        return <RefreshCw className="w-3.5 h-3.5 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto space-y-8">
      {/* Toast Container */}
      <Toaster position="top-right" />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Manage Administrators</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Create and manage administrator accounts for the system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Admin Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  <UserPlus className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Create Admin User</CardTitle>
              </div>
            </div>
            <CardDescription>Add a new administrator to the system</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-1.5">
                  <AtSign className="h-3.5 w-3.5 text-slate-500" />
                  Username
                </Label>
                <Input
                  id="username"
                  value={formData.username.replace(/\s+/g, '')}
                  onChange={handleChange}
                  placeholder="e.g. johnsmith"
                  className={`h-10 ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={isLoading}
                  required
                />
                {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
              </div>

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. John Smith"
                  className={`h-10 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={isLoading}
                  required
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="text"
                  value={formData.email.replace(/\s+/g, '')}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`h-10 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={isLoading}
                  required
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-slate-500" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password.replace(/\s+/g, '')}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`h-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={isLoading}
                  required
                />
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-500" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 1234567890"
                  className={`h-10 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                  disabled={isLoading}
                  required
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Assigned DIDs Field */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-slate-500" />
                  Assigned DIDs
                </Label>

                {/* Selected DIDs display */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.assignedDids.length > 0 ? (
                    formData.assignedDids.map((did) => (
                      <Badge key={did} variant="secondary" className="py-1 flex items-center gap-1 group">
                        {did}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 p-0 text-slate-400 hover:text-red-500"
                          onClick={() => removeDid(did)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No DIDs assigned</p>
                  )}
                </div>

                {/* DID selection interface */}
                <div className="relative">
                  <div className="flex">
                    <Input
                      value={newDid}
                      onChange={(e) => setNewDid(e.target.value)}
                      onFocus={() => setShowDidDropdown(true)}
                      placeholder="Add DID number"
                      className="h-10 rounded-r-none"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="rounded-l-none"
                      onClick={() => {
                        if (newDid) addDid(newDid);
                      }}
                      disabled={isLoading || !newDid}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  {/* Available DIDs dropdown */}
                  {showDidDropdown && getAvailableDids().length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg max-h-48 overflow-y-auto">
                      <div className="p-1">
                        {getAvailableDids().map((did) => (
                          <button
                            type="button"
                            key={did}
                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                            onClick={() => addDid(did)}
                          >
                            {did}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <CardFooter className="flex justify-between pt-4 px-0">
                <Button type="submit" disabled={isLoading} className="relative">
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Creating...' : 'Create Admin'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({
                      username: '',
                      name: '',
                      email: '',
                      password: '',
                      phone: '',
                      assignedDids: [],
                    });
                    setErrors({});
                  }}
                  disabled={isLoading}
                >
                  Reset
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>

        {/* Admin List Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Administrator Accounts</CardTitle>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-slate-500" />
                <Input
                  placeholder="Search admins..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-9 w-full sm:w-64"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left font-medium text-slate-500 dark:text-slate-400 px-6 py-3">Username</th>
                    <th className="text-left font-medium text-slate-500 dark:text-slate-400 px-6 py-3">Name</th>
                    <th className="text-left font-medium text-slate-500 dark:text-slate-400 px-6 py-3">Email</th>
                    <th className="text-left font-medium text-slate-500 dark:text-slate-400 px-6 py-3">Status</th>
                    <th className="text-left font-medium text-slate-500 dark:text-slate-400 px-6 py-3">DIDs</th>
                    <th className="text-left font-medium text-slate-500 dark:text-slate-400 px-6 py-3 w-16">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.length > 0 ? (
                    filteredAdmins.map((admin) => (
                      <tr
                        key={admin.id}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">{admin.username}</td>
                        <td className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">{admin.name}</td>
                        <td className="px-6 py-3 text-slate-600 dark:text-slate-400">{admin.email}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              admin.status
                            )}`}
                          >
                            {getStatusIcon(admin.status)}
                            {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex flex-wrap gap-1 max-w-[240px]">
                            {admin.assignedDids.length > 0 ? (
                              admin.assignedDids.map((did) => (
                                <Badge key={did} variant="outline" className="font-normal text-xs">
                                  {did}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500">No DIDs</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                              onClick={() => {
                                toast.success(`Edit ${admin.username} details`);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              onClick={() => {
                                toast.success(`${admin.username} deleted successfully`);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                        No administrators found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 py-3 px-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {filteredAdmins.length} of {existingAdmins.length} administrators
            </p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
