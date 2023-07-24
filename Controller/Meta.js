
(function () {
    const { runDBQuery } = require("../Database/db");
    const { getMetaQuery, updateMetaQuery } = require("../Database/query");
    const manifest = require("../manifest");
    const { errorHandler, isJasonValid } = require("./General");

    module.exports = {
        getMetaDetails: async (req, res) => {
            try {
                const { query: { language = '', fullResponse = '' } } = req;
                const { ok, response: [{ data: pageMeta = {} } = {}] = [] } = await runDBQuery(getMetaQuery());
                const status = ok ? 200 : 500;
                const lng = ['hindi', 'english'].includes(language) ? language : 'english';
                return res.status(status).send({
                    selectedLanguage: lng,
                    ...(fullResponse === 'true' ? { fullResponse: { ...pageMeta } } : { ...pageMeta[lng] }),
                    apiBaseUrl: manifest.apiBaseUrl
                });
            } catch (err) {
                return errorHandler(err, res);
            }
        },
        updateMetaDetails: async (req, res) => {
            const { body: { data = '' } = {} } = req;
            if(isJasonValid(data)) {
                const { ok } = await runDBQuery(updateMetaQuery({ data }));
                if (ok) {
                    return res.status(200).send();
                }
            }
            return res.status(400).send();
        }
    };
}());
