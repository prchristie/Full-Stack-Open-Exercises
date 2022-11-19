const _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((prev, curr) => prev + curr.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs.length) {
    return null;
  }

  const favorite = blogs.reduce((prev, curr) =>
    prev.likes >= curr.likes ? prev : curr
  );

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

const mostBlogs = (blogs) => {
  if (!blogs.length) {
    return null;
  }

  const most = _.chain(blogs)
    .countBy((item) => item.author)
    .toPairs()
    .maxBy((item) => item[1])
    .value();

  return {
    author: most[0],
    blogs: most[1],
  };
};

const mostLikes = (blogs) => {
  if (!blogs.length) {
    return null;
  }

  return _.chain(blogs)
    .groupBy((item) => item.author)
    .map((objs, key) => ({
      author: key,
      likes: _.sumBy(objs, (item) => item.likes),
    }))
    .maxBy((item) => item.likes)
    .value();
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
