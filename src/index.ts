require('dotenv').config();
import "./lib/db"
import express from "express"
import type { ErrorRequestHandler } from "express";
import path from 'path'
import morgan from 'morgan'
import cors from 'cors'
import { Router, Request, Response, NextFunction } from 'express';

const app = express();
app.disable("x-powered-by")
app.set('port', process.env.PORT || 3333);
app.disable('ETag');

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static(path.join(__dirname, './client')));



import URL from "./models/url";
import { nanoid } from 'nanoid'

const route = Router()

route.post('/url', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { slug, url } = req.body;
    if (!slug) slug = nanoid(5)
    slug = slug.toLowerCase()
    const newURL = await URL.create({ slug, url })
    res.json(newURL)
  } catch (err: unknown) {
    if (err instanceof Error) {
      if (err.message.startsWith('E11000')) err.message = 'Slug in use!'
      res.json(err.message)
    }
  }
})

route.get('/urls/get', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const urls = await URL.find()
    res.json(urls)
  } catch (err: unknown) {
    next(err)
  }
})

route.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: slug } = req.params
    const url = await URL.findOne({ slug })
    if (url) {
      res.redirect(url.url)
      return
    }
    res.redirect(`/?error=${slug} not found`)
  } catch (err: unknown) {
    res.redirect(`/?error=Link not found`)
    next(err)
  }
})

app.use(route)



app.listen(app.get('port'),()=>console.log(`server running on http://localhost:${app.get('port')}`))