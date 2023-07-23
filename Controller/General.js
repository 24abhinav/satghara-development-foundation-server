

(function () {
    const Meta = require('../Meta.json');
    const manifest = require('../manifest');
    const Cryptr = require('cryptr');
    const cryptr = new Cryptr('myTotallySecretKey');
    const { sendMail, setNewPasswordHtml } = require('../helper');
    const { runDBQuery } = require('../Database/db');
    const { checkOrgUserQuery, addSessionQuery } = require('../Database/query');

    module.exports = {
        getPageMeta: async (req, res) => {
            const { query: { language = '' } } = req;
            const lng = ['hindi', 'english'].includes(language) ? language : 'english';
            return res.status(200).send({ ...Meta[lng], selectedLanguage: language, apiBaseUrl: manifest.apiBaseUrl });
        },
        errorHandler: (err, res) => {
            console.log('API error', err);
            return res.status(500).send({ status: 500 });
        },
        encrypt: (string) => {
            return cryptr.encrypt(string);
        },
        decrypt: (encryptedString) => {
            try {
                const decryptedString =  cryptr.decrypt(encryptedString);
                return decryptedString;
            } catch (err) {
                return '';
            }
        },
        sendPasswordSetLink: async ({ email, firstTimeUser = false }) => {
            const encryptedString = cryptr.encrypt(email);
            const link = `${manifest.clientUrl}/sdfAdmin/create-password/${encryptedString}`;
            await sendMail({
                to: email,
                subject: firstTimeUser ? 'User created' : 'Reset your password',
                html: setNewPasswordHtml(link, firstTimeUser)
            }, firstTimeUser );
        },
        checkAdminDuplicateUser: async email => {
            try {
                const { response = [] } = await runDBQuery(checkOrgUserQuery(email));
                return { user: response[0] || {}, isUserExist: !!response.length };
            } catch (err) {
                return { user: {}, isUserExist: false };
            }
        },
        addSession: async (details, sid) => {
            try {
                await runDBQuery(addSessionQuery(details, sid));
                return { user: response[0] || {}, isUserExist: !!response.length };
            } catch (err) {
                return { user: {}, isUserExist: false };
            }
        }
    };
}());
