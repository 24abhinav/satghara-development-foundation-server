const query = {
    visitorsContactQuery: ({ name, mobile, description }) =>  {
        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long' }).toLowerCase();
        const day = date.getDate();
        return `
            INSERT INTO visitorscontact (name, mobile, description, date, month, year, day)
            VALUES ('${name}', '${mobile}', '${description}', '${date.getTime()}', '${month}', ${date.getFullYear()}, ${day});
        `;
    }
};

module.exports = query;