import ImageKit from "imagekit";
import dummyBooks from "../dummyBooks.json"
import { books } from "./schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";

config({path:".env.local"});

const sql=neon(process.env.DATABASE_URL!);
export const db=drizzle({client:sql});

const imagekit=new ImageKit({
    publicKey:process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    urlEndpoint:process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY!
})

const uploadToImageKit=async(
    url:string,
    fileName:string,
    folder:string)=>{

        try {
            const response = await imagekit.upload({
                file: url,
                fileName,
                folder
            });

            // Prefer the full public URL when available; fall back to filePath
            return response.url ?? response.filePath;
        } catch (error) {
            console.error("error uploading image to ImageKit:", error);
        }
    }

const seed=async ()=>{
    console.log('seeding data...');

    try {
        for(const book of dummyBooks){
            const coverUrl = await uploadToImageKit(
                book.coverUrl,
                `${book.title}.jpg`,
                "/books/covers",
            ) as string;

            const videoUrl = await uploadToImageKit(
                book.videoUrl,
                `${book.title}.mp4`,
                "/books/trailers",
            ) as string;

            try {
                await db.insert(books).values({
                    ...book,
                    coverUrl,
                    videoUrl,
                })
            } catch (err: any) {
                // Log and continue on per-record insert errors (e.g., duplicate id)
                console.warn(`Skipping book \"${book.title}\":`, err?.message ?? err);
                continue;
            }
        }

        console.log('data seeded successfully'); 
        
    } catch (error) {
        console.error('Error seeding the data:', error);
    }
}

seed();