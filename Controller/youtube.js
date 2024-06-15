(function () {
    const translate = require('translate-google');
    const { sanitizeObject } = require('../helper');
    const { runDBQuery } = require("../Database/db");
    const { getVideosQuery, addNewVideoQuery, deleteVideoQuery } = require("../Database/query");

    module.exports = {
        getVideos: async (req, res) => {
            const { query: { lng = 'english' } = {}} = req;
            const { response = [] } = await runDBQuery(getVideosQuery());
            const ApiResponse = response.map(el => {
                try {
                    const { hindi, english, ...rest } = el;
                    return {
                        ...rest,
                        ...(JSON.parse(lng === 'hindi' ? hindi : english))
                    }
                } catch (e) {
                    console.log('Error while parsing video', e);
                }
            });
            return res.status(200).send(ApiResponse);
        },
        addNewVideo: async (req, res) => {
            const {
                userDetails: { name = '' } = {},
                body: { title = '', url = '' } = {}
            } = req;
            const english = { title };
            const hindi = await translate({ ...english }, { from: 'en', to: 'hi'});
            const query = addNewVideoQuery(sanitizeObject({
                createdBy: name,
                url,
                english: JSON.stringify(english),
                hindi: JSON.stringify(hindi)
            }));
            const { ok } = await runDBQuery(query);
            return res.status(ok ? 201 : 500).send();
        },
        deleteVideo: async (req, res) => {
            const { params: { id = '' } = {} } = req;
            const { ok } = await runDBQuery(deleteVideoQuery(id));
            return res.status(ok ? 204 : 500).send();
        },
    };
}());
