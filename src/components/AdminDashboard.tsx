'use client';

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, PhoneCall, Folder, Activity, Edit } from 'lucide-react';
import CreateConferenceModal from './CreateConferenceModal';
import WelcomeAudioModal from './WelcomeAudioModal';
import DataTable from './DataTable';
import { conferenceService } from '@/utils/services';
import toast from 'react-hot-toast';
import moment from 'moment';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Button } from './ui/button';
import DateRangePicker from './DateRangePicker';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  interface Conference {
    _id: string;
    hostNumber: string;
    adminUser: string;
    dialedNumber: string;
    numberOfGuests: number;
    status: string;
    conference: string;
    type: string;
    answerTime: string | null;
    hangupTime: string | null;
  }

  const [conferencesData, setConferencesData] = useState<Conference[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Set initial date range only once on component mount
  useEffect(() => {
    const today = moment().endOf('day');
    const sevenDaysAgo = moment().subtract(7, 'days').startOf('day');

    setStartDate(sevenDaysAgo.format('YYYY-MM-DD'));
    setEndDate(today.format('YYYY-MM-DD'));

    // Initial data fetch will happen in the next useEffect when startDate and endDate are set
  }, []);

  // Fetch conferences only when both dates are available and either date changes
  useEffect(() => {
    if (startDate && endDate) {
      fetchConferences();
    }
  }, [startDate, endDate]);

  const fetchConferences = async () => {
    setIsLoading(true);

    try {
      const res = await conferenceService.getAllConferences();
      if (res?.status) {
        console.log(res.data);
        setConferencesData(res.data);
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

  // Handle date picker changes - combine all state updates to prevent multiple renders
  const handleDateChange = (update: [Date | null, Date | null]) => {
    if (Array.isArray(update) && update.length === 2 && update[0] && update[1]) {
      // Update date range state

      // Format dates for API calls
      const formattedStartDate = moment(update[0]).format('YYYY-MM-DD');
      const formattedEndDate = moment(update[1]).format('YYYY-MM-DD');

      // Update date strings in a single batch to minimize renders
      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);

      // The fetchConferences will be triggered by the useEffect that depends on startDate and endDate
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await conferenceService.deleteConference(id);
      if (res.status) {
        setConferencesData((prev) => prev.filter((item) => item._id !== id));
        toast.success(res.message);
      } else {
        toast.error(res.message || 'Failed to delete Conferences');
      }
    } catch (err) {
      toast.error('Something went wrong while deleting');
    }
  };

  const handleEdit = async (username: string) => {
    try {
      const res = await conferenceService.getConferenceById(username);
      if (res.status) {
        // setAdminByUsername(res.data.admin);
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
        id: 'hostNumber',
        accessorKey: 'hostNumber',
        header: () => 'Host Number',
        cell: ({ row }: { row: { original: { hostNumber: string } } }) => <span>{row.original.hostNumber}</span>,
      },
      {
        id: 'adminUser',
        accessorKey: 'adminUser',
        header: () => 'Admin User',
        cell: ({ row }: { row: { original: { adminUser: string } } }) => <span>{row.original.adminUser}</span>,
      },
      {
        id: 'dialedNumber',
        accessorKey: 'dialedNumber',
        header: () => 'Dialed Number',
        cell: ({ row }: { row: { original: { dialedNumber: string } } }) => <span>{row.original.dialedNumber}</span>,
      },
      {
        id: 'numberOfGuests',
        accessorKey: 'numberOfGuests',
        header: () => 'Guests',
        cell: ({ row }: { row: { original: { numberOfGuests: number } } }) => (
          <span>{row.original.numberOfGuests}</span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'status',
        header: () => 'Status',
        cell: ({ row }: { row: { original: { status: string } } }) => <span>{row.original.status}</span>,
      },
      {
        id: 'conference',
        accessorKey: 'conference',
        header: () => 'Conference',
        cell: ({ row }: { row: { original: { conference: string } } }) => <span>{row.original.conference}</span>,
      },
      {
        id: 'type',
        accessorKey: 'type',
        header: () => 'Type',
        cell: ({ row }: { row: { original: { type: string } } }) => <span>{row.original.type}</span>,
      },
      // {
      //   id: 'guestChannels',
      //   accessorKey: 'guestChannels',
      //   header: () => 'Guest Channels',
      //   disableSorting: true,
      //   cell: ({ row }: { row: { original: any } }) => (
      //     <div className="flex flex-col gap-1 max-w-xs">
      //       {row.original.guestChannels && row.original.guestChannels.length > 0 ? (
      //         row.original.guestChannels.map(
      //           (
      //             guest: {
      //               name:
      //                 | string
      //                 | number
      //                 | bigint
      //                 | boolean
      //                 | ReactElement<unknown, string | JSXElementConstructor<any>>
      //                 | Iterable<ReactNode>
      //                 | ReactPortal
      //                 | Promise<
      //                     | string
      //                     | number
      //                     | bigint
      //                     | boolean
      //                     | ReactPortal
      //                     | ReactElement<unknown, string | JSXElementConstructor<any>>
      //                     | Iterable<ReactNode>
      //                     | null
      //                     | undefined
      //                   >
      //                 | null
      //                 | undefined;
      //               phoneNumber:
      //                 | string
      //                 | number
      //                 | bigint
      //                 | boolean
      //                 | ReactElement<unknown, string | JSXElementConstructor<any>>
      //                 | Iterable<ReactNode>
      //                 | ReactPortal
      //                 | Promise<
      //                     | string
      //                     | number
      //                     | bigint
      //                     | boolean
      //                     | ReactPortal
      //                     | ReactElement<unknown, string | JSXElementConstructor<any>>
      //                     | Iterable<ReactNode>
      //                     | null
      //                     | undefined
      //                   >
      //                 | null
      //                 | undefined;
      //               status:
      //                 | string
      //                 | number
      //                 | bigint
      //                 | boolean
      //                 | ReactElement<unknown, string | JSXElementConstructor<any>>
      //                 | Iterable<ReactNode>
      //                 | ReactPortal
      //                 | Promise<
      //                     | string
      //                     | number
      //                     | bigint
      //                     | boolean
      //                     | ReactPortal
      //                     | ReactElement<unknown, string | JSXElementConstructor<any>>
      //                     | Iterable<ReactNode>
      //                     | null
      //                     | undefined
      //                   >
      //                 | null
      //                 | undefined;
      //             },
      //             idx: Key | null | undefined
      //           ) => (
      //             <div key={idx} className="flex gap-2 items-center text-xs border-b last:border-b-0 py-1">
      //               <span className="font-semibold">{guest.name}</span>
      //               <span>{guest.phoneNumber}</span>
      //               <span className="italic text-slate-500">{guest.status}</span>
      //             </div>
      //           )
      //         )
      //       ) : (
      //         <span className="text-slate-400 text-xs">No Guests</span>
      //       )}
      //     </div>
      //   ),
      // },
      {
        id: 'answerTime',
        accessorKey: 'answerTime',
        header: () => 'Answer Time',
        cell: ({ row }: { row: { original: { answerTime: string | null; hangupTime: string | null } } }) => (
          <span>{row.original.answerTime ? moment(row.original.answerTime).format('DD-MMM-YYYY h:mm A') : '-'}</span>
        ),
      },
      {
        id: 'hangupTime',
        accessorKey: 'hangupTime',
        header: () => 'Hangup Time',
        cell: ({ row }: { row: { original: { answerTime: string | null; hangupTime: string | null } } }) => (
          <span>{row.original.hangupTime ? moment(row.original.hangupTime).format('DD-MMM-YYYY h:mm A') : '-'}</span>
        ),
      },
      {
        id: 'duration',
        header: () => 'Duration',
        cell: ({ row }: { row: { original: { answerTime: string | null; hangupTime: string | null } } }) => {
          if (!row.original.answerTime || !row.original.hangupTime) return '-';

          const start = moment(row.original.answerTime);
          const end = moment(row.original.hangupTime);
          const duration = moment.duration(end.diff(start));

          // Format duration as HH:MM:SS
          return `${Math.floor(duration.asHours())}:${duration.minutes().toString().padStart(2, '0')}:${duration
            .seconds()
            .toString()
            .padStart(2, '0')}`;
        },
      },
      {
        id: 'actions',
        header: () => 'Actions',
        disableSorting: true,
        cell: ({
          row,
        }: {
          row: {
            original: {
              _id(_id: any): void;
              id: string;
            };
          };
        }) => (
          <div className="flex gap-x-4">
            <DeleteConfirmationModal
              onDelete={() => handleDelete(row.original._id as unknown as string)}
              itemName={`Conference`}
            />

            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
              title="Edit"
              onClick={() => handleEdit(row.original._id as unknown as string)}
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
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CreateConferenceModal />
          <WelcomeAudioModal />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="overflow-hidden border-l-4 border-l-primary">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <PhoneCall className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Conferences</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold">42</h2>
                <span className="text-xs text-green-500">+12% ↑</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-green-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-500/10 p-3 rounded-lg">
              <Activity className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Live Conferences</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold">3</h2>
                <Badge
                  variant="outline"
                  className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Live
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-orange-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-orange-500/10 p-3 rounded-lg">
              <Mic className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Audio Files</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold">18</h2>
                <span className="text-xs text-orange-500">+3 today</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-l-4 border-l-blue-500">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-lg">
              <Folder className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">DIDs Assigned</p>
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold">5</h2>
                <span className="text-xs text-blue-500">of 10 available</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-2">
        <CardHeader className="pb-0 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Conferences Management</CardTitle>
          <DateRangePicker
            onDateChange={handleDateChange}
            initialStartDate={startDate || undefined}
            initialEndDate={endDate || undefined}
          />
        </CardHeader>

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
