
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");

admin.initializeApp();

const db = admin.firestore();
const POSITIONSTACK_API_KEY = "YOUR_POSITIONSTACK_API_KEY"; // Replace with your actual API key

const geocodeAddress = async (address) => {
  try {
    const response = await axios.get("http://api.positionstack.com/v1/forward", {
      params: {
        access_key: POSITIONSTACK_API_KEY,
        query: address,
        limit: 1,
      },
    });
    if (response.data && response.data.data && response.data.data.length > 0) {
      const { latitude, longitude } = response.data.data[0];
      return { lat: latitude, lng: longitude };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

const processMerchant = async (merchant) => {
  const merchantRef = db.collection("merchants").where("name", "==", merchant.name);
  const snapshot = await merchantRef.get();

  if (snapshot.empty) {
    const location = await geocodeAddress(merchant.address);
    if (location) {
      await db.collection("merchants").add({
        ...merchant,
        ...location,
        addedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`Added merchant: ${merchant.name}`);
    }
  } else {
    console.log(`Merchant already exists: ${merchant.name}`);
  }
};

exports.fetchAndStoreMerchants = functions.https.onRequest(async (req, res) => {
  try {
    const response = await axios.get("https://coingate.com/stores");
    const $ = cheerio.load(response.data);
    const merchants = [];

    $(".vendor-item").each((i, el) => {
      const name = $(el).find(".vendor-title").text().trim();
      const address = $(el).find(".vendor-address").text().trim();
      const category = $(el).find(".vendor-category").text().trim();
      if (name && address) {
        merchants.push({ name, address, category });
      }
    });

    for (const merchant of merchants) {
      await processMerchant(merchant);
      // Simple delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    res.status(200).send("Merchant data fetched and stored successfully.");
  } catch (error) {
    console.error("Error fetching and storing merchants:", error);
    res.status(500).send("An error occurred while fetching and storing merchant data.");
  }
});
