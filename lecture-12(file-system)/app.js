const http = require("http");
//file-system
const fs = require("fs");

//const app = express()
const server = http.createServer();

server.on("request", (req, res) => {
  console.log(req.method, " ", req.url);
  const dataString = "fggg welcome to nodejs class april";

  if (req.method === "GET" && req.url === "/") {
    return res.end("Home page");
  }
  //write
  else if (req.method === "GET" && req.url === "/writefile") {
    fs.writeFile("demo.txt", dataString, (err) => {
      if (err) throw err;
      return res.end("write successfull");
    });
  }
  //append
  else if (req.method === "GET" && req.url === "/appendfile") {
    fs.appendFile("demoAppend.txt", dataString, (err) => {
      if (err) throw err;
      return res.end("append successfull");
    });
  }
  //read
  else if (req.method === "GET" && req.url === "/readfile") {
    fs.readFile("test.html", (err, data) => {
      console.log(data);
      return res.end(data);
    });
  } else if (req.method === "GET" && req.url === "/deletefile") {
    fs.unlink("demo1.txt", (err) => {
      if (err) throw err;
      return res.end("Delete successfull");
    });
  }
  //rename
  else if (req.method === "GET" && req.url === "/renamefile") {
    fs.rename("demo.txt", "newDemo.txt", (err) => {
      if (err) throw err;
      return res.end("Rename success");
    });
  }
});

//listenner
server.listen(8000, () => {
  console.log("server is running on port 8000");
});
