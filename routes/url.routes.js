import express from "express";
import { shortenPostRequestBodySchema } from "../validations/request.validation.js";
import { nanoid } from "nanoid";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";
import {
  shortenUrl,
  getAllCodes,
  redirectToUrl,
  deleteUrl,
  updateCode
} from "../services/url.service.js";
import { urlsTable } from "../models/url.model.js";
import { eq, and } from "drizzle-orm";
const urlRoutes = express.Router();
import { db } from "../db/index.js";

urlRoutes.post("/shorten", ensureAuthenticated, async function (req, res) {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body,
  );
  if (validationResult.error) {
    return res.status(400).json({
      error: validationResult.error.format(),
    });
  }
  const { url, code } = validationResult.data;
  const shortCode = code ?? nanoid(6);
  const result = await shortenUrl({
    url,
    shortCode,
    userId: req.user.id,
  });

  return res.status(201).json({
    id: result.id,
    shortCode: result.shortCode,
    targetURL: result.targetURL,
  });
});

urlRoutes.delete("/:id", ensureAuthenticated, async function (req, res) {
  const id = req.params.id;
  await deleteUrl(id, req.user.id);
  return res.status(200).json({
    deleted: true,
  });
});

urlRoutes.patch("/:id", ensureAuthenticated, async function (req, res) {
  const id = req.params.id;
  const code = req.body.code;
  const result = await updateCode(id, req.user.id, code);
  return res.status(200).json({
    Updated: true,
  });
});

urlRoutes.get("/codes", ensureAuthenticated, async function (req, res) {
  const codes = await getAllCodes(req.user.id);
  return res.json({ codes });
});
urlRoutes.get("/:shortCode", async function (req, res) {
  const code = req.params.shortCode;
  const result = await redirectToUrl(code);
  if(!result){
    return res.status(404).json({
      error:"Invalid URL",
    });
  }
  return res.redirect(result);
});

export default urlRoutes;
