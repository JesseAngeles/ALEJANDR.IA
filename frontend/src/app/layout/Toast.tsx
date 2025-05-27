import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

type ToastProps = {
  message: string;
  type?: "success" | "error";
};

const Toast: React.FC<ToastProps> = ({ message, type = "success" }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2500); // empieza a desaparecer
    return () => clearTimeout(timer);
  }, []);

  const bgColor = type === "success" ? "bg-cyan-500" : "bg-red-600";
  const Icon = type === "success" ? FaCheckCircle : FaTimesCircle;

  return (
    <div
      className={`px-6 py-4 text-white rounded-lg shadow-lg w-[360px] max-w-sm flex items-center gap-3 transition-all duration-500 ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
      } ${bgColor}`}
    >
      <Icon className="text-2xl" />
      <p className="text-base font-semibold">{message}</p>
    </div>
  );
};

export default Toast;
