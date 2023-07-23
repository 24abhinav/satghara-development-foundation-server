const { runDBQuery } = require("../Database/db");
const { addOrgUserQuery, getOrgUserQuery, deleteOrgUserQuery, updateOrgUserQuery, setOrgPasswordQuery } = require("../Database/query");
const { errorHandler, sendPasswordSetLink, checkAdminDuplicateUser, decrypt, encrypt, addSession } = require("./General");

(function () {
    module.exports = {
        adminSignIn: async (req, res) => {
            try {
                const { body: { email = '', password = ''} = {} } = req;
                const { isUserExist, user = {}} = await checkAdminDuplicateUser(email);
                const { password: savedPassword, active = false } = user;
                if(isUserExist && savedPassword && password) {
                    const decryptedPassword = decrypt(savedPassword || '');
                    if(decryptedPassword === password) {
                        const token = encrypt(JSON.stringify({ ...user, time: new Date().getTime()}));
                        res.set('x-session-token', token);
                        return res.status(200).send({ signedIn: true });
                    }
                }
                return res.status(400).send({ ...(isUserExist ? { active } : {} ) });
            } catch (err) {
                return errorHandler(err, res);
            }
        },
        addAdminUser: async (req, res) => {
            const { body } = req;
            const { email = '' } = body;
            try {
                const { isUserExist } = await checkAdminDuplicateUser(email);
                if (isUserExist) {
                    return res.status(409).send();
                }
                const { ok } = await runDBQuery(addOrgUserQuery(body));
                if (ok) {
                    await sendPasswordSetLink({ email, firstTimeUser: true });
                }
                const status = ok ? 201 : 500;
                return res.status(status).send();
            } catch (err) {
                return errorHandler(err, res);
            }
        },
        getAdminUser: async (req, res) => {
            try {
                const { ok, response } = await runDBQuery(getOrgUserQuery);
                const status = ok ? 200 : 500;
                return res.status(status).send(response);
            } catch (err) {
                return errorHandler(err, res);
            }
        },
        deleteAdminUser: async (req, res) => {
            const { query } = req;
            try {
                const { ok } = await runDBQuery(deleteOrgUserQuery(query));
                const status = ok ? 204 : 500;
                return res.status(status).send({ status });
            } catch (err) {
                return errorHandler(err, res);
            }
        },
        changeAdminUser: async (req, res) => {
            const { body, query: { email: filterEmail = '' } = {} } = req;
            try {
                let checkEmail = body.email === filterEmail;
                if (!checkEmail) {
                    const { isUserExist } = await checkAdminDuplicateUser(body.email || '');
                    if (isUserExist) {
                        return res.status(409).send();
                    }
                }
                const { ok } = await runDBQuery(updateOrgUserQuery({ ...body, filterEmail }));
                const status = ok ? 200 : 500;
                return res.status(status).send({ status });
            } catch (err) {
                return errorHandler(err, res);
            }
        },
        setAdminPassword: async (req, res) => {
            const { body: { password = '' } = {}, headers: { 'x-key': encryptedKey = '' } } = req;
            try {
                const email = decrypt(encryptedKey);
                const { ok } = await runDBQuery(setOrgPasswordQuery({ password: encrypt(password), email }));
                const status = ok ? 200 : 500;
                return res.status(status).send({ status });
            } catch (err) {
                return errorHandler(err, res);
            }
        },
        resetPassword: async (req, res) => {
            const { body: { email = '' } = {} } = req;
            try {
                const { isUserExist } = await checkAdminDuplicateUser(email);
                if(isUserExist) {
                    await sendPasswordSetLink({ email });
                }
                return res.status(200).send();
            } catch (err) {
                return errorHandler(err, res);
            }
        },
    };
}());
