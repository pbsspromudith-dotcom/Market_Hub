export async function verifyRecaptcha(captchaToken: string | undefined | null) {
  if (!captchaToken) {
    if (process.env.NODE_ENV === 'production') {
      return { success: false, message: 'Please complete the CAPTCHA verification.' };
    }
    // Allow local dev bypass when no token passed
    return { success: true };
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LfBW3ItAAAAABUR6r6cJTYACUJsPmrJTkX5ZHEJ';

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: captchaToken,
      }),
    });

    const data = await res.json();

    if (!data.success) {
      console.error('reCAPTCHA verification failed:', data);
      return { success: false, message: 'CAPTCHA verification failed. Please try again.' };
    }

    return { success: true };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, message: 'Failed to verify CAPTCHA with Google servers.' };
  }
}
