const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("../serviceAccountKey.json");

const assignTenant = async (req, res) => {
  try {
    const admin = require("firebase-admin");

    const body = { ...req.body };
    // body: {property: id, fullAddress, tenant: id, name}

    !admin.apps.length
      ? initializeApp({
          credential: cert(serviceAccount),
          databaseURL: "https://horizon-test-b7b3d-default-rtdb.firebaseio.com",
        })
      : admin.app();

    const db = getFirestore();

    // CHECK IF TENANT IS ASSIGNED TO ANY OTHER UNITS
    const userRef = await db.collection("users").doc(body.tenant.id);
    const userSnapshot = await userRef.get();
    const userData = await userSnapshot.data();

    if (userData?.unit)
      return res.status(409).json({
        status: 409,
        message: `${body.tenant.name} is already assigned to ${userData.unit.fullAddress}. Please unassign her and re-assign to the correct unit if necessary`,
      });

    // CHECK IF UNIT ALREADY HAS A TENANT ASSIGNED
    const unitRef = await db.collection("rentals").doc(body.unit.id);
    const unitSnapshot = await unitRef.get();
    const unitData = await unitSnapshot.data();

    if (unitData?.tenant)
      return res.status(409).json({
        status: 409,
        message: `${body.unit.fullAddress} already has tenant ${unitData?.tenant?.name} assigned to that unit. Please unassign if they do not live there anymore.`,
      });

    // WHILE BOTH CONDITIONS ARE MET, ASSIGN TENANT TO UNIT,
    // THEN ADD UNIT TO TENANT OBJECT

    // UPDATE UNIT
    const unitResponse = await unitRef.update({
      ...unitData,
      rentOwed: 0,
      tenant: { id: body.tenant.id, name: body.tenant.name },
    });

    // UPDATE USER
    const userResponse = await userRef.update({
      ...userData,
      unit: { id: body.unit.id, fullAddress: body.unit.fullAddress },
    });

    res.status(200).json({
      status: 200,
      message: `${body.tenant.id} was assigned to unit ${body.unit.fullAddress}`,
      data: body,
      unitResponse,
      userResponse,
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

module.exports = { assignTenant };
