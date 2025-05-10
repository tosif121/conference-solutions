'use client';

import { Dialog, DialogContent, DialogTrigger, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Calendar, Phone, User, Plus, Trash2, FileAudio } from 'lucide-react';

// Define types
interface Host {
  name: string;
  phoneNumber: string;
}

interface Guest {
  name: string;
  phoneNumber: string;
  retryCount: number;
}

interface FormData {
  conferenceName: string;
  description: string;
  host: Host;
  guests: Guest[];
  welcomeAudioId: string;
  playWelcomeAudio: boolean;
  retryOnNoAnswer: boolean;
  announcementEnabled: boolean;
  pinProtected: boolean;
  hostPin: string;
  guestPin: string;
  scheduledAt: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CreateConferenceModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    conferenceName: '',
    description: '',
    host: { name: '', phoneNumber: '' },
    guests: [{ name: '', phoneNumber: '', retryCount: 1 }],
    welcomeAudioId: '',
    playWelcomeAudio: false,
    retryOnNoAnswer: false,
    announcementEnabled: false,
    pinProtected: false,
    hostPin: '',
    guestPin: '',
    scheduledAt: '',
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields validation
    if (!formData.conferenceName.trim()) newErrors.conferenceName = 'Conference name is required';

    // Host validation
    if (!formData.host.name.trim()) newErrors.hostName = 'Host name is required';
    if (!formData.host.phoneNumber.trim()) newErrors.hostPhone = 'Host phone is required';

