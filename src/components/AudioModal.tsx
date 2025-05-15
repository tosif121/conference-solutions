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
import { audioService } from '@/utils/services';
import moment from 'moment';

interface AudioFile {
  createdAt: string; // Ensure this is a valid date string or timestamp
  fileName: string;
  id: string;
  name: string;
  size: string;
  duration: string;
  dateUploaded: string;
  url?: string; // Add URL for actual audio playback
}

export default function AudioManager() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateDesc');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch audio files when dialog opens
  useEffect(() => {
    if (open) {
      fetchAudioFiles();
    }
  }, [open]);

  const fetchAudioFiles = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  };

  const togglePlayAudio = (audio: AudioFile) => {
    if (!audio.url) return;

    if (currentPlayingId === audio.id && isPlaying) {
      // Pause current audio
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      // Stop any currently playing audio
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Play new audio
      if (!audioRef.current) {
        audioRef.current = new Audio(audio.url);
      } else {
        audioRef.current.src = audio.url;
      }

      audioRef.current
        .play()
        .then(() => {
          setCurrentPlayingId(audio.id);
          setIsPlaying(true);
        })
        .catch((error) => {
          toast.error('Failed to play audio');
          console.error('Audio playback error:', error);
        });

      // Handle audio end
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setCurrentPlayingId('');
      };
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    setFile(null);
    setFileName('');

    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Validate file type
      if (!selectedFile.type.match('audio/wav|audio/x-wav')) {
        setFileError('Only WAV files are supported');
        return;
      }

      // Validate file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        setFileError('File size must be less than 5MB');
        return;
      }

      setFile(selectedFile);
      // Set the default display name from the original filename (without extension)
      setFileName(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setFileError('Please select a WAV file');
      return;
    }

    // Make sure there's a display name
    if (!fileName.trim()) {
      setFileError('Please enter a file name for the audio file');
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean up the fileName by removing any .wav extension the user might have added
      const cleanFileName = fileName.replace(/\.wav$/i, '');

      // Send the clean filename (without .wav extension) to the API
      const res = await audioService.uploadAudio(cleanFileName, file);
      if (res.status) {
        // Refresh the audio list
        await fetchAudioFiles();

        toast.success(res.message);
        resetForm();
        setActiveTab('list');
      }
    } catch (error) {
      toast.error('Failed to upload audio file');
      console.error('Upload error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAudio = async (id: string) => {
    try {
      // Call the API to delete the audio file
      const response = await audioService.deleteAudio(id);

      if (response.status) {
        // Update the list after successful deletion
        setAudioFiles((prev) => prev.filter((file) => file.id !== id));
        toast.success(response.message || 'Audio file deleted successfully');
      } else {
        toast.error(response.message || 'Failed to delete audio file');
      }
    } catch (error) {
      console.error('Error deleting audio file:', error);
      toast.error('Failed to delete audio file');
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileName('');
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Clean up audio when closing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setCurrentPlayingId('');
      resetForm();
    }
    setOpen(newOpen);
  };

  // Filter and sort logic remains the same as your original
  const filteredAudioFiles = audioFiles.filter((audio) => audio.fileName.toLowerCase().includes(searchQuery.toLowerCase()));

  const sortedAudioFiles = [...filteredAudioFiles].sort((a, b) => {
    switch (sortBy) {
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      case 'dateAsc':
        return a.dateUploaded?.localeCompare(b.dateUploaded);
      case 'dateDesc':
      default:
        return b.dateUploaded?.localeCompare(a.dateUploaded);
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <FileAudio className="h-4 w-4" />
          Audio Manager
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle>Audio Manager</DialogTitle>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="list">Audio List</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {/* Search and sort controls */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Search audio files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <select
                className="px-3 py-2 border rounded-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="dateDesc">Newest First</option>
                <option value="dateAsc">Oldest First</option>
                <option value="nameAsc">Name A-Z</option>
                <option value="nameDesc">Name Z-A</option>
              </select>
            </div>

            {/* Audio files list */}
            {isLoading ? (
              <div className="text-center p-4">Loading audio files...</div>
            ) : sortedAudioFiles.length === 0 ? (
              <div className="text-center p-4 text-slate-500">
                {searchQuery ? 'No matching audio files found' : 'No audio files available'}
              </div>
            ) : (
              sortedAudioFiles.map((audio) => (
                <div
                  key={audio.id}
                  className={`flex items-center justify-between p-3 rounded-md ${
                    currentPlayingId === audio.id
                      ? 'bg-primary/10 border border-primary'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileAudio className="text-primary h-5 w-5" />
                    <div>
                      <p className="font-medium">{audio.fileName}</p>
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
                    <Button variant="ghost" size="icon" onClick={() => togglePlayAudio(audio)}>
                      {currentPlayingId === audio.id && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <DeleteConfirmationModal
                      onDelete={() => handleDeleteAudio(audio.id)}
                      itemName={`audio file "${audio.fileName}"`}
                    />
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <FileAudio className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{file.name}</p>
                      <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        resetForm();
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                    >
                      <X className="h-4 w-4 mr-1" /> Remove
                    </Button>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="bg-slate-100 p-3 rounded-full">
                      <Upload className="h-6 w-6 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium">Click to upload audio</p>
                      <p className="text-xs text-slate-500">Only WAV format (max 5MB)</p>
                    </div>
                    <Input
                      type="file"
                      accept="audio/wav"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden"
                    />
                  </div>
                )}
              </div>

              {file && (
                <div className="flex items-center gap-3">
                  <div className="w-full">
                    <label className="block text-sm font-medium mb-1">File Name</label>
                    <Input
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="Enter a name for this audio file"
                      className="w-full"
                    />
                    <p className="text-xs text-slate-500 mt-1">No need to include .wav extension</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        togglePlayAudio({
                          id: 'preview',
                          name: fileName,
                          size: `${(file.size / 1024).toFixed(1)} KB`,
                          duration: '0:00',
                          dateUploaded: new Date().toISOString().split('T')[0],
                          url: URL.createObjectURL(file),
                          createdAt: '',
                          fileName: ''
                        })
                      }
                      title="Preview audio"
                    >
                      {currentPlayingId === 'preview' && isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            {fileError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}

            <div className="rounded-lg p-4 bg-blue-50 border border-blue-100">
              <h4 className="text-sm font-medium flex items-center gap-2 text-blue-700">
                <FileAudio className="h-4 w-4 text-blue-600" />
                Audio Guidelines
              </h4>
              <ul className="mt-2 space-y-1 text-xs text-blue-700 ml-6 list-disc">
                <li>Keep welcome messages brief (under 30 seconds)</li>
                <li>Use clear language and avoid background noise</li>
                <li>Only WAV format is supported</li>
                <li>Maximum file size is 5MB</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {activeTab === 'upload' ? (
            <>
              <Button variant="outline" onClick={() => setActiveTab('list')}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!file || !fileName || isSubmitting}>
                {isSubmitting ? 'Uploading...' : 'Upload Audio'}
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
  );
}
