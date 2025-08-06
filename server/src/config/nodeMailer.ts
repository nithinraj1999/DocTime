import nodemailer, { Transporter } from 'nodemailer'

export interface IEmailService {
  sendEmail(recipient: string, otp: string): Promise<void>
  sendEmailToResetPassword(email: string, resetLink: string): Promise<void>
}

export class EmailService implements IEmailService {
  private transporter: Transporter 

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    })
  }

  async sendEmail(recipient: string, otp: string): Promise<void> {
    const mailOptions = {
      from: `"DocApp Team" <${process.env.MAIL_USER}>`,
      to: recipient,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #1d4ed8;">Your One-Time Password (OTP)</h2>
          <p style="font-size: 16px;">Use the OTP below to verify your email:</p>
          <div style="font-size: 24px; font-weight: bold; color: #111827; background: #e0f2fe; padding: 12px 24px; border-radius: 6px; display: inline-block; letter-spacing: 4px;">
            ${otp}
          </div>
          <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">This OTP is valid for a limited time. Do not share it with anyone.</p>
        </div>
      `,
    }

    try {
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error('Failed to send OTP email:', error)
      throw new Error('Failed to send OTP email.')
    }
  }

  async sendEmailToResetPassword(email: string, resetLink: string): Promise<void> {
    const mailOptions = {
      from: `"DocApp Team" <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #dc2626;">Password Reset Requested</h2>
          <p style="font-size: 16px;">Click the button below to reset your password:</p>
          <a href="${resetLink}" target="_blank" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #dc2626; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reset Password
          </a>
          <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">If you didn’t request this, just ignore this email.</p>
        </div>
      `,
    }

    try {
      await this.transporter.sendMail(mailOptions)
    } catch (error) {
      console.error('Failed to send reset password email:', error)
      throw new Error('Failed to send reset password email.')
    }
  }
}
