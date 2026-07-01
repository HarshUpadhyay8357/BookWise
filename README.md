# BookWise - University Library Management System


Built with Next.js, TypeScript, and Postgres,BookWise is a University Library Management System, a production-grade platform featuring a public-facing app and an admin interface. It offers advanced functionalities like  seamless book borrowing, automated workflows, and a modern, optimized tech stack for real-world scalability.

Live demo: https://book-wise-flame.vercel.app/

## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- PostgreSQL
- ImageKit
- TypeScript
- EmailJs
- Tailwind CSS

## <a name="features"> Features</a>

- **Open-source Authentication**: Personalized onboarding flow with email notifications.  

- **Home Page**: Highlighted books and newly added books with 3D effects.    

- **Book Detail Pages**: Availability tracking, book summaries, videos, and suggestions for similar books.  

- **Profile Page**: Manage accounts, track borrowed books, and download receipts.  

- **Onboarding Workflows**: Automated welcome emails when users sign up, with follow-ups based on inactivity or activity dates.  

- **All Books Page**: List and manage all library books with advanced search, pagination, and filters. 

- **Book Management Forms**: Add new books and edit existing entries.  

- **Book Details Page**: Detailed book information for administrators. 

- **Database Management**: Postgres with Neon for scalable and collaborative database handling.  

- **Real-time Media Processing**: ImageKit for image and video optimization and transformations. 

- **Database ORM**: Drizzle ORM for simplified and efficient database interactions.  

- **Modern UI/UX**: Built with TailwindCSS, ShadCN, and other cutting-edge tools.  

- **Technology Stack**: Next.js with TypeScript for scalable development, and NextAuth for robust authentication.  

- **Seamless Email Handling**: EmailJs for automated email communications, including notifications and updates.  

and many more, including code architecture and reusability 

## <a name="quick-start"> Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/HarshUpadhyay8357/BookWise.git
cd university_library
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=

NEXT_PUBLIC_API_ENDPOINT=
NEXT_PUBLIC_PROD_API_ENDPOINT=

DATABASE_URL=

UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

AUTH_SECRET=

# Required for workflow
QSTASH_URL=
QSTASH_TOKEN=

# EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=
EMAILJS_SERVICE_ID=
EMAILJS_INACTIVITY_REMINDER_TEMPLATE_ID=
EMAILJS_WELCOME_TEMPLATE_ID=
```

Replace the placeholder values with your actual ImageKit, NeonDB, Upstash, and EmailJs credentials. You can obtain these credentials by signing up on the [ImageKit](https://bit.ly/49zmXkt), [NeonDB](https://fyi.neon.tech/1jsm), [Upstash](https://upstash.com/?utm_source=jsmastery1), and [EmailJs](https://emailjs.com/). 

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## Demo
https://book-wise-flame.vercel.app/

