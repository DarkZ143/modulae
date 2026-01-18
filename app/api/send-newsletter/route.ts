/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { subject, body, subscribers, adminEmail } = await req.json();

        // 1. Determine Credentials based on Admin Email
        let transporterConfig;

        if (adminEmail === process.env.ADMIN1_EMAIL) {
            transporterConfig = {
                user: process.env.ADMIN1_EMAIL,
                pass: process.env.ADMIN1_PASSWORD
            };
        } else if (adminEmail === process.env.ADMIN2_EMAIL) {
            transporterConfig = {
                user: process.env.ADMIN2_EMAIL,
                pass: process.env.ADMIN2_PASSWORD
            };
        } else {
            return NextResponse.json({ success: false, message: "Unauthorized Sender Address" }, { status: 401 });
        }

        // 2. Create Transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: transporterConfig.user,
                pass: transporterConfig.pass,
            },
        });

        // 3. Prepare Recipients
        const recipientList = subscribers.map((sub: any) => sub.email).join(',');

        if (!recipientList) {
            return NextResponse.json({ success: false, message: "No subscribers found" });
        }

        // 4. Send Email
        const info = await transporter.sendMail({
            from: `"Modulae Admin (${transporterConfig.user})" <${transporterConfig.user}>`, // ✅ Dynamic From Address
            to: transporterConfig.user, // Send copy to sender
            bcc: recipientList,
            subject: subject,
            text: body,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
                    <h2 style="color: #ea580c;">Modulae Announcement</h2>
                    <p style="font-size: 14px; color: #666;">Sent by: ${adminEmail}</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${body}</p>
                    <br />
                    <hr style="border: 0; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #888; text-align: center;">
                        © 2026 Modulae. All rights reserved.
                    </p>
                </div>
            `,
        });

        return NextResponse.json({ success: true, messageId: info.messageId });

    } catch (error) {
        console.error("Email Error:", error);
        return NextResponse.json({ success: false, error: "Failed to send emails" }, { status: 500 });
    }
}