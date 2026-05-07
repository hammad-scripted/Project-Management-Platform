import Mailgen from 'mailgen';

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
