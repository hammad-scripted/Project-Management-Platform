import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

// * Configure Mailgen
const mailGenerator = new Mailgen({
  theme: 'default',
  product: {
    name: 'Project Management Platform',
    link: 'https://github.com/hammad-scripted/Project-Management-Platform',
  },
});

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_SMTP_HOST,
  port: Number(process.env.MAILTRAP_SMTP_PORT),
  auth: {
    user: process.env.MAILTRAP_SMTP_USER,
    pass: process.env.MAILTRAP_SMTP_PASS,
  },
});

//* Send Email Function
export const sendEmail = async (options) => {
  try {
    //* Generate HTML email
    const emailHtml = mailGenerator.generate(options.mailgenContent);

    //* Generate plain text email
    const emailText = mailGenerator.generatePlaintext(options.mailgenContent);

    const mailOptions = {
      from: process.env.MAILTRAP_SMTP_USER,
      to: options.to,
      subject: options.subject,
      html: emailHtml,
      text: emailText,
    };

    await transporter.sendMail(mailOptions);

    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

const emailVerificationTemplate = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro:
        "Welcome to our project management platform! We're excited to have you on board.",
      action: {
        instructions: 'To verify your email, please click the button below:',
        button: {
          color: '#22BC66',
          text: 'Verify Email',
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const passwordResetTemplate = (username, resetUrl) => {
  return {
    body: {
      name: username,
      intro:
        'You have requested to reset your password. Click the button below to reset your password:',
      action: {
        instructions: 'To reset your password, please click the button below:',
        button: {
          color: '#FF5733', // Red color
          text: 'Reset Password',
          link: resetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export { emailVerificationTemplate, passwordResetTemplate };
