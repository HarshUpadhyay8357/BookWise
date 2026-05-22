const config={
    env:{
        imagekit:{
            publicKey:process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
            urlEndpoint:process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
            privateKey:process.env.IMAGEKIT_PRIVATE_KEY!
        },
        apiEndpoint:process.env.NEXT_PUBLIC_API_ENDPOINT!,
        databaseUrl:process.env.DATABASE_URL,
        upstash:{ 
            redisUrl:process.env.UPSTASH_REDIS_URL,
            redisToken:process.env.UPSTASH_REDIS_TOKEN,
            qstashUrl: process.env.QSTASH_URL,
            qstashToken: process.env.QSTASH_TOKEN,
            qstashCurrentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
            qstashNextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
        },
        prodApiEndpoint: process.env.NEXT_PUBLIC_API_ENDPOINT!,
        emailjs:{
            emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY,
            emailjsPrivateKey: process.env.EMAILJS_PRIVATE_KEY,
            emailjsServiceId:process.env.EMAILJS_SERVICE_ID,
            emailjsInactivityReminderTemplate:process.env.EMAILJS_INACTIVITY_REMINDER_TEMPLATE_ID,
            emailjsWelcomeTemplateId:process.env.EMAILJS_WELCOME_TEMPLATE_ID
        }
    }
}

export default config;