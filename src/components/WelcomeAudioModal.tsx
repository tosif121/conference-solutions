'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, FileAudio, Check, Upload, Trash2, Play, Pause, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

// Define types
interface AudioFile {
  id: string;
  name: string;
  size: string;
  duration?: string;
  dateUploaded?: string;
}

export default function WelcomeAudioModal() {
  const [open, setOpen] = useState(false);
  // State management
  const [activeTab, setActiveTab] = useState<string>('select');
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([
    {
      id: 'audio_welcome_standard_123456',
      name: 'Welcome Standard',
      size: '320 KB',
      duration: '0:12',
      dateUploaded: '2025-04-15',
    },
    {
      id: 'audio_conference_intro_789012',
      name: 'Conference Introduction',
      size: '450 KB',
      duration: '0:23',
      dateUploaded: '2025-04-20',
    },
    {
      id: 'audio_meeting_start_345678',
      name: 'Meeting Start',
      size: '280 KB',
      duration: '0:15',
      dateUploaded: '2025-05-01',
    },
  ]);
  const [selectedAudio, setSelectedAudio] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('dateDesc');

  // Upload states
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');

  // Audio player states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string>('');

  // Ref to track the timeout for audio playback
  const audioTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup any playing audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
      }
    };
  }, []);

  // Filter audio files based on search query
  const filteredAudioFiles = audioFiles.filter((audio) => audio.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Sort audio files
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

  // Handle file selection for upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!['audio/mp3', 'audio/wav', 'audio/mpeg'].includes(file.type)) {
        setUploadError('File must be MP3 or WAV format');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB');
        return;
      }

      setUploadingFile(file);
    }
  };

  // Upload file handler
  const handleUpload = () => {
    if (!uploadingFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);

          // Add the file to our list with a generated ID
          const newAudioId = `audio_${uploadingFile.name
            .replace(/\.[^/.]+$/, '')
            .replace(/\s+/g, '_')
            .toLowerCase()}_${Date.now().toString().slice(-6)}`;

          const fileSize = (uploadingFile.size / 1024).toFixed(0) + ' KB';
          const fileName = uploadingFile.name.replace(/\.[^/.]+$/, '');

          // Add to the beginning of the list
          const newAudio = {
            id: newAudioId,
            name: fileName,
            size: fileSize,
            duration: '0:17', // Mock duration
            dateUploaded: new Date().toISOString().split('T')[0],
          };

          setAudioFiles((prev) => [newAudio, ...prev]);
          setUploadingFile(null);
          setSelectedAudio(newAudioId);

          // Switch to select tab after successful upload
          setActiveTab('select');

          // Show success message
          toast.success('Audio file uploaded successfully!');

          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Delete audio file
  const handleDeleteAudio = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Confirm deletion
    if (window.confirm('Are you sure you want to delete this audio file?')) {
      setAudioFiles((prev) => prev.filter((audio) => audio.id !== id));

      if (selectedAudio === id) {
        setSelectedAudio('');
      }

      // Stop playing if this was the current audio
      if (currentPlayingId === id) {
        if (audioTimeoutRef.current) {
          clearTimeout(audioTimeoutRef.current);
        }
        setIsPlaying(false);
        setCurrentPlayingId('');
      }

      toast.success('Audio file deleted successfully');
    }
  };

  // Toggle audio playback
  const togglePlayAudio = (id: string, e: React.MouseEvent) => {
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

  const resetForm = () => {
    setActiveTab('select');
    setSearchQuery('');
    setSortBy('dateDesc');
    setUploadingFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadError('');
    setIsPlaying(false);
    setCurrentPlayingId('');

    // Clear any active timeouts
    if (audioTimeoutRef.current) {
      clearTimeout(audioTimeoutRef.current);
      audioTimeoutRef.current = null;
    }
  };

  const handleCancel = () => {
    // First reset the form state
    resetForm();
    // Then close the modal
    if (typeof setOpen === 'function') {
      setOpen(false);
    }
  };

  const handleOpenChange = (newOpen: boolean): void => {
    if (!newOpen) {
      resetForm();
    }
    setOpen(newOpen);
  };

  const handleSelectAudio = () => {
    if (selectedAudio) {
      const selectedAudioFile = audioFiles.find((audio) => audio.id === selectedAudio);
      console.log('Selected audio:', selectedAudio, selectedAudioFile?.name || '');
      setOpen(false);
    } else {
      toast.error('Please select an audio file');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Audio Manager
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle>Welcome Audio Manager</DialogTitle>

        <Tabs defaultValue="select" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="select">Select Audio</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>

          {/* Select Audio Tab */}
          <TabsContent value="select" className="space-y-4">
            {/* Search and Sort Controls */}
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

            {/* Audio List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {sortedAudioFiles.length === 0 ? (
                <div className="text-center p-4 text-slate-500 text-sm">
                  {searchQuery ? 'No audio files found matching your search' : 'No audio files available'}
                </div>
              ) : (
                sortedAudioFiles.map((audio) => (
                  <div
                    key={audio.id}
                    onClick={() => setSelectedAudio(audio.id)}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                      selectedAudio === audio.id
                        ? 'bg-primary/10 border border-primary'
                        : 'bg-slate-50 hover:bg-slate-100 border border-transparent'
                    }`}
                    role="button"
                    aria-pressed={selectedAudio === audio.id}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedAudio(audio.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <FileAudio className="text-primary h-5 w-5" />
                      <div className="w-full overflow-hidden">
                        <p className="font-medium text-sm truncate">{audio.name}</p>
                        <div className="flex text-xs text-slate-500 gap-2">
                          <span>{audio.size}</span>
                          <span>•</span>
                          <span>{audio.duration}</span>
                          {audio.dateUploaded && (
                            <>
                              <span>•</span>
                              <span>{audio.dateUploaded}</span>
                            </>
                          )}
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
                          currentPlayingId === audio.id && isPlaying ? `Pause ${audio.name}` : `Play ${audio.name}`
                        }
                      >
                        {currentPlayingId === audio.id && isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => handleDeleteAudio(audio.id, e)}
                        aria-label={`Delete ${audio.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
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
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-4">
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-medium">Upload New Audio</h3>

              <div className="space-y-2">
                <Input
                  type="file"
                  accept="audio/wav"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                  aria-label="Upload audio file"
                />
                <p className="text-xs text-slate-500">Supported formats: WAV (max 5MB)</p>

                {uploadError && (
                  <p className="text-xs text-red-500" role="alert">
                    {uploadError}
                  </p>
                )}

                {uploadingFile && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="truncate max-w-[70%]">{uploadingFile.name}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div
                      className="w-full bg-slate-200 rounded-full h-1.5"
                      role="progressbar"
                      aria-valuenow={uploadProgress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        disabled={isUploading}
                        onClick={handleUpload}
                        className="flex items-center gap-2"
                      >
                        {isUploading ? (
                          <>Uploading...</>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg p-4 bg-blue-50 border border-blue-100">
              <h4 className="text-sm font-medium flex items-center gap-2 text-blue-700">
                <div className="rounded-full bg-blue-100 p-1">
                  <FileAudio className="h-4 w-4 text-blue-600" />
                </div>
                Audio Guidelines
              </h4>
              <ul className="mt-2 space-y-1 text-xs text-blue-700 ml-6 list-disc">
                <li>Keep welcome messages brief (under 30 seconds)</li>
                <li>Use clear language and avoid background noise</li>
                <li>Consider recording in a professional studio for best quality</li>
                <li>WAV (16-bit PCM, 8kHz, Mono) formats are supported</li>
                <li>Test your audio in a conference setting before actual use</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6 space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSelectAudio} disabled={!selectedAudio} className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            Select Audio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
