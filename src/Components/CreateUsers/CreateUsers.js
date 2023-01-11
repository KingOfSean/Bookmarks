import React, {useState, useEffect} from "react";
import styled from "styled-components";
import {MdClose} from "react-icons/md";

const CloseModelButton = styled(MdClose)`
	cursor: pointer;
	position: absolute;
	top: 20px;
	right: 20px;
	width: 32px;
	height: 32px;
	padding: 0;
	z-index: 10;
`;

export default function CreateUsers({createModal, setCreateModal}) {
	const [createForm, setCreateForm] = useState({
		username: "",
		password: "",
	});

	const createUser = async (e) => {
		e.preventDefault();
		const body = {...createForm};
		try {
			const response = await fetch(
				"https://bookmarks-backend.onrender.com/register",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(body, {
						token: window.localStorage.getItem("token"),
					}),
				},
			);
		} catch (error) {
			console.log(error);
		}
		setCreateForm({
			username: "",
			password: "",
		});
		setCreateModal(false);
	};

	const createChange = (e) => {
		setCreateForm({
			...createForm,
			[e.target.id]: e.target.value,
		});
	};

	return (
		<>
			{createModal ? (
				<div className="bg-modal">
					<div className="modal-container">
						<form className="modal-form" onSubmit={createUser}>
							<label for="usernames">
								Username:{" "}
								<input
									className="edit"
									type="text"
									id="username"
									placeholder="username"
									onChange={createChange}
									value={createForm.username}
								/>{" "}
								<br />
							</label>
							<br />
							<label for="passwords">
								Password:{" "}
								<input
									className="edit"
									type="password"
									id="password"
									placeholder="password"
									onChange={createChange}
									value={createForm.password}
								/>{" "}
								<br />
							</label>
							<br />
							<input className="submit" type="submit"></input>
							<CloseModelButton
								aria-label="Close modal"
								onClick={() => {
									setCreateModal(false);
								}}
							/>
						</form>
					</div>
				</div>
			) : null}
		</>
	);
}
