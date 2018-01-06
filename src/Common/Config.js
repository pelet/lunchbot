module.exports = {
    slack: {
        CLIENT_ID: process.env.NODE_ENV !== 'test' ? process.env.CLIENT_ID : 'test_client_id',
        CLIENT_SECRET: process.env.NODE_ENV !== 'test' ? process.env.CLIENT_SECRET : 'test_client_secret',
        VERIFICATION_TOKEN: process.env.NODE_ENV !== 'test' ? process.env.VERIFICATION_TOKEN : 'test_token',
        TEAM_ID: process.env.NODE_ENV !== 'test' ? process.env.TEAM_ID : 'test_team_id',
    },
    
    PORT: process.env.PORT,
    
    DB_FILE: process.env.NODE_ENV !== 'test' ? process.env.DB_FILE : './test/Fixture/db.json',
}
