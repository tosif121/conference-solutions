'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import toast from 'react-hot-toast';
import { Plus, Trash2, FileAudio, X, Pause, Play, Check } from 'lucide-react';
import { audioService, conferenceService } from '@/utils/services';
import moment from 'moment';

// Define types
interface Host {
  name: string;
  phoneNumber: string;
}

interface Guest {
  name: string;
  phoneNumber: string;
  guestArrivalMusic: string;
}

interface AudioFile {
  createdAt: string | Date;
  fileName: string;
  id: string;
  name: string;
  size: string;
  duration: string;
  dateUploaded: string;
}

interface FormData {
  conferenceName: string;
  description: string;
  host: Host;
  guests: Guest[];
  welcomeAudioId: string;
  playWelcomeAudio: boolean;
  retryOnNoAnswer: boolean;
  guestMute: boolean;
  retryCount: number;
  announcementEnabled: boolean;
}

interface Conference {
  id: string;
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
  status?: string;
  answerTime?: string | null;
  hangupTime?: string | null;
}

interface FormErrors {
  [key: string]: string;
}

interface CreateConferenceModalProps {
  fetchConferences: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  editConference?: Conference;
}

export default function CreateConferenceModal({
  fetchConferences,
  open,
  setOpen,
  editConference,
}: CreateConferenceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('dateDesc');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    conferenceName: '',
    description: '',
    host: { name: '', phoneNumber: '' },
    guests: [{ name: '', phoneNumber: '', guestArrivalMusic: '' }],
    welcomeAudioId: '',
    retryCount: 1,
    playWelcomeAudio: false,
    retryOnNoAnswer: false,
    guestMute: false,
    announcementEnabled: false,
  });
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<string>('');
  const audioTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (open) {
      fetchAudioFiles();
    }
  }, [open]);

  const fetchAudioFiles = async () => {
    setIsSubmitting(true);
    try {
      // Use the audioService to get the list of audio files
      const response = await audioService.getAudioList();
      if (response.status) {
        setAudioFiles(response.data.audioList);
      } else {
        toast.error(response.message || 'Failed to fetch audio files');
      }
    } catch (error) {
      console.error('Error fetching audio files:', error);
      toast.error('Failed to fetch audio files');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Consistently format phone numbers by removing any non-digit characters and ensuring 10 digits only
  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');
    // Remove +91 prefix if present
    return digitsOnly.replace(/^91/, '').slice(0, 10);
  };

  // Effect to populate form data when editConference changes
  useEffect(() => {
    if (editConference) {
      setIsEditMode(true);

      // Populate the form with existing conference data
      setFormData({
        conferenceName: editConference.conferenceName || '',
        description: editConference.description || '',
        host: {
          name: editConference.host?.name || '',
          phoneNumber: formatPhoneNumber(editConference.host?.phoneNumber || ''),
        },
        guests:
          editConference.guests?.length > 0
            ? editConference.guests.map((guest) => ({
                name: guest.name || '',
                phoneNumber: formatPhoneNumber(guest.phoneNumber || ''),
                guestArrivalMusic: guest.guestArrivalMusic || '',
              }))
            : [{ name: '', phoneNumber: '', guestArrivalMusic: '' }],
        welcomeAudioId: editConference.welcomeAudioId || '',
        playWelcomeAudio: editConference.playWelcomeAudio || false,
        retryOnNoAnswer: editConference.retryOnNoAnswer || false,
        retryCount: editConference.retryCount || 1,
        guestMute: editConference.guestMute || false,
        announcementEnabled: editConference.announcementEnabled || false,
      });

      // Set selected audio if it exists
      if (editConference.welcomeAudioId) {
        setSelectedAudio(editConference.welcomeAudioId);
      }
    } else {
      setIsEditMode(false);
    }
  }, [editConference]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.conferenceName.trim()) newErrors.conferenceName = 'Conference name is required';

    // Host validation
    if (!formData.host.name.trim()) newErrors.hostName = 'Host name is required';

    // Phone validation with exact 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.host.phoneNumber.trim()) {
      newErrors.hostPhone = 'Host phone is required';
    } else if (!phoneRegex.test(formData.host.phoneNumber)) {
      newErrors.hostPhone = 'Please enter a valid 10-digit mobile number';
    }

    // Guest validation
    formData.guests.forEach((guest, index) => {
      if (guest.phoneNumber && !guest.name.trim()) {
        newErrors[`guestName_${index}`] = 'Guest name is required if phone is provided';
      }

      if (guest.name && !guest.phoneNumber.trim()) {
        newErrors[`guestPhone_${index}`] = 'Guest phone is required if name is provided';
      }

      // Phone validation for guests - only if phone is provided
      if (guest.phoneNumber && !phoneRegex.test(guest.phoneNumber)) {
        newErrors[`guestPhone_${index}`] = 'Please enter a valid 10-digit mobile number';
      }
    });

    // Welcome Audio validation when enabled
    if (formData.playWelcomeAudio && !selectedAudio) {
      newErrors.welcomeAudioId = 'Welcome Audio selection is required when welcome audio is enabled';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Update welcomeAudioId from selected audio before submission
      const dataToSubmit = {
        ...formData,
        welcomeAudioId: selectedAudio,
      };

      // Prepare payload for API
      const payload = {
        conferenceName: dataToSubmit.conferenceName,
        description: dataToSubmit.description,
        host: {
          ...dataToSubmit.host,
          phoneNumber: dataToSubmit.host.phoneNumber,
        },
        guests: dataToSubmit.guests
          .filter((guest) => guest.name || guest.phoneNumber)
          .map((guest) => ({
            ...guest,
            phoneNumber: guest.phoneNumber,
          })),
        welcomeAudioId: dataToSubmit.playWelcomeAudio ? dataToSubmit.welcomeAudioId : undefined,
        playWelcomeAudio: dataToSubmit.playWelcomeAudio,
        retryOnNoAnswer: dataToSubmit.retryOnNoAnswer,
        retryCount: dataToSubmit.retryOnNoAnswer ? dataToSubmit.retryCount : undefined,
        guestMute: dataToSubmit.guestMute,
        announcementEnabled: dataToSubmit.announcementEnabled,
      };

      let response;

      if (isEditMode && editConference) {
        // Update existing conference
        response = await conferenceService.updateConference(editConference.id, payload);
      } else {
        // Create new conference
        response = await conferenceService.createConference(payload);
      }

      if (response.status) {
        toast.success(response.message || `Conference ${isEditMode ? 'updated' : 'created'} successfully`);
        setOpen(false);
        resetForm();
        fetchConferences();
      } else {
        // Handle unsuccessful response with status false
        toast.error(response.message || `Failed to ${isEditMode ? 'update' : 'create'} conference`);
      }
    } catch (error) {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} conference. Please try again.`);
      console.error(`Conference ${isEditMode ? 'update' : 'creation'} error:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = (): void => {
    setFormData({
      conferenceName: '',
      description: '',
      host: { name: '', phoneNumber: '' },
      guests: [{ name: '', phoneNumber: '', guestArrivalMusic: '' }],
      welcomeAudioId: '',
      retryCount: 1,
      playWelcomeAudio: false,
      retryOnNoAnswer: false,
      guestMute: false,
      announcementEnabled: false,
    });
    setSelectedAudio('');
    setErrors({});
    setIsEditMode(false);
  };

  const handleOpenChange = (newOpen: boolean): void => {
    if (!newOpen) {
      resetForm();
    }
    setOpen(newOpen);
  };

  // Add a new guest
  const addGuest = (): void => {
    setFormData({
      ...formData,
      guests: [...formData.guests, { name: '', phoneNumber: '', guestArrivalMusic: '' }],
    });
  };

  // Remove a guest
  const removeGuest = (index: number): void => {
    if (formData.guests.length > 1) {
      const newGuests = [...formData.guests];
      newGuests.splice(index, 1);
      setFormData({
        ...formData,
        guests: newGuests,
      });
    }
  };

  // Update host fields
  const updateHostField = (field: keyof Host, value: string): void => {
    if (field === 'phoneNumber') {
      // Only allow digits and limit to 10 digits
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setFormData({
      ...formData,
      host: {
        ...formData.host,
        [field]: value,
      },
    });
  };

  // Update guest fields
  const updateGuestField = (index: number, field: keyof Guest, value: string): void => {
    const newGuests = [...formData.guests];
    if (field === 'phoneNumber' && typeof value === 'string') {
      // Only allow digits and limit to 10 digits
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    newGuests[index] = {
      ...newGuests[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      guests: newGuests,
    });
  };

  const filteredAudioFiles = audioFiles.filter((audio) =>
    audio.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedAudioFiles = [...filteredAudioFiles].sort((a, b) => {
    switch (sortBy) {
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      case 'dateAsc':
        return (a.dateUploaded || '').localeCompare(b.dateUploaded || '');
      case 'dateDesc':
      default:
        return (b.dateUploaded || '').localeCompare(a.dateUploaded || '');
    }
  });

  const togglePlayAudio = (id: string, e: React.MouseEvent): void => {
    e.stopPropagation();

    if (currentPlayingId === id && isPlaying) {
      // Stop playing
      setIsPlaying(false);
      setCurrentPlayingId('');

      // Clear any existing timeout
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
        audioTimeoutRef.current = null;
      }
    } else {
      // Stop any current audio
      if (isPlaying && audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
        audioTimeoutRef.current = null;
      }

      // Start new audio
      setCurrentPlayingId(id);
      setIsPlaying(true);

      // Mock audio duration - stop automatically after 5 seconds
      audioTimeoutRef.current = setTimeout(() => {
        setIsPlaying(false);
        setCurrentPlayingId('');
        audioTimeoutRef.current = null;
      }, 5000);
    }
  };

  // Handle audio selection and update form data
  const handleAudioSelection = (audioId: string): void => {
    setSelectedAudio(audioId);
    setFormData({
      ...formData,
      welcomeAudioId: audioId,
    });

    // Clear any welcome audio error when a selection is made
    if (errors.welcomeAudioId) {
      const { welcomeAudioId, ...remainingErrors } = errors;
      setErrors(remainingErrors);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>{isEditMode ? 'Edit Conference' : 'Create New Conference'}</DialogTitle>

          <div className="mt-4 space-y-6">
            {/* Conference Details Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="conferenceName" className="flex items-center space-x-1">
                  <span>Conference Name</span>
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="conferenceName"
                  placeholder="Enter Conference Name"
                  value={formData.conferenceName}
                  onChange={(e) => setFormData({ ...formData, conferenceName: e.target.value })}
                  className={errors.conferenceName ? 'border-red-500' : ''}
                  aria-invalid={!!errors.conferenceName}
                  aria-describedby={errors.conferenceName ? 'conferenceName-error' : undefined}
                />
                {errors.conferenceName && (
                  <p id="conferenceName-error" className="text-red-500 text-sm">
                    {errors.conferenceName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the conference call"
                />
              </div>
            </div>

            {/* Host Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Host</h3>

              <div className="p-4 border rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hostName" className="flex items-center space-x-1">
                      <span>Host Name</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hostName"
                      value={formData.host.name}
                      onChange={(e) => updateHostField('name', e.target.value)}
                      placeholder="Enter Host Name"
                      className={errors.hostName ? 'border-red-500' : ''}
                      aria-invalid={!!errors.hostName}
                      aria-describedby={errors.hostName ? 'hostName-error' : undefined}
                    />
                    {errors.hostName && (
                      <p id="hostName-error" className="text-red-500 text-sm">
                        {errors.hostName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hostPhone" className="flex items-center space-x-1">
                      <span>Host Mobile</span>
                      <span className="text-red-500">*</span>
                    </Label>

                    <Input
                      id="hostPhone"
                      type="text"
                      inputMode="numeric"
                      value={formData.host.phoneNumber}
                      onChange={(e) => updateHostField('phoneNumber', e.target.value)}
                      placeholder="Enter Mobile No."
                      className={`${errors.hostPhone ? 'border-red-500' : ''}`}
                      aria-invalid={!!errors.hostPhone}
                      aria-describedby={errors.hostPhone ? 'hostPhone-error' : undefined}
                    />
                    {errors.hostPhone && (
                      <p id="hostPhone-error" className="text-red-500 text-sm">
                        {errors.hostPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Guests Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Guests</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addGuest}
                  className="flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Guest</span>
                </Button>
              </div>

              {formData.guests.map((guest, index) => (
                <div key={`guest-${index}`} className="p-4 border rounded-md relative">
                  {formData.guests.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGuest(index)}
                      className="absolute top-1 right-2 p-1 h-8 w-8"
                      aria-label={`Remove guest ${index + 1}`}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Existing name and phone fields remain the same */}
                    <div className="space-y-2">
                      <Label htmlFor={`guestName-${index}`}>Guest Name</Label>
                      <div className="relative">
                        <Input
                          id={`guestName-${index}`}
                          value={guest.name}
                          onChange={(e) => updateGuestField(index, 'name', e.target.value)}
                          placeholder="Enter Guest Name"
                          className={errors[`guestName_${index}`] ? 'border-red-500' : ''}
                          aria-invalid={!!errors[`guestName_${index}`]}
                          aria-describedby={errors[`guestName_${index}`] ? `guestName-error-${index}` : undefined}
                        />
                      </div>
                      {errors[`guestName_${index}`] && (
                        <p id={`guestName-error-${index}`} className="text-red-500 text-sm">
                          {errors[`guestName_${index}`]}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`guestPhone-${index}`}>Guest Mobile</Label>

                      <Input
                        id={`guestPhone-${index}`}
                        value={guest.phoneNumber}
                        onChange={(e) => updateGuestField(index, 'phoneNumber', e.target.value)}
                        placeholder="Enter Mobile No."
                        className={`${errors[`guestPhone_${index}`] ? 'border-red-500' : ''}`}
                        aria-invalid={!!errors[`guestPhone_${index}`]}
                        aria-describedby={errors[`guestPhone_${index}`] ? `guestPhone-error-${index}` : undefined}
                      />
                      {errors[`guestPhone_${index}`] && (
                        <p id={`guestPhone-error-${index}`} className="text-red-500 text-sm">
                          {errors[`guestPhone_${index}`]}
                        </p>
                      )}
                    </div>

                    {/* Modified guestArrivalMusic field */}
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor={`guestArrivalMusic-${index}`}>Guest Arrival Music</Label>
                      <select
                        id={`guestArrivalMusic-${index}`}
                        value={guest.guestArrivalMusic}
                        onChange={(e) => updateGuestField(index, 'guestArrivalMusic', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">Select arrival music (optional)</option>
                        {audioFiles.map((audio) => (
                          <option key={audio.id} value={audio.id}>
                            {audio.fileName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Settings Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="playWelcomeAudio"
                      checked={formData.playWelcomeAudio}
                      onCheckedChange={(val) => {
                        setFormData({
                          ...formData,
                          playWelcomeAudio: val,
                        });
                        if (!val) {
                          // Clear welcome audio errors when turning off
                          const { welcomeAudioId, ...otherErrors } = errors;
                          setErrors(otherErrors);
                        }
                      }}
                    />
                    <Label htmlFor="playWelcomeAudio">Play Welcome Audio</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="retryOnNoAnswer"
                      checked={formData.retryOnNoAnswer}
                      onCheckedChange={(val) => setFormData({ ...formData, retryOnNoAnswer: val })}
                    />
                    <Label htmlFor="retryOnNoAnswer">Retry on No Answer</Label>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="announcementEnabled"
                      checked={formData.announcementEnabled}
                      onCheckedChange={(val) => setFormData({ ...formData, announcementEnabled: val })}
                    />
                    <Label htmlFor="announcementEnabled">Enable Announcement</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="guestMute"
                      checked={formData.guestMute}
                      onCheckedChange={(val) => setFormData({ ...formData, guestMute: val })}
                    />
                    <Label htmlFor="guestMute">Guest Mute</Label>
                  </div>
                </div>
              </div>

              {/* Show global retryCount only when retryOnNoAnswer is true */}
              {formData.retryOnNoAnswer && (
                <div className="p-4 border rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="retryCount">Retry Count</Label>
                    <Input
                      id="retryCount"
                      type="number"
                      min="1"
                      max="5"
                      value={formData.retryCount}
                      onChange={(e) => setFormData({ ...formData, retryCount: parseInt(e.target.value, 10) || 1 })}
                      placeholder="Enter retry count"
                    />
                    <p className="text-xs text-slate-500">Number of times to retry calling guests who don't answer</p>
                  </div>
                </div>
              )}

              {formData.playWelcomeAudio && (
                <div className="mt-2 p-4 bg-primary-foreground rounded-md">
                  <div className="space-y-4">
                    <Label htmlFor="welcomeAudioId" className="flex items-center space-x-1">
                      <span>Welcome Audio</span>
                      <span className="text-red-500">*</span>
                    </Label>

                    <div className="flex flex-col md:flex-row gap-2">
                      <div className="relative flex-grow">
                        <Input
                          type="text"
                          placeholder="Search audio files..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pr-10"
                          aria-label="Search audio files"
                        />
                        {searchQuery && (
                          <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            onClick={() => setSearchQuery('')}
                            aria-label="Clear search"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        )}
                      </div>

                      <select
                        className="px-3 py-2 border rounded-md"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        aria-label="Sort audio files"
                      >
                        <option value="dateDesc">Newest First</option>
                        <option value="dateAsc">Oldest First</option>
                        <option value="nameAsc">Name A-Z</option>
                        <option value="nameDesc">Name Z-A</option>
                      </select>
                    </div>

                    {/* Audio files list */}
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {sortedAudioFiles.length === 0 ? (
                        <div className="text-center p-4 text-slate-500 text-sm">
                          {searchQuery ? 'No audio files found matching your search' : 'No audio files available'}
                        </div>
                      ) : (
                        sortedAudioFiles.map((audio) => (
                          <div
                            key={audio.id}
                            onClick={() => handleAudioSelection(audio.id)}
                            className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                              selectedAudio === audio.id
                                ? 'bg-primary/10 border border-primary'
                                : 'bg-slate-50 dark:bg-black/50 dark:hover:bg-primary/10 hover:bg-slate-100 border border-transparent'
                            }`}
                            role="button"
                            aria-pressed={selectedAudio === audio.id}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleAudioSelection(audio.id);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <FileAudio className="text-primary h-5 w-5" />
                              <div className="w-full overflow-hidden">
                                <p className="font-medium text-sm truncate">{audio.fileName}</p>
                                <div className="flex text-xs text-slate-500 gap-2">
                                  {/* <span>{audio.size}</span>
                                                       <span>•</span>
                                                       <span>{audio.duration}</span>
                                                       <span>•</span> */}
                                  <span>{moment(audio.createdAt).format('DD-MM-YYYY')}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => togglePlayAudio(audio.id, e)}
                                aria-label={
                                  currentPlayingId === audio.id && isPlaying
                                    ? `Pause ${audio.name}`
                                    : `Play ${audio.name}`
                                }
                              >
                                {currentPlayingId === audio.id && isPlaying ? (
                                  <Pause className="h-4 w-4" />
                                ) : (
                                  <Play className="h-4 w-4" />
                                )}
                              </Button>

                              {selectedAudio === audio.id && (
                                <div className="flex items-center justify-center h-7 w-7">
                                  <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {errors.welcomeAudioId && formData.playWelcomeAudio && (
                      <p id="welcomeAudio-error" className="text-red-500 text-sm mt-2">
                        {errors.welcomeAudioId}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6 space-x-2">
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? 'Updating...'
                  : 'Creating...'
                : isEditMode
                ? 'Update Conferences'
                : 'Create Conferences'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
