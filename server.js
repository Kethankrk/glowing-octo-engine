import express, { json } from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/admin-login", async (req, res) => {
  try {
    let conn = await db.getConnection();
    let data = await conn.query("SELECT * FROM admin WHERE ID = 1");

    if (req.body.username === data[0].username) {
      if (req.body.password === data[0].password) {
        const username = { userID: data[0].username };
        let token = jwt.sign(username, "kethankrk", { expiresIn: 15768000 });
        res.send({ status: "ok", token: token });
      } else {
        res.send({ status: "not ok", err: "Incorrect Password" });
      }
    } else {
      res.send({ status: "not ok", err: "Username not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "not ok", err: error });
  }
});

app.post("/upload", async (req, res) => {
  try {
    let conn = await db.getConnection();
    console.log(req.body);
    const { productName, productCategory, productDownloadLink } = req.body;

    try {
      let sql = `INSERT INTO products (productName, productCategory, productDownloadLink) VALUES ("${productName}", "${productCategory}", "${productDownloadLink}")`;

      await conn.query(sql, (err, response) => {
        if (err) {
          console.log(err);
          return res.send({ status: "error", error: err });
        }
      });
      return res.send({ status: "success" });
    } catch (err) {
      console.log(err);
      res.send({ staus: "error", error: err });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get("/download", async (req, res) => {
  let conn = await db.getConnection();

  const download = await conn.query("SELECT * FROM products");
  res.send(download);
});

app.post("/edit", async (req, res) => {
  try {
    let conn = await db.getConnection();

    const oldRecord = req.body.oldRecord;
    const newRecord = req.body.newRecord;

    let query = `UPDATE products SET productDownloadLink='${newRecord.productDownloadLink}', productCategory='${newRecord.productCategory}' WHERE productName='${oldRecord.productName}'`;

    conn.query(query, (err) => {
      console.log(err);
      return;
    });

    return res.send("success");
  } catch (err) {
    return res.send(err);
  }
});

app.listen(5000);
