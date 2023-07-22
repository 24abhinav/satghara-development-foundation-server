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
    getVisitorsQuery: ({ name, mobile, day, month, year, active = true }) => {
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
};

module.exports = query;
