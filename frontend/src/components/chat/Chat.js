import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import axios from "axios";
import { useSelector } from "react-redux";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import chooseFile from "../assets/check.png";
import * as XLSX from "xlsx";
import Loader from "../services/Loader";

export default function ChatBox() {
  const [input, setInput] = useState("");
  const [jsonData, setJsonData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { send: false, message: "Please Ask you queries!" },
  ]);

  const colors = useSelector((state) => state.UpdateColor) || [];
  const fontText = useSelector((state) => state.UpdateFont) || [];

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setJsonData(() => {
        return json;
      });

      addMessages(json);
    };

    reader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightBlock(block);
    });
  }, [messages]);

  const addMessages = async (jsonData) => {
    if (input !== "" || jsonData !== null) {
      const userMessage = { send: true, message: input };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setInput("");
      setJsonData(null);

      try {
        const prompt = jsonData
          ? `I have provided you with data. Please read and process the data to make it available for answering my questions.
           Let me know once you have successfully processed and are ready to respond to my queries based on the provided data.
            Data: ${JSON.stringify(jsonData, null, 2)}.
            Question:${
              input
                ? input
                : "Response as you are done with processing the above data and ready to take queries related file data you have gotten."
            }`
          : input;

        setIsLoading(true);
        const response = await axios.post("http://localhost:5000/api/message", {
          userId: "12345",
          userPrompt: prompt,
        });

        const botMessage = { send: false, message: response.data.response };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error fetching response:", error);
        const errorMessage = {
          send: false,
          message: "Sorry, I couldn't process that request. Please try again.",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert("Please type your query");
    }
  };

  return (
    <div
      className="chatbox_container"
      // style={{ border: `1px solid ${colors[0]?.color_up || "#000"}` }}
    >
      {isLoading ? <Loader /> : ""}
      <div
        className="chatbox_header"
        style={{ backgroundColor: colors[1]?.color_up || "#f0f0f0" }}
      >
        <div className="chat_icon">
          <img
            alt="icon"
            src="https://as1.ftcdn.net/v2/jpg/02/81/66/10/1000_F_281661004_3Zj7ojB3mwAPB2NXBqOWDrwskk5LvFIp.jpg"
          />
        </div>
        <div className="chat_name">
          <div className="c_n_1">Growwth Partner</div>
          <div className="c_n_2">AI Assistant</div>
        </div>
        <div className="chat_cross">
          <img
            alt="cross"
            width="20vh"
            height="20vh"
            src="https://img.icons8.com/ios11/512w/FFFFFF/multiply.png"
          />
        </div>
      </div>

      <div className="chatbox_message_area">
        {messages.map((item, index) => (
          <div
            key={index}
            className={item.send ? "user_message_bubble" : "bot_message_bubble"}
          >
            <div
              className={item.send ? "u_m_b_box" : "b_m_b_box"}
              style={{
                backgroundColor: colors[item.send ? 4 : 2]?.color_up || "#fff",
                color: colors[item.send ? 5 : 3]?.color_up || "#000",
                fontFamily: fontText[3]?.fontStyle || "inherit",
                fontWeight: fontText[0]?.bold ? "bold" : "normal",
                fontStyle: fontText[1]?.italic ? "italic" : "normal",
                textDecoration: fontText[2]?.underline ? "underline" : "none",
                fontSize: fontText[4]?.fontSize
                  ? `${fontText[4].fontSize / 10}vh`
                  : "inherit",
              }}
            >
              {item.message !== "" ? (
                <div
                  id="output-container"
                  dangerouslySetInnerHTML={{
                    __html: item.message,
                  }}
                />
              ) : (
                ""
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="chatbox_footer">
        <div className="c_f_input_file">
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            disabled={isLoading}
            style={{ pointerEvents: isLoading ? "none" : "auto" }}
          />
          <label htmlFor="file-upload">
            <img src={chooseFile} alt="Upload" />
          </label>
        </div>

        <div className="c_f_input">
          <input
            value={input}
            type="text"
            placeholder="Ask us anything..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            style={{ cursor: isLoading ? "not-allowed" : "" }}
          />
        </div>
        <div className="c_f_button">
          <img
            alt="sendbtn"
            onClick={() => addMessages(jsonData)}
            src="https://cdn.icon-icons.com/icons2/1509/PNG/512/documentsend_104490.png"
            disabled={isLoading}
            style={{ cursor: isLoading ? "not-allowed" : "" }}
          />
        </div>
      </div>
    </div>
  );
}
