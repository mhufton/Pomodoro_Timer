import React from "react";
import useInterval from "./utils/useInterval";
import { secondsToDuration, minutesToDuration } from "./utils/duration";

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
          new Audio(`https://bigsoundbank.com/UPLOAD/mp3/1482.mp3`).play();
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

export default Display;