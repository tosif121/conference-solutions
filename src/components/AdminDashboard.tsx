'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  PhoneCall, 
  Folder, 
  Activity, 
  MoreVertical, 
  Calendar, 
  Users, 
  Clock, 
  Plus, 
  RefreshCw, 
  Search, 
  Filter, 
  Download,
  BarChart4
} from 'lucide-react';
import CreateConferenceModal from './CreateConferenceModal';
import WelcomeAudioModal from './WelcomeAudioModal';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Conference data 
  const recentConferences = [
    { id: 1, name: 'Team Standup Call', date: 'Today, 10:30 AM', status: 'Completed', participants: 12, duration: '45 min' },
    { id: 2, name: 'Sales Review Meeting', date: 'Yesterday, 4:00 PM', status: 'Completed', participants: 8, duration: '1h 15min' },
    { id: 3, name: 'Product Demo', date: 'Yesterday, 2:30 PM', status: 'Completed', participants: 15, duration: '30 min' },
    { id: 4, name: 'Client Demo', date: '2 Days Ago, 1:15 PM', status: 'Completed', participants: 5, duration: '45 min' },
    { id: 5, name: 'Board Meeting', date: '3 Days Ago, 3:00 PM', status: 'Completed', participants: 7, duration: '2h' },
  ];

  // Upcoming conferences
  const upcomingConferences = [
    { id: 6, name: 'Marketing Strategy', date: 'Tomorrow, 11:00 AM', status: 'Scheduled', participants: 6 },
    { id: 7, name: 'Project Kickoff', date: 'May 13, 2:00 PM', status: 'Scheduled', participants: 12 },
    { id: 8, name: 'Quarterly Review', date: 'May 15, 9:00 AM', status: 'Scheduled', participants: 18 },
  ];

  // Active conferences
  const activeConferences = [
    { id: 9, name: 'Customer Support', startTime: '09:30 AM', duration: '45 min', participants: 4, progress: 65 },
    { id: 10, name: 'Engineering Sync', startTime: '10:15 AM', duration: '30 min', participants: 8, progress: 40 },
    { id: 11, name: 'Sales Call', startTime: '10:00 AM', duration: '1h', participants: 3, progress: 25 },
  ];

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your conferences and monitor system activity</p>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
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
                <Badge variant="outline" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Live</Badge>
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

      {/* Main content tabs */}
      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="active">Active Calls</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="recordings">Recordings</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Active conferences */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Live Conferences
                </CardTitle>
                <Badge className="bg-green-500">3 Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeConferences.map((conference) => (
                  <div key={conference.id} className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-3 h-3 bg-green-500 rounded-full absolute -top-1 -right-1 animate-pulse"></div>
                          <Avatar className="w-10 h-10 border-2 border-green-200">
                            <AvatarFallback className="bg-green-100 text-green-800">{conference.name.slice(0, 2)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <h3 className="font-medium">{conference.name}</h3>
                          <div className="flex items-center text-xs text-muted-foreground gap-3">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {conference.startTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" /> {conference.participants} participants
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 sm:mt-0">
                        <Button size="sm" variant="secondary">Join</Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>End Call</DropdownMenuItem>
                            <DropdownMenuItem>Add Participant</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground mt-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span>Progress</span>
                          <span>{conference.progress}%</span>
                        </div>
                        <Progress value={conference.progress} className="h-2" />
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {conference.duration}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent conferences */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Recent Conferences
                </CardTitle>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-900">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium">Conference</th>
                      <th className="py-3 px-4 text-left font-medium hidden sm:table-cell">Date</th>
                      <th className="py-3 px-4 text-left font-medium hidden md:table-cell">Participants</th>
                      <th className="py-3 px-4 text-left font-medium hidden md:table-cell">Duration</th>
                      <th className="py-3 px-4 text-left font-medium">Status</th>
                      <th className="py-3 px-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentConferences.map((conference, index) => (
                      <tr key={conference.id} className={index !== recentConferences.length - 1 ? "border-b" : ""}>
                        <td className="py-3 px-4">{conference.name}</td>
                        <td className="py-3 px-4 hidden sm:table-cell text-muted-foreground">{conference.date}</td>
                        <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{conference.participants}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell text-muted-foreground">{conference.duration}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                            {conference.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Download Recording</DropdownMenuItem>
                              <DropdownMenuItem>View Transcript</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming conferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Upcoming Conferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingConferences.map((conference) => (
                    <div key={conference.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-blue-100 text-blue-800">{conference.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{conference.name}</h3>
                          <div className="flex items-center text-xs text-muted-foreground gap-2">
                            <span>{conference.date}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" /> {conference.participants}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Prepare</Button>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  View Full Schedule
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <BarChart4 className="w-5 h-5 text-violet-500" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>CPU Usage</span>
                      <span>28%</span>
                    </div>
                    <Progress value={28} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Memory Usage</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Storage</span>
                      <span>62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Network</span>
                      <span>15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <div className="text-sm">
                    <p className="font-medium">System Status</p>
                    <p className="text-green-500 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      All Systems Operational
                    </p>
                  </div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Active Calls Tab */}
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Conference Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Detailed information about currently active conference calls would appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scheduled Tab */}
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Conferences</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Calendar view and list of upcoming scheduled conferences would appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recordings Tab */}
        <TabsContent value="recordings">
          <Card>
            <CardHeader>
              <CardTitle>Conference Recordings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Library of all recorded conference calls and their transcripts would appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}