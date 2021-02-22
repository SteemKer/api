const { MongoClient } = require("mongodb");

module.exports = class Database {
    async init() {
        this.client = await MongoClient.connect("mongodb+srv://api:tcoWw1WAuuDDtDEZ@steekercluster.jvq0d.mongodb.net/steeker?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
        this.db = this.client.db("steeker");
    }

    async getUserPacks(userID) {
        const collection = this.db.collection("packs");
        const data = await collection.find({ creator: userID }).toArray();

        return data
    }

    async getPack(packID, userID) {
        const collection = this.db.collection("packs");
        const data = await collection.findOne({ creator: userID, pack_id: packID});

        return data;
    }

    // async isUserWhitelisted(userID) {
    //     const collection = self.db.collection("whitelisted");
    //     const data = await collection.findOne({ user: userID })

    //     return !!data
    // }
}