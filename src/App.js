import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import UpdateModal from './Components/UpdateBookmark/UpdateModal';
import CreateUsers from './Components/CreateUsers/CreateUsers'
import './App.css';


export const DataContext = React.createContext();



const Button = styled.button`
text-transform: uppercase;
text-decoration: none;
background-color: transparent;
padding: 15px;
color: white;
border-radius: 5rem;
box-sizing: content-box;
width: fit-content;
transition: all .2s;
font-size: 1rem;
font-family: 'Merriweather Sans', sans-serif;
cursor: pointer;
`;


export default function App() {
  const [update, setUpdate] = useState();
  const [showModal, setShowModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    url: ""
  });


  const [isLoggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  });


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:9000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...loginForm })
      });
      const data = await response.json();
      if (data.token) {
        window.localStorage.setItem("token", data.token);
        window.localStorage.setItem("username", data.username);
        setLoggedIn(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setLoggedIn(false);
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.id]: e.target.value });
  };

  const openModel = (e) => {
    setShowModal(true)
    setUpdate(e.target.value)
      
  }

  
  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.id]: e.target.value
    })
  }

  const openCreateModal = (e) => {
    setCreateModal(true)
  }



  // CREATE
  const createBookmark = async (e) => {
    e.preventDefault();
    const body = { ...formData };

    try {
     const response = await fetch('http://localhost:9000/bookmarks', {
       method: "POST",
       headers: {
         "Content-Type": "application/json"
       }, 
       body: JSON.stringify(body)
     });
        const bookmark = await response.json();
        const addBookmark = await fetch(
         "http://localhost:9000/users/addBookmarkToUser",
         {
           method: "POST",
           headers: {
             "Content-Type": "application/json"
           },
           body: JSON.stringify({
             ...bookmark,
             token: window.localStorage.getItem("token"),
             username: window.localStorage.getItem("username")
           })
         }
       );
       const data = await addBookmark.json();
     } catch (error) {
       console.log(error)
     } finally {
       await getBookmarks();
     }
     setFormData({
      title: "",
      url: ""
    });
  }


  // READ
  const getBookmarks = async () => {
    try {
      const response = await fetch(
        `http://localhost:9000/users/${window.localStorage.getItem(
          "username"
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );
      const data = await response.json();
      console.log(data.bookmarks)
      setBookmarks([...data.bookmarks]);
    } catch (error) {
      console.error(error);
    }
  };


  // UPDATE
  const updateBookmark = async (data, id) => {
    try {
      const response = await fetch(`http://localhost:9000/bookmarks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error(error);
    } finally {
      await getBookmarks();
    }
  };


  // DESTROY
  const deleteBookmark = async (e, id) => {
    try {
      const response = await fetch(`http://localhost:9000/bookmarks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json(); 
    } catch (error) {
      console.error(error);
    } finally {
      await getBookmarks();
    }
  };



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    }
  }, []);
  useEffect(() => {
    if (isLoggedIn) {
      getBookmarks();
    }
  }, [isLoggedIn]);


  return (
    <div className="App">
      <>{isLoggedIn ? 
        <div>
          <nav>
            <div className="nav-container">
              <div className="title-logo">
                <img src="/Logos/bookmark-alt-flat.png"></img>
                <h1 >Bookmarks!</h1>
              </div>
              <Button onClick={handleLogout}>LogOut</Button>
            </div>
          </nav>
          <div className="bookmarks-container">
            <div className="bookmarks-form">
              <h2>Create a Bookmark</h2>
              <form onSubmit={createBookmark}>
                <label>Bookmark Title: {" "}
                <input className="create" type="text" id="title" value={formData.title} onChange={handleChange}></input>{" "}<br />
                </label>
                <br />
                <label>Bookmark URL: {" "}
                <input className="create" type="text" id="url" value={formData.url} onChange={handleChange}></input>{" "}<br />
                </label>
                <br />
                <input className="submit" type="submit"></input>
              </form>
                <br />
            </div>
            <div className="added-bookmarks">
              <h2>Added Bookmarks</h2>
              {bookmarks.map((bookmark, i) => {
                return (
                  <section>
                    <div className="each-bookmark">
                      <a href={bookmark.url} target="_target">{bookmark.title}</a>{"  "} 
                      <Button value={bookmark._id} onClick={openModel}>UPDATE</Button>{"  "} 
                      <Button onClick={(e) => {
                          deleteBookmark(e, bookmark._id);
                        }}>DELETE</Button>
                    </div>
                    <UpdateModal data={bookmark} showModal={showModal} setShowModal={setShowModal} updateBookmark={updateBookmark} update={update} setUpdate={setUpdate} />
                  </section>
                )
              })}
            </div>
          </div>
        </div>
      : 
      <div>
        <center>
          <h1>Log In To Bookmarks</h1>
          <img src="/Logos/bookmark-alt-flat.png"></img>
        </center>
        <form className="login" onSubmit={handleLogin}>
          <label>
            {" "}
            Username:{" "}
            <input
              className="create"
              type="text"
              id="username"
              value={loginForm.username}
              onChange={handleLoginChange}
          />
          </label>
          <br />
          <br />
          <label>
            {" "}
            Password:{" "}
            <input
              className="create"
              type="password"
              id="password"
              value={loginForm.password}
              onChange={handleLoginChange}
          />
          </label>
          <br />
          <br />
          <input className="submit" type="submit" />{' '}{' '}
        </form>
          <button className="submit" onClick={openCreateModal} >Create User</button>
        <CreateUsers createModal={createModal} setCreateModal={setCreateModal} />
        </div>}
        </>
        <>{showModal === false?
          <footer>
          By: Sean King
        </footer>
          :
          null}</>
    </div>
  );
}