const mongoose = require("mongoose");
const db = mongoose.connection;

const sendApi = async (req, res, next) => {
  try {
    const userData = req.body; // Get userData from request body
    if (!userData) {
      throw new Error("User data is undefined");
    }
    console.log(userData);
    const { Memberage, Membername, Gender } = userData;
    let collectionName;
    console.log(Gender);
    console.log(typeof Gender);

    // CHECK FOR GENDER TYPE TO KNOW WHICH COLLECTION TO USE
    if (Gender === "Female") {
      collectionName = "Intakew";
    } else if (Gender === "Male") {
      collectionName = "Intakem";
    } else {
      throw new Error("Invalid Gender specified");
    }
    console.log(collectionName);
    // READING DATA IN THE SELECTED COLLECTION
    const collection = db.collection(collectionName);
    const document = await collection.find().toArray();

    //Filtering the required Intake
    let fittedMember = document.find((data) => data.Age === Memberage);
    const { _id, ID, Age, ...requiredChemicals } = fittedMember;

    console.log(fittedMember);

    const { 'Potassium (mg)': potassium, 'Sodium (mg)': sodium, 'Calcium (mg)': calcium } = requiredChemicals;
   
    const mainColQuery = {
      'Potassium (mg)': potassium,
      'Sodium (mg)': sodium,
      'Calcium (mg)': calcium
    };

    //Readinding data from MainCol
    const MainCol = db.collection("mainCol");
    const mainColDocuments = await MainCol.findOne(mainColQuery);

    const { 'food name': foodName } = mainColDocuments;

    let recommendedFood = foodName

    if (document.length > 0) {
      res.status(200).json(recommendedFood);
    } else {
      res.status(404).json({ message: "Document not found" });
    }
  } catch (error) {
    console.error("Error fetching document:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "An error occurred while fetching the document" });
    }
  }
};

//Reaceiving Data
const receivingData = async (req, res, next) => {
  const theData = req.body;

  try {
    console.log(theData);
    // Pass req, res, next, and theData to sendApi
    await sendApi(req, res, next);
    // sendApi should now correctly use the userData from the request body
  } catch (error) {
    console.error("Error processing request:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ message: "An error occurred while processing the request" });
    }
  }
};

module.exports = { sendApi, receivingData };
