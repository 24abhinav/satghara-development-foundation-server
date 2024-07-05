(function () {
    const translate = require('translate-google');
    const { sanitizeObject } = require('../helper');
    const { runDBQuery } = require("../Database/db");
    const { getVideosQuery, addNewVideoQuery, deleteVideoQuery, getProgramQuery, getVideoProgramMappingQuery, deleteVideoProgramMappingQuery, addVideoProgramMappingQuery, deleteVideoProgramMappingByVideoIdQuery } = require("../Database/query");

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
                body: { title = '', url = '', platform='' } = {}
            } = req;
            const english = { title };
            const hindi = await translate({ ...english }, { from: 'en', to: 'hi'});
            const query = addNewVideoQuery(sanitizeObject({
                createdBy: name,
                url,
                platform,
                english: JSON.stringify(english),
                hindi: JSON.stringify(hindi)
            }));
            const { ok } = await runDBQuery(query);
            return res.status(ok ? 201 : 500).send();
        },
        deleteVideo: async (req, res) => {
            const { params: { id = '' } = {} } = req;
            const { ok } = await runDBQuery(deleteVideoQuery(id));
            await runDBQuery(deleteVideoProgramMappingByVideoIdQuery({ videoId: id }));
            return res.status(ok ? 204 : 500).send();
        },
        videoProgramMapping: async (req, res) => {
            const {
                userDetails: { name = '' } = {},
                body: { programId = '', videoId = '' } = {}
            } = req;
            let message = 'Provide valid input';
            let status = 400;
            if (programId && videoId) {
                const params = { videoId, programId, name };
                const { response: [program] = [] } = await runDBQuery(getProgramQuery(programId));
                if (program) {
                    const { response: [{ url = '' } = {}] = [] } = await runDBQuery(getVideosQuery(videoId));
                    if (url) {
                        params.url = url;
                        const {response: [existingMapping] = [] } = await runDBQuery(getVideoProgramMappingQuery({ ...params }));
                        if (existingMapping) {
                            const { ok } = await runDBQuery(deleteVideoProgramMappingQuery({ ...params }));
                            if (ok) {
                                message = 'Video removed from the Program';
                                status = 200;
                            }
                        } else {
                            const { ok } = await runDBQuery(addVideoProgramMappingQuery({ ...params }));
                            if (ok) {
                                message = 'Video added to the program';
                                status = 201;
                            }
                        }
                    }
                }
            }
            return res.status(status).send({ message });
        },
        getVideoByProgramId:  async (req, res) => {
            const { query: { programId = 0 } = {}} = req;
            const { response = [] } = await runDBQuery(getVideoProgramMappingQuery({ programId }));
            return res.status(200).send(response);
        }
    };
}());
