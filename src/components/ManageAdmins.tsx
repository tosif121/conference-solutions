'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Trash2, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import CreateAdmin from './CreateAdmin';

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
  const [searchQuery, setSearchQuery] = useState('');

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
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Manage Administrators</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Create and manage administrator accounts for the system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Admin Card */}
        <CreateAdmin />

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
