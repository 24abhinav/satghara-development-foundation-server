const { sendMail, contactHtml } = require("../helper");

(function () {

    const addContact = async (req, res) => {
        const { body } = req;
        try {
            await sendMail({
                to: 'abhinavanand.cse@gmail.com',
                subject: 'Customer Contact',
                html: contactHtml(body)
            });
            res.send({ ...body }).status(200);
        } catch (err) {
            console.log(err);
            res.send({ status: 500 }).status(500);
        }
    };

    module.exports = {
        addContact
    };
}());
