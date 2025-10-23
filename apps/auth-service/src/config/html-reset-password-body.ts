/**
 * Genera una plantilla HTML profesional para un correo de restablecimiento de contraseña.
 *
 * @param link El enlace único de restablecimiento de contraseña.
 * @param name El nombre del usuario para personalizar el saludo.
 * @returns Una cadena de texto con el cuerpo HTML del correo.
 */
export function generatePasswordResetEmailHtml(link: string, name: string): string {

  // Paleta de colores profesional
  const colors = {
    primary: '#007bff', // Un azul corporativo
    background: '#f4f7f6', // Un gris muy claro para el fondo
    contentBg: '#ffffff', // Fondo blanco para el contenido
    text: '#333333', // Texto principal oscuro
    textLight: '#555555', // Texto secundario
    footerText: '#888888', // Texto del pie de página
  };

  // Estilos en línea para máxima compatibilidad
  const styles = {
    body: `margin: 0; padding: 0; width: 100% !important; background-color: ${colors.background};`,
    wrapper: `width: 100%; background-color: ${colors.background}; padding: 40px 0;`,
    container: `width: 90%; max-width: 600px; margin: 0 auto; background-color: ${colors.contentBg}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);`,
    header: `padding: 30px 40px; text-align: center; background-color: ${colors.contentBg};`,
    headerLogo: `font-size: 28px; color: ${colors.primary}; font-weight: bold; text-decoration: none;`,
    content: `padding: 30px 40px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: ${colors.text};`,
    greeting: `font-size: 20px; font-weight: bold; color: ${colors.text}; margin-bottom: 20px;`,
    paragraph: `margin-bottom: 20px; color: ${colors.textLight};`,
    buttonContainer: `text-align: center; margin: 30px 0;`,
    button: `display: inline-block; padding: 14px 28px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: ${colors.primary}; text-decoration: none; border-radius: 5px;`,
    expiry: `font-size: 14px; color: ${colors.textLight}; margin-top: 20px;`,
    footer: `padding: 30px 40px; text-align: center; font-family: Arial, sans-serif; font-size: 12px; color: ${colors.footerText};`,
    footerLink: `color: ${colors.footerText}; text-decoration: underline;`,
  };

  const emailHtml: string = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-R">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecer Contraseña</title>
</head>
<body style="${styles.body}">
  <!--[if mso | IE]>
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="background-color: ${colors.background};">
  <![endif]-->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="${styles.wrapper}">
    <tr>
      <td>
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="${styles.container}">
          <!-- Cabecera con Logo/Nombre de la Empresa -->
          <tr>
            <td style="${styles.header}">
              <!-- Reemplaza esto con tu logo -->
              <a href="#" style="${styles.headerLogo}">[Nombre de tu Empresa]</a>
            </td>
          </tr>
          
          <!-- Contenido Principal -->
          <tr>
            <td style="${styles.content}">
              <p style="${styles.greeting}">¡Hola, ${name}!</p>
              <p style="${styles.paragraph}">
                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
              </p>
              <p style="${styles.paragraph}">
                Para continuar, por favor haz clic en el siguiente botón:
              </p>
              
              <!-- Botón de Acción (CTA) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="${styles.buttonContainer}" width="100%">
                <tr>
                  <td align="center">
                    <a href="${link}" target="_blank" style="${styles.button}">
                      Restablecer Contraseña
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="${styles.expiry}">
                Este enlace de restablecimiento es válido por los próximos 15 minutos.
              </p>
              <p style="${styles.paragraph}">
                Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu cuenta permanece protegida.
              </p>
              <p style="${styles.paragraph}">
                Saludos,<br>
                El equipo de [Nombre de tu Empresa]
              </p>
            </td>
          </tr>
          
          <!-- Pie de Página -->
          <tr>
            <td style="${styles.footer}">
              <p>&copy; ${new Date().getFullYear()} [Nombre de tu Empresa]. Todos los derechos reservados.</p>
              <p>Este es un correo automático, por favor no respondas.</p>
              <p>
                <a href="#" style="${styles.footerLink}">Política de Privacidad</a> | 
                <a href="#" style="${styles.footerLink}">Términos de Servicio</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
  <!--[if mso | IE]>
      </td>
    </tr>
  </table>
  <![endif]-->
</body>
</html>
  `;

  return emailHtml;
}
