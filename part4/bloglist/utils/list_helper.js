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

  return blogs.reduce((prev, curr) => (prev.likes >= curr.likes ? prev : curr));
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
