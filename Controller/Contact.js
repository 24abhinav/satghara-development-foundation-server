const { runDBQuery } = require("../Database/db");
const { addVisitorsContactQuery, getVisitorsQuery, deleteVisitorsQuery, changeVisitorsStatusQuery } = require("../Database/query");
const { sendMail, contactHtml } = require("../helper");

const errorHandler = (err, res) => {
    console.log('API error', err);
    return res.status(500).send({ status: 500 });
};

(function () {
    module.exports = {
        addContact: async (req, res) => {
            const { body } = req;
            try {
                const { ok } = await runDBQuery(addVisitorsContactQuery(body));
                await sendMail({
                    to: 'abhinavanand.cse@gmail.com',
                    subject: 'Customer Contact',
                    html: contactHtml(body)
                });
                const status = ok ? 201 : 500;
                return res.status(status).send({ status });
            } catch (err) {
                return errorHandler(err);
            }
        },
        getContact: async (req, res) => {
            const { query } = req;
            try {
                const { ok, response } = await runDBQuery(getVisitorsQuery(query));
                const status = ok ? 200 : 500;
                return res.status(status).send({ status, visitorsList: response });
            } catch (err) {
                return errorHandler(err);
            }
        },
        deleteContact: async (req, res) => {
            const { query } = req;
            try {
                const { ok } = await runDBQuery(deleteVisitorsQuery(query));
                const status = ok ? 204 : 500;
                return res.status(status).send({ status });
            } catch (err) {
                return errorHandler(err);
            }
        },
        changeContactStatus: async (req, res) => {
            const { query } = req;
            try {
                const { ok } = await runDBQuery(changeVisitorsStatusQuery(query));
                const status = ok ? 200 : 500;
                return res.status(status).send({ status });
            } catch (err) {
                return errorHandler(err);
            }
        },
    };
}());
