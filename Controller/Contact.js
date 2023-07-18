const { runDBQuery } = require("../Database/db");
const { visitorsContactQuery } = require("../Database/query");
const { sendMail, contactHtml } = require("../helper");

(function () {

    const addContact = async (req, res) => {
        const { body } = req;
        try {
            const { ok } = await runDBQuery(visitorsContactQuery(body));
            await sendMail({
                to: 'abhinavanand.cse@gmail.com',
                subject: 'Customer Contact',
                html: contactHtml(body)
            });
            const status = ok ? 200 : 500;
            res.send({ status }).status(status);
        } catch (err) {
            console.log(err);
            res.send({ status: 500 }).status(500);
        }
    };

    module.exports = {
        addContact
    };
}());
