'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Image as ImageIcon, Video as VideoIcon, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type MediaUploaderProps = {
  label: string
  value: string
  onChange: (url: string) => void
  accept: 'image/*' | 'video/*'
  placeholder?: string
}

export function MediaUploader({
  label,
  value,
  onChange,
  accept,
  placeholder = 'Select file or drag here',
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isVideo = accept.includes('video')

  async function handleUpload(file: File) {
    if (!file) return

    setUploading(true)
    setError('')
    setProgress(10)

    try {
      const supabase = createClient()
      
      // Generate clean filename
      const ext = file.name.split('.').pop()
      const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`
      const filePath = `${isVideo ? 'videos' : 'images'}/${cleanName}`

      setProgress(30)

      // Upload file to Supabase storage bucket 'media'
      const { data, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) throw uploadError

      setProgress(80)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath)

      setProgress(100)
      onChange(publicUrl)
      setTimeout(() => {
        setUploading(false)
        setProgress(0)
      }, 500)

    } catch (err: any) {
      console.error('Upload failed:', err)
      setError(err.message || 'Failed to upload file')
      setUploading(false)
      setProgress(0)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith(isVideo ? 'video/' : 'image/')) {
      handleUpload(file)
    }
  }

  return (
    <div className="space-y-2 w-full">
      <label className="block text-[0.82rem] font-medium text-neutral-700">{label}</label>

      {value ? (
        // Preview State
        <div className="relative rounded-lg border border-neutral-200 bg-neutral-50 p-3 flex items-center gap-3 w-full min-w-0">
          {isVideo ? (
            <div className="relative h-16 w-24 shrink-0 rounded border border-neutral-200 bg-black overflow-hidden flex items-center justify-center p-2">
              <video src={value} className="h-full w-full object-cover" muted />
              <VideoIcon className="absolute top-2 right-2 h-4 w-4 text-white/80 bg-black/40 rounded-full p-0.5" />
            </div>
          ) : (
            <div className="relative h-16 w-16 shrink-0 rounded border border-neutral-200 bg-white overflow-hidden p-2">
              <img src={value} alt="Preview" className="h-full w-full object-cover" />
              <ImageIcon className="absolute bottom-1 right-1 h-3.5 w-3.5 text-neutral-500 bg-white/80 rounded-full p-0.5" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="text-[0.74rem] font-mono text-neutral-500 truncate">{value}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[0.7rem] font-medium text-green-600">
              <CheckCircle2 className="h-3 w-3" /> Ready
            </span>
          </div>

          <button
            type="button"
            onClick={() => onChange('')}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-400 hover:bg-neutral-100 hover:text-red-500 transition-colors"
            aria-label="Remove media"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        // Upload State
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-150 w-full ${
            uploading
              ? 'border-[#0a8f07]/40 bg-[#0a8f07]/5 pointer-events-none'
              : 'border-neutral-300 bg-neutral-50/50 hover:border-[#0a8f07]/50 hover:bg-neutral-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />

          {uploading ? (
            <div className="space-y-2">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#0a8f07]" />
              <p className="text-[0.84rem] font-medium text-neutral-700">Uploading file... {progress}%</p>
              <div className="h-1.5 w-48 mx-auto rounded-full bg-neutral-200 overflow-hidden">
                <div
                  className="h-full bg-[#0a8f07] transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {isVideo ? (
                <VideoIcon className="mx-auto h-8 w-8 text-neutral-400" />
              ) : (
                <Upload className="mx-auto h-8 w-8 text-neutral-400" />
              )}
              <p className="text-[0.84rem] font-semibold text-neutral-800">{placeholder}</p>
              <p className="text-[0.74rem] text-neutral-500">
                Click to browse or drop {isVideo ? 'video' : 'image'} file
              </p>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-[0.76rem] font-medium text-red-500">{error}</p>}
    </div>
  )
}
