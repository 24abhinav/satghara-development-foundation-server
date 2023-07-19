(function () {
    const Meta = require('../Meta.json');
    const manifest = require('../manifest');
    module.exports = {
        getPageMeta: async (req, res) => {
            const { query: { language = '' } } = req;
            const lng = ['hindi', 'english'].includes(language) ? language : 'english';
            return res.status(200).send({ ...Meta[lng], selectedLanguage: language, apiBaseUrl: manifest.apiBaseUrl });
        },
    };
}());
