import nodemailer from 'nodemailer';

const transporter  = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'floppygatolector@gmail.com',
        pass: 'floppy_gato_lector_8'
    },
    from: 'floppygatolector@gmail.com'
});

export const sendEmail = async (to: string, code: string): Promise<void> => {

    const mailOptions = {
        from: '"El Gato Lector" floppygatolector@gmail.com',
        to,
        subject: 'Código de verificación El Gato Lector',
        text: `Tu código de validación es ${code}. Por favor no lo compartas con nadie.`
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log("Correo electrónico enviado");   
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error)
    }

}