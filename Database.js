const { MongoClient } = require("mongodb");

module.exports = class Database {
    async init() {
        self.client = await MongoClient.connect("mongodb+srv://api:tcoWw1WAuuDDtDEZ@steekercluster.jvq0d.mongodb.net/steeker?retryWrites=true&w=majority");
        self.db = self.client.database("steeker");
    }

    async getUserPacks(userID) {
        const collection = self.db.collection("packs");
        const data = await collection.find({ creator: userID }).toArray();

        return data
    }

    // async isUserWhitelisted(userID) {
    //     const collection = self.db.collection("whitelisted");
    //     const data = await collection.findOne({ user: userID })

    //     return !!data
    // }
}