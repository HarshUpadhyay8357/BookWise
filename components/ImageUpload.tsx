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
  console.log('inside authenticator');
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
  onFileChange: (filePath: string) => void;
}

const ImageUpload = ({ onFileChange }: Props) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const auth = await authenticator();
      console.log(auth);

      const response = await upload({
        file,
        fileName: file.name,
        publicKey,         
        token: auth.token,
        expire: auth.expire,
        signature: auth.signature,
        folder: '/students', 
      });
      console.log(response);

      setUploadedFile({
        filePath: response.filePath!,
        url: response.url!,
        name: response.name!,
      });

      onFileChange(response.filePath!);
      toast.success('Image uploaded successfully.');
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError('Image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          await handleUpload(file);
        }}
      />

      <button
        className="upload-btn bg-dark-200 cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          fileInputRef.current?.click();
        }}
        disabled={isUploading}
      >
        <img src="/icons/upload.svg" alt="upload" height={20} width={20} className="object-contain" />
        <p className="text-base text-light-100">
          {isUploading ? 'Uploading…' : 'Upload a File'}
        </p>
      </button>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {uploadedFile && (
        <>
          <p className="upload-filename mt-2">{uploadedFile.name}</p>
          <div className="mt-4">
            <Image
              src={uploadedFile.filePath}
              alt={uploadedFile.name}
              width={500}
              height={300}
            />
          </div>
        </>
      )}
    </ImageKitProvider>
  );
};

export default ImageUpload;

