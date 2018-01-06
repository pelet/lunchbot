module.exports = {
    slack: {
        CLIENT_ID: process.env.NODE_ENV !== 'test' ? process.env.CLIENT_ID : 'testclientid',
        CLIENT_SECRET: process.env.NODE_ENV !== 'test' ? process.env.CLIENT_SECRET : 'testclientsecret',
        VERIFICATION_TOKEN: process.env.NODE_ENV !== 'test' ? process.env.VERIFICATION_TOKEN : 'testtoken',
        TEAM_ID: process.env.NODE_ENV !== 'test' ? process.env.TEAM_ID : 'testteamid',
    },
    
    PORT: process.env.NODE_ENV !== 'test' ? process.env.PORT : '8081',
    
    DB_FILE: process.env.NODE_ENV !== 'test' ? process.env.DB_FILE : './test/Fixture/db.json',
}
