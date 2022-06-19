const { getDoc } = require("@firebase/firestore");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

const serviceAccount = require("../serviceAccountKey.json");

const editTenant = async (req, res) => {
  try {
    const admin = require("firebase-admin");

    const tenant = { ...req.body };

    !admin.apps.length
      ? initializeApp({
          credential: cert(serviceAccount),
          databaseURL: "https://horizon-test-b7b3d-default-rtdb.firebaseio.com",
        })
      : admin.app();

    const db = getFirestore();

    // get user's data
    const tenantRef = await db.collection("users").doc(tenant.email);
    const tenantSnapshot = await tenantRef.get();
    const tenantDbData = await tenantSnapshot.data();

    // check if user is assigned to a unit
    if (tenantDbData?.unit) {
      // if so, update the name on the rental object
      const unitRef = await db.collection("rentals").doc(tenantDbData.unit.id);
      const unitSnapshot = await unitRef.get();
      const unit = await unitSnapshot.data();
      await unitRef.update({
        ...unit,
        tenant: {
          id: tenant.email,
          name: `${tenant.firstName} ${tenant.lastName}`,
        },
      });
    }

    // update user object
    const response = await tenantRef.update({
      ...tenantDbData,
      ...tenant,
    });

    res.status(200).json({
      status: 200,
      message: `Successfully edited user ${tenant.email}`,
      data: tenant,
      response,
    });
  } catch (e) {
    console.error(e);
    res.json({
      status: 404,
      message: "Something went wrong.",
      error: e,
    });
  }
};

module.exports = { editTenant };
