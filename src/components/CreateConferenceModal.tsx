'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Calendar, Phone, User, Plus, Trash2 } from 'lucide-react';

export default function CreateConferenceModal() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    conferenceName: '',
    description: '',
    hosts: [{ name: '', phoneNumber: '' }],
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

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.conferenceName.trim()) newErrors.conferenceName = 'Conference name is required';
    
    // Host validation
    formData.hosts.forEach((host, index) => {
      if (!host.name.trim()) newErrors[`hostName_${index}`] = 'Host name is required';
      if (!host.phoneNumber.trim()) newErrors[`hostPhone_${index}`] = 'Host phone is required';
      
      // Phone validation (simple regex for demonstration)
      const phoneRegex = /^\+?[0-9]{10,15}$/;
      if (host.phoneNumber && !phoneRegex.test(host.phoneNumber.replace(/\s+/g, ''))) {
        newErrors[`hostPhone_${index}`] = 'Please enter a valid phone number';
      }
    });

    // Guest validation
    formData.guests.forEach((guest, index) => {
      if (guest.phoneNumber && !guest.name.trim()) {
        newErrors[`guestName_${index}`] = 'Guest name is required if phone is provided';
      }
      
      if (guest.name && !guest.phoneNumber.trim()) {
        newErrors[`guestPhone_${index}`] = 'Guest phone is required if name is provided';
      }
      
      // Phone validation for guests
      const phoneRegex = /^\+?[0-9]{10,15}$/;
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
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
        hosts: formData.hosts,
        guests: formData.guests.filter(guest => guest.name || guest.phoneNumber),
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

  const resetForm = () => {
    setFormData({
      conferenceName: '',
      description: '',
      hosts: [{ name: '', phoneNumber: '' }],
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

  const handleOpenChange = (newOpen) => {
    if (!newOpen) {
      resetForm();
    }
    setOpen(newOpen);
  };

  // Add a new host
  const addHost = () => {
    setFormData({
      ...formData,
      hosts: [...formData.hosts, { name: '', phoneNumber: '' }]
    });
  };

  // Remove a host
  const removeHost = (index) => {
    if (formData.hosts.length > 1) {
      const newHosts = [...formData.hosts];
      newHosts.splice(index, 1);
      setFormData({
        ...formData,
        hosts: newHosts
      });
    }
  };

  // Add a new guest
  const addGuest = () => {
    setFormData({
      ...formData,
      guests: [...formData.guests, { name: '', phoneNumber: '', retryCount: 1 }]
    });
  };

  // Remove a guest
  const removeGuest = (index) => {
    if (formData.guests.length > 1) {
      const newGuests = [...formData.guests];
      newGuests.splice(index, 1);
      setFormData({
        ...formData,
        guests: newGuests
      });
    }
  };

  // Update host fields
  const updateHostField = (index, field, value) => {
    const newHosts = [...formData.hosts];
    newHosts[index][field] = value;
    setFormData({
      ...formData,
      hosts: newHosts
    });
  };

  // Update guest fields
  const updateGuestField = (index, field, value) => {
    const newGuests = [...formData.guests];
    newGuests[index][field] = value;
    setFormData({
      ...formData,
      guests: newGuests
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default">+ Create Conference</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="mt-4 space-y-6">
          {/* Conference Details Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Conference Details</h3>

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

          {/* Hosts Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Hosts</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addHost}
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Host</span>
              </Button>
            </div>

            {formData.hosts.map((host, index) => (
              <div key={`host-${index}`} className="p-4 border rounded-md relative">
                {formData.hosts.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHost(index)}
                    className="absolute top-2 right-2 p-1 h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`hostName-${index}`} className="flex items-center space-x-1">
                      <span>Host Name</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id={`hostName-${index}`}
                        value={host.name}
                        onChange={(e) => updateHostField(index, 'name', e.target.value)}
                        placeholder="Enter host name"
                        className={`pl-10 ${errors[`hostName_${index}`] ? 'border-red-500' : ''}`}
                      />
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    </div>
                    {errors[`hostName_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`hostName_${index}`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`hostPhone-${index}`} className="flex items-center space-x-1">
                      <span>Host Phone</span>
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id={`hostPhone-${index}`}
                        value={host.phoneNumber}
                        onChange={(e) => updateHostField(index, 'phoneNumber', e.target.value)}
                        placeholder="+1234567890"
                        className={`pl-10 ${errors[`hostPhone_${index}`] ? 'border-red-500' : ''}`}
                      />
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    </div>
                    {errors[`hostPhone_${index}`] && (
                      <p className="text-red-500 text-sm">{errors[`hostPhone_${index}`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
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