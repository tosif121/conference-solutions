'use client';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, Mail, User, Loader2, Phone, Lock, AtSign, Plus, X, Hash, EyeOff, Eye, UserCog } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createAdmin, updateAdmin } from '@/utils/services';

interface Admin {
  username: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  assignedDids: string[];
  isDeleted?: boolean;
}

interface CreateAdminProps {
  fetchAdmins: () => void;
  adminByUsername?: Admin | null;
}

function CreateAdmin({ fetchAdmins, adminByUsername }: CreateAdminProps) {
  const initialFormState = {
    username: '',
    name: '',
    email: '',
    password: '',
    phone: '',
    rawPhone: '',
    assignedDids: [] as string[],
  };

  const [formData, setFormData] = useState<typeof initialFormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [newDid, setNewDid] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
    rawPhone?: string;
    assignedDids?: string;
  }>({});

  useEffect(() => {
    if (adminByUsername) {
      const rawPhone = adminByUsername.phone.startsWith('+91')
        ? adminByUsername.phone.substring(3)
        : adminByUsername.phone;

      setFormData({
        username: adminByUsername.username || '',
        name: adminByUsername.name || '',
        email: adminByUsername.email || '',
        password: adminByUsername.password || '',
        phone: adminByUsername.phone || '',
        rawPhone: rawPhone,
        assignedDids: adminByUsername.assignedDids || [],
      });
      setIsEditMode(true);
    } else {
      resetForm();
    }
  }, [adminByUsername]);

  useEffect(() => {
    if (formData.rawPhone) {
      setFormData((prev) => ({
        ...prev,
        phone: `+91${prev.rawPhone}`,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        phone: '',
      }));
    }
  }, [formData.rawPhone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target as { id: string; value: string };

    if (id === 'rawPhone') {
      const numbersOnly = value.replace(/\D/g, '');
      const limitedInput = numbersOnly.slice(0, 10);

      setFormData((prev) => ({ ...prev, rawPhone: limitedInput }));

      if (errors.phone || errors.rawPhone) {
        setErrors((prev) => ({ ...prev, phone: '', rawPhone: '' }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));

      if (errors[id as keyof typeof errors]) {
        setErrors((prev) => ({ ...prev, [id]: '' }));
      }
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
    setNewDid('');
    setIsEditMode(false);
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

    // Password validation - only required for new users
    if (!isEditMode && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (
      formData.password.trim() &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.password)
    ) {
      newErrors.password = 'Password must have 6+ chars, uppercase, lowercase, number & special char';
    }

    // Phone validation
    if (!formData.rawPhone.trim()) {
      newErrors.rawPhone = 'Phone number is required';
    } else if (formData.rawPhone.length !== 10) {
      newErrors.rawPhone = 'Phone number must be exactly 10 digits';
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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const adminData = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone, // This includes the +91 prefix
        assignedDids: formData.assignedDids,
      };

      let response;

      if (isEditMode) {
        // Update existing admin - pass username as first parameter
        response = await updateAdmin(formData.username, adminData);
      } else {
        // Create new admin - include username in the payload
        response = await createAdmin({
          ...adminData,
          username: formData.username,
        });
      }

      if (response.status) {
        // Success
        toast.success(response.message || `Admin ${isEditMode ? 'updated' : 'created'} successfully!`);
        fetchAdmins();
        // Reset form after successful operation
        resetForm();
      } else {
        // Error handling
        toast.error(response.message || `Failed to ${isEditMode ? 'update' : 'create'} admin.`);
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} admin:`, error);
      toast.error(`Operation failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    resetForm();
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-md ${
                isEditMode
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              }`}
            >
              {isEditMode ? <UserCog className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <CardTitle className="text-lg">{isEditMode ? 'Edit Admin User' : 'Create Admin User'}</CardTitle>
          </div>
        </div>
        <CardDescription>
          {isEditMode ? 'Update existing administrator details' : 'Add a new administrator to the system'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={isLoading || isEditMode} // Disable username editing in edit mode
              required
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username}</p>}
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-slate-500" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password.replace(/\s+/g, '')}
                onChange={handleChange}
                placeholder={isEditMode ? 'Enter new password or leave blank' : 'Enter Password'}
                className={`h-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                disabled={isLoading}
                required={!isEditMode}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rawPhone" className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-500" />
              Mobile Number
            </Label>
            <div className="flex">
              <div className="flex items-center justify-center bg-slate-100 dark:bg-slate-800 px-3 border border-r-0 rounded-l-md border-slate-200 dark:border-slate-700">
                +91
              </div>
              <Input
                id="rawPhone"
                type="text"
                inputMode="numeric"
                value={formData.rawPhone}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                className={`h-10 rounded-l-none ${errors.rawPhone ? 'border-red-500 focus:ring-red-500' : ''}`}
                disabled={isLoading}
                required
              />
            </div>
            {errors.rawPhone && <p className="text-xs text-red-500 mt-1">{errors.rawPhone}</p>}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Hash className="h-3.5 w-3.5 text-slate-500" />
              Assigned DIDs
            </Label>

            <div className="flex flex-wrap gap-2 mb-2">
              {formData.assignedDids.length > 0
                ? formData.assignedDids.map((did) => (
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
                : ''}
            </div>

            <div className="relative">
              <div className="flex">
                <Input
                  value={newDid}
                  onChange={(e) => {
                    // Only allow digits and limit to 10 characters for DIDs
                    const numbersOnly = e.target.value.replace(/\D/g, '');
                    const limitedInput = numbersOnly.slice(0, 10);
                    setNewDid(limitedInput);
                  }}
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
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : isEditMode ? (
                  <UserCog className="h-4 w-4 mr-2" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                {isLoading
                  ? isEditMode
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditMode
                  ? 'Update Admin'
                  : 'Create Admin'}
              </Button>

              {isEditMode && (
                <Button type="button" variant="outline" onClick={cancelEdit} disabled={isLoading}>
                  Cancel
                </Button>
              )}
            </div>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}

export default CreateAdmin;
