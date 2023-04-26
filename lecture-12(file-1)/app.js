const http = require("http");
//file-system
const fs = require("fs");
const formidable = require("formidable");

//const app = express()
const server = http.createServer();

// server.on("request", (req, res) => {
//   console.log(req.method, " ", req.url);
//   const dataString = "fggg welcome to nodejs class april";

//   if (req.method === "GET" && req.url === "/") {
//     return res.end("Home page");
//   }
//   //write
//   else if (req.method === "GET" && req.url === "/writefile") {
//     fs.writeFile("demo.txt", dataString, (err) => {
//       if (err) throw err;
//       return res.end("write successfull");
//     });
//   }
//   //append
//   else if (req.method === "GET" && req.url === "/appendfile") {
//     fs.appendFile("demoAppend.txt", dataString, (err) => {
//       if (err) throw err;
//       return res.end("append successfull");
//     });
//   }
//   //read
//   else if (req.method === "GET" && req.url === "/readfile") {
//     fs.readFile("demo.txt", (err, data) => {
//       console.log(data);
//       return res.end(data);
//     });
//   } else if (req.method === "GET" && req.url === "/deletefile") {
//     fs.unlink("demo1.txt", (err) => {
//       if (err) throw err;
//       return res.end("Delete successfull");
//     });
//   }
//   //rename
//   else if (req.method === "GET" && req.url === "/renamefile") {
//     fs.rename("newDemo1.txt", "demo.txt", (err) => {
//       if (err) throw err;
//       return res.end("Rename success");
//     });
//   }
//   //stream read file
//   else if (req.method === "GET" && req.url === "/streamfile") {
//     const rStream = fs.createReadStream("demo.txt");

//     rStream.on("data", (char) => {
//       console.log(char);
//       res.write(char);
//     });

//     rStream.on("end", () => {
//       return res.end();
//     });
//   }
// });

server.on("request", (req, res) => {
  if (req.method === "POST" && req.url === "/fileupload") {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, feilds, files) => {
      const oldPath = files.fileToUpload.filepath;
      const newPath =
        __dirname + "/uploads/" + files.fileToUpload.originalFilename;

      fs.rename(oldPath, newPath, (err) => {
        if (err) throw err;
        return res.end("form submitted successfully");
      });
    });
  } else {
    fs.readFile("form.html", (err, data) => {
      if (err) throw err;
      return res.end(data);
    });
  }
});

//listenner
server.listen(8000, () => {
  console.log("server is running on port 8000");
});
