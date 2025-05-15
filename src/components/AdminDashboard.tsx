'use client';

import { SetStateAction, useEffect, useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mic, PhoneCall, Folder, Activity, Users, Clock, RefreshCw, PauseCircle, PhoneOff, MicOff } from 'lucide-react';
import { conferenceCallService, channelService } from '@/utils/services';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import moment from 'moment';

interface GuestChannel {
  name: string;
  phoneNumber: string;
  status: string;
  dialedAttempt: number;
  channelId: string;
  startTime: number;
  answerTime: number | null;
  hangupTime: number | null;
  isMuted: boolean;
  guestArivalMusic?: string;
}

interface Conference {
  hostChannel: string;
  hostNumber: string;
  adminUser: string;
  dialedNumber: string;
  hostName: string;
  numberOfGuests: number;
  isGuestMuted: boolean;
  bridge: string;
  type: string;
  status: string;
  conference: string;
  guestChannels: GuestChannel[];
  playbackId: string;
  answerTime: number;
  startTime?: number;
}

function AdminDashboard() {
  const [conferencesData, setConferencesData] = useState<Conference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(4);
  const [refreshIntervalInput, setRefreshIntervalInput] = useState('4');
  const [isPaused, setIsPaused] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalConferences: 0,
    liveConferences: 0,
    audioFiles: 18, // Static for now
    didsAssigned: 5, // Static for now
  });

  // Last successful data cache to prevent UI flickering
  const [cachedData, setCachedData] = useState<Conference[]>([]);

  useEffect(() => {
    fetchLiveConferenceCalls();

    let intervalId: string | number | NodeJS.Timeout | undefined;
    if (!isPaused) {
      intervalId = setInterval(() => {
        fetchLiveConferenceCalls(true);
      }, refreshInterval * 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [refreshInterval, isPaused]);

  const fetchLiveConferenceCalls = async (isBackgroundRefresh = false) => {
    // Only show loading state on initial load, not on background refreshes
    if (!isBackgroundRefresh) {
      setIsLoading(true);
    }

    if (isBackgroundRefresh) {
      setIsRefreshing(true);
    }

    try {
      const res = await conferenceCallService.getLiveConferenceCalls();
      if (res?.status) {
        // Assuming the API returns an array directly or in a nested property
        let conferences = Array.isArray(res.data) ? res.data : res.data.liveConfCalls || [];

        // Add startTime from answerTime if needed
        conferences = conferences.map((conference: Conference) => {
          if (!conference.startTime && conference.answerTime) {
            conference.startTime = conference.answerTime;
          }
          return conference;
        });

        // Use React 18's startTransition for smoother UI updates
        startTransition(() => {
          setConferencesData(conferences);
          setCachedData(conferences);

          // Update stats
          setStats((prev) => ({
            ...prev,
            totalConferences: 42, // This could be from API in real app
            liveConferences: conferences.length,
          }));
        });
      } else {
        if (!isBackgroundRefresh) {
          toast.error(res.message || 'Failed to fetch conferences');
        } else {
          console.error('Background refresh failed:', res.message);
        }
      }
    } catch (err) {
      console.error('Error fetching conferences:', err);
      if (!isBackgroundRefresh) {
        toast.error('Error fetching conferences');
      }
    } finally {
      if (!isBackgroundRefresh) {
        setIsLoading(false);
      }
      setIsRefreshing(false);
    }
  };

  const handleRefreshIntervalChange = (e: { target: { value: SetStateAction<string> } }) => {
    setRefreshIntervalInput(e.target.value);
  };

  const applyRefreshInterval = () => {
    const value = parseInt(refreshIntervalInput);
    if (!isNaN(value) && value > 0) {
      setRefreshInterval(value);
      toast.success(`Refresh interval set to ${value} seconds`);
    } else {
      toast.error('Please enter a valid positive number');
      setRefreshIntervalInput(refreshInterval.toString());
    }
  };

  const togglePauseRefresh = () => {
    setIsPaused(!isPaused);
    toast.success(isPaused ? 'Auto-refresh resumed' : 'Auto-refresh paused');
  };

  const handleManualRefresh = () => {
    fetchLiveConferenceCalls();
    toast.success('Data refreshed');
  };

  const calculateConfDetails = (conference: Conference) => {
    const startTime = conference.answerTime ? moment(conference.answerTime) : moment();
    const now = moment();
    const durationMinutes = now.diff(startTime, 'minutes');
    const durationSeconds = now.diff(startTime, 'seconds') % 60;

    const duration = `${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;
    const progress = Math.min(Math.round((now.diff(startTime, 'seconds') / (30 * 60)) * 100), 100);

    return { duration, progress };
  };

  // Format timestamp using moment.js
  const formatTime = (timestamp: number | undefined) => {
    if (!timestamp) return '';
    return moment(timestamp).format('h:mm A');
  };

  // Handle muting/unmuting for guests with optimistic updates
  const handleToggleChannelMute = async (
    guestChannelId: string,
    isCurrentlyMuted: boolean,
    conferenceIndex: number,
    guestIndex: number
  ) => {
    // Optimistic update for smoother UX
    const updatedConferences = [...conferencesData];
    updatedConferences[conferenceIndex].guestChannels[guestIndex].isMuted = !isCurrentlyMuted;
    setConferencesData(updatedConferences);

    try {
      await channelService.toggleChannelMute(guestChannelId, {
        mute: !isCurrentlyMuted,
        hostChannelId: conferencesData[conferenceIndex]?.hostChannel,
      });

      toast.success(`Participant ${isCurrentlyMuted ? 'unmuted' : 'muted'}`);
      // No need to refresh the full data here - our optimistic update is enough
    } catch (error) {
      console.error('Error toggling mute:', error);
      toast.error('Failed to change mute status');

      // Revert the optimistic update on failure
      const revertConferences = [...conferencesData];
      revertConferences[conferenceIndex].guestChannels[guestIndex].isMuted = isCurrentlyMuted;
      setConferencesData(revertConferences);
    }
  };

  const handleHangupChannel = async (
    guestChannelId: string,
    participantName: string,
    conferenceIndex: number,
    guestIndex: number
  ) => {
    // Optimistic update
    const updatedConferences = [...conferencesData];
    updatedConferences[conferenceIndex].guestChannels[guestIndex].status = 'hanging-up';
    setConferencesData(updatedConferences);

    try {
      await channelService.hangupChannel(guestChannelId);
      toast.success(`Disconnected ${participantName}`);

      // Update the status to hung-up
      updatedConferences[conferenceIndex].guestChannels[guestIndex].status = 'hung-up';
      setConferencesData(updatedConferences);

      // Fetch the latest data in background
      setTimeout(() => fetchLiveConferenceCalls(true), 1000);
    } catch (error) {
      console.error('Error hanging up:', error);
      toast.error('Failed to disconnect participant');

      // Revert the optimistic update on failure
      const revertConferences = [...conferencesData];
      revertConferences[conferenceIndex].guestChannels[guestIndex].status = 'answered';
      setConferencesData(revertConferences);
    }
  };

  // Use the cached data if we're loading
  const displayData = isLoading && cachedData.length > 0 ? cachedData : conferencesData;

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Conference Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {!isPaused && (
              <span className="ml-2 text-green-500 text-sm">• Auto-refreshing every {refreshInterval}s</span>
            )}
            {isPaused && <span className="ml-2 text-orange-500 text-sm">• Auto-refresh paused</span>}
            {isRefreshing && <span className="ml-2 text-blue-500 text-sm animate-pulse">• Refreshing data...</span>}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              value={refreshIntervalInput}
              onChange={handleRefreshIntervalChange}
              className="w-20 h-9 bg-white dark:bg-slate-800"
              onKeyDown={(e) => e.key === 'Enter' && applyRefreshInterval()}
            />
            <span className="text-sm text-slate-500">seconds</span>
            <Button variant="outline" size="sm" onClick={applyRefreshInterval}>
              Apply
            </Button>
          </div>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={togglePauseRefresh}>
            {isPaused ? <RefreshCw className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
          </Button>
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleManualRefresh}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading || isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
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
                <h2 className="text-2xl font-bold">{stats.totalConferences}</h2>
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
                <h2 className="text-2xl font-bold">{stats.liveConferences}</h2>
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
                <h2 className="text-2xl font-bold">{stats.audioFiles}</h2>
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
                <h2 className="text-2xl font-bold">{stats.didsAssigned}</h2>
                <span className="text-xs text-blue-500">of 10 available</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Live Conferences
            </CardTitle>
            <Badge className="bg-green-500">{displayData.length} Active</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && displayData.length === 0 && <div className="text-center py-4">Loading conference data...</div>}

          {!isLoading && displayData.length === 0 && (
            <div className="text-center py-8 text-slate-500">No active conferences at the moment</div>
          )}

          <div className="space-y-4 transition-opacity duration-300" style={{ opacity: isPending ? 0.7 : 1 }}>
            {displayData.map((conference, conferenceIndex) => {
              const { duration, progress } = calculateConfDetails(conference);
              const answeredParticipants = conference.guestChannels.filter((g) => g.status === 'answered').length;
              const totalParticipants = conference.guestChannels.length;

              return (
                <div
                  key={conference.bridge}
                  className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-3 h-3 bg-green-500 rounded-full absolute -top-1 -right-1 animate-pulse"></div>
                        <Avatar className="w-10 h-10 border-2 border-green-200">
                          <AvatarFallback className="bg-green-100 text-green-800">
                            {conference.conference.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h3 className="font-medium">{conference.conference}</h3>
                        <div className="flex items-center text-xs text-muted-foreground gap-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {formatTime(conference.answerTime)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {answeredParticipants}/{totalParticipants} connected
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3 sm:mt-0">
                      <Badge
                        variant="outline"
                        className={`${
                          conference.isGuestMuted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {conference.isGuestMuted ? 'Guests Muted' : 'Guests Unmuted'}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`${
                          conference.status === 'answered'
                            ? 'bg-green-100 text-green-800'
                            : conference.status === 'ringing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {conference.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground mt-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span>Call Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {duration}
                    </Badge>
                  </div>

                  {/* Host information */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium mb-2">Host</h4>
                    <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback
                            className={`text-xs ${
                              conference.status === 'answered'
                                ? 'bg-blue-100 text-blue-800'
                                : conference.status === 'ringing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {conference.hostName?.slice(0, 1).toUpperCase() || 'H'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{conference.hostName || 'Unknown Host'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {conference.hostNumber}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-medium mb-2">Participants</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {conference.guestChannels.map((guest, guestIndex) => (
                        <div
                          key={guest.channelId}
                          className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 transition-all duration-300"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback
                                className={`text-xs ${
                                  guest.status === 'answered'
                                    ? 'bg-green-100 text-green-800'
                                    : guest.status === 'dialing'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : guest.status === 'hanging-up'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {guest.name?.trim() ? guest.name.slice(0, 1).toUpperCase() : 'G'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{guest.name || 'Unknown'}</span>
                              <span className="text-xs text-slate-500">{guest.phoneNumber}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                guest.status === 'answered'
                                  ? 'bg-green-100 text-green-800'
                                  : guest.status === 'dialing'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : guest.status === 'hanging-up'
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {guest.status === 'hanging-up' ? 'Disconnecting' : guest.status}
                            </Badge>
                            {guest.status === 'answered' && (
                              <div className="flex items-center gap-1">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    guest.isMuted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {guest.isMuted ? 'Muted' : 'Unmuted'}
                                </Badge>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() =>
                                    handleToggleChannelMute(guest.channelId, guest.isMuted, conferenceIndex, guestIndex)
                                  }
                                  title={guest.isMuted ? 'Unmute' : 'Mute'}
                                >
                                  {!guest.isMuted ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() =>
                                    handleHangupChannel(guest.channelId, guest.name, conferenceIndex, guestIndex)
                                  }
                                  title="hangup"
                                >
                                  <PhoneOff className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminDashboard;
