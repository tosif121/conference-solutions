'use client';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, Mail, User, Loader2, Phone, Lock, AtSign, Plus, X, Hash } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createAdmin } from '@/utils/services';

function CreateAdmin() {
  const initialFormState = {
    username: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    assignedDids: [] as string[],
  };

  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [newDid, setNewDid] = useState('');
  const [errors, setErrors] = useState<{
    username?: string;
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    assignedDids?: string;
  }>({});
  const [showDidDropdown, setShowDidDropdown] = useState(false);

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target as { id: keyof typeof errors; value: string };
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear error when user types
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setNewDid('');
    setShowDidDropdown(false);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.password)) {
      newErrors.password = 'Password must have 6+ chars, uppercase, lowercase, number & special char';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must start with + and have 10-15 digits';
    }

    // Check if at least one DID is assigned
    if (formData.assignedDids.length === 0) {
      newErrors.assignedDids = 'At least one DID must be assigned';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add DID to assigned list
  const addDid = (didToAdd: string) => {
    if (!didToAdd.trim()) return;

    // Check if DID is already assigned
    if (formData.assignedDids.includes(didToAdd)) {
      toast.error('This DID is already assigned');
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

    // Clear DID error if it exists
    if (errors.assignedDids) {
      setErrors((prev) => ({ ...prev, assignedDids: '' }));
    }

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

  const handleCreateAdmin = async (e: { preventDefault: () => void; }) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Call the actual API endpoint with the correct formData values
      const response = await createAdmin({
        username: formData.username,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        assignedDids: formData.assignedDids,
      });

      if (response.status) {
        // Success
        toast.success(response.message || 'Admin created successfully!');

        // Reset form after successful creation
        resetForm();
      } else {
        // Error handling
        toast.error(response.message || 'Failed to create admin.');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
      toast.error('Creation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              placeholder="Enter Username"
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
              placeholder="Enter Full Name"
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
              placeholder="Enter Email Address"
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
              placeholder="Enter Password"
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
              Mobile Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Mobile Number with + prefix"
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
                  placeholder="Enter 10-digit DID Number"
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
              {errors.assignedDids && <p className="text-xs text-red-500 mt-1">{errors.assignedDids}</p>}
            </div>
          </div>

          <CardFooter className="flex justify-between pt-4 px-0">
            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading} className="relative">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
                {isLoading ? 'Creating...' : 'Create Admin'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

export default CreateAdmin;
