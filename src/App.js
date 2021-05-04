import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import UpdateModal from './Components/UpdateBookmark/UpdateModal';
import './App.css';

export const DataContext = React.createContext();



const Button = styled.button`
  min-width: 100px;
  padding: 16px 32px;
  border-radius: 4px
  border: none;
  // background: #141414;
  font-size: 15px;
`;


export default function App() {
  const [update, setUpdate] = useState()
  const [showModal, setShowModal] = useState(false)
  const [bookmarks, setBookmarks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    url: ""
  })

  const openModel = (e) => {
    setShowModal(true)
    setUpdate(e.target.value)
      
  }

  
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
  const updateBookmark = async (data, id) => {
    try {
      const response = await fetch(`http://localhost:9000/bookmarks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      // const data = await response.json();
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


  return (
    <div className="App">
      <form onSubmit={createBookmark}>
        <label>Bookmark Title: {" "}
        <input type="text" id="title" value={formData.title} onChange={handleChange}></input>{" "}<br />
        </label>
        <br />
        <label>Bookmark URL: {" "}
        <input type="text" id="url" value={formData.url} onChange={handleChange}></input>{" "}<br />
        </label>
        <br />
        <input type="submit"></input>
      </form>
        <br />
      {bookmarks.map((bookmark, i) => {
        return (
          <div>
            <a href={bookmark.url} target="_target">{bookmark.title}</a>
            <Button value={bookmark._id} onClick={openModel}>
              {`UPDATE ${bookmark.title}`}</Button>
            <Button onClick={(e) => {
                deleteBookmark(e, bookmark._id);
              }}
            >{`DELETE ${bookmark.title}`}</Button>
            <UpdateModal data={bookmark} showModal={showModal} setShowModal={setShowModal} updateBookmark={updateBookmark} update={update} setUpdate={setUpdate} />
          </div>
        )
      })}
    </div>
  );
}