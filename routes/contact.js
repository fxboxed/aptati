import express from "express";
import { sendMail } from "../utils/mailer.js";

const router = express.Router();

// ──────────────────────────────────────────────────────────────
// Ultra-light IP rate limiter (no deps)
// Limits each IP to N submissions per windowMs.
// Default here: 5 messages / 10 minutes.
// ──────────────────────────────────────────────────────────────
function makeRateLimiter({ windowMs = 10 * 60 * 1000, max = 5 } = {}) {
    const hits = new Map(); // ip -> [timestamps]

    return (req, res, next) => {
        const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress || "unknown";
        const now = Date.now();
        const windowStart = now - windowMs;

        let arr = hits.get(ip) || [];
        // prune old timestamps
        arr = arr.filter((t) => t >= windowStart);

        if (arr.length >= max) {
            return res.status(429).json({
                ok: false,
                message: "Too many messages from this IP. Please try again later.",
            });
        }

        arr.push(now);
        hits.set(ip, arr);

        // best-effort occasional cleanup to keep the Map small
        if (hits.size > 1000 && Math.random() < 0.01) {
            for (const [key, list] of hits) {
                const pruned = list.filter((t) => t >= windowStart);
                if (pruned.length) hits.set(key, pruned);
                else hits.delete(key);
            }
        }

        next();
    };
}

router.use(makeRateLimiter({ windowMs: 10 * 60 * 1000, max: 5 }));

// Tiny helper: escape dangerous chars in text (not needed for HTML you control)
const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

// POST /contact  — expects application/x-www-form-urlencoded
router.post("/", async (req, res) => {
    console.log("✅ Contact route hit! Using contactRouter..."); // Debug log
    console.log("Request body:", req.body); // Debug log
    
    const name = (req.body?.name || "").trim();
    const email = (req.body?.email || "").trim();
    const message = (req.body?.message || "").trim();

    // 🔒 Honeypot: if the hidden "website" field is filled, silently accept and stop.
    if ((req.body?.website || "").trim()) {
        console.log("🤖 Honeypot triggered (bot detected)");
        return res.json({ ok: true, message: "Message sent successfully!" });
    }

    // Basic validation (minimal and fast)
    if (!name || !email || !message) {
        return res.status(400).json({ ok: false, message: "All fields are required." });
    }
    const emailLike = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailLike.test(email)) {
        return res.status(400).json({ ok: false, message: "Please enter a valid email address." });
    }

    console.log(`📧 Preparing to send email from ${email} to ${process.env.EMAIL_USER}`);

    // Compose HTML email safely (escape user text; convert newlines)
    const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${esc(name)}</p>
    <p><strong>Email:</strong> ${esc(email)}</p>
    <p><strong>Message:</strong><br>${esc(message).replace(/\n/g, "<br>")}</p>
  `;

    const result = await sendMail({
        to: process.env.EMAIL_USER,           // send to yourself
        subject: "New Contact Form Submission",
        html,
        replyTo: email,                       // so you can reply directly
    });

    console.log("📤 Email sending result:", result); // Debug log

    if (result.ok) {
        return res.json({ ok: true, message: "Message sent successfully!" });
    }
    return res.status(500).json({
        ok: false,
        message: `Failed to send message: ${result.error || "unknown error"}`,
        code: result.code,
    });
});

export default router;