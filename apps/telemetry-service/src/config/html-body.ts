

export function bodyHtml(link: string,name:string): string {
  
    const email:string =  
`
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Confirma tu Correo Electrónico</title>
    <style>
        /* Estilos generales y para clientes que no soportan media queries */
        body {
            margin: 0;
            padding: 0;
            width: 100% !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
        }
        table {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        td {
            border-collapse: collapse;
        }
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
        }
        .container {
            width: 100%;
            max-width: 600px;
        }
        .button a {
            color: #ffffff !important;
            text-decoration: none;
            display: inline-block;
            padding: 15px 25px;
            border-radius: 8px;
            font-weight: bold;
        }

        /* Estilos responsivos para dispositivos móviles */
        @media screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                max-width: 100% !important;
            }
            .content {
                padding: 20px !important;
            }
            .header img {
                max-width: 120px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <!-- Contenedor principal del correo -->
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellspacing="0" cellpadding="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table role="presentation" class="container" border="0" align="center" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
                    <!-- Cabecera con el logo -->
                    <tr>
                        <td align="center" class="header" style="padding: 40px 20px 20px 20px;">
                            <!-- Reemplaza 'URL_DE_TU_LOGO' con la URL de tu logo -->
                            <img src="https://placehold.co/150x50/28a745/FFFFFF?text=TuLogo" alt="Logo de la Empresa" width="150" style="display: block;">
                        </td>
                    </tr>
                    <!-- Contenido principal del mensaje -->
                    <tr>
                        <td class="content" style="padding: 20px 40px 40px 40px; text-align: center;">
                            <h1 style="font-size: 24px; color: #333333; margin: 0 0 20px 0;">¡Ya casi está todo listo!</h1>
                            <p style="font-size: 16px; color: #555555; line-height: 1.5; margin: 0 0 30px 0;">
                                ¡Hola, ${name}!
                                <br><br>
                                Gracias por registrarte. Para activar tu cuenta y empezar, solo necesitamos verificar tu dirección de correo electrónico.
                            </p>
                            <!-- Botón de llamada a la acción -->
                            <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" class="button">
                                <tr>
                                    <!-- He cambiado el color a un verde para diferenciar la acción -->
                                    <td align="center" style="border-radius: 8px; background-color: #28a745;">
                                        <!-- Reemplaza '#' con tu enlace de verificación -->
                                        <a href="${link}" target="_blank" style="font-size: 16px; font-family: Arial, sans-serif; color: #ffffff; text-decoration: none; border-radius: 8px; padding: 15px 25px; border: 1px solid #28a745; display: inline-block; font-weight: bold;">Verificar Correo Electrónico</a>
                                    </td>
                                </tr>
                            </table>
                            <p style="font-size: 14px; color: #888888; line-height: 1.5; margin: 30px 0 0 0;">
                                Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
                                <br>
                                <!-- Reemplaza '#' con tu enlace de verificación -->
                                <a href="#" target="_blank" style="color: #28a745; text-decoration: underline; word-break: break-all;">${link}</a>
                            </p>
                        </td>
                    </tr>
                    <!-- Pie de página -->
                    <tr>
                        <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px;">
                            <p style="font-size: 12px; color: #999999; margin: 0;">
                                &copy; 2025 [Nombre de tu Empresa]. Todos los derechos reservados.
                                <br>
                                [Tu Dirección, Ciudad]
                                <br><br>
                                Si no creaste una cuenta, por favor ignora este mensaje.
                            </p>
                        </td>
                    </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
            </td>
        </tr>
    </table>
</body>
</html>
`;
  
  
    return email ;
}