    // Phone validation (simple regex for demonstration)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (formData.host.phoneNumber && !phoneRegex.test(formData.host.phoneNumber.replace(/\s+/g, ''))) {
      newErrors.hostPhone = 'Please enter a valid phone number';
    }

    // Guest validation
    formData.guests.forEach((guest, index) => {
      if (guest.phoneNumber && !guest.name.trim()) {
        newErrors[`guestName_${index}`] = 'Guest name is required if phone is provided';
      }

      if (guest.name && !guest.phoneNumber.trim()) {
        newErrors[`guestPhone_${index}`] = 'Guest phone is required if name is provided';
      }

      // Phone validation for guests
      if (guest.phoneNumber && !phoneRegex.test(guest.phoneNumber.replace(/\s+/g, ''))) {
        newErrors[`guestPhone_${index}`] = 'Please enter a valid phone number';
      }
    });

    // PIN validation when enabled
    if (formData.pinProtected) {
      if (!formData.hostPin) {
        newErrors.hostPin = 'Host PIN is required when PIN protection is enabled';
      } else if (!/^\d{4,6}$/.test(formData.hostPin)) {
        newErrors.hostPin = 'PIN must be 4-6 digits';
      }

      if (!formData.guestPin) {
        newErrors.guestPin = 'Guest PIN is required when PIN protection is enabled';
      } else if (!/^\d{4,6}$/.test(formData.guestPin)) {
        newErrors.guestPin = 'PIN must be 4-6 digits';
      }
    }

    // Date validation
    if (!formData.scheduledAt) {
      newErrors.scheduledAt = 'Schedule time is required';
    } else {
      const scheduledTime = new Date(formData.scheduledAt).getTime();
      const now = new Date().getTime();

      if (scheduledTime <= now) {
        newErrors.scheduledAt = 'Schedule time must be in the future';
      }
    }

    // Welcome Audio validation when enabled
    if (formData.playWelcomeAudio && !formData.welcomeAudioId.trim()) {
      newErrors.welcomeAudioId = 'Welcome Audio ID is required when welcome audio is enabled';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      const payload = {
        conferenceName: formData.conferenceName,
        description: formData.description,
        host: formData.host,
        guests: formData.guests.filter((guest) => guest.name || guest.phoneNumber),
        welcomeAudioId: formData.welcomeAudioId,
        playWelcomeAudio: formData.playWelcomeAudio,
        retryOnNoAnswer: formData.retryOnNoAnswer,
        announcementEnabled: formData.announcementEnabled,
        pinProtected: formData.pinProtected,
        hostPin: formData.pinProtected ? formData.hostPin : undefined,
        guestPin: formData.pinProtected ? formData.guestPin : undefined,
        scheduledAt: new Date(formData.scheduledAt).getTime(),
      };

      console.log('Sending to API:', payload);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success('Conference created successfully!');
      setOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to create conference. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = (): void => {
    setFormData({
      conferenceName: '',
      description: '',
      host: { name: '', phoneNumber: '' },
      guests: [{ name: '', phoneNumber: '', retryCount: 1 }],
      welcomeAudioId: '',
      playWelcomeAudio: false,
      retryOnNoAnswer: false,
      announcementEnabled: false,
      pinProtected: false,
      hostPin: '',
      guestPin: '',
      scheduledAt: '',
    });
    setErrors({});
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
      guests: [...formData.guests, { name: '', phoneNumber: '', retryCount: 1 }],
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
    setFormData({
      ...formData,
      host: {
        ...formData.host,
        [field]: value,
      },
    });
  };

  // Update guest fields
  const updateGuestField = (index: number, field: keyof Guest, value: string | number): void => {
    const newGuests = [...formData.guests];
    newGuests[index] = {
      ...newGuests[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      guests: newGuests,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default">+ Create Conference</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle>Create New Conference</DialogTitle>
        
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
                value={formData.conferenceName}
                onChange={(e) => setFormData({ ...formData, conferenceName: e.target.value })}
                className={errors.conferenceName ? 'border-red-500' : ''}
              />
              {errors.conferenceName && <p className="text-red-500 text-sm">{errors.conferenceName}</p>}
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

            <div className="space-y-2">
              <Label htmlFor="scheduledAt" className="flex items-center space-x-1">
                <span>Scheduled Time</span>
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className={`pl-10 ${errors.scheduledAt ? 'border-red-500' : ''}`}
                />
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              </div>
              {errors.scheduledAt && <p className="text-red-500 text-sm">{errors.scheduledAt}</p>}
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
                  <div className="relative">
                    <Input
                      id="hostName"
                      value={formData.host.name}
                      onChange={(e) => updateHostField('name', e.target.value)}
                      placeholder="Enter host name"
                      className={`pl-10 ${errors.hostName ? 'border-red-500' : ''}`}
                    />
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  </div>
                  {errors.hostName && <p className="text-red-500 text-sm">{errors.hostName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hostPhone" className="flex items-center space-x-1">
                    <span>Host Phone</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="hostPhone"
                      value={formData.host.phoneNumber}
                      onChange={(e) => updateHostField('phoneNumber', e.target.value)}
                      placeholder="+1234567890"
                      className={`pl-10 ${errors.hostPhone ? 'border-red-500' : ''}`}
                    />
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  </div>
                  {errors.hostPhone && <p className="text-red-500 text-sm">{errors.hostPhone}</p>}
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
                    className="absolute top-2 right-2 p-1 h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`guestName-${index}`}>Guest Name</Label>
                    <div className="relative">
                      <Input
                        id={`guestName-${index}`}
                        value={guest.name}
                        onChange={(e) => updateGuestField(index, 'name', e.target.value)}
                        placeholder="Enter guest name"
                        className={`pl-10 ${errors[`guestName_${index}`] ? 'border-red-500' : ''}`}
                      />
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    </div>
                    {errors[`guestName_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`guestName_${index}`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`guestPhone-${index}`}>Guest Phone</Label>
                    <div className="relative">
                      <Input
                        id={`guestPhone-${index}`}
                        value={guest.phoneNumber}
                        onChange={(e) => updateGuestField(index, 'phoneNumber', e.target.value)}
                        placeholder="+1234567890"
                        className={`pl-10 ${errors[`guestPhone_${index}`] ? 'border-red-500' : ''}`}
                      />
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    </div>
                    {errors[`guestPhone_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`guestPhone_${index}`]}</p>
                    )}
                  </div>

                  {formData.retryOnNoAnswer && (
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor={`retryCount-${index}`}>Retry Count</Label>
                      <Input
                        id={`retryCount-${index}`}
                        type="number"
                        min="1"
                        max="5"
                        value={guest.retryCount}
                        onChange={(e) => updateGuestField(index, 'retryCount', parseInt(e.target.value, 10) || 1)}
                      />
                    </div>
                  )}
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
                    onCheckedChange={(val) => setFormData({ ...formData, playWelcomeAudio: val })}
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
                    id="pinProtected"
                    checked={formData.pinProtected}
                    onCheckedChange={(val) => setFormData({ ...formData, pinProtected: val })}
                  />
                  <Label htmlFor="pinProtected">PIN Protected</Label>
                </div>
              </div>
            </div>

            {formData.playWelcomeAudio && (
              <div className="mt-2 p-4 bg-gray-50 rounded-md">
                <div className="space-y-4">
                  <Label htmlFor="welcomeAudioId" className="flex items-center space-x-1">
                    <span>Welcome Audio</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  
                  {/* Audio File Selector */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <div className="relative">
                        <Input
                          id="welcomeAudioId"
                          value={formData.welcomeAudioId}
                          onChange={(e) => setFormData({ ...formData, welcomeAudioId: e.target.value })}
                          placeholder="Enter audio ID or select a file"
                          className={`pl-10 ${errors.welcomeAudioId ? 'border-red-500' : ''}`}
                          readOnly={false}
                        />
                        <FileAudio className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      </div>
                      {errors.welcomeAudioId && <p className="text-red-500 text-sm">{errors.welcomeAudioId}</p>}
                    </div>
                    
                    <div>
                      <Input
                        id="welcomeAudioFile"
                        type="file"
                        accept="audio/*"
                        className="cursor-pointer"
                        onChange={(e) => {
                          // In a real implementation, you would handle file upload here
                          // and then set the returned ID to welcomeAudioId
                          if (e.target.files && e.target.files[0]) {
                            const fileName = e.target.files[0].name;
                            // Simulate ID generation from filename
                            const simulatedId = `audio_${fileName.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_").toLowerCase()}_${Date.now().toString().substr(-6)}`;
                            setFormData({ ...formData, welcomeAudioId: simulatedId });
                          }
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">Supported formats: MP3, WAV (max 5MB)</p>
                    </div>
                  </div>
                  
                  {/* Audio Preview - Would show when audio is selected */}
                  {formData.welcomeAudioId && (
                    <div className="p-3 border rounded-md bg-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileAudio className="h-5 w-5 text-blue-500" />
                          <span className="text-sm font-medium truncate">
                            {formData.welcomeAudioId.includes('_') 
                              ? formData.welcomeAudioId.split('_').slice(1, -1).join('_').replace(/_/g, ' ')
                              : 'Selected Audio'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => {
                              // In a real implementation, this would play the audio
                              toast('Audio playback would start here');
                            }}
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="20" 
                              height="20" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                              className="text-blue-500"
                            >
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setFormData({ ...formData, welcomeAudioId: '' })}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.pinProtected && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-4 bg-gray-50 rounded-md">
                <div className="space-y-2">
                  <Label htmlFor="hostPin" className="flex items-center space-x-1">
                    <span>Host PIN</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="hostPin"
                    type="password"
                    value={formData.hostPin}
                    onChange={(e) => setFormData({ ...formData, hostPin: e.target.value })}
                    placeholder="4-6 digits"
                    className={errors.hostPin ? 'border-red-500' : ''}
                  />
                  {errors.hostPin && <p className="text-red-500 text-sm">{errors.hostPin}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestPin" className="flex items-center space-x-1">
                    <span>Guest PIN</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="guestPin"
                    type="password"
                    value={formData.guestPin}
                    onChange={(e) => setFormData({ ...formData, guestPin: e.target.value })}
                    placeholder="4-6 digits"
                    className={errors.guestPin ? 'border-red-500' : ''}
                  />
                  {errors.guestPin && <p className="text-red-500 text-sm">{errors.guestPin}</p>}
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
            {isSubmitting ? 'Creating...' : 'Create Conference'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}