import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import { Notification } from "./components/Notification";
import LoginForm from "./components/LoginForm";
import { NewNoteForm } from "./components/NewNoteForm";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const displayNotification = (message, isError) => {
    setNotificationMessage(message);
    setIsError(isError);
    setTimeout(() => setNotificationMessage(null), 5000);
  };

  useEffect(() => {
    const loadBlogs = async () => {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    };
    loadBlogs();
  }, []);

  useEffect(() => {
    const userJSON = window.localStorage.getItem("user");
    if (userJSON) {
      const user = JSON.parse(userJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const blogList = () => (
    <>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </>
  );

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      blogService.setToken(user.token);
      window.localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setPassword("");
      setUsername("");
    } catch (e) {
      displayNotification("wrong username or password", true);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("user");
    setUser(null);
  };

  const createNewBlog = async (title, author, url) => {
    const newBlog = {
      title,
      author,
      url,
    };

    try {
      const blog = await blogService.create(newBlog);
      setBlogs(blogs.concat(blog));
      displayNotification(
        `a new blog ${blog.title} by ${blog.author} added`,
        false
      );
    } catch (e) {
      if (e.response.data.error === "invalid token") {
        displayNotification("You have been logged out", true);
        logout();
        return;
      }
      displayNotification(e.response.data.error, true);
    }
  };

  console.log(notificationMessage);
  return (
    <>
      {user !== null ? (
        <div>
          <h2>blogs</h2>
          {notificationMessage && (
            <Notification message={notificationMessage} isError={isError} />
          )}
          <div>
            <p>
              {user.username} logged in
              <button onClick={(e) => logout()}>logout</button>
            </p>
          </div>
          <div>
            <h2>create new</h2>
            <NewNoteForm onNewBlogCreated={createNewBlog} />
          </div>
          <div>{blogList()}</div>
        </div>
      ) : (
        <>
          <h2>log in to application</h2>
          {notificationMessage && (
            <Notification message={notificationMessage} isError={isError} />
          )}
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
            setUsername={setUsername}
            setPassword={setPassword}
          />
        </>
      )}
    </>
  );
};

export default App;
