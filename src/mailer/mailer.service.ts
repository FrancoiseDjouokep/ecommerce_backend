import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY is not defined in environment variables');
    }
    sgMail.setApiKey(apiKey);
  }

  // Génération OTP
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Envoi de l'email de confirmation
  async sendSignupEmail(toEmail: string): Promise<string> {
    const otp = this.generateOtp();
    const fromEmail = this.configService.get<string>('EMAIL_USER');

    if (!fromEmail) {
      throw new Error('EMAIL_USER is not defined in environment variables');
    }

    const msg = {
      to: toEmail,
      from: { email: fromEmail, name: 'E-commerce App' },
      subject: 'Confirmation de votre inscription',
      html: `
        <h2>Bienvenue !</h2>
        <p>Merci de vous être inscrit sur notre plateforme.</p>
        <p>Voici votre code de confirmation :</p>
        <h1 style="color: #007bff;">${otp}</h1>
        <p>Ce code expirera dans 10 minutes.</p>
      `,
    };

    try {
      await sgMail.send(msg);
      console.log(`Email envoyé avec succès à ${toEmail}`);
      return otp;
    } catch (error) {
      console.error('Erreur lors de l’envoi de l’email :', error);
      throw new InternalServerErrorException('Impossible d’envoyer l’email.');
    }
  }
}