import { signOut } from '@/auth'
import BookList from '@/components/BookList'
import { Button } from '@/components/ui/button'
import { sampleBooks } from '@/constants'

const page = () => {
  return (
    <>
        <form className='mb-10' action={async ()=>{
            'use server'
            await signOut();
        }}>
            <Button>Logout</Button> 
        </form>
        <BookList title='borrowed books' books={sampleBooks}/>
    </>
  )
}

export default page