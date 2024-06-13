const { runDBQuery } = require("../Database/db");
const { addDonationQuery, getDonationQuery, deleteDonationQuery, updateDonationQuery, getDonationSumQuery } = require("../Database/query");
const translate = require('translate-google');

const errorHandler = (err, res) => {
    console.log('API error', err);
    return res.status(500).send({ status: 500 });
};

(function () {
    module.exports = {
        addDonation: async (req, res) => {
            const { body } = req;
            try {
                const { amount, name, notes = '', ...restPayload } = body;
                const hindiContent = await translate({ name, ...restPayload }, { from: 'en', to: 'hi'});
                const { ok } = await runDBQuery(addDonationQuery({ hindi: hindiContent, english: { name: name.toLowerCase(), ...restPayload}, amount, notes }));
                const status = ok ? 201 : 500;
                return res.status(status).send();
            } catch (err) {
                return errorHandler(err);
            }
        },
        getDonation: async (req, res) => {
            const { query } = req;
            const { countOnly = 'false' } = query;
            try {
                const promise = [
                    ...(countOnly === 'true' ? [Promise.resolve({})] : [runDBQuery(getDonationQuery(query))]),
                    runDBQuery(getDonationSumQuery),
                ];
                const promiseArray = await Promise.allSettled(promise);
                const responseObj = {};
                let status = true;
                promiseArray.forEach(({ status, value }, index) => {
                    if(status === 'fulfilled') {
                        const { ok, response } = value;
                        if (ok) {
                            if (index === 0) {
                                responseObj.list = response;
                            } else {
                                const [{ sum = 0, count = 0 } = {}] = response;
                                responseObj.totalDonation = Number(sum);
                                responseObj.totalDonorCount = Number(count);
                            }
                        } else {
                            status = false;
                        }
                    } else {
                        status = false;
                    }
                })
                // const { ok, response } = await runDBQuery(getDonationQuery(query));
                return res.status(status ? 200 : 500).send({ ...responseObj });
            } catch (err) {
                return errorHandler(err);
            }
        },
        deleteDonation: async (req, res) => {
            const { query } = req;
            try {
                const { ok } = await runDBQuery(deleteDonationQuery(query));
                const status = ok ? 204 : 500;
                return res.status(status).send({ status });
            } catch (err) {
                return errorHandler(err);
            }
        },
        updateDonation: async (req, res) => {
            const { body, query: { id = '' } } = req;
            try {
                const { amount, name, ...restPayload } = body;
                const hindiContent = await translate({ name, ...restPayload }, { from: 'en', to: 'hi'});
                const { ok } = await runDBQuery(updateDonationQuery({ hindi: hindiContent, english: { name: name.toLowerCase(), ...restPayload}, amount, id }));
                const status = ok ? 200 : 500;
                return res.status(status).send({ status });
            } catch (err) {
                return errorHandler(err);
            }
        },
    };
}());
