import { Client, Databases, ID } from 'node-appwrite';
import nodemailer from 'nodemailer';

/**
 * @param {string} toEmail 
 * @returns 
 */
async function sendEmail(toEmail, log) {

  // Create a new transporter
  var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
          user: 'mnimitsavant@gmail.com',
          pass: process.env.GMAIL_APP_PASSWORD,
      }
  });

  // Send the email object
  var message = {
    from: "mnimitsavant@gmail.com",
    to: toEmail,
    subject: "test email",
    html: "<h1>Welcome to Scratch Newsletter</h1><br /><p>Thank you for signing up with us!</p>",
  };

  // Send the email
  const info = await transporter.sendMail(message);

  // Log the message id
  log(`Message sent ${info.messageId}`);

  return info.messageId;
}

/**
 * @typedef {object} Req
 * @property {string} method
 * @property {JSON} body
 * @property {String} body.email
 * @property {object} query
 */


/**
 * @typedef {object} Res
 * @property {Function} json
 * @property {Function} send
 * @property {Function} empty
 */

/**
 * @param {object} context
 * @param {Req} context.req
 * @param {Res} context.res
 * @param {object} context.log
 * @param {object} context.error
 * 
 */
export default async ({ req, res, log, error }) => {
  // Why not try the Appwrite SDK?
  //

  var headers = {};
  headers['Content-Type'] = 'application/json';
  headers['Access-Control-Allow-Origin'] = '*';
  headers["Access-Control-Allow-Headers"] =  "Content-Type";
  headers['RAccess-Control-Allow-Methods'] = 'RANDOM';

  log('Scratch Newsletter function invoked')
  try {
    // Create connection with Appwrite Client

    // This was important to add because the websites will have cors, so first they'll send a small request to check if the server is accepting the request and then the post call will happen
    if(req.method === 'OPTIONS') {
      log('OPTIONS METHOD')
      return res.send('', 204, headers);
    } else if(req.method === 'POST') {
      log('Request method is POST')

      const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);


        // Get the request body and parse
        const body = req.body;
        if(!body.email) {
          // Send a response
          log('Email is required')
          return res.send('Email is required', 400, headers);
        }

        // Create a new database instance
        const database = new Databases(client);

        // Create a new document in the database
        const newData = await database.createDocument(process.env.APPWRITE_DATABASE_ID, process.env.APPWRITE_COLLECTION_ID, ID.unique(), {
          email: body.email
        });

        // Log the new data
        log(newData);
        if(newData.$id) {
          // Send new email
          await sendEmail(newData.email, log);

          // Send a response
          return res.send('Subscribed to the newsletter', 201, headers);
           
        } else {
          // Send a response
          return res.send('Failed to subscribe to the newsletter', 409, headers);
        }
      } else {
        // Send a response when not using POST method
        return res.send('Invalid request method. Please use POST method to subscribe to the newsletter.', 405, headers);
      }

  } catch (err) {
    // Log the error
    error(err.toString());
    return res.send('Some error occurred. Please try again later.');
  }
};
