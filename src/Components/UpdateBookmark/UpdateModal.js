import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {MdClose} from 'react-icons/md';

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

export default function Modal({ showModal, setShowModal, handleChange, updateBookmark, handleSubmit, data }) {
    const [theTitle, setTheTitle] = useState(data.title);
    const [theUrl, setTheUrl] = useState(data.url);

    const onTheTitleChange = (e) => setTheTitle(e.target.value);
    const onTheUrlChange = (e) => setTheUrl(e.target.value);

    const onFormSubmit = (e) => {
        e.preventDefault();
        const theData = { title: theTitle, url: theUrl }
        updateBookmark(theData, data._id)
    }
console.log(data._id)
    return <>{showModal ? 
        <div className="bg-modal">
            <div className="modal-container">
                <form className="modal-form" onSubmit={onFormSubmit}>
                <input type="text" id="title" placeholder="title" onChange={onTheTitleChange} value={theTitle} />
                    <input type="text" id="url" placeholder="url" onChange={onTheUrlChange} value={theUrl} />
                    <input type="submit"></input>
                    <CloseModelButton aria-label="Close modal" onClick={() => {
                        setShowModal(false)
                    }} />
                </form>
            </div>
        </div>
    : null}</>    
};