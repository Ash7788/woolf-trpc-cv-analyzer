import express, { Request, Response } from "express";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { promises as fs } from 'fs';

dotenv.config();

const app = express();
const upload = multer({ dest: "uploads/" });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, '../public')));

interface MulterRequest extends Request {
  files: {
    [fieldname: string]: Express.Multer.File[];
  };
}

app.use("/trpc", createExpressMiddleware({ router: appRouter }));

app.get("/", (_req: Request, res: Response) => {
  res.render("index");
});

app.post(
  "/upload",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "jd", maxCount: 1 },
  ]),
  async (req: Request, res: Response) => {
    const files = (req as MulterRequest).files;
    let jdPath: string | undefined;
    let cvPath: string | undefined;

    try {
      if (!files?.["jd"]?.[0] || !files?.["cv"]?.[0]) {
        res.status(400).send("Both Job Description and CV PDF files are required.");
        return;
      }

      jdPath = files["jd"][0].path;
      cvPath = files["cv"][0].path;

      const trpcCaller = appRouter.createCaller({});
      const response = await trpcCaller.analyze({ jdPath, cvPath });
      const analysisResult = response.analysis;

      res.render("result", { result: analysisResult });
    } catch (err: any) {
      console.error("Upload/Analysis Error:", err);
      res.status(500).render("result", { result: `Error processing your request: ${err.message || 'Unknown error'}` });
    } finally {
      if (jdPath) {
        try {
          await fs.unlink(jdPath);
          console.log(`Deleted temporary file: ${jdPath}`);
        } catch (unlinkErr) {
          console.error(`Error deleting temporary JD file ${jdPath}:`, unlinkErr);
        }
      }
      if (cvPath) {
        try {
          await fs.unlink(cvPath);
          console.log(`Deleted temporary file: ${cvPath}`);
        } catch (unlinkErr) {
          console.error(`Error deleting temporary CV file ${cvPath}:`, unlinkErr);
        }
      }
    }
  }
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`tRPC endpoint: http://localhost:${PORT}/trpc`);
});
