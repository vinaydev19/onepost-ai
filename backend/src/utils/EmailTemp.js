export const Verification_Email_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>WriterFlow - Verify Your Email</title>
  <style>
    body {
      background-color: #f1f3f9;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', sans-serif;
    }

    .email-container {
      max-width: 580px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      border: 1px solid #e0e0e0;
    }

    .email-header {
      background: linear-gradient(to right, #3a8ffd, #005bea);
      color: white;
      padding: 30px 20px;
      text-align: center;
      font-size: 24px;
      font-weight: 600;
    }

    .email-body {
      padding: 30px 25px;
      color: #333;
      line-height: 1.6;
    }

    .email-body p {
      margin-bottom: 20px;
      font-size: 16px;
    }

    .verification-code {
      display: inline-block;
      background: #eef5ff;
      color: #005bea;
      font-weight: bold;
      padding: 14px 24px;
      font-size: 24px;
      letter-spacing: 3px;
      border-radius: 8px;
      border: 2px dashed #005bea;
      margin: 20px 0;
    }

    .email-footer {
      text-align: center;
      background: #fafafa;
      padding: 18px;
      font-size: 12px;
      color: #777;
      border-top: 1px solid #e0e0e0;
    }

    @media (max-width: 600px) {
      .email-body, .email-header {
        padding: 20px;
      }
      .verification-code {
        font-size: 20px;
        padding: 12px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      Verify Your Email - WriterFlow
    </div>
    <div class="email-body">
      <p>Hello,</p>
      <p>Thank you for joining <strong>WriterFlow</strong>! To complete your registration, please use the verification code below:</p>

      <div class="verification-code">{verificationCode}</div>

      <p>If you didn’t create a WriterFlow account, you can safely ignore this message. For any help, feel free to contact our support team.</p>
    </div>
    <div class="email-footer">
      &copy; ${new Date().getFullYear()} WriterFlow. All rights reserved.
    </div>
  </div>
</body>
</html>

`;

export const Welcome_Email_Template = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to WriterFlow</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #f9fafb;
      margin: 0;
      padding: 0;
      font-family: 'Inter', sans-serif;
      color: #111827;
    }

    .container {
      max-width: 620px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
      overflow: hidden;
      border: 1px solid #e5e7eb;
    }

    .header {
      background: linear-gradient(90deg, #5B2EFF 0%, #1FD1F9 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      font-size: 26px;
      font-weight: 700;
    }

    .content {
      padding: 30px 28px;
      font-size: 16px;
      line-height: 1.8;
      color: #374151;
    }

    .welcome-message {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 24px;
    }

    .footer {
      background-color: #f3f4f6;
      text-align: center;
      padding: 20px;
      font-size: 13px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }

    ul {
      padding-left: 20px;
      margin-bottom: 24px;
    }

    ul li {
      margin-bottom: 10px;
    }

    @media (max-width: 640px) {
      .content, .header {
        padding: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to WriterFlow!</h1>
    </div>
    <div class="content">
      <p class="welcome-message">Hi {name},</p>
      <p>We're thrilled to welcome you to <strong>WriterFlow</strong> – your powerful writing and publishing companion for modern creators and businesses.</p>
      <p>Here’s what you can start doing right away:</p>
      <ul>
        <li>Create AI-assisted drafts and content effortlessly.</li>
        <li>Collaborate with your team or audience in real-time.</li>
        <li>Track performance and manage projects like a pro.</li>
      </ul>
      <p>If you need any assistance, just reply to this email or contact our support team.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} WriterFlow. All rights reserved.
    </div>
  </div>
</body>
</html>

`;

export const Reset_Password_Email_Template = `  
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WriterFlow - Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #007BFF;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-code {
              display: block;
              margin: 20px 0;
              font-size: 22px;
              color: #007BFF;
              background: #e8f0ff;
              border: 1px dashed #007BFF;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              font-weight: bold;
              letter-spacing: 2px;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">WriterFlow - Verify Your Email</div>
          <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for <strong>WriterFlow</strong>. by entering the code below:</p>
              <span class="verification-code">{verificationCode}</span>
              <p>If you didn’t request a password reset, you can safely ignore this email.</p>
              <p>For further assistance, feel free to contact our support team.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} WriterFlow. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

export const Password_Reset_Confirmation_Email = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WriterFlow - Password Reset Successful</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #007BFF;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.8;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">WriterFlow - Password Reset Successful</div>
          <div class="content">
              <p>Hello {name},</p>
              <p>Your password has been successfully reset. You can now log in using your new password.</p>
              <p>If you did not request this change, please contact our support team immediately.</p>
              <p>Stay secure,</p>
              <p><strong>WriterFlow Team</strong></p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} WriterFlow. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

export const Email_Change_Verification_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WriterFlow - Verify Your New Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #007BFF;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              color: #333;
              line-height: 1.8;
          }
          .verification-code {
              display: block;
              margin: 20px 0;
              font-size: 22px;
              color: #007BFF;
              background: #e8f0ff;
              border: 1px dashed #007BFF;
              padding: 10px;
              text-align: center;
              border-radius: 5px;
              font-weight: bold;
              letter-spacing: 2px;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">WriterFlow - Verify Your New Email</div>
          <div class="content">
              <p>Hello,</p>
              <p>You have requested to change your email address for your <strong>WriterFlow</strong> account. To proceed, please verify your new email address by entering the code below:</p>
              <span class="verification-code">{verificationCode}</span>
              <p>If you did not request this change, please ignore this email or contact our support team immediately.</p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} WriterFlow. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;

export const Email_Change_Confirmation_Email = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>WriterFlow - Email Change Successful</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
              color: #333;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              border: 1px solid #ddd;
          }
          .header {
              background-color: #007BFF;
              color: white;
              padding: 20px;
              text-align: center;
              font-size: 26px;
              font-weight: bold;
          }
          .content {
              padding: 25px;
              line-height: 1.8;
          }
          .footer {
              background-color: #f4f4f4;
              padding: 15px;
              text-align: center;
              color: #777;
              font-size: 12px;
              border-top: 1px solid #ddd;
          }
          p {
              margin: 0 0 15px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">WriterFlow - Email Change Successful</div>
          <div class="content">
              <p>Hello {name},</p>
              <p>Your email address has been successfully updated. From now on, please use your new email address to log in to your account.</p>
              <p>If you did not request this change, please contact our support team immediately.</p>
              <p>Stay secure,</p>
              <p><strong>WriterFlow Team</strong></p>
          </div>
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} WriterFlow. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;
