const manifest = require('./manifest');

(function () {
    var nodemailer = require('nodemailer');
    const { sftpOption } = require('./manifest');
    var transporter = nodemailer.createTransport(sftpOption);

    module.exports = {
        sendMail: async (mailOptions) => {
          if (manifest.enableMail) {
            const { response, rejected } = await transporter.sendMail({
              ...mailOptions, from: sftpOption.auth.user
            });
            if (response) {
              return Promise.resolve(true);
            } else {
              console.log(rejected);
              return Promise.resolve(false);
            }
          }
          return Promise.resolve(true);
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
