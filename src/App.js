import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {MdClose} from 'react-icons/md';
import UpdateModal from './Components/UpdateBookmark/UpdateModal';
import './App.css';

export const DataContext = React.createContext();

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vw;
`;

const Button = styled.button`
  min-width: 100px;
  padding: 16px 32px;
  border-radius: 4px
  border: none;
  // background: #141414;
  font-size: 15px;
`;
const CloseModelButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`

export default function App() {
  const [submit, setSubmit] = useState("POST")
  const [showModal, setShowModal] = useState(false)
  const [bookmarks, setBookmarks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    url: ""
  })

  const openModel = (e) => {
    setShowModal(true) 
  }
  
  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.id]: e.target.value
    })
  }

  // const handleSubmit = (e) => {
  //   if (submit === "POST"){
  //     createBookmark(e)
  //   }else {
  //     updateBookmark(e)
  //   }
    
  // }




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
      {bookmarks.map((bookmark, i) => {
        return (
          <div>
            <a href={bookmark.url} target="_target">{bookmark.title}</a>
            <Button value={bookmark._id} onClick={(e) => {
              openModel(e, bookmark._id)
            }}>{`UPDATE ${bookmark.title}`}</Button>
            <Button onClick={(e) => {
                deleteBookmark(e, bookmark._id);
              }}
            >{`DELETE ${bookmark.title}`}</Button>
            <UpdateModal data={bookmark} showModal={showModal} setShowModal={setShowModal} updateBookmark={updateBookmark} />
          </div>
        )
      })}
      {/* {bookmarks.map((el, i) => {
        return <UpdateModal data={el} showModal={showModal} setShowModal={setShowModal} updateBookmark={updateBookmark} />
      })} */}
    </div>
  );
}