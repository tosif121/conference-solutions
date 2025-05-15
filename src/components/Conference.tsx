'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, PhoneCall, Folder, Activity, Edit, Plus } from 'lucide-react';
import CreateConferenceModal from './CreateConferenceModal';
import AudioModal from './AudioModal';
import DataTable from './DataTable';
import { conferenceService } from '@/utils/services';
import toast from 'react-hot-toast';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Button } from './ui/button';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  // Updated Conference interface to match the actual API response
  interface Conference {
    conferenceName: string;
    description: string;
    host: {
      name: string;
      phoneNumber: string;
    };
    guests: Array<{
      name: string;
      phoneNumber: string;
      guestArrivalMusic?: string;
    }>;
    welcomeAudioId: string;
    playWelcomeAudio: boolean;
    retryOnNoAnswer: boolean;
    retryCount: number;
    guestMute: boolean;
    announcementEnabled: boolean;
    id: string;
    status?: string;
    answerTime?: string | null;
    hangupTime?: string | null;
  }

  const [conferencesData, setConferencesData] = useState<Conference[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [editConference, setEditConference] = useState<Conference | undefined>(undefined);

  useEffect(() => {
    fetchConferences();
  }, []);

  const fetchConferences = async () => {
    setIsLoading(true);

    try {
      const res = await conferenceService.getAllConferences();
      if (res?.status) {
        // Assuming the API returns an array directly or in a nested property
        let conferences = Array.isArray(res.data) ? res.data : res.data.conferences || [];

        setConferencesData(conferences);
      } else {
        toast.error(res.message || 'Failed to fetch conferences');
      }
    } catch (err) {
      console.error('Error fetching conferences:', err);
      toast.error('Error fetching conferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await conferenceService.deleteConference(id);
      if (res.status) {
        setConferencesData((prev) => prev.filter((item) => item.id !== id));
        toast.success(res.message || 'Conference deleted successfully');
      } else {
        toast.error(res.message || 'Failed to delete Conference');
      }
    } catch (err) {
      toast.error('Something went wrong while deleting');
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const res = await conferenceService.getConferenceById(id);
      if (res.status) {
        toast.success(res.message || 'Retrieved conference details');
        setEditConference(res.data.conference);
        setOpen(true);
      } else {
        toast.error(res.message || 'Failed to fetch conference details');
      }
    } catch (err) {
      toast.error('Something went wrong while fetching conference details');
    }
  };

  const columns = useMemo(
    () => [
      {
        id: 'conferenceName',
        accessorKey: 'conferenceName',
        header: () => 'Conference Name',
        cell: ({ row }: { row: { original: Conference } }) => <span>{row.original.conferenceName}</span>,
      },
      {
        id: 'hostName',
        accessorKey: 'host.name',
        header: () => 'Host Name',
        cell: ({ row }: { row: { original: Conference } }) => <span>{row.original.host?.name || '-'}</span>,
      },
      {
        id: 'hostNumber',
        accessorKey: 'host.phoneNumber',
        header: () => 'Host Number',
        cell: ({ row }: { row: { original: Conference } }) => <span>{row.original.host?.phoneNumber || '-'}</span>,
      },
      {
        id: 'numberOfGuests',
        accessorKey: 'guests',
        header: () => 'Guests',
        cell: ({ row }: { row: { original: Conference } }) => <span>{row.original.guests?.length || 0}</span>,
      },
      {
        id: 'description',
        accessorKey: 'description',
        header: () => 'Description',
        cell: ({ row }: { row: { original: Conference } }) => (
          <span className="truncate max-w-[150px] block" title={row.original.description}>
            {row.original.description || '-'}
          </span>
        ),
      },
      {
        id: 'features',
        header: () => 'Features',
        cell: ({ row }: { row: { original: Conference } }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.playWelcomeAudio && (
              <Badge variant="secondary" className="text-xs">
                Welcome Audio
              </Badge>
            )}
            {row.original.guestMute && (
              <Badge variant="secondary" className="text-xs">
                Guest Mute
              </Badge>
            )}
            {row.original.announcementEnabled && (
              <Badge variant="secondary" className="text-xs">
                Announcements
              </Badge>
            )}
          </div>
        ),
      },
      {
        id: 'actions',
        header: () => 'Actions',
        disableSorting: true,
        cell: ({ row }: { row: { original: Conference } }) => (
          <div className="flex gap-x-4">
            <DeleteConfirmationModal
              onDelete={() => handleDelete(row.original.id)}
              itemName={`Conference ${row.original.conferenceName}`}
            />

            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
              title="Edit"
              onClick={() => handleEdit(row.original.id)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Conferences Management</h1>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CreateConferenceModal
            open={open}
            setOpen={setOpen}
            editConference={editConference}
            fetchConferences={fetchConferences}
          />
          <Button variant={'default'} className="flex items-center gap-2" onClick={() => setOpen(true)}>
            <Plus />
            Create Conference
          </Button>
          <AudioModal />
        </div>
      </div>

      <Card className="lg:col-span-2">
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400">Loading conferences...</div>
          ) : conferencesData?.length > 0 ? (
            <DataTable data={conferencesData} columns={columns} searchPlaceholder="Search Conferences..." />
          ) : (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400">No conferences found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
