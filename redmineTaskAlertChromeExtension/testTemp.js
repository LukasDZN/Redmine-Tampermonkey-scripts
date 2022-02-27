var redmineApiToken = "97f301157f2afdc96676e988ceb58eea2d78602c";

const sendRequest = async (taskId) => {
  try {
    const redmineResponse = await fetch(
      `https://redmine.tribepayments.com/issues/${taskId}.json`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Redmine-API-Key": redmineApiToken,
        },
        body: null,
      }
    );
    return redmineResponse;
  } catch (error) {
    console.log("ERROR in sendRequest func" + error);
    return "ERROR in sendRequest func";
  }
};

let redmineResponse = sendRequest("57148")
console.log('Redmine response: ' + JSON.stringify(redmineResponse)); // @testing)