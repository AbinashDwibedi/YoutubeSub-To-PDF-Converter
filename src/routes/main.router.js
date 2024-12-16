import { Router } from "express";
import { getSubtitles } from "youtube-captions-scraper";
import nlp from "compromise";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";
import fetch from "node-fetch";

const router = Router();

router.route("/").get((req, res, next) => {
  try {
    res.render("home");
  } catch (err) {
    next(err);
  }
});

router.route("/submit").post(async (req, res, next) => {
  try {
    const { userInput } = req.body;
    let mainStr ="";
    function extractVideoId(url) {
      const regex = /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null; 
  }
    let mainLink = extractVideoId(userInput);

    const videoId = mainLink;
    await getSubtitles({ videoID: videoId, lang: "en" })
      .then((captions) => {
        for (let i = 0; i < captions.length; i++) {
          mainStr = mainStr.concat(` ${captions[i].text}`);
        }
      })
      .catch((err) => {
        console.error("Error fetching subtitles:", err);
      });
    const inputText = mainStr;
    const docu = nlp(inputText).sentences().toTitleCase();
    // res.send(docu.text());

    const getTitleFromVideo = async (userInput) => {
      const response = await fetch(userInput);
      const text = await response.text();
      const titleMatch = text.match(/<meta name="title" content="(.*?)"/);
      const title = titleMatch ? titleMatch[1] : 'No title found';
      
      return title
    };
    
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(`./public/output.pdf`));
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text(await getTitleFromVideo(userInput), { align: "center"});
    doc.fontSize(12).font("Helvetica").text("~ Abinash Dwibedi", {align:"right"})
    doc
      .fontSize(14)
      .font("Helvetica")
      .moveDown(1)
      .text(
        docu.text() , {align:"justify"}
      )
      .moveDown(1)
      .text("***",{align:"center"});

    doc.end();

    console.log("PDF Created!");
    setTimeout(() => {
      res.sendFile(path.resolve(`./public/output.pdf`));
    }, 1000);
  } catch (err) {
    next(err);
  }
});
export default router;