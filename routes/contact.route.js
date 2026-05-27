/**
 * =========================================================================
 * SECURE CONTACT FORM BACKEND ROUTE (routes/contact.route.js)
 * =========================================================================
 */
import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/contact', async (req, res) => {
    // 1. Destructure fields from the urlencoded form request body
    const { name, email, message, website } = req.body;

    /**
     * 2. THE HONEYPOT TRAP: Anti-Spam Security Guard
     * Real humans cannot see or interact with the 'website' input field because it's at left: -9999px.
     * Automated scraper bots read the raw HTML code, see the field, and blindly fill it out.
     * If the field has content, we quietly pretend it was a success but stop the email entirely.
     */
    if (website && website.trim() !== "") {
        console.warn("⚠️ SPAM DETECTED: Bot filled the honeypot field.");
        // Return a fake positive response to trick the bot into stopping
        return res.status(200).json({ message: "Thank you for contacting us!" });
    }

    // 3. Fallback Validation Check
    if (!name || !email || !message) {
        return res.status(400).json({ error: "All required form fields must be completed." });
    }

    try {
        // 4. Create the Mail Carrier configuration engine
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '465'),
            secure: true, // true for port 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // 5. Build the aesthetic layout layout for your received inbox message
        const mailOptions = {
            from: '"Aptati Games" <info@aptati.com>', // Displays clean domain branding in headers
            replyTo: email, // Clicking 'Reply' in your inbox opens a window directly to the player
            to: process.env.CONTACT_RECEIVER,
            subject: `📩 New Aptati Contact Form Message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
                    <h2 style="color: #333; margin-top: 0;">Aptati Message!</h2>
                    <p><strong>Sender:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="white-space: pre-wrap; line-height: 1.6; color: #555;">${message}</p>
                </div>
            `
        };

        // 6. Push the trigger to transmit the message across the web
        await transporter.sendMail(mailOptions);
        console.log(`✉️ Contact message sent successfully from ${email}`);

        // Return clean JSON matching your front-end fetch requirement
        return res.status(200).json({ message: "Thank you for contacting us!" });

    } catch (error) {
        console.error("❌ Nodemailer transmission failure:", error);
        return res.status(500).json({ error: "Internal mail transmission failed. Please try again later." });
    }
});

export default router;