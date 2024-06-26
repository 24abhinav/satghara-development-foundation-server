
(function () {
    const { sanitizeObject } = require('../helper');
    const translate = require('translate-google');
    const { runDBQuery } = require("../Database/db");
    const { addNewProgramQuery, getProgramQuery, editProgramQuery, deleteProgramQuery, changeProgramImageQuery } = require("../Database/query");

    module.exports = {
        getPrograms: async (req, res) => {
            const { query: { id = '', lng = 'english', url = '' } = {}} = req;
            const { response = [] } = await runDBQuery(getProgramQuery(id, url));
            const ApiResponse = response.map(el => {
                try {
                    const { hindi, english, ...rest } = el;
                    return {
                        ...rest,
                        ...(JSON.parse(lng === 'hindi' ? hindi : english))
                    }
                } catch (e) {
                    console.log('Error while parsing programs', e);
                }
            });
            return res.status(200).send(ApiResponse);
        },
        addNewProgram: async (req, res) => {
            const {
                userDetails: { name = '' } = {},
                body: {
                    title = '',
                    description = '',
                    alerts = '',
                    address = '',
                    detailspageurl = '',
                    maintainer = ''
                } = {}
            } = req;
            const english = { title, description, alerts, address };
            const hindi = await translate({ ...english }, { from: 'en', to: 'hi'});
            const query = addNewProgramQuery(sanitizeObject({
                createdBy: name,
                detailspageurl,
                maintainer,
                english: JSON.stringify(english),
                hindi: JSON.stringify(hindi)
            }));
            const { ok } = await runDBQuery(query);
            return res.status(ok ? 200 : 500).send();
        },
        editProgram: async (req, res) => {
            const {
                userDetails: { name = '' } = {},
                body: {
                    programid,
                    title = '',
                    description = '',
                    alerts = '',
                    address = '',
                    detailspageurl = '',
                    maintainer = '',
                } = {}
            } = req;
            const english = { title, description, alerts, address };
            const hindi = await translate({ ...english }, { from: 'en', to: 'hi'});
            const query = editProgramQuery(sanitizeObject({
                username: name,
                detailspageurl,
                english: JSON.stringify(english),
                hindi: JSON.stringify(hindi),
                programid,
                maintainer
            }));
            const { ok } = await runDBQuery(query);
            return res.status(ok ? 200 : 500).send();
        },
        deleteProgram: async (req, res) => {
            const {
                userDetails: { name = '' } = {},
                params: { id = '' } = {}
            } = req;
            const { ok } = await runDBQuery(deleteProgramQuery({ id, username: name }));
            return res.status(ok ? 200 : 500).send();
        },
        changeProgramImage: async (req, res) => {
            const {
                userDetails: { name = '' } = {},
                params: { id = '' } = {},
                body: { image = '' } = {}
            } = req;
            const { ok } = await runDBQuery(changeProgramImageQuery({ id, username: name, image }));
            return res.status(ok ? 200 : 500).send();
        }
    };
}());
