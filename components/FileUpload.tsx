'use client';

import config from '@/lib/config';
import { Image, ImageKitProvider, upload } from '@imagekit/next';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/auth/imagekit`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed with status ${response.status}: ${errorText}`);
    }

    const { signature, expire, token } = await response.json();
    return { token, expire, signature };
  } catch (error: any) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

interface UploadedFile {
  filePath: string;
  url: string;
  name: string;
}

interface Props {
  type:'image' | 'video',
  accept:string,
  placeholder:string,
  folder:string,
  variant:'dark'|'light'
  onFileChange: (filePath: string) => void;
}

const ImageUpload = ({type,accept,placeholder,folder,variant,onFileChange }: Props) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setprogress] = useState(0)
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null);

  const styles={
    button: variant==='dark'? 'bg-dark-300' : 'bg-light-600 border-gray-100 border',
    placeholder: variant==='dark'? 'text-light-100' : 'text-slate-500',
    text: variant==='dark'? 'text-light-100' : 'text-dark-400'
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const auth = await authenticator();

      const response = await upload({
        file,
        fileName: file.name,
        publicKey,
        token: auth.token,
        expire: auth.expire,
        signature: auth.signature,
        folder: folder || '/students',
        // progress callback: imagekit-next may provide progress as number or event
        onProgress: (ev: any) => {
          try {
            const percent = typeof ev === 'number' ? ev : Math.round((ev.loaded / ev.total) * 100);
            setprogress(percent);
          } catch (_e) {
            // ignore
          }
        },
      });

      setUploadedFile({
        filePath: response.filePath!,
        url: response.url!,
        name: response.name!,
      });

      // Pass the full public URL when available; fall back to filePath
      onFileChange(response.url ?? response.filePath!);
      // If this was an image, show uploaded image; if video, try to keep previously generated thumbnail
      if (type === 'image') {
        setPreviewThumbnail(response.url!);
      }
      toast.success(`${type} uploaded successfully.`);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError('Image upload failed. Please try again.');
      toast.warning(`${type} upload failed`);
    } finally {
      setIsUploading(false);
      // ensure progress completes visually
      setprogress(100);
      setTimeout(() => setprogress(0), 800);
    }
  };

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      try {
        const url = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = url;
        video.muted = true;

        const cleanup = () => {
          URL.revokeObjectURL(url);
          video.remove();
        };

        video.addEventListener('loadeddata', () => {
          try {
            // seek a little into the video to avoid black frames
            video.currentTime = Math.min(0.5, video.duration / 2 || 0);
          } catch (_e) {
            // ignore
          }
        });

        video.addEventListener('seeked', () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 180;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Canvas not supported');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            cleanup();
            resolve(dataUrl);
          } catch (e) {
            cleanup();
            reject(e);
          }
        });

        // fallback if seeking isn't supported
        setTimeout(() => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 320;
            canvas.height = video.videoHeight || 180;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg');
              cleanup();
              resolve(dataUrl);
            }
          } catch (_e) {
            // ignore fallback failure
          }
        }, 1500);
      } catch (e) {
        reject(e);
      }
    });
  };

  const onValidate = async (file: File) => {
    // basic mime/type checks and size limits
    if (type === 'image') {
      if (!file.type.startsWith('image/')) {
        toast.warning('Please select a valid image file.');
        return false;
      }
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: 'File size too large',
          description: 'Please upload a file that is less than 20MB in size',
          variant: 'destructive',
        } as any);
        return false;
      }
    } else if (type === 'video') {
      if (!file.type.startsWith('video/')) {
        toast.warning('Please select a valid video file.');
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: 'File size too large',
          description: 'Please upload a file that is less than 50MB in size',
          variant: 'destructive',
        } as any);
        return false;
      }
    }
    return true;
  };

  return (
    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const ok = await onValidate(file);
          if (!ok) return;
          // generate preview thumbnail for videos
          if (type === 'video') {
            try {
              const thumb = await generateVideoThumbnail(file);
              setPreviewThumbnail(thumb);
            } catch (err) {
              console.warn('Could not generate video thumbnail', err);
            }
          }
          await handleUpload(file);
        }}
      />

      <button
        className={`upload-btn ${styles.button} cursor-pointer`}
        onClick={(e) => {
          e.preventDefault();
          fileInputRef.current?.click();
        }}
        disabled={isUploading}
      >
        <img src="/icons/upload.svg" alt="upload" height={20} width={20} className="object-contain" />
        <p className={`text-base ${styles.text}`}>
          {isUploading ? 'Uploading…' : placeholder || 'Upload a File'}
        </p>
      </button>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200 mt-2">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {uploadedFile && (
        <>
          <p className="upload-filename mt-2">{uploadedFile.name}</p>
          <div className="mt-4">
            {type === 'video' ? (
              // show a playable video with optional poster (generated thumbnail)
              <video
                controls
                width={500}
                height={300}
                poster={previewThumbnail ?? undefined}
                className="rounded"
              >
                <source src={uploadedFile.url ?? uploadedFile.filePath} />
                Your browser does not support the video tag.
              </video>
            ) : (
              // image preview
              <Image src={previewThumbnail ?? uploadedFile.url ?? uploadedFile.filePath} alt={uploadedFile.name} width={500} height={300} />
            )}
          </div>
        </>
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;

