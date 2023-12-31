module.exports = {
    sftpOption: {
        service: process.env.sftpService,
        auth: {
          user: process.env.sftpEmail,
          pass: process.env.sftpEmailPassword
        },
    },
    enableMail: process.env.enableMail === 'true',
    apiBaseUrl: process.env.apiBaseUrl,
    clientUrl: process.env.clientUrl,
    allowedSessionTime: Number(process.env.allowedSessionTime)
};