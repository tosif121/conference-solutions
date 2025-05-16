'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertCircle,
  AlignLeft,
  Check,
  Download,
  LinkIcon,
  Phone,
  Plus,
  Search,
  SearchIcon,
  Trash2,
  UnlinkIcon,
  Upload,
  User,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';

// Mock data
const admins = [
  { id: 'admin1', name: 'Alice Johnson', didCount: 3 },
  { id: 'admin2', name: 'Bob Smith', didCount: 2 },
  { id: 'admin3', name: 'Charlie Davis', didCount: 0 },
  { id: 'admin4', name: 'Diana Miller', didCount: 4 },
];

const availableDIDs = [
  { id: 'did1', number: '+911234567890', status: 'available' },
  { id: 'did2', number: '+918765432100', status: 'available' },
  { id: 'did3', number: '+919876543210', status: 'available' },
];

const assignedDIDs = [
  { id: 'did4', number: '+917654321098', admin: 'Alice Johnson', assignedDate: '2025-04-10' },
  { id: 'did5', number: '+912345678901', admin: 'Bob Smith', assignedDate: '2025-04-15' },
  { id: 'did6', number: '+913456789012', admin: 'Diana Miller', assignedDate: '2025-05-01' },
  { id: 'did7', number: '+914567890123', admin: 'Alice Johnson', assignedDate: '2025-05-02' },
  { id: 'did8', number: '+915678901234', admin: 'Alice Johnson', assignedDate: '2025-05-03' },
  { id: 'did9', number: '+916789012345', admin: 'Bob Smith', assignedDate: '2025-05-05' },
  { id: 'did10', number: '+917890123456', admin: 'Diana Miller', assignedDate: '2025-05-06' },
  { id: 'did11', number: '+918901234567', admin: 'Diana Miller', assignedDate: '2025-05-07' },
  { id: 'did12', number: '+919012345678', admin: 'Diana Miller', assignedDate: '2025-05-08' },
];

// Helper function to validate DID format
const isValidDIDFormat = (didNumber: string) => {
  // Validates international phone number format with country code
  // Format example: +911234567890
  return /^\+\d{1,3}\d{10,12}$/.test(didNumber);
};

// Helper function to check if DID is already assigned
const isDidAssigned = (didNumber: string) => {
  return assignedDIDs.some((did) => did.number === didNumber);
};

