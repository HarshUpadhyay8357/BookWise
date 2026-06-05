"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { borrowBook } from "@/lib/actions/book";

interface Props{
    userId:string;
    bookId:string;
    borrowingEligibility: {
        isEligible:boolean;
        message:string;
    }
}

const BookBorrow = ({bookId,userId,borrowingEligibility:{isEligible,message}}:Props) => {

    const router=useRouter();
    const [borrowing, setborrowing] = useState(false);

    const handleBorrow=async()=>{

        if(!isEligible){
            toast.error(message);
        }

        setborrowing(true);

        try {

            const result=await borrowBook({bookId, userId});

            if(result.success){
                toast.success('Book borrowed successfully');

                router.push('/my-profile');
            }
            else{
                toast.error(result.error);
            }
            
        } catch (error) {
            toast.error('An error occured while borrowing this book');
        }
        finally{
            setborrowing(false);
        }
    }

  return (
    <Button className="book-overview_btn" onClick={handleBorrow}>
      <Image src="/icons/book.svg" alt="book" height={20} width={20} />
      <p className="font-bebas-neue text-xl text-dark-100">{borrowing? 'Borrowing...' : 'Borrow book'}</p>
    </Button>
  );
};

export default BookBorrow;
