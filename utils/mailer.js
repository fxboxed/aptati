import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ---- Load + normalize env ---------------------------------------------------
let {
    EMAIL_USER,
    EMAIL_PASS,
    SMTP_HOST = "smtp.gmail.com",
    SMTP_PORT = "465",         // 465 (SSL) or 587 (STARTTLS)
    SMTP_SECURE = "true"       // "true" for 465, "false" for 587
} = process.env;

// Debug env vars (mask password)
console.log("📧 Email Configuration:");
console.log(`   EMAIL_USER: ${EMAIL_USER}`);
console.log(`   EMAIL_PASS: ${EMAIL_PASS ? '***' + EMAIL_PASS.slice(-4) : 'NOT SET'}`);
console.log(`   SMTP_HOST: ${SMTP_HOST}`);
console.log(`   SMTP_PORT: ${SMTP_PORT}`);
console.log(`   SMTP_SECURE: ${SMTP_SECURE}`);

// Normalize Gmail App Password (Google shows it with spaces)
if (EMAIL_PASS && /\s/.test(EMAIL_PASS)) {
    EMAIL_PASS = EMAIL_PASS.replace(/\s+/g, "");
}

// Validate required env vars
if (!EMAIL_USER || !EMAIL_PASS) {
    console.error("❌ EMAIL_USER or EMAIL_PASS environment variables are not set!");
    console.error("   Please check your .env file");
}

// ---- Create transporter ------------------------------------------------------
export const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === "true", // true => TLS immediately (465); false => STARTTLS (587)
    auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    pool: true,
    maxConnections: 1,
    connectionTimeout: 15_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    tls: { servername: SMTP_HOST },
    family: 4, // force IPv4 to avoid IPv6 timeouts on some hosts
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP Connection Failed:", {
            name: error.name,
            code: error.code,
            message: error.message,
            command: error.command,
            responseCode: error.responseCode
        });
        console.log("\nTroubleshooting Tips:");
        console.log("1. Check if EMAIL_USER/EMAIL_PASS are correct in .env");
        console.log("2. For Gmail, use an App Password (not your regular password)");
        console.log("3. Check if 'Less secure app access' is ON in Google Account");
        console.log("4. Try using SMTP_PORT=587 and SMTP_SECURE=false");
        console.log("5. Check firewall/network allows outgoing SMTP");
    } else {
        console.log("✅ SMTP Server is ready to send emails");
    }
});

// ---- Send helper -------------------------------------------------------------
export async function sendMail({ to, subject, html, replyTo }) {
    try {
        console.log(`📨 Attempting to send email to: ${to}`);
        console.log(`   Subject: ${subject}`);
        
        const info = await transporter.sendMail({
            from: `"Aptati Contact Form" <${EMAIL_USER}>`, // must match authenticated Gmail/Workspace user
            to,
            subject,
            html,
            ...(replyTo ? { replyTo } : {}),
        });
        
        console.log(`✅ Email sent successfully! Message ID: ${info.messageId}`);
        return { ok: true, id: info.messageId };
    } catch (err) {
        // Only log failures
        console.error("❌ Email sending failed:", {
            name: err.name,
            code: err.code,
            command: err.command,
            response: err.response,
            responseCode: err.responseCode,
            message: err.message,
        });
        
        // Provide user-friendly error message
        let userMessage = err.message;
        if (err.code === 'EAUTH') {
            userMessage = "Email authentication failed. Check email credentials.";
        } else if (err.code === 'ECONNECTION') {
            userMessage = "Could not connect to email server.";
        } else if (err.code === 'ETIMEDOUT') {
            userMessage = "Email server connection timed out.";
        }
        
        return { ok: false, error: userMessage, code: err.code || null };
    }
}