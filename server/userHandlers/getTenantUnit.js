const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("../serviceAccountKey.json");

const getTenantUnit = async (req, res) => {
  try {
    const tenantId = req.params.id;

    const admin = require("firebase-admin");

    !admin.apps.length
      ? initializeApp({
          credential: cert(serviceAccount),
          databaseURL: "https://horizon-test-b7b3d-default-rtdb.firebaseio.com",
        })
      : admin.app();

    const db = getFirestore();

    // get tenant info for unit ID
    const tenantSnapshot = await db.collection("users").doc(tenantId).get();

    // get unit ID
    const unitId =
      tenantSnapshot._fieldsProto.unit.mapValue.fields.id.stringValue;

    // pull unit and it's info from db
    const unitSnapshot = await db.collection("rentals").doc(unitId).get();
    const unit = unitSnapshot.data();

    // return unit info to FE
    res.status(200).json({
      status: 200,
      message: `User ${tenantId}'s unit retrieved for ${unit.fullAddress}`,
      data: unit,
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({
      status: 404,
      message: "Something went wrong while retrieving the user's unit info",
      error: e,
    });
  }
};

module.exports = {
  getTenantUnit,
};
