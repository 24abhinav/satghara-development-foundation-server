(function () {
    const translate = require('translate-google');
    const { runDBQuery } = require("../Database/db");
    const { addNewProgramQuery, getProgramQuery, editProgramQuery, deleteProgramQuery, changeProgramImageQuery } = require("../Database/query");

    module.exports = {
        getPrograms: async (req, res) => {
            const { query: { id = '', lng = 'en' } = {}} = req;
            const { ok, response } = await runDBQuery(getProgramQuery(id));
            const ApiResponse = response.map(el => {
                try {
                    const { hindi, english, ...rest } = el;
                    return {
                        ...rest,
                        ...(JSON.parse(lng === 'en' ? english : hindi))
                    }
                } catch (e) {
                    console.log('Error while parsing programs', e);
                }
            });
            return res.status(ok ? 200 : 500).send(ApiResponse);
        },
        addNewProgram: async (req, res) => {
            const {
                userDetails: { name = '' } = {},
                body: { title = '', description = '', alerts = '', detailsPageUrl = '' } = {}
            } = req;
            const english = { title, description, alerts };
            const hindi = await translate({ ...english }, { from: 'en', to: 'hi'});
            const query = addNewProgramQuery({
                createdBy: name,
                detailsPageUrl,
                english: JSON.stringify(english),
                hindi: JSON.stringify(hindi)
            });
            const { ok } = await runDBQuery(query);
            return res.status(ok ? 200 : 500).send();
        },
        editProgram: async (req, res) => {
            const {
                userDetails: { name = '' } = {},
                body: { title = '', description = '', alerts = '', detailsPageUrl = '', id = '' } = {}
            } = req;
            const english = { title, description, alerts };
            const hindi = await translate({ ...english }, { from: 'en', to: 'hi'});
            const query = editProgramQuery({
                username: name,
                detailsPageUrl,
                english: JSON.stringify(english),
                hindi: JSON.stringify(hindi),
                id
            });
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
