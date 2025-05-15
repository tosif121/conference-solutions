'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, FileAudio, Upload, Play, Pause, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from './DeleteConfirmationModal';

// Define types
interface AudioFile {
  id: string;
  name: string;
  size: string;
  duration: string;
  dateUploaded: string;
}

export default function AudioManager() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  // Audio list states
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([
    {
      id: 'audio1',
      name: 'Welcome Message',
      size: '320 KB',
      duration: '0:15',
      dateUploaded: '2025-05-10',
    },
    {
      id: 'audio2',
      name: 'Conference Introduction',
      size: '450 KB',
      duration: '0:22',
      dateUploaded: '2025-05-08',
    },
    {
      id: 'audio3',
      name: 'Meeting Start Alert',
      size: '280 KB',
      duration: '0:08',
      dateUploaded: '2025-05-01',
    },
  ]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAudio, setSelectedAudio] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('dateDesc');

  // Audio player states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string>('');
  const audioTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Upload states
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        return a.dateUploaded.localeCompare(b.dateUploaded);
      case 'dateDesc':
      default:
        return b.dateUploaded.localeCompare(a.dateUploaded);
    }
  });

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

  // Handle file selection for upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file type
      const fileType = selectedFile.type.toLowerCase();
      if (fileType !== 'audio/wav' && fileType !== 'audio/x-wav') {
        setFileError('Only WAV files are supported');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFileError('File size must be less than 5MB');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  // Submit new audio file
  const handleSubmit = () => {
    // Validate inputs
    if (!file) {
      setFileError('Please select a WAV file');
      return;
    }

    // Simulate submission
    setIsSubmitting(true);

    // Simulate file upload
    setTimeout(() => {
      // Create new audio file entry
      const newAudio: AudioFile = {
        id: `audio${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''), // Use file name without extension
        size: `${Math.round(file.size / 1024)} KB`,
        duration: '0:10', // Mock duration
        dateUploaded: new Date().toISOString().split('T')[0],
      };

      // Add to audio files
      setAudioFiles((prev) => [newAudio, ...prev]);

      setIsSubmitting(false);
      toast.success('Audio file uploaded successfully!');
      resetForm();
      setActiveTab('list');
    }, 1500);
  };

  // Reset form
  const resetForm = () => {
    setFile(null);
    setFileError('');
    setIsSubmitting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle dialog close
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
      setSearchQuery('');
      setSortBy('dateDesc');
      setActiveTab('list');

      // Clear any active timeouts
      if (audioTimeoutRef.current) {
        clearTimeout(audioTimeoutRef.current);
        audioTimeoutRef.current = null;
      }
      setIsPlaying(false);
      setCurrentPlayingId('');
    }
    setOpen(newOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="default" className="flex items-center gap-2">
            <FileAudio className="h-4 w-4" />
            Audio Manager
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>Audio Manager</DialogTitle>

          <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="list">Audio List</TabsTrigger>
              <TabsTrigger value="upload">Upload New</TabsTrigger>
            </TabsList>

            {/* Audio List Tab */}
            <TabsContent value="list" className="space-y-4">
              {/* Search and Sort Controls */}
              <div className="flex flex-col sm:flex-row gap-2">
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

              {/* Audio Files List */}
              <div className="max-h-64 overflow-y-auto space-y-2">
                {sortedAudioFiles.length === 0 ? (
                  <div className="text-center p-4 text-slate-500 text-sm">
                    {searchQuery ? 'No audio files found matching your search' : 'No audio files available'}
                  </div>
                ) : (
                  sortedAudioFiles.map((audio) => (
                    <div
                      key={audio.id}
                      className={`flex items-center justify-between p-3 rounded-md ${
                        currentPlayingId === audio.id && isPlaying
                          ? 'bg-primary/10 border border-primary'
                          : 'bg-slate-50 hover:bg-slate-100 border border-transparent'
                      }`}
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
                        {/* Play button remains the same */}
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

                        {/* Replace the delete button with DeleteConfirmationModal */}
                        <DeleteConfirmationModal
                          onDelete={(e) => {
                            e?.stopPropagation();
                            // Actual delete logic
                            setAudioFiles((prev) => prev.filter((item) => item.id !== audio.id));

                            // Cleanup if this was the selected/playing audio
                            if (selectedAudio === audio.id) setSelectedAudio('');
                            if (currentPlayingId === audio.id) {
                              setIsPlaying(false);
                              setCurrentPlayingId('');
                              if (audioTimeoutRef.current) clearTimeout(audioTimeoutRef.current);
                            }

                            toast.success('Audio file deleted successfully');
                          }}
                          itemName={`audio file "${audio.name}"`}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <label htmlFor="audio-file" className="text-sm font-medium">
                    Upload Audio File
                  </label>
                  <Input
                    id="audio-file"
                    type="file"
                    accept="audio/wav"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    ref={fileInputRef}
                  />
                  <p className="text-xs text-slate-500">Only WAV format (max 5MB)</p>
                </div>

                {fileError && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-xs text-red-800">{fileError}</AlertDescription>
                  </Alert>
                )}
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
                  <li>Only WAV format is supported (16-bit PCM, 8kHz, Mono recommended)</li>
                  <li>Maximum file size is 5MB</li>
                  <li>Test your audio in a conference setting before actual use</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4 space-x-2">
            {activeTab === 'upload' ? (
              <>
                <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} disabled={!file || isSubmitting} className="flex items-center gap-2">
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Upload Audio
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
function setFileName(value: string) {
  throw new Error('Function not implemented.');
}
