import React from "react";
import {Copy as CopyIcon, X as CancelIcon} from "lucide-react"

function Input({
                   label,
                   text,
                   placeholder,
                   haveCopy,
                   onClear = null,
                   onChange = null,
                   readOnly = false,
                   visible = true,
                   ...props
               }) {
    return (
        <div className={`flex-1 flex flex-col justify-center ${!visible ? "hidden" : ""}`} {...props}>
            <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-300">
                    {label}
                </label>
                <span className="text-xs text-gray-400">
                    {text.length} символов
                </span>
            </div>

            <div className="relative flex-1">
                <button
                    onClick={haveCopy ? () => navigator.clipboard.writeText(text) : onClear}
                    className="absolute top-3 right-3 p-1 text-gray-400 hover:text-white
                       transition-all duration-200 z-10
                       active:scale-95 active:opacity-70 active:duration-100"
                    title={haveCopy ? "Скопировать" : "Очистить"}
                >
                    {haveCopy ? <CopyIcon size={24}/> : <CancelIcon size={24}/>}
                </button>

                <textarea
                    placeholder={placeholder}
                    onChange={onChange}
                    value={text}
                    readOnly={readOnly}
                    className="w-full md:h-full p-4 pr-10 bg-gray-700 border border-gray-600 rounded-xl
                         text-white placeholder-gray-400 resize-none focus:outline-none
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200 min-h-[150px] md:min-h-[150px]"
                />
            </div>
        </div>
    )
}

export default Input;