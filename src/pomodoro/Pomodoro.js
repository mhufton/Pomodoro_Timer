import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import { secondsToDuration, minutesToDuration } from "../utils/duration";

//Screen
function Display({ TimerData, isTimerRunning, setTimerData }) {
  let {
    focusSecs,
    counter,
    focusTime,
    displayName,
    breakTime,
    breakSecs,
    onFocus,
    paused
  } = TimerData;
  let pauseDisplay = !paused ? "block" : "none";
  let currentSession = onFocus
    ? {
        mins: focusTime,
        secs: focusSecs,
      }
    : { mins: breakTime, secs: breakSecs };

  useInterval(
    () => {
      setTimerData((currentData) => {
        if (
          currentData.displayName === "Focusing" &&
          currentData.counter >= currentData.focusSecs
        ) {
          currentData.counter = 0;
          currentData.displayName = "On Break";
          currentData.onFocus = !currentData.onFocus;
          new Audio(`https://bigsoundbank.com/UPLOAD/mp3/1482.mp3`).play();
        } else if (
          currentData.displayName === "On Break" &&
          currentData.counter >= currentData.breakSecs
        ) {
          currentData.counter = 0;
          currentData.displayName = "Focusing";
          currentData.onFocus = !currentData.onFocus;
          new Audio(`https://bigsoundbank.com/UPLOAD/mp3/11482.mp3`).play();
        }

        return { ...currentData, counter: currentData.counter + 1 };
      });
    },
    paused ? 1000 : null
  );
  let bar = `${(counter / currentSession.secs) * 100}`;
  return (
    <div style={{ display: `${TimerData.display}` }}>
      <div className="row mb-2">
        <div className="col">
          {isTimerRunning && (<h2 data-testid="session-title">
            {displayName} for {minutesToDuration(currentSession.mins)} minutes
          </h2>)}
          {isTimerRunning && (<p className="lead" data-testid="session-sub-title">
            {secondsToDuration(currentSession.secs - counter)} remaining
          </p>)}
        </div>
      </div>
      <div style={{ display: pauseDisplay }}>
        <h3>PAUSED</h3>
      </div>
      <div className="row mb-2">
        <div className="col">
          <div className="progress" style={{ height: "20px" }}>
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={bar}
              style={{ width: `${bar}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


//Durations
function TimerDurations({ TimerData, isTimerRunning, setTimerData }) {
  const handleInOrDe = (event) => {
    event.preventDefault();
    const whichButton =
      event.target.nodeName === "SPAN"
        ? event.target.parentNode.name
        : event.target.name;
    let newTime = 0;
    switch (whichButton) {
      case "decrease-focus":
        newTime = Math.max(TimerData.focusTime - 5, 5);
        setTimerData((currentData) => {
          return {
            ...currentData,
            focusTime: newTime,
            focusSecs: newTime * 60,
          };
        });
        break;
      case "increase-focus":
        newTime = Math.min(TimerData.focusTime + 5, 60);
        setTimerData((currentData) => {
          return {
            ...currentData,
            focusTime: newTime,
            focusSecs: newTime * 60,
          };
        });
        break;
      case "decrease-break":
        newTime = Math.max(TimerData.breakTime - 1, 1);
        setTimerData((currentData) => {
          return {
            ...currentData,
            breakTime: newTime,
            breakSecs: newTime * 60,
          };
         
        });
        break;
      case "increase-break":
        newTime = Math.min(TimerData.breakTime + 1, 15);
        setTimerData((currentData) => {
          return {
            ...currentData,
            breakTime: newTime,
            breakSecs: newTime * 60,
          };
        });
        break;
      default:
        break;
    }
  };
  return (
    <div className="row">
      <div className="col">
        <div className="input-group input-group-lg mb-2">
          <span className="input-group-text" data-testid="duration-focus">
            Focus Duration: {minutesToDuration(TimerData.focusTime)}
          </span>
          <div className="input-group-append">
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="decrease-focus"
              disabled={isTimerRunning}
              onClick={handleInOrDe}
              name="decrease-focus"
            >
              <span className="oi oi-minus" />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="increase-focus"
              disabled={isTimerRunning}
              onClick={handleInOrDe}
              name="increase-focus"
            >
              <span className="oi oi-plus" />
            </button>
          </div>
        </div>
      </div>
      <div className="col">
        <div className="float-right">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-break">
              Break Duration: {minutesToDuration(TimerData.breakTime)}
            </span>
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-break"
                disabled={isTimerRunning}
                onClick={handleInOrDe}
                name="decrease-break"
              >
                <span className="oi oi-minus" name="decrease-break" />
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-break"
                disabled={isTimerRunning}
                onClick={handleInOrDe}
                name="increase-break"
              >
                <span className="oi oi-plus" name="increase-break" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


//ButtonControl
function ControlButtons({ playPause, isTimerRunning, stop, paused }) {
  return (
    <div className="row">
      <div className="col">
        <div
          className="btn-group btn-group-lg mb-2"
          role="group"
          aria-label="Timer controls"
        >
          <button
            type="button"
            className="btn btn-primary"
            data-testid="play-pause"
            title="Start or pause timer"
            onClick={playPause}
          >
            <span
              className={classNames({
                oi: true,
                "oi-media-play": !paused,
                "oi-media-pause": paused,
              })}
            />
          </button>
          <button
            type="reset"
            className="btn btn-secondary"
            title="Stop the session"
            disabled={!isTimerRunning}
            onClick={stop}
            data-testid="stop"
          >
            <span className="oi oi-media-stop" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Pomodoro() {
  const initialState = {
    focusTime: 25,
    breakTime: 5,
    display: `none`,
    focusSecs: 1500,
    breakSecs: 300,
    counter: 0,
    displayName: "Focusing",
    onFocus: true,
    paused: false
  };
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [TimerData, setTimerData] = useState({ ...initialState });

  function playPause() {
    setIsTimerRunning(true);
    setTimerData({ ...TimerData, display: "block", paused: !TimerData.paused });
  }
  function stop() {
    setTimerData({ ...initialState });
    setIsTimerRunning(false);
  }

  return (
    <div className="pomodoro">
      <TimerDurations
        TimerData={TimerData}
        isTimerRunning={isTimerRunning}
        setTimerData={setTimerData}
      />
      <ControlButtons
        playPause={playPause}
        isTimerRunning={isTimerRunning}
        stop={stop}
        paused={TimerData.paused}
      />
      <Display
        TimerData={TimerData}
        isTimerRunning={isTimerRunning}
        setTimerData={setTimerData}
      />
    </div>
  );
}

export default Pomodoro;
