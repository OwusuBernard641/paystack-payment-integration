// routes/transactionRoutes.js
const express = require("express");
const https = require("https");

const router = express.Router();
require("dotenv").config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Initialize transaction
router.post("/initialize-transaction", (req, res) => {
  const { email, amount } = req.body;

  const params = JSON.stringify({
    email,
    amount,
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const request = https
    .request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        res.json(JSON.parse(data));
      });
    })
    .on("error", (error) => {
      res.status(500).json({ error: error.message });
    });

  request.write(params);
  request.end();
});

// Verify transaction
router.get("/verify-transaction/:reference", (req, res) => {
  const { reference } = req.params;

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  const request = https
    .request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const parsedData = JSON.parse(data);
        const expectedAmount = 500000; // Replace this with the actual amount you're expecting

        if (parsedData.data.status === "success") {
          if (parsedData.data.amount === expectedAmount) {
            res.json({
              success: true,
              message: "Transaction was successful",
              data: parsedData.data,
            });
          } else {
            res.json({
              success: false,
              message: "Transaction amount mismatch",
              data: parsedData.data,
            });
          }
        } else {
          res.json({
            success: false,
            message: "Transaction failed",
            data: parsedData.data,
          });
        }
      });
    })
    .on("error", (error) => {
      res.status(500).json({ error: error.message });
    });

  request.end();
});

module.exports = router;
