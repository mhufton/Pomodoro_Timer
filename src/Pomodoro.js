import React, { useState } from "react";
import ControlButtons from "./ControlButtons";
import TimerDurations from "./TimerDurations";
import Display from "./Display";

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
