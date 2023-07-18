
(function () {
    var nodemailer = require('nodemailer');
    const { sftpOption } = require('./manifest');
    var transporter = nodemailer.createTransport(sftpOption);

    module.exports = {
        sendMail: async (mailOptions) => {
          const { response, rejected } = await transporter.sendMail({
            ...mailOptions, from: sftpOption.auth.user
          });
          if (response) {
            Promise.resolve(true);
          } else {
            console.log(rejected);
            Promise.resolve(false);
          }
        },
        contactHtml: ({ name, mobile, description }) => `
          <div>
            <p>Name: ${name}</p>
            <p>Phone: ${mobile}</p>
            <p>Description: ${description}</p>
        </div>
        `
    };
}());
