import { cn, getMediaUrl } from '@/lib/utils';
import Image from 'next/image';
import React from 'react'
import BookCoverSvg from './BookCoverSvg';

type BookCoverVariant='extraSmall'|'small'|'medium'|'regular'|'wide'

const variantStyles:Record<BookCoverVariant, String>={
    extraSmall:'book-cover_extra_small',
    small:'book-cover_small',
    medium:'book-cover_medium',
    regular:'book-cover_regular',
    wide:'book-cover_wide',
}

interface Props{
    className?:string;
    variant? :BookCoverVariant;
    coverColor:string;
    coverUrl:string
}

const BookCover = ({className, variant='regular', coverColor='#012B48', coverUrl="https://placehold.co/400*600.png"}:Props) => {
  const src = getMediaUrl(coverUrl) || "https://placehold.co/400*600.png";

  return (
    <div className={cn('relative transition-all duration-300', variantStyles[variant], className)} style={{overflow:'hidden'}}>
        
        <BookCoverSvg coverColor={coverColor}/>
    
    <div style={{position:'absolute', top:'0%', left:'13%', width:'86%', height:'87%', zIndex:10}}>
        <Image src={src} alt='book cover' fill className='rounded-sm object-fill' sizes='(max-width: 480px) 174px, 296px'/>
    </div>

    </div>
  )
}

export default BookCover