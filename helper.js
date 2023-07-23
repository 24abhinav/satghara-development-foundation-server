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
        `,
        setNewPasswordHtml: (link, firstTimeUser = true) => `
            <div>
                <p>
                  ${firstTimeUser ?
                  `
                    Your SDF admin account has been successfully created.
                    Please click on the below link to set your password
                  ` : 'Use the below link to reset your password'
                  }
                </p>
                <p>Click <a href="${link}" target="_blank">here</a> to set your new password</p>
            </div>
        `
    };
}());
