import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import { Howl } from "howler";

import chiptune from "./assets/sounds/chiptune-loop.wav";
import "./App.css";

const Timer = () => {
    const alarm = new Howl({
        src: [chiptune],
    });

    const [isStarted, setIsStarted] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);

    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        const timeInSec =
            parseInt(data.hours) * 3600 +
            parseInt(data.minutes) * 60 +
            parseInt(data.seconds);

        setTimeLeft(timeInSec);
        setIsStarted(!isStarted);
        setIsRunning(true);
    };

    const handleClick = () => {
        if (timeLeft === 0) {
            setIsStarted(!isStarted);
            alarm.stop();
        }
        setIsRunning(!isRunning);
    };

    const handleCancelClick = () => {
        setIsStarted(!isStarted);
        setIsRunning(!isRunning);
    };

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            const interval = setInterval(
                () => setTimeLeft(timeLeft - 1),
                1000
            );
            return () => clearInterval(interval);
        }
        if (timeLeft === 0 && isStarted) {
            alarm.play();
        }
    });

    const startButton = () => {
        if (hours + minutes + seconds > 0) {
            return (
                <button className="start-button" type="submit">
                    Start
                </button>
            );
        } else {
            return <button disabled>Start</button>;
        }
    };

    const timer = moment.duration(timeLeft, "seconds")._data;

    return (
        <div className="timer-container">
            <div className="timer-wrapper">
                <div className="window">
                    <div className="title-bar">
                        <h1 className="title-bar-text">
                            Very Cool Timer
                        </h1>
                    </div>
                    {!isStarted ? (
                        <div className="form-wrapper window-body">
                            <p>Please enter a time.</p>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="field-row">
                                    <div className="hours time-input ">
                                        <input
                                            type="number"
                                            name="hours"
                                            value={hours}
                                            ref={register}
                                            onChange={(event) =>
                                                setHours(
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="minutes time-input">
                                        <input
                                            type="number"
                                            name="minutes"
                                            value={minutes}
                                            ref={register}
                                            onChange={(event) =>
                                                setMinutes(
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="seconds time-input">
                                        <input
                                            type="number"
                                            name="seconds"
                                            value={seconds}
                                            ref={register}
                                            onChange={(event) =>
                                                setSeconds(
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="field-row window-button-wrapper">
                                    {startButton()}
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div>
                            <p>
                                {timer.hours < 10
                                    ? `0${timer.hours}`
                                    : timer.hours}
                                :
                                {timer.minutes < 10
                                    ? `0${timer.minutes}`
                                    : timer.minutes}
                                :
                                {timer.seconds < 10
                                    ? `0${timer.seconds}`
                                    : timer.seconds}
                            </p>
                            <button onClick={handleClick}>
                                {timeLeft === 0
                                    ? "Reset"
                                    : isRunning
                                    ? "Pause"
                                    : "Resume"}
                            </button>
                            {isStarted && timeLeft > 0 ? (
                                <button onClick={handleCancelClick}>
                                    Cancel
                                </button>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Timer;
