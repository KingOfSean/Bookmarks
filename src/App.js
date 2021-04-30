import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import './App.css';

export default function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    url: ""
  })
  
  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.id]: e.target.value
    })
  }


  // CREATE
  const createBookmark = async (e) => {
    e.preventDefault();
    const body = { ...formData };

    try {
     const res = await fetch('http://localhost:9000/bookmarks', {
       method: "POST",
       headers: {
         "Content-Type": "application/json"
       }, 
       body: JSON.stringify(body)
     });
     setFormData({
      title: "",
      url: ""
    });
    } catch (error) {
      console.log(error)
    } finally {
      await getBookmarks();
    }
  }


  // READ
  const getBookmarks = async () => {
    try {
      const res = await fetch('http://localhost:9000/bookmarks');
      const data = await res.json();
      setBookmarks(data)
    } catch (error) {
      console.log(error)
    }
  }
  

  // UPDATE
  const updateBookmark = async (e, id) => {
    const body = { ...formData }
    try {
      const response = await fetch(`http://localhost:9000/bookmarks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
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
    getBookmarks()
  }, []);

  console.log(bookmarks)
  return (
    <div className="App">
      <form onSubmit={createBookmark}>
        <input type="text" id="title" value={formData.title} onChange={handleChange}></input>{" "}
        <br />
        <input type="text" id="url" value={formData.url} onChange={handleChange}></input>{" "}
        <br />
        <input type="submit"></input>
      </form>
      {bookmarks.map((bookmark) => {
        return (
          <div>
            <a href={bookmark.url}>{bookmark.title}</a>
            <button onClick={(e) => {
                deleteBookmark(e, bookmark._id);
              }}
            >{`DELETE ${bookmark.title}`}</button>
          </div>
        )
      })}
    </div>
  );
}