import https from "https";
// import fetch from "node-fetch";

export default function smsController() {
  const checkBalance = async () => {
    try {
      // let tokenFasterMsg =
      //   "58cb5f1368d8011225b199d809054d11e59f562077b53dbf9813fbc26de5c04f";
      // const response = await fetch(
      //   "https://api.fastermessage.com/api/v1/sms/balance",
      //   {
      //     method: "POST",
      //     headers: {
      //       'x-api-key': ` ${tokenFasterMsg}`
      //     }
      //   }
      // );
      // // const result = await response.json();
      // console.log("response", response);
      
      const init = {
        host: "fastermessage.com",
        path: "/api/v1/sms/balance",
        method: "POST",
        headers: {
          "x-api-key":
            " 58cb5f1368d8011225b199d809054d11e59f562077b53dbf9813fbc26de5c04f",
        },
      };

      const callback = function (response) {
        let result = Buffer.alloc(0);
        response.on("data", function (chunk) {
          result = Buffer.concat([result, chunk]);
        });

        response.on("end", function () {
          // result has response body buffer
          console.log(result.toString());
        });
      };
      const req = https.request(init, callback);
      req.end();
    } catch (err) {
      console.log("Erreur ", err);
      throw new Error(err);
    }
  };

  const sendSMS = (to, text) => {
    try {
      if (to && text) {
        if (text.length > 480) {
          throw new Error(
            "Votre texte est trop long. Il dépasse 480 caractères"
          );
        }
        checkBalance();
        // if (checkBalance()) {
        //   const postData = JSON.stringify({
        //     from: sender,
        //     to: to,
        //     text: text,
        //   });

        //   const init = {
        //     hostname: "https://api.fastermessage.com/v1/sms/send",
        //     path: "/",
        //     method: "POST",
        //     headers: {
        //       Authorization: "Authorization: Basic ".base64_encode(
        //         username + ":" + password
        //       ),
        //       "Content-Type": "application/json",
        //       "Content-Length": postData.length,
        //     },
        //   };

        //   const request = https.request(init, (resp) => {
        //     let result = Buffer.alloc(0);
        //     resp.on("data", function (chunk) {
        //       result = Buffer.concat([result, chunk]);
        //     });
        //     resp.on("end", function () {
        //       // result has response body buffer
        //       console.log(result.toString());
        //     });
        //   });

        //   request.end();
        // }
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  return {
    sendSMS,
  };
}
