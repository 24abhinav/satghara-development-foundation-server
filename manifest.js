module.exports = {
    sftpOption: {
        service: process.env.sftpService,
        auth: {
          user: process.env.sftpEmail,
          pass: process.env.sftpEmailPassword
        },
    },
    enableMail: process.env.enableMail === 'true'
};