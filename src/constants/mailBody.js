const mailBody = async (data, email, type ) => {
  let content = "";

  if (type === "verify") {
    content = `
      <h2>Hi ${data?.name},</h2>
      <p>Thank you for registering with us! To complete your registration, please verify your email address by clicking the button below:</p>
      <div style="text-align: center;">
        <a href="${data?.token}" class="button">Verify Email Address</a>
      </div>
      <p><strong>This link will expire in 24 hours.</strong></p>
    `;
  } else if (type === "reset") {
    content = `
      <h2>Hi ${data?.name},</h2>
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      <div style="text-align: center;">
        <a href="${data?.token}" class="button">Reset Password</a>
      </div>
      <p><strong>This link will expire in 1 hour.</strong></p>
    `;
  }

  return `
     <!DOCTYPE html>
     <html>
     <head>
       <style>
         body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
         .container { max-width: 600px; margin: 0 auto; padding: 20px; }
         .header { background: #007bff; color: white; padding: 20px; text-align: center; }
         .content { padding: 20px; background: #f9f9f9; }
         .button { 
           display: inline-block; 
           padding: 12px 24px; 
           background: #28a745; 
           color: white; 
           text-decoration: none; 
           border-radius: 5px; 
           margin: 20px 0;
           font-weight: bold;
         }
         .button:hover {
           background: #218838;
         }
         .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
       </style>
     </head>
     <body>
       <div class="container">
         <div class="header">
           <h1>${process.env.APP_NAME || "Our App"}</h1>
         </div>
         <div class="content">
           ${content}
           <p>If you didn’t request this, you can safely ignore this email.</p>
         </div>
         <div class="footer">
           <p>&copy; 2025 ${
             process.env.APP_NAME || "Your App"
           }. All rights reserved.</p>
         </div>
       </div>
     </body>
     </html>
   `;
};
export default mailBody;
