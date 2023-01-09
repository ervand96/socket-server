import React, { useState } from "react";
import io from "socket.io-client";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import Messages from "./Messages";

import icon from "../images/logo.svg";
import styles from "../styles/Chat.module.css"; 

const DEPLOY_URL = "https://online-chat-zk62.onrender.com"; 

const socket = io.connect(DEPLOY_URL);

const Chat = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [state, setState] = useState([]);
  const [params, setParams] = useState({ room: "", user: "" });
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState(0);

  console.log(search);

  useEffect(() => {
    const searchParams = Object.fromEntries(new URLSearchParams(search));
    setParams(searchParams);
    socket.emit("join", searchParams);

    return () => {
      socket.off();
    };
  }, [search]);

  useEffect(() => {
    socket.on("message", ({ data }) => {
      setState((_state) => [..._state, data]);
    });
  }, []);

  useEffect(() => {
    socket.on("joinRoom", ({ data: { users } }) => {
      setUsers(users.length);
    });
  }, []);

  const leftRoom = () => {
    socket.emit("leftRoom", { params });
    navigate("/");
  };
  const handlerChange = ({ target: { value } }) => {
    setMessage(value);
  };
  const handlerSubmit = (e) => {
    e.preventDefault();

    if (!message) return;

    socket.emit("sendMessage", { message, params });

    setMessage("");
  };

  const onEmojiClick = ({ emoji }) => {
    setMessage(`${message} ${emoji}`);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>{params?.room}</div>
        <div className={styles.users}>{users} users in this room</div>
        <button className={styles.left} onClick={leftRoom}>
          Left Room
        </button>
      </div>
      <div className={styles.messages}>
        <Messages messages={state} name={params.name} />
      </div>
      <form className={styles.form} onSubmit={handlerSubmit}>
        <div className={styles.input}>
          <input
            type="text"
            name="message"
            value={message}
            onChange={handlerChange}
            autoComplete="off"
            placeholder="Write Message"
            required
          />
        </div>

        <div className={styles.emoji}>
          <img src={icon} alt="icon" onClick={() => setIsOpen(!isOpen)} />
          {isOpen && (
            <div className={styles.emojies}>
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
        <div className={styles.button}>
          <input
            type="submit"
            value="Send a message"
            onSubmit={handlerSubmit}
          />
        </div>
      </form>
    </div>
  );
};

export default Chat;
