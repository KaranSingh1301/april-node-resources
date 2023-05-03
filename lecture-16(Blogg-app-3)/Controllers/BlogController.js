const express = require("express");
const User = require("../Models/userModels");
const Blog = require("../Models/BlogModels");
const BlogRouter = express.Router();

// /blog/test
BlogRouter.post("/create-blog", async (req, res) => {
  const { title, textBody } = req.body;
  const userId = req.session.user.userId;
  const creationDateTime = Date.now();

  if (!title || !textBody || !userId) {
    return res.send({
      status: 400,
      message: "Missing credentials",
    });
  }

  if (typeof title !== "string" || typeof textBody !== "string") {
    return res.send({
      status: 400,
      message: "Data format invalid",
    });
  }

  try {
    await User.verifyUserId({ userId });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Error occured",
      error: error,
    });
  }

  try {
    //to create a blog
    const blogObj = new Blog({ title, textBody, creationDateTime, userId });
    const blogDb = await blogObj.createBlog();

    return res.send({
      status: 201,
      message: "Blog created successfully",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Error occured",
      error: error,
    });
  }
});

//get-blogs?skip=10
BlogRouter.get("/get-blogs", async (req, res) => {
  const skip = req.query.skip || 0;
  try {
    //read the blogs from db
    const blogsDb = await Blog.getBlogs({ skip });
    return res.send({
      status: 200,
      message: "Read successfull",
      data: blogsDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Read failed",
      error: error,
    });
  }
});

BlogRouter.get("/my-blogs", async (req, res) => {
  const skip = req.query.skip || 0;
  const userId = req.session.user.userId;

  try {
    //read the blogs from db
    const blogsDb = await Blog.myBlogs({ skip, userId });
    return res.send({
      status: 200,
      message: "Read successfull",
      data: blogsDb,
    });
  } catch (error) {
    console.log(error);
    return res.send({
      status: 500,
      message: "Read failed",
      error: error,
    });
  }
});

BlogRouter.post("/edit-blogs", async (req, res) => {
  const { title, textBody } = req.body;
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

  try {
    //find the blog with id
    const blogObj = new Blog({ title, textBody, userId, blogId });
    const blogDb = await blogObj.getBlogFromId();
    console.log(blogDb);

    //check ownership
    // if(blogDb.userId.toString() !== userId.toString())
    if (!blogDb.userId.equals(userId)) {
      return res.send({
        status: 400,
        message: "Authorization failed, not allow to edit this blog",
      });
    }

    //check time, within 30mins or not
    console.log((Date.now() - blogDb.creationDateTime) / (1000 * 60));
    const diff = (Date.now() - blogDb.creationDateTime) / (1000 * 60);
    if (diff > 30) {
      return res.send({
        status: 400,
        message: "Not allow to edit after 30 mins of creation",
      });
    }

    //update the blog
    const oldBlogDb = await blogObj.updateBlog();

    return res.send({
      status: 200,
      message: "Update successfully",
      data: oldBlogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Read failed",
      error: error,
    });
  }
});

module.exports = BlogRouter;
