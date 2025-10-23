import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugin.js';
import { generatePasswordResetEmailHtml } from '../../config/html-reset-password-body.js';
import { ValidationEmailHtml } from '../../config/html-validation-body.js';

interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
}

export class EmailService {


  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody } = options;

    try {
      await this.transporter.sendMail({
        to: to,
        subject: subject,
        html: htmlBody,
      });
      return true;
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return false;
    }
  }

  sendEmailWithValidateAccount(to: string, link: string, name: string) {
    const subject = 'Validar tu cuenta de correo';
    const htmlBody = ValidationEmailHtml(link, name);
    return this.sendEmail({ to, subject, htmlBody });
  }

  sendPasswordResetEmail(to: string, link: string, name: string) {
    const subject = 'Restablecer tu contraseña';
    const htmlBody = generatePasswordResetEmailHtml(link, name);
    return this.sendEmail({ to, subject, htmlBody });
  }





}

/**
 * ==================================================================================================
 *                                SERVICIO DE ENVÍO DE CORREO ELECTRÓNICO
 * ==================================================================================================
 *
 * @file src/presentation/email/email.service.ts
 * @description Este archivo define la clase `EmailService`, responsable de toda la lógica
 *              para el envío de correos electrónicos utilizando la librería `nodemailer`.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                       INTERFAZ SendMailOptions
 * --------------------------------------------------------------------------------------------------
 * @interface SendMailOptions
 * @description Define la estructura de datos necesaria para enviar un correo.
 * @property {string | string[]} to - El destinatario o lista de destinatarios.
 * @property {string} subject - El asunto del correo.
 * @property {string} htmlBody - El contenido del correo en formato HTML.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                          CLASE EmailService
 * --------------------------------------------------------------------------------------------------
 * @class EmailService
 * @description Encapsula la configuración y la lógica para el envío de correos.
 *
 * @property {nodemailer.Transporter} transporter - Instancia de `nodemailer` pre-configurada
 *           con el servicio y las credenciales obtenidas de las variables de entorno.
 *           Esta instancia es la que se reutiliza para todos los envíos.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                         MÉTODO `sendEmail`
 * --------------------------------------------------------------------------------------------------
 * @method sendEmail
 * @description Método genérico y principal para enviar un correo electrónico.
 * @param {SendMailOptions} options - Objeto con la información del destinatario, asunto y cuerpo del correo.
 * @returns {Promise<boolean>} - Retorna `true` si el correo se envió con éxito, `false` en caso de error.
 *
 * @paso 1: Desestructuración de Opciones
 *   - Extrae `to`, `subject` y `htmlBody` del objeto de opciones.
 *
 * @paso 2: Envío del Correo
 *   - Utiliza `this.transporter.sendMail()` para realizar el envío.
 *   - Se envuelve en un bloque `try...catch` para manejar posibles fallos en la comunicación
 *     con el servicio de correo (ej. credenciales incorrectas, problemas de red).
 *
 * @paso 3: Manejo del Resultado
 *   - Si el envío es exitoso, retorna `true`.
 *   - Si ocurre un error, lo captura, lo muestra en consola y retorna `false`.
 *
 *
 * --------------------------------------------------------------------------------------------------
 *                                 MÉTODO `sendEmailWithValidateAccount`
 * --------------------------------------------------------------------------------------------------
 * @method sendEmailWithValidateAccount
 * @description Método especializado para enviar el correo de validación de cuenta.
 *              Actúa como un "helper" que simplifica una tarea común.
 * @param {string} to - El destinatario del correo.
 * @param {string} link - El enlace de validación que se incluirá en el cuerpo del correo.
 * @param {string} name - El nombre del usuario para personalizar el mensaje.
 * @returns {Promise<boolean>} - El resultado de la operación de envío.
 *
 * @paso 1: Definición del Contenido
 *   - Establece un asunto (`subject`) específico para este tipo de correo.
 *   - Genera el cuerpo del correo (`htmlBody`) utilizando una plantilla HTML (`bodyHtml`).
 *
 * @paso 2: Delegación del Envío
 *   - Llama al método genérico `sendEmail`, pasándole los datos construidos.
 *   - Retorna directamente el resultado de `sendEmail`.
 *
 */