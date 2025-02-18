import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { transporter } from "../lib/nodeMailer";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 🔹 Definir __dirname para funcionar em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const mailService = {
  async sendEmail(clientEmail: string, relationShipId: string): Promise<{ message: string; messageId: string; error: boolean }> {
    try {
      // 🔹 Link do site que será convertido em QR Code
      const siteUrl = `${process.env.FRONT_URL}/love/${relationShipId}`;

      // 🔹 Gerar o QR Code em formato Base64
      const qrCodeBase64 = await QRCode.toDataURL(siteUrl);

      // 🔹 Ler o template do e-mail
      const htmlFilePath = path.join(__dirname, '../mails/successfull-purchase.html');
      let htmlTemplate = fs.readFileSync(htmlFilePath, 'utf8');

      // 🔹 Substituir placeholders no HTML
      htmlTemplate = htmlTemplate
        .replace('{{RELATIONSHIP_ID}}', relationShipId)
        .replace('{{CLIENT_NAME}}', 'Cliente')
        .replace('{{QR_CODE}}', `<img src="${qrCodeBase64}" alt="QR Code" width="150"/>`)
        .replace('{{QR_LINK}}', `<a href="${siteUrl}" class="button">Baixe o QR Code, clicando aqui!</a>`);

      // 🔹 Enviar e-mail
      const mail = await transporter.sendMail({
        from: process.env.EMAIL_ACCOUNT,
        to: clientEmail,
        subject: `Nova imagem adicionada ao relacionamento ${relationShipId}`,
        html: htmlTemplate
      });

      return {
        message: "Email Enviado",
        messageId: mail.messageId,
        error: false
      };

    } catch (err) {
      console.error("Erro ao enviar email:", err);
      return {
        message: "Erro ao enviar email",
        messageId: "",
        error: true
      };
    }
  },
  async sendConfirmPayment(payment_link: string, clientEmail: string): Promise<{ message: string; messageId: string; error: boolean }> {
    try {

      const htmlFilePath = path.join(__dirname, '../mails/purchase-link.html');
      let htmlTemplate = fs.readFileSync(htmlFilePath, 'utf8');

      htmlTemplate = htmlTemplate
        .replace('{{CLIENT_NAME}}', 'Cliente')
        .replace('{{LINK}}', `${payment_link}`);

      // 🔹 Enviar e-mail
      const mail = await transporter.sendMail({
        from: process.env.EMAIL_ACCOUNT,
        to: clientEmail,
        subject: `Faça seu mozão feliz!`,
        html: htmlTemplate
      });

      return {
        message: "Email Enviado",
        messageId: mail.messageId,
        error: false
      };

    } catch (err) {
      console.error("Erro ao enviar email:", err);
      return {
        message: "Erro ao enviar email",
        messageId: "",
        error: true
      };
    }
  },
};
