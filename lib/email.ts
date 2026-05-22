const EMAILJS_URL = "https://api.emailjs.com/api/v1.0/email/send";

async function sendEmail({
  templateId,
  to_name,
  email,
}: {
  templateId: string;
  to_name: string;
  email: string;
}) {
  try {
    const response = await fetch(EMAILJS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: templateId,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,

        template_params: {
          to_name,
          email,
          website_link: process.env.NEXT_PUBLIC_API_ENDPOINT!,
        },
      }),
    });

    const data = await response.text();

    console.log("EMAILJS RESPONSE:", data);

    if (!response.ok) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.error("EMAILJS SEND ERROR:", error);
    throw error;
  }
}

export async function sendWelcomeEmail({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  return sendEmail({
    templateId: process.env.EMAILJS_WELCOME_TEMPLATE_ID!,
    to_name: fullName,
    email: email,
  });
}

export async function sendReminderEmail({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) {
  return sendEmail({
    templateId: process.env.EMAILJS_INACTIVITY_REMINDER_TEMPLATE_ID!,
    to_name: fullName,
    email: email,
  });
}