const query = {
    addVisitorsContactQuery: ({ name, mobile, description }) =>  {
        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long' }).toLowerCase();
        const day = date.getDate();
        return `
            INSERT INTO visitorscontact (name, mobile, description, date, month, year, day)
            VALUES ('${name}', '${mobile}', '${description}', '${date.getTime()}', '${month}', ${date.getFullYear()}, ${day});
        `;
    },
    getVisitorsQuery: ({ name, mobile, day, month, year = new Date().getFullYear(), active = true }) => {
        return `
            select * from visitorscontact where
            active=${active}
            ${name ? `and name='${name}'` : ''}
            ${mobile ? `and mobile='${mobile}'` : ''}
            ${day ? `and day=${day}` : ''}
            ${month ? `and month='${month}'` : ''}
            ${year ? `and year=${year}` : ''}
        `;
    },
    deleteVisitorsQuery: ({ id }) => {
        return `DELETE FROM visitorscontact WHERE ID = ${id};`;
    },
    changeVisitorsStatusQuery: ({ id }) => {
        return `UPDATE visitorscontact SET active=false WHERE id=${id};`;
    },
    addDonationQuery: ({ english, hindi, amount }) => {
        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long' }).toLowerCase();
        const day = date.getDate();
        return `
            INSERT INTO DONATION (english, hindi, amount, date, day, month, year)
            VALUES
            (
                '${JSON.stringify(english)}',
                '${JSON.stringify(hindi)}',
                '${amount}',
                '${date.getTime()}',
                ${day},
                '${month}',
                ${date.getFullYear()}
            )
        `;
    },
    getDonationQuery: ({ amount, name, mobile, day, month, year = new Date().getFullYear() }) => {
        return `
            select * from DONATION where year=${year}
            ${name ? `and english LIKE '%${name.toLowerCase()}%'` : ''}
            ${amount ? `and amount='${amount}'` : ''}
            ${mobile ? `and mobile='${mobile}'` : ''}
            ${day ? `and day=${day}` : ''}
            ${month ? `and month='${month}'` : ''}
        `;
    },
    deleteDonationQuery: ({ id }) => {
        return `DELETE FROM DONATION WHERE ID = ${id};`;
    },
    updateDonationQuery: ({ english, hindi, amount, id }) => {
        return `
            UPDATE DONATION SET
            english='${JSON.stringify(english)}',
            hindi='${JSON.stringify(hindi)}',
            amount='${amount}'
            WHERE id=${id};
        `;
    },
    getDonationSumQuery: 'SELECT SUM(AMOUNT), COUNT(AMOUNT) FROM DONATION',

    getOrgUserQuery: 'SELECT * FROM OrgUser',
    checkOrgUserQuery: (email) => `SELECT * FROM OrgUser where email='${email}'`,
    addOrgUserQuery: ({ name, email, mobile, role, designation, createdBy }) => {
        return `
            INSERT INTO OrgUser (name, email, mobile, designation, role, createdby)
            VALUES
            (
                '${name}',
                '${email}',
                ${mobile},
                '${designation}',
                ${role ? role : null},
                '${createdBy}'
            )
        `;
    },
    deleteOrgUserQuery: ({ email }) => {
        return `DELETE FROM OrgUser WHERE EMAIL = '${email}';`;
    },
    updateOrgUserQuery: ({ name, email, mobile, role, designation, filterEmail }) => {
        return `
            UPDATE OrgUser SET
            name='${name}',
            email='${email}',
            mobile=${mobile},
            designation='${designation}'
            ${role ? `,role='${role}'` : ''}
            WHERE email='${filterEmail}';
        `;
    },
    setOrgPasswordQuery: ({ email, password }) => {
        return `
            UPDATE OrgUser SET
            password='${password}',
            active=${true}
            WHERE email='${email}';
        `;
    },
    addSessionQuery: (details = {}, sid) => {
        return `
            INSERT INTO session (sid, user, date)
            VALUES
            (
                '${sid}',
                '${JSON.stringify(details)}',
                '${new Date().getTime()}'
            )
        `;
    },
    getMetaQuery: (status = true) => `SELECT * FROM META WHERE active=${status}`,
    getAllMetaQuery: () => `SELECT * FROM META where dead=false`,
    getActiveMetaId: () => `SELECT id FROM META WHERE active=true`,
    changeMetaStatus: ({ id, status, name }) => `UPDATE META SET active=${status}, modifiedBy='${name}' where id=${id}`,
    addMetaQuery: ({ encodedEnglish, encodedHindi, name } = {}) => `INSERT INTO META (english, hindi, modifiedBy) VALUES ('${encodedEnglish}', '${encodedHindi}', '${name}')`,
    deleteMeta: ({ id, name }) => `UPDATE META SET dead=true, modifiedBy='${name}' where id=${id}`,
    
    // Programs
    getProgramQuery: (id) => `SELECT * FROM PROGRAMS WHERE dead=false ${id && `AND id=${id}`}`,
    addNewProgramQuery: ({ english, hindi, createdBy, detailsPageUrl }) => `
        INSERT INTO PROGRAMS (english, hindi, createdBy, modifiedBy, detailsPageUrl)
        VALUES
        (
            '${english}',
            '${hindi}',
            '${createdBy}',
            '${createdBy}',
            '${detailsPageUrl}'
        )
    `,
    editProgramQuery: ({ english, hindi, username, detailsPageUrl, id }) => `UPDATE PROGRAMS SET english='${english}', hindi='${hindi}', modifiedBy='${username}', detailsPageUrl='${detailsPageUrl}', WHERE id=${id}`,
    deleteProgramQuery: ({ id, username }) => `UPDATE PROGRAMS SET dead=true, modifiedBy='${username}' WHERE id=${id}`,
    changeProgramImageQuery: ({ id, username, image }) => `UPDATE PROGRAMS SET modifiedBy='${username}', imageUrl='${image}' WHERE id=${id}`,
};

module.exports = query;
