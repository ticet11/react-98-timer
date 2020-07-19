import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";
import { Howl } from "howler";
import "98.css";

import chiptune from "./assets/sounds/chiptune-loop.wav";
import "./App.scss";

const Timer = () => {
    const alarm = new Howl({
        src: [chiptune],
    });

    const [isStarted, setIsStarted] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [error, setError] = useState(false);

    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        const timeInSec =
            parseInt(data.hours) * 3600 +
            parseInt(data.minutes) * 60 +
            parseInt(data.seconds);
        if (timeInSec === 0) {
            setError(true);
        } else {
            setError(false);
            setTimeLeft(timeInSec);
            setIsStarted(!isStarted);
            setIsRunning(true);
        }
    };

    const errorMessage = () => {
        if (error) {
            return (
                <p className="timer-error-message">
                    Please enter a time
                </p>
            );
        }
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

    const timer = moment.duration(timeLeft, "seconds")._data;

    return (
        <div className="timer-container">
            <div className="timer-wrapper">
                <div className="window">
                    <div className="title-bar">
                        <div className="title-bar-text">
                            Very Cool Timer
                        </div>
                        <div className="title-bar-controls">
                            <button aria-label="Help" />
                            <button aria-label="Close" />
                        </div>
                    </div>
                    {!isStarted ? (
                        <div className="form-wrapper window-body">
                            <p>Please enter a time.</p>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="field-row">
                                    <input
                                        name="hours"
                                        defaultValue="00"
                                        ref={register}
                                    />
                                    <input
                                        name="minutes"
                                        defaultValue="00"
                                        ref={register}
                                    />
                                    <input
                                        name="seconds"
                                        defaultValue="00"
                                        ref={register}
                                    />
                                </div>
                                <div className="field-row window-button-wrapper">
                                    <button
                                        className="start-button"
                                        type="submit"
                                    >
                                        Start
                                    </button>
                                </div>
                                {errorMessage()}
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
