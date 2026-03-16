const nodemailer = require('nodemailer');

async function createAccount() {
    let testAccount = await nodemailer.createTestAccount();
    console.log(`SMTP_HOST=${testAccount.smtp.host}`);
    console.log(`SMTP_PORT=${testAccount.smtp.port}`);
    console.log(`SMTP_USER=${testAccount.user}`);
    console.log(`SMTP_PASS=${testAccount.pass}`);
    console.log(`WEBUI=https://ethereal.email/message/`);
}

createAccount().catch(console.error);
