"use client";

import { useEffect, useRef } from "react";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "@/redux/slice/notificationSlice";

const playNotificationSound = () => {
    if (typeof window !== "undefined") {
        // const audio = new Audio("https://res.cloudinary.com/dvh8zf1nm/video/upload/v1743312798/notification_u9xtjc.mp3");
        const audio = new Audio("https://res.cloudinary.com/dvh8zf1nm/video/upload/v1743321611/notification2_wt0on4.mp3");
        audio.load();
        audio.play().catch((error) => console.error("Audio playback failed:", error));
    }
};

const GlobalNotification = () => {
    const dispatch = useDispatch();
    const message = useSelector((state: RootState) => state.notification.message);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (message) {
            playNotificationSound();

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                dispatch(hideNotification());
            }, 20000);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [message, dispatch]);

    if (!message) return null;

    return (
        <div className="fixed top-4 right-4 bg-neon_pink text-white px-4 py-2 rounded-md shadow-md text-sm">
            {message}
        </div>
    );
};

export default GlobalNotification;
