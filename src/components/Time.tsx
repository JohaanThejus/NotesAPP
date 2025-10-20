import { useEffect, useState } from "react";
import "../styles/general.css";

function Time() {
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);

    useEffect(() => {
        const updateTime = () => {
            const date = new Date();
            setHour(date.getHours());
            setMinute(date.getMinutes());
        };

        // update immediately once
        updateTime();

        // update every second
        const interval = setInterval(updateTime, 1000);

        // cleanup on unmount
        return () => clearInterval(interval);
    }, []);

    // format the minutes to always show two digits (e.g., 09 instead of 9)
    const formattedMinute = String(minute).padStart(2, "0");
    const formattedHour = String(hour).padStart(2, "0");

    return (
        <div className="time-wrapper">
            <div className="time">
                <p className="font-minor white">
                    {formattedHour} : {formattedMinute}
                </p>
            </div>
        </div>
    );
}

export default Time;
