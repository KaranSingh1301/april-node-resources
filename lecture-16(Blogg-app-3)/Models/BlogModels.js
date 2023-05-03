const blogSchema = require("../Schemas/blogSchema");
const ObjectId = require("mongodb").ObjectId;

let Blog = class {
  title;
  textBody;
  creationDateTime;
  userId;
  blogId;

  constructor({ title, textBody, creationDateTime, userId, blogId }) {
    this.title = title;
    this.creationDateTime = creationDateTime;
    this.textBody = textBody;
    this.userId = userId;
    this.blogId = blogId;
  }

  createBlog() {
    return new Promise(async (resolve, reject) => {
      this.title.trim();
      this.textBody.trim();

      const blog = new blogSchema({
        title: this.title,
        textBody: this.textBody,
        creationDateTime: this.creationDateTime,
        userId: this.userId,
      });

      try {
        const blogDb = await blog.save();
        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  static getBlogs({ skip }) {
    return new Promise(async (resolve, reject) => {
      //pagination, sort
      try {
        const blogDb = await blogSchema.aggregate([
          { $sort: { creationDateTime: -1 } }, //DESC order of time
          {
            $facet: {
              data: [
                { $skip: parseInt(skip) },
                { $limit: parseInt(process.env.BLOGSLIMIT) },
              ],
            },
          },
        ]);
        console.log(blogDb[0].data);
        resolve(blogDb[0].data);
      } catch (error) {
        reject(error);
      }
    });
  }

  static myBlogs({ skip, userId }) {
    return new Promise(async (resolve, reject) => {
      //pagination, sort, match
      try {
        const blogDb = await blogSchema.aggregate([
          { $match: { userId: new ObjectId(userId) } },
          { $sort: { creationDateTime: -1 } }, //DESC order of time
          {
            $facet: {
              data: [
                { $skip: parseInt(skip) },
                { $limit: parseInt(process.env.BLOGSLIMIT) },
              ],
            },
          },
        ]);
        console.log(blogDb[0].data);
        resolve(blogDb[0].data);
      } catch (error) {
        reject(error);
      }
    });
  }

  getBlogFromId() {
    return new Promise(async (resolve, reject) => {
      try {
        const blogDb = await blogSchema.findOne({ _id: this.blogId });
        if (!blogDb) {
          reject("Blog not found");
        }
        resolve(blogDb);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateBlog() {
    return new Promise(async (resolve, reject) => {
      let newBlogData = {};
      try {
        if (this.title) {
          newBlogData.title = this.title;
        }

        if (this.textBody) {
          newBlogData.textBody = this.textBody;
        }

        const oldBlog = await blogSchema.findOneAndUpdate(
          { _id: this.blogId },
          newBlogData
        );

        resolve(oldBlog);
      } catch (error) {
        reject(error);
      }
    });
  }
};

module.exports = Blog;
