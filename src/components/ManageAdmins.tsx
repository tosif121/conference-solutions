'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  UserPlus,
  Mail,
  User,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw
} from 'lucide-react'

// Mock data for existing admins
const existingAdmins = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', status: 'active', didCount: 3 },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', status: 'active', didCount: 2 },
  { id: '3', name: 'Charlie Davis', email: 'charlie@example.com', status: 'inactive', didCount: 0 },
  { id: '4', name: 'Diana Miller', email: 'diana@example.com', status: 'active', didCount: 4 },
  { id: '5', name: 'Edward Williams', email: 'edward@example.com', status: 'pending', didCount: 0 }
]

export default function ManageAdmins() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAdmin, setSelectedAdmin] = useState(null)

  const handleCreateAdmin = (e: { preventDefault: () => void }) => {
    if (e) e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Creating admin:', { name, email })
      // Reset form
      setName('')
      setEmail('')
      setIsLoading(false)
      // Show success toast (handled by react-hot-toast in real implementation)
    }, 1000)
  }

  const filteredAdmins = existingAdmins.filter(admin => 
    admin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'inactive': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
      case 'inactive': return <XCircle className="w-3.5 h-3.5 mr-1" />
      case 'pending': return <RefreshCw className="w-3.5 h-3.5 mr-1" />
      default: return null
    }
  }

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Manage Administrators</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create and manage administrator accounts for the system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Admin Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <UserPlus className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Create Admin User</CardTitle>
            </div>
            <CardDescription>Add a new administrator to the system</CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  Full Name
                </Label>
                <Input 
                  id="name"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g. John Smith"
                  className="h-10"
                  disabled={isLoading}
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  Email Address
                </Label>
                <Input 
                  id="email"
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@company.com"
                  className="h-10"
                  disabled={isLoading}
                  required 
                />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t dark:border-slate-800 pt-4">
            <Button variant="outline" disabled={isLoading}>Cancel</Button>
            <Button 
              onClick={handleCreateAdmin} 
              disabled={!name || !email || isLoading}
              className="relative"
            >
              {isLoading && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              )}
              <span className={isLoading ? 'opacity-0' : ''}>Create Admin</span>
            </Button>
          </CardFooter>
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
                        <td className="px-6 py-3 font-medium text-slate-700 dark:text-slate-300">{admin.name}</td>
                        <td className="px-6 py-3 text-slate-600 dark:text-slate-400">{admin.email}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(admin.status)}`}>
                            {getStatusIcon(admin.status)}
                            {admin.status.charAt(0).toUpperCase() + admin.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <Badge variant="outline" className="font-normal">
                            {admin.didCount}
                          </Badge>
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">No administrators found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 py-3 px-6">
            <p className="text-sm text-slate-500 dark:text-slate-400">Showing {filteredAdmins.length} of {existingAdmins.length} administrators</p>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}