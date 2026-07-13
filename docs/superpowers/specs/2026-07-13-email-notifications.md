# Email Notifications

## Overview
Send email to the farm admin when customers submit an order enquiry or a contact form. Uses Resend (free tier: 3K emails/month) with React Email for templates.

## Dependencies
- `resend` — email sending SDK
- `@react-email/components` — typed email components (Html, Head, Preview, Body, Container, Heading, Text, Hr)

## Environment Variables (.env — not committed)
```
RESEND_API_KEY=re_7JHwAfRr_BXJ5QEa6hc7X6EEiEfvviE7k
ADMIN_EMAIL=bholefarms21@gmail.com
```

## Files

### New: `src/lib/email.ts`
- Initialize Resend client from env
- Export `sendOrderNotification(data)` and `sendContactNotification(data)`
- Each wraps `resend.emails.send()` in try/catch and logs error on failure (never throws)

### New: `src/emails/order-notification.tsx`
React Email template — Bhole Farms branding (green #2E7D32, gold accents):
- Subject: "New Order Enquiry — {customerName}"
- Fields: Customer Name, Phone, Email, Product, Quantity, Message
- Sent to `ADMIN_EMAIL`, reply-to set to customer's email if provided

### New: `src/emails/contact-notification.tsx`
React Email template:
- Subject: "New Contact Message — {name}"
- Fields: Name, Email, Phone, Message
- Sent to `ADMIN_EMAIL`, reply-to set to submitter's email

## Integration Points
Edit existing API routes to call the email functions after successful creation:

1. `src/app/api/orders/route.ts` — after `prisma.order.create()`, call `sendOrderNotification(body)`
2. `src/app/api/contact/route.ts` — after parsing body, call `sendContactNotification(body)`

Both wrapped in try/catch so email failure never breaks the 200 response.

## No Visual Change
No UI changes — emails are transparent to the customer. Contact form and enquiry form continue to show success message to the user regardless of email delivery.
