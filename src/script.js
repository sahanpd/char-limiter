"use strict";
let domContainer = document.querySelector("#app");
ReactDOM.render(<App />, domContainer);

function App() {
  return (
    <div className="app-container">
      <TextInput />
    </div>
  );
}

function TextInput() {
  const [userInput, setUserInput] = React.useState("");
  const [charLength, setCharLength] = React.useState(0);
  const [selectedLimit, setSelectedLimit] = React.useState(45);
  const [limitArray, setLimitArray] = React.useState([45, 80, 250, 450, 2000]);
  const [isNewSelectItemActive, setIsNewSelectItemActive] = React.useState(false);

  const limitArrayRef = React.useRef();
  const userInputRef = React.useRef();

  React.useEffect(() => {
    limitArrayRef.current = limitArray;
  }, [limitArray]);

  React.useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  const handleTextChange = (event) => {
    let currInput = event.currentTarget.value;
    let currLength = currInput.length;
    // console.log(currLength, currInput);

    currInput = currInput.replace(/\r?\n|\r/g, " ");

    if (currLength > selectedLimit) {
      currInput = currInput.slice(0, selectedLimit);
      currLength = selectedLimit;
    }

    setCharLength(currLength);
    setUserInput(currInput);
  };

  const handleSelectClick = (event) => {
    // console.log(event.currentTarget.id);
    let currSelectedLimit = parseInt(event.currentTarget.id);
    setSelectedLimit(currSelectedLimit);

    if (userInput && userInput.length > currSelectedLimit) {
      let newInput = userInput.slice(0, currSelectedLimit);

      setCharLength(currSelectedLimit);
      setUserInput(newInput);
    }

    document.getElementById("id-text-input").focus();
  };

  const handleClearClick = () => {
    setUserInput("");
    setCharLength(0);
    document.getElementById("id-text-input").focus();
  };

  const handleCopyClick = () => {
    let copyText = document.getElementById("id-text-input");

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    document.execCommand("copy");
  };

  const handleNewSelect = () => {
    if (!isNewSelectItemActive) {
      let newSelect = document.getElementById("id-new-select-item");

      let tempInput = document.createElement("input");
      tempInput.id = "id-temp-input";
      tempInput.style = "height: 13px; width: 50px; margin: 2px 4px; border: none; outline: none; text-align: center;";

      tempInput.addEventListener("blur", newSelectBlur);
      tempInput.addEventListener("keydown", enterNewSelectOption);

      newSelect.prepend(tempInput);
      document.getElementById("id-temp-input").focus();
    }

    setIsNewSelectItemActive(true);
  };

  const newSelectBlur = (event) => {
    // console.log(event.target);

    event.target.remove();
    setIsNewSelectItemActive(false);
  };

  const enterNewSelectOption = (event) => {
    if (event.keyCode === 13 && event.currentTarget.value.length <= 15) {
      let newItem = parseFloat(event.currentTarget.value);

      if (newItem) {
        newItem = Math.round(newItem);

        if (newItem !== 0) {
          let tempArray = [...limitArrayRef.current];

          if (!tempArray.find((item) => item === newItem)) {
            tempArray.push(newItem);
            tempArray.sort((a, b) => a - b);
            setLimitArray(tempArray);
          }

          setSelectedLimit(newItem);

          if (userInputRef.current && userInputRef.current.length > newItem) {
            let newInput = userInputRef.current.slice(0, newItem);

            setCharLength(newItem);
            setUserInput(newInput);
          }
        }
      }

      event.currentTarget.value = "";
    }
  };

  return (
    <React.Fragment>
      <div className="toolbar">
        <div className="toolbar_left">
          {limitArray.map((item) => (
            <div
              id={item}
              key={item}
              className={`toolbar_select ${selectedLimit === item ? "active-select" : ""}`}
              onClick={handleSelectClick}
            >
              {item}
            </div>
          ))}

          <div id="id-new-select-item" className="button" onClick={handleNewSelect}>
            +
          </div>
        </div>
        <div className="toolbar_right">
          <div className="button" onClick={handleClearClick}>
            Clear
          </div>
          <div className="button" onClick={handleCopyClick}>
            Copy
          </div>
        </div>
      </div>

      <textarea
        id="id-text-input"
        placeholder="Enter text"
        className={`text-input ${userInput.length === selectedLimit ? "limit-reached" : ""}`}
        onChange={handleTextChange}
        value={userInput}
      ></textarea>

      <div className="footer">
        <span
          style={{
            color: "gray",
            fontSize: "12px",
            display: "inline-flex",
            alignItems: "center",
            marginRight: "3px",
            marginTop: "1px",
          }}
        >
          Char Count :
        </span>
        <span
          className={`footer_label ${userInput.length === selectedLimit ? "limit-reached" : ""}`}
          style={{ marginRight: "10px" }}
        >
          {charLength}
        </span>

        <span
          style={{
            color: "gray",
            fontSize: "12px",
            display: "inline-flex",
            alignItems: "center",
            marginRight: "3px",
            marginTop: "1px",
          }}
        >
          Char Left :
        </span>
        <span className={`footer_label faded ${userInput.length === selectedLimit ? "limit-reached" : ""}`}>
          {selectedLimit - charLength}
        </span>
      </div>
    </React.Fragment>
  );
}
