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
    }
};

module.exports = query;