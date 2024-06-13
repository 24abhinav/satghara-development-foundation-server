(function () {
    const { runDBQuery } = require("../Database/db");
    const { getMetaQuery, addMetaQuery, changeMetaStatus, getAllMetaQuery, getActiveMetaId, deleteMeta } = require("../Database/query");
    const manifest = require("../manifest");
    const { errorHandler, isJasonValid } = require("./General");

    module.exports = {
        addNewMeta: async (req, res) => {
            const {
                userDetails: { name = '' } = {},
                body: { english = {}, hindi = {} } = {}
            } = req;
            const encodedEnglish = JSON.stringify(english).replace(/'/g, "''");
            const encodedHindi = JSON.stringify(hindi).replace(/'/g, "''");
            const { ok } = await runDBQuery(addMetaQuery({ encodedEnglish, encodedHindi, name }));
            return res.status(ok ? 200: 500).send();
        },
        updateMetaStatus: async (req, res) => {
            const {
                userDetails: { name = '' } = {},
                body: { id = '', status = '', activeId = '' } = {}
            } = req;
            const { ok } = await runDBQuery(changeMetaStatus({ id, status, name }));
            if (ok) {
                if (activeId) {
                    await runDBQuery(changeMetaStatus({ id: activeId, status: false, name }));
                }
            }
            return res.status(ok ? 200: 500).send();
        },
        getMetaDetails: async (req, res) => {
            try {
                const { query: { language = '', fullResponse = '' } } = req;
                const { ok, response: [pageMeta = {}] = [] } = await runDBQuery(getMetaQuery());
                const response = {
                    ...pageMeta,
                    english: null,
                    hindi: null,
                };
                try {
                    response.english = JSON.parse(pageMeta.english);
                    response.hindi = JSON.parse(pageMeta.hindi);
                } catch (e) {
                    console.log(e);
                }
                const lng = ['hindi', 'english'].includes(language) ? language : 'english';
                return res.status(ok ? 200 : 500).send({
                    selectedLanguage: lng,
                    meta: fullResponse === 'true' ? response : { ...response, english: undefined, hindi: undefined, ...response[lng]},
                    apiBaseUrl: manifest.apiBaseUrl
                });
            } catch (err) {
                return errorHandler(err, res);
            }
        },
        getAllMeta: async (req, res) => {
            const { ok, response = [] } = await runDBQuery(getAllMetaQuery());
            let activeMeta = {};
            const resp = response.map(el => {
                const { english, hindi } = el;
                const meta = { ...el };
                try {
                    meta.english = JSON.parse(english);
                    meta.hindi = JSON.parse(hindi);
                } catch (e) {
                    console.log('Error while parsing', e);
                }
                if (el.active) {
                    activeMeta = meta;
                }
                return meta;
            });
            return res.status(ok ? 200 : 500).send({ allMeta: resp, active: activeMeta });
        },
        deleteMeta:  async (req, res) => {
            const {
                userDetails: { name = '' } = {},
                params: { id = '' } = {}
            } = req;
            const { ok, response: [{ id: activeId = '' } = {}] = [] } = await runDBQuery(getActiveMetaId());
            if (ok) {
                if (Number(id) === Number(activeId)) {
                    return res.status(400).send({ message: 'Active meta can not be deleted'});
                }
                const { ok } = await runDBQuery(deleteMeta({ id, name }));
                return res.status(ok ? 200: 500).send();
            }
        }
    };
}());
