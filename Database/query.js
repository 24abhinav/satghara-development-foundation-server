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
    addDonationQuery: ({ english, hindi, amount, notes = '' }) => {
        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long' }).toLowerCase();
        const day = date.getDate();
        return `
            INSERT INTO DONATION (english, hindi, amount, date, day, month, year, notes)
            VALUES
            (
                '${JSON.stringify(english)}',
                '${JSON.stringify(hindi)}',
                '${amount}',
                '${date.getTime()}',
                ${day},
                '${month}',
                ${date.getFullYear()},
                '${notes}'
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
    getProgramQuery: (id, url) => `
        SELECT *,
        prg.id as programId,
        orguser."name" as maintainer_name,
        orguser."mobile" as maintainer_mobile,
        orguser."email" as maintainer_email,
        orguser.designation as maintainer_designation
        FROM programs prg
        INNER JOIN orguser ON prg.maintainer = orguser.id
        WHERE
        prg.dead=false
        ${id ? `AND prg.id=${id}` : ''}
        ${url ? `AND prg.detailspageurl='${url}'` : ''};
    `,
    addNewProgramQuery: ({ english, hindi, createdBy, detailspageurl, maintainer }) => `
        INSERT INTO PROGRAMS (english, hindi, createdBy, modifiedBy, detailspageurl, maintainer)
        VALUES
        (
            '${english}',
            '${hindi}',
            '${createdBy}',
            '${createdBy}',
            '${detailspageurl}',
            ${maintainer}
        )
    `,
    editProgramQuery: ({ english, hindi, username, detailspageurl, id, maintainer }) => `UPDATE PROGRAMS SET english='${english}', hindi='${hindi}', modifiedBy='${username}', detailspageurl='${detailspageurl}', maintainer=${maintainer} WHERE id=${id}`,
    deleteProgramQuery: ({ id, username }) => `UPDATE PROGRAMS SET dead=true, modifiedBy='${username}' WHERE id=${id}`,
    changeProgramImageQuery: ({ id, username, image }) => `UPDATE PROGRAMS SET modifiedBy='${username}', imageUrl='${image}' WHERE id=${id}`,
    // Youtube
    getVideosQuery: (id) => `SELECT * FROM youtube ${id && `WHERE id=${id}`}`,
    addNewVideoQuery: ({ english, hindi, url, createdBy }) => `
        INSERT INTO YOUTUBE (english, hindi, url, createdBy) VALUES
        (
            '${english}',
            '${hindi}',
            '${url}',
            '${createdBy}'
        )
    `,
    deleteVideoQuery: (id) => `DELETE FROM YOUTUBE WHERE id=${id}`,
    getVideoProgramMappingQuery: ({ programId, videoId }) => `SELECT * FROM video_program_mapping WHERE programId=${programId} ${videoId ? `AND videoId=${videoId}` : ''}`,
    addVideoProgramMappingQuery: ({ programId, videoId, url, name }) => `
        INSERT INTO video_program_mapping (programId, videoId, url, createdBy) VALUES
        (
            ${programId},
            ${videoId},
            '${url}',
            '${name}'
        )
    `,
    deleteVideoProgramMappingQuery: ({ programId, videoId }) => `DELETE FROM video_program_mapping WHERE programId=${programId} AND videoId=${videoId}`,
    deleteVideoProgramMappingByProgramIdQuery: ({ programId }) => `DELETE FROM video_program_mapping WHERE programId=${programId}`,
    deleteVideoProgramMappingByVideoIdQuery: ({ videoId }) => `DELETE FROM video_program_mapping WHERE videoId=${videoId}`,
};

module.exports = query;
