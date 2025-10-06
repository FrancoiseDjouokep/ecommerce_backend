import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';

@Injectable()
export class MailerService {
  private sender: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('SENDGRID_API_KEY')!;
    this.sender = this.configService.get<string>('EMAIL_SENDER')!;
    sgMail.setApiKey(apiKey);
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendSignupEmail(userEmail: string): Promise<string> {
    const otp = this.generateOtp();

    const msg = {
      to: userEmail,
      from: this.sender,
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
      console.log(`Email envoyé avec succès à ${userEmail}`);
      return otp;
    } catch (error) {
      console.error('Erreur lors de l’envoi de l’email :', error.response?.body || error);
      throw new Error('Impossible d’envoyer l’email.');
    }
  }
}
