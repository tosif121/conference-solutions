'use client';
import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';
import CreateAdmin from './CreateAdmin';
import { adminService } from '@/utils/services';
import DataTable from '../Reusable/DataTable';
import DeleteConfirmationModal from '../Reusable/DeleteConfirmationModal';
import TableSkeleton from '../Reusable/TableSkeleton';

export default function ManageAdmins() {
  interface Admin {
    username: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    assignedDids: string[];
    isDeleted?: boolean;
  }

  const [adminData, setAdminData] = useState<Admin[]>([]);
  const [adminByUsername, setAdminByUsername] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getAllAdmins();
      if (res?.status) {
        console.log(res);
        setAdminData(res.data.admins);
      } else {
        toast.error(res.message || 'Failed to fetch administrators');
      }
    } catch (err) {
      console.error('Error fetching administrators:', err);
      toast.error('Error fetching administrators');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleDelete = async (username: string) => {
    try {
      const res = await adminService.deleteAdmin(username);
      if (res.status) {
        setAdminData((prev) => prev.filter((item) => item.username !== username));
        toast.success(res.message);
      } else {
        toast.error(res.message || 'Failed to delete administrator');
      }
    } catch (err) {
      toast.error('Something went wrong while deleting');
    }
  };

  const handleEdit = async (username: string) => {
    try {
      const res = await adminService.getAdminByUsername(username);
      if (res.status) {
        setAdminByUsername(res.data.admin);
        toast.success(res.message);
      } else {
        toast.error(res.message || 'Failed to fetch administrator details');
      }
    } catch (err) {
      toast.error('Something went wrong while fetching administrator details');
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'username',
        accessorKey: 'username',
        header: () => 'User Name',
        cell: ({ row }: { row: { original: Admin } }) => <span>{row.original.username}</span>,
      },
      {
        id: 'name',
        accessorKey: 'name',
        header: () => 'Name',
        cell: ({ row }: { row: { original: Admin } }) => <span>{row.original.name}</span>,
      },
      {
        id: 'email',
        accessorKey: 'email',
        header: () => 'Email',
        cell: ({ row }: { row: { original: Admin } }) => <span>{row.original.email}</span>,
      },
      {
        id: 'phone',
        accessorKey: 'phone',
        header: () => 'Mobile',
        cell: ({ row }: { row: { original: Admin } }) => <span>{row.original.phone}</span>,
      },

      {
        id: 'assignedDids',
        accessorKey: 'assignedDids',
        header: () => 'Assigned DIDs',
        disableSorting: true,
        cell: ({ row }: { row: { original: Admin } }) => (
          <div className="flex flex-wrap gap-1 max-w-xs">
            {row.original.assignedDids && row.original.assignedDids.length > 0 ? (
              row.original.assignedDids.map((did, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {did}
                </Badge>
              ))
            ) : (
              <span className="text-slate-400 text-xs">No DIDs assigned</span>
            )}
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => 'Actions',
        disableSorting: true,
        cell: ({ row }: { row: { original: Admin } }) => (
          <div className="flex gap-x-4">
            <DeleteConfirmationModal
              onDelete={() => handleDelete(row.original.username)}
              itemName={`administrator "${row.original.username}"`}
            />

            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
              title="Edit"
              onClick={() => handleEdit(row.original.username)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const filteredAdmins = useMemo(() => {
    return adminData.filter((admin) => !admin.isDeleted);
  }, [adminData]);

  return (
    <div className="container mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Manage Administrators</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Create and manage administrator accounts for the system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CreateAdmin fetchAdmins={fetchAdmins} adminByUsername={adminByUsername} />

        <Card className="lg:col-span-2">
          <CardHeader className="pb-0 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Administrator Accounts</CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <TableSkeleton rowCount={10} columnCount={6} />
            ) : filteredAdmins.length > 0 ? (
              <DataTable data={filteredAdmins} columns={columns} searchPlaceholder="Search Admins..." />
            ) : (
              <div className="py-8 text-center text-slate-500 dark:text-slate-400">No administrators found.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
