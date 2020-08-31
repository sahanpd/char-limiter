"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var domContainer = document.querySelector("#app");
ReactDOM.render(React.createElement(App, null), domContainer);

function App() {
  return React.createElement(
    "div",
    { className: "app-container" },
    React.createElement(TextInput, null)
  );
}

function TextInput() {
  var _React$useState = React.useState(""),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      userInput = _React$useState2[0],
      setUserInput = _React$useState2[1];

  var _React$useState3 = React.useState(0),
      _React$useState4 = _slicedToArray(_React$useState3, 2),
      charLength = _React$useState4[0],
      setCharLength = _React$useState4[1];

  var _React$useState5 = React.useState(45),
      _React$useState6 = _slicedToArray(_React$useState5, 2),
      selectedLimit = _React$useState6[0],
      setSelectedLimit = _React$useState6[1];

  var _React$useState7 = React.useState([45, 80, 250, 450, 2000]),
      _React$useState8 = _slicedToArray(_React$useState7, 2),
      limitArray = _React$useState8[0],
      setLimitArray = _React$useState8[1];

  var _React$useState9 = React.useState(false),
      _React$useState10 = _slicedToArray(_React$useState9, 2),
      isNewSelectItemActive = _React$useState10[0],
      setIsNewSelectItemActive = _React$useState10[1];

  var limitArrayRef = React.useRef();
  var userInputRef = React.useRef();

  React.useEffect(function () {
    limitArrayRef.current = limitArray;
  }, [limitArray]);

  React.useEffect(function () {
    userInputRef.current = userInput;
  }, [userInput]);

  var handleTextChange = function handleTextChange(event) {
    var currInput = event.currentTarget.value;
    var currLength = currInput.length;
    // console.log(currLength, currInput);

    currInput = currInput.replace(/\r?\n|\r/g, " ");

    if (currLength > selectedLimit) {
      currInput = currInput.slice(0, selectedLimit);
      currLength = selectedLimit;
    }

    setCharLength(currLength);
    setUserInput(currInput);
  };

  var handleSelectClick = function handleSelectClick(event) {
    // console.log(event.currentTarget.id);
    var currSelectedLimit = parseInt(event.currentTarget.id);
    setSelectedLimit(currSelectedLimit);

    if (userInput && userInput.length > currSelectedLimit) {
      var newInput = userInput.slice(0, currSelectedLimit);

      setCharLength(currSelectedLimit);
      setUserInput(newInput);
    }

    document.getElementById("id-text-input").focus();
  };

  var handleClearClick = function handleClearClick() {
    setUserInput("");
    setCharLength(0);
    document.getElementById("id-text-input").focus();
  };

  var handleCopyClick = function handleCopyClick() {
    var copyText = document.getElementById("id-text-input");

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    document.execCommand("copy");
  };

  var handleNewSelect = function handleNewSelect() {
    if (!isNewSelectItemActive) {
      var newSelect = document.getElementById("id-new-select-item");

      var tempInput = document.createElement("input");
      tempInput.id = "id-temp-input";
      tempInput.style = "height: 13px; width: 50px; margin: 2px 4px; border: none; outline: none; text-align: center;";

      tempInput.addEventListener("blur", newSelectBlur);
      tempInput.addEventListener("keydown", enterNewSelectOption);

      newSelect.prepend(tempInput);
      document.getElementById("id-temp-input").focus();
    }

    setIsNewSelectItemActive(true);
  };

  var newSelectBlur = function newSelectBlur(event) {
    // console.log(event.target);

    event.target.remove();
    setIsNewSelectItemActive(false);
  };

  var enterNewSelectOption = function enterNewSelectOption(event) {
    if (event.keyCode === 13 && event.currentTarget.value.length <= 15) {
      var newItem = parseFloat(event.currentTarget.value);

      if (newItem) {
        newItem = Math.round(newItem);

        if (newItem !== 0) {
          var tempArray = [].concat(_toConsumableArray(limitArrayRef.current));

          if (!tempArray.find(function (item) {
            return item === newItem;
          })) {
            tempArray.push(newItem);
            tempArray.sort(function (a, b) {
              return a - b;
            });
            setLimitArray(tempArray);
          }

          setSelectedLimit(newItem);

          if (userInputRef.current && userInputRef.current.length > newItem) {
            var newInput = userInputRef.current.slice(0, newItem);

            setCharLength(newItem);
            setUserInput(newInput);
          }
        }
      }

      event.currentTarget.value = "";
    }
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div",
      { className: "toolbar" },
      React.createElement(
        "div",
        { className: "toolbar_left" },
        limitArray.map(function (item) {
          return React.createElement(
            "div",
            {
              id: item,
              key: item,
              className: "toolbar_select " + (selectedLimit === item ? "active-select" : ""),
              onClick: handleSelectClick
            },
            item
          );
        }),
        React.createElement(
          "div",
          { id: "id-new-select-item", className: "button", onClick: handleNewSelect },
          "+"
        )
      ),
      React.createElement(
        "div",
        { className: "toolbar_right" },
        React.createElement(
          "div",
          { className: "button", onClick: handleClearClick },
          "Clear"
        ),
        React.createElement(
          "div",
          { className: "button", onClick: handleCopyClick },
          "Copy"
        )
      )
    ),
    React.createElement("textarea", {
      id: "id-text-input",
      placeholder: "Enter text",
      className: "text-input " + (userInput.length === selectedLimit ? "limit-reached" : ""),
      onChange: handleTextChange,
      value: userInput
    }),
    React.createElement(
      "div",
      { className: "footer" },
      React.createElement(
        "span",
        {
          style: {
            color: "gray",
            fontSize: "12px",
            display: "inline-flex",
            alignItems: "center",
            marginRight: "3px",
            marginTop: "1px"
          }
        },
        "Char Count :"
      ),
      React.createElement(
        "span",
        {
          className: "footer_label " + (userInput.length === selectedLimit ? "limit-reached" : ""),
          style: { marginRight: "10px" }
        },
        charLength
      ),
      React.createElement(
        "span",
        {
          style: {
            color: "gray",
            fontSize: "12px",
            display: "inline-flex",
            alignItems: "center",
            marginRight: "3px",
            marginTop: "1px"
          }
        },
        "Char Left :"
      ),
      React.createElement(
        "span",
        { className: "footer_label faded " + (userInput.length === selectedLimit ? "limit-reached" : "") },
        selectedLimit - charLength
      )
    )
  );
}