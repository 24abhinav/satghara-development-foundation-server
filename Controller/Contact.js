const { runDBQuery } = require("../Database/db");
const { addVisitorsContactQuery, getVisitorsQuery, deleteVisitorsQuery, changeVisitorsStatusQuery } = require("../Database/query");
const { sendMail, contactHtml } = require("../helper");

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
                res.send({ status }).status(status);
            } catch (err) {
                console.log(err);
                res.send({ status: 500 }).status(500);
            }
        },
        getContact: async (req, res) => {
            const { query } = req;
            try {
                const { ok, response } = await runDBQuery(getVisitorsQuery(query));
                const status = ok ? 200 : 500;
                res.send({ status, visitorsList: response }).status(status);
            } catch (err) {
                console.log(err);
                res.send({ status: 500 }).status(500);
            }
        },
        deleteContact: async (req, res) => {
            const { query } = req;
            try {
                const { ok } = await runDBQuery(deleteVisitorsQuery(query));
                const status = ok ? 204 : 500;
                res.send({ status }).status(status);
            } catch (err) {
                console.log(err);
                res.send({ status: 500 }).status(500);
            }
        },
        changeContactStatus: async (req, res) => {
            const { query } = req;
            try {
                const { ok } = await runDBQuery(changeVisitorsStatusQuery(query));
                const status = ok ? 200 : 500;
                res.send({ status }).status(status);
            } catch (err) {
                console.log(err);
                res.send({ status: 500 }).status(500);
            }
        },
    };
}());
