const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const serviceAccount = require("../serviceAccountKey.json");

const editProject = async (req, res) => {
  try {
    const admin = require("firebase-admin");

    const property = { ...req.body };

    !admin.apps.length
      ? initializeApp({
          credential: cert(serviceAccount),
          databaseURL: "https://horizon-test-b7b3d-default-rtdb.firebaseio.com",
        })
      : admin.app();

    const db = getFirestore();

    const propertyRef = await db.collection("rentals").doc(property.id);
    const propertySnapshot = await propertyRef.get();
    const propertyDbData = await propertySnapshot.data();

    if (propertyDbData?.tenant) {
      const tenantRef = await db
        .collection("users")
        .doc(propertyDbData.tenant.id);
      const tenantSnapshot = await tenantRef.get();
      const tenantDbData = await tenantSnapshot.data();

      await tenantRef.update({
        ...tenantDbData,
        unit: {
          ...tenantDbData.unit,
          fullAddress: property.fullAddress,
        },
      });
    }

    const response = await propertyRef.update({
      ...property,
      apt: property.apt ? property.apt : FieldValue.delete(),
    });

    res.status(200).json({
      status: 200,
      message: "Property edit successful.",
      data: property,
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({
      status: 404,
      message: "Failed to edit data",
      error: e,
    });
  }
};

module.exports = { editProject };
