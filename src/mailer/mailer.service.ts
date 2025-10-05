import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailerService {
  private resend: Resend;
  private sender: string;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    this.sender = this.configService.get<string>('EMAIL_USER')!;
  }

  // Génération OTP
  private generateOtp(): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }

  // Envoi de l'email de confirmation
  async sendSignupEmail(userEmail: string): Promise<string> {
    const otp = this.generateOtp();

    try {
      await this.resend.emails.send({
        from: `E-commerce App <${this.sender}>`,
        to: userEmail,
        subject: 'Confirmation de votre inscription',
        html: `
          <h2>Bienvenue !</h2>
          <p>Merci de vous être inscrit sur notre plateforme.</p>
          <p>Voici votre code de confirmation :</p>
          <h1 style="color: #007bff;">${otp}</h1>
          <p>Ce code expirera dans 10 minutes.</p>
        `,
      });

      console.log(`✅ Email envoyé avec succès à ${userEmail}`);
      return otp;
    } catch (error) {
      console.error('Erreur lors de l’envoi de l’email :', error);
      throw new Error('Impossible d’envoyer l’email.');
    }
  }
}