export default function AssignDIDs() {
  const [adminId, setAdminId] = useState('');
  const [did, setDid] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('assign');
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [selectedDIDs, setSelectedDIDs] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showCreateDIDDialog, setShowCreateDIDDialog] = useState(false);
  const [newDIDNumber, setNewDIDNumber] = useState('');
  const [formData, setFormData] = useState({
    assignedDids: [],
  });

  const validateDID = (didNumber: string) => {
    // Reset previous error
    setValidationError('');

    // Validate DID format
    if (!isValidDIDFormat(didNumber)) {
      setValidationError('Invalid DID format. Must include country code (e.g., +911234567890)');
      return false;
    }

    return true;
  };

  const handleAssign = () => {
    if (!adminId || !did) {
      return;
    }

    // Validate selected DID
    if (!validateDID(did)) {
      return;
    }

    // Check if this DID is already assigned to another admin
    if (isDidAssigned(did)) {
      setValidationError('This DID is already assigned to an administrator');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const adminName = admins.find((a) => a.id === adminId)?.name;
      setSuccessMessage(`Successfully assigned ${did} to ${adminName}`);
      setAdminId('');
      setDid('');
      setIsLoading(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleCreateDID = () => {
    if (!newDIDNumber) {
      return;
    }

    // Validate new DID
    if (!validateDID(newDIDNumber)) {
      return;
    }

    // Check if DID already exists
    const didExists = [...availableDIDs, ...assignedDIDs].some((did) => did.number === newDIDNumber);
    if (didExists) {
      setValidationError('This DID already exists in the system');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage(`Successfully created new DID: ${newDIDNumber}`);
      setNewDIDNumber('');
      setShowCreateDIDDialog(false);
      setIsLoading(false);
      setValidationError('');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleBulkUpload = () => {
    if (!bulkFile) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage('Successfully processed bulk upload');
      setBulkFile(null);
      setIsLoading(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1500);
  };

  const handleFileChange = (e: { target: { files: any; }; }) => {
    const files = e.target.files;
    if (files && files[0]) {
      setBulkFile(files[0]);
    }
  };

  const handleUnassign = () => {
    if (selectedDIDs.length === 0) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setSuccessMessage(`Successfully unassigned ${selectedDIDs.length} DID${selectedDIDs.length > 1 ? 's' : ''}`);
      setSelectedDIDs([]);
      setShowConfirmDialog(false);
      setIsLoading(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1000);
  };

  const handleSelectDID = (didId: string) => {
    setSelectedDIDs((prev) => {
      if (prev.includes(didId)) {
        return prev.filter((id) => id !== didId);
      } else {
        return [...prev, didId];
      }
    });
  };

  const handleSelectAllDIDs = () => {
    if (selectedDIDs.length === filteredAssignedDIDs.length) {
      setSelectedDIDs([]);
    } else {
      setSelectedDIDs(filteredAssignedDIDs.map((did) => did.id));
    }
  };

  const filteredAssignedDIDs = assignedDIDs.filter(
    (did) => did.number.includes(searchQuery) || did.admin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadTemplate = () => {
    // In a real implementation, this would generate and download a CSV template
    console.log('Downloading template file');
  };

  // Reset validation error when changing tabs or closing dialogs
  const resetValidationError = () => {
    setValidationError('');
  };

  return (
    <div className="container mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">DID Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign and manage DID numbers for administrators
          </p>
        </div>

        <Dialog
          open={showCreateDIDDialog}
          onOpenChange={(open) => {
            setShowCreateDIDDialog(open);
            if (!open) resetValidationError();
          }}
        >
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              Create DID
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New DID</DialogTitle>
              <DialogDescription>Add a new DID number to the system with its initial status.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="did-number" className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-slate-500" />
                  DID Number
                </Label>
                <Input
                  id="did-number"
                  placeholder="+911234567890"
                  value={newDIDNumber}
                  onChange={(e) => {
                    setNewDIDNumber(e.target.value);
                    resetValidationError();
                  }}
                />
                <p className="text-xs text-slate-500">Enter the DID number with country code (e.g., +911234567890)</p>
              </div>

              {validationError && (
                <Alert className="bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/30">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-500" />
                  <AlertDescription className="text-red-700 dark:text-red-400">{validationError}</AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDIDDialog(false)} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleCreateDID} disabled={!newDIDNumber || isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-1.5">
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Plus className="h-4 w-4" />
                    Create DID
                  </div>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {successMessage && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30">
          <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
          <AlertDescription className="text-green-700 dark:text-green-400">{successMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs
        value={currentTab}
        onValueChange={(val) => {
          setCurrentTab(val);
          resetValidationError();
        }}
        className="w-full"
      >
        <TabsList className="grid w-full md:w-auto grid-cols-3 mb-6">
          <TabsTrigger value="assign" className="flex items-center gap-1.5">
            <LinkIcon className="h-4 w-4" />
            Assign DIDs
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center gap-1.5">
            <AlignLeft className="h-4 w-4" />
            Manage Assignments
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-1.5">
            <Upload className="h-4 w-4" />
            Bulk Upload
          </TabsTrigger>
        </TabsList>

        {/* Assign DIDs Tab */}
        <TabsContent value="assign" className="mt-0">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <Phone className="h-5 w-5" />
                </div>
                <CardTitle>Assign DID to Admin</CardTitle>
              </div>
              <CardDescription>Connect a DID number to an administrator account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-slate-500" />
                    Select Administrator
                  </Label>
                  <Select onValueChange={setAdminId} value={adminId} disabled={isLoading}>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Choose an admin" />
                    </SelectTrigger>
                    <SelectContent>
                      {admins.map((admin) => (
                        <SelectItem key={admin.id} value={admin.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{admin.name}</span>
                            <Badge variant={admin.didCount > 0 ? 'secondary' : 'outline'} className="ml-2">
                              {admin.didCount} DIDs
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-slate-500" />
                    Select DID Number
                  </Label>
                  <Select
                    onValueChange={(value) => {
                      setDid(value);
                      resetValidationError();
                    }}
                    value={did}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Choose a DID number" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDIDs.map((did) => (
                        <SelectItem key={did.id} value={did.number}>
                          {did.number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t bg-slate-50 dark:bg-slate-900/50 px-6 py-4">
              <Button onClick={handleAssign} disabled={!adminId || !did || isLoading} className="ml-auto">
                {isLoading ? (
                  <div className="flex items-center gap-1.5">
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    Assigning...
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <LinkIcon className="h-4 w-4" />
                    Assign DID
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Manage Assignments Tab */}
        <TabsContent value="manage" className="mt-0">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    <AlignLeft className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Manage DID Assignments</CardTitle>
                    <CardDescription>View and modify existing DID assignments</CardDescription>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <Input
                      placeholder="Search DIDs or admins"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-10 w-full md:w-64"
                    />
                  </div>
                  {selectedDIDs.length > 0 && (
                    <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="h-10">
                          <UnlinkIcon className="h-4 w-4 mr-1.5" />
                          Unassign ({selectedDIDs.length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Unassignment</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to unassign {selectedDIDs.length} DID
                            {selectedDIDs.length > 1 ? 's' : ''}? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isLoading}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleUnassign} disabled={isLoading}>
                            {isLoading ? (
                              <div className="flex items-center gap-1.5">
                                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                                Processing...
                              </div>
                            ) : (
                              'Confirm Unassignment'
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 dark:bg-slate-900/50">
                      <TableHead className="w-12">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            checked={selectedDIDs.length > 0 && selectedDIDs.length === filteredAssignedDIDs.length}
                            onChange={handleSelectAllDIDs}
                          />
                        </div>
                      </TableHead>
                      <TableHead>DID Number</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Assigned Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAssignedDIDs.length > 0 ? (
                      filteredAssignedDIDs.map((did) => (
                        <TableRow key={did.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                checked={selectedDIDs.includes(did.id)}
                                onChange={() => handleSelectDID(did.id)}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{did.number}</TableCell>
                          <TableCell>{did.admin}</TableCell>
                          <TableCell>{did.assignedDate}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleSelectDID(did.id)}
                            >
                              <Trash2 className="h-4 w-4 text-slate-500 hover:text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <SearchIcon className="h-8 w-8 mb-2 text-slate-400" />
                            <p>No matching DIDs found</p>
                            {searchQuery && (
                              <Button variant="link" onClick={() => setSearchQuery('')} className="mt-1">
                                Clear search
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bulk Upload Tab */}
        <TabsContent value="bulk" className="mt-0">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Bulk DID Assignment</CardTitle>
                  <CardDescription>Upload a CSV file to assign multiple DIDs at once</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/30">
                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                <AlertDescription className="text-blue-700 dark:text-blue-400">
                  Use the template file for correct format. Required columns: DID Number, Administrator ID.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col md:flex-row gap-4">
                <Button variant="outline" className="flex items-center gap-1.5" onClick={downloadTemplate}>
                  <Download className="h-4 w-4" />
                  Download Template
                </Button>

                <div className="flex-1">
                  <Label htmlFor="csvFile" className="sr-only">
                    Upload CSV
                  </Label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md">
                    <div className="space-y-2 text-center">
                      <div className="mx-auto h-12 w-12 text-slate-400 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Upload className="h-6 w-6" />
                      </div>
                      <div className="flex text-sm text-slate-600 dark:text-slate-400">
                        <label
                          htmlFor="csvFile"
                          className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 focus-within:outline-none"
                        >
                          <span>Upload a CSV file</span>
                          <input
                            id="csvFile"
                            name="csvFile"
                            type="file"
                            accept=".csv"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {bulkFile ? bulkFile.name : 'CSV files only, max 5MB'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t bg-slate-50 dark:bg-slate-900/50 px-6 py-4">
              <Button onClick={handleBulkUpload} disabled={!bulkFile || isLoading} className="ml-auto">
                {isLoading ? (
                  <div className="flex items-center gap-1.5">
                    <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Upload className="h-4 w-4" />
                    Process Upload
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
