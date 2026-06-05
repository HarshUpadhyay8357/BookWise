import { getMediaUrl } from '@/lib/utils';

const BookVideo = ({videoUrl}:{videoUrl:string}) => {
  const src = getMediaUrl(videoUrl) || '';

  if (!src) return null;

  return (
    <div className="w-full rounded-xl overflow-hidden">
      <video src={src} controls className="w-full rounded-xl" />
    </div>
  )
}

export default BookVideo