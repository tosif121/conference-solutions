'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Mic, PhoneCall, Folder, Activity } from 'lucide-react';
import CreateConferenceModal from './CreateConferenceModal';

export default function AdminDashboard() {
  return (
    <div className="container mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
        <CreateConferenceModal />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardContent className="p-5 flex items-center gap-4">
            <PhoneCall className="w-8 h-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Total Conferences</p>
              <h2 className="text-xl font-bold">42</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardContent className="p-5 flex items-center gap-4">
            <Activity className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Live Conferences</p>
              <h2 className="text-xl font-bold">3</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardContent className="p-5 flex items-center gap-4">
            <Mic className="w-8 h-8 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Audio Files</p>
              <h2 className="text-xl font-bold">18</h2>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-800 shadow-md">
          <CardContent className="p-5 flex items-center gap-4">
            <Folder className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">DIDs Assigned</p>
              <h2 className="text-xl font-bold">5</h2>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-800 shadow-md rounded-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Recent Conferences</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex justify-between items-center border-b pb-2">
            <span>Team Standup Call</span>
            <span>Today, 10:30 AM</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span>Sales Review Meeting</span>
            <span>Yesterday, 4:00 PM</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Client Demo</span>
            <span>2 Days Ago, 1:15 PM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
