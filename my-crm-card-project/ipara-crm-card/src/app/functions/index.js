exports.main = async (context = {}) => {
  const { objectId } = context.parameters || {};

  return {
    message: `Hello ${firstname || "there"} ${lastname || ""}! Contact ID: ${hs_object_id} | Email: ${email || "N/A"}`,
    timestamp: new Date().toISOString(),
  };
};
