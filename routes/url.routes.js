import express from "express";
import { shortenPostRequestBodySchema } from "../validations/request.validation.js";
import { db } from "../db/index.js";
import { urlsTable } from "../models/index.js";
import {nanoid} from 'nanoid';
import {ensureAuthenticated} from "../middlewares/auth.middleware.js";
import { shortenUrl } from "../services/url.service.js"
const urlRoutes = express.Router();

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
  })
  
  return res.status(201).json({
    id: result.id,
    shortCode:result.shortCode,
    targetURL:result.targetURL
  })
}); 

export default urlRoutes;