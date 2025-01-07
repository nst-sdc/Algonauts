import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import path from "path";

import calculate from "./utils/generateObject";
import updateAll from "./utils/updateall";
import backFetcher from "./utils/backfetcher";

const app = express();
const PORT = 5001;
const USERNAME = "kanishk";
const PASSWORD = "letmein";


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.static(path.join(__dirname, "./public")));

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "c88ee4ad6278f9299e01db9766c20c64", 
    resave: false,
    saveUninitialized: false,
  })
);


function isAuthenticated(req: any, res: Response, next: NextFunction) {
  if (req.session && req.session.isLoggedIn) {
    return next();
  }
  res.redirect("/login");
}

app.get("/login", async (req: Request, res: Response) => {
  res.render("login", { title: "Algonauts" });
});

app.post("/login", (req: any, res: Response) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    req.session.isLoggedIn = true;
    res.redirect("/dashboard");
  } else {
    res
      .status(401)
      .send('Invalid credentials. <a href="/login">Try again</a>.');
  }
});

app.get("/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("An error occurred while logging out.");
    }
    res.redirect("/login");
  });
});

app.get("/dashboard", isAuthenticated, async (req: Request, res: Response) => {
  const data = await backFetcher("/leaderboard/getuserlist");
  res.render("admin/dashboard", {
    message: undefined,
    data: Array.from(data.values()),
  });
});
app.get("/problems", isAuthenticated, async (req: Request, res: Response) => {
  const data = await backFetcher("/problems/getproblems/455");
  res.render("admin/problems", { title: "Problem of Day", data });
});

app.post("/problems", isAuthenticated, async (req: Request, res: Response) => {
  let { name, problemIndex, contestId, tags, difficulty, date } = req.body;
  tags = tags.split(",");
  await backFetcher("/problems/addproblem", "POST", {
    name,
    problemIndex,
    contestId,
    tags,
    difficulty,
    date,
  });
  res.redirect("/problems");
});

app.post("/dashboard", isAuthenticated, async (req: Request, res: Response) => {
  const {
    name,
    role,
    leetcode_username,
    codeforces_username,
    codechef_username,
    cses_username,
  } = req.body;
  const generateObject = await calculate(name, role, [
    {
      platform: "leetcode",
      username: leetcode_username,
    },
    {
      platform: "codeforces",
      username: codeforces_username,
    },
    {
      platform: "codechef",
      username: codechef_username,
    },
    {
      platform: "cses",
      username: cses_username,
    },
  ]);
  const result = await backFetcher(
    "/leaderboard/adduser",
    "PUT",
    generateObject
  );
  if (result.success !== false) {
    console.log("Update Successful:", result);
  } else {
    console.error("Error during update:", result.error);
  }
  res.redirect("/dashboard");
});
app.get("/members" , async (req: Request, res: Response) => {
    const data = await backFetcher("/problems/getproblems/450005");
    res.render("members", { title: "Algonauts", data });
  });
app.get("/", async (req: Request, res: Response) => {
  const data = await backFetcher("/problems/getproblems/450005");
  res.render("index", { title: "Algonauts", data });
});

app.get("/rulebook", async (req: Request, res: Response) => {
  res.render("rulebook", { title: "Algonauts" });
});

app.get("/leaderboard", async (req: Request, res: Response) => {
  res.render("leaderboard", {
    title: "Algonauts",
    obj: await backFetcher("/leaderboard/getuserlist"),
  });
});

app.get("/calendar", async (req: Request, res: Response) => {
  res.render("calendar", { title: "Algonauts" });
});

app.get("/updateall", isAuthenticated, async (req: Request, res: Response) => {
  await updateAll();
  res.status(200).send("Update was successful ");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
