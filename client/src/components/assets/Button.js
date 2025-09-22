'use client'

export default function Button({
    btnLabel = "Button",
    btnClasses = "",
    paddingY = 'py-3',
    paddingX = 'px-10',
    textColor = 'text-neutral-50',
    btnBorder = 'border-black',
    btnColor = "bg-black",
    btnHover = "hover:bg-neutral-50",
    textColorHover = 'hover:text-black',
    btnBorderHover = 'hover:border-black' }) {
    return (
        <button
            className={`${btnClasses} flex shadow-lg shadow-blue-600/10 justify-center items-center ${paddingY} ${paddingX} 
                ${textColor} ${btnColor} cursor-pointer rounded-md
                ${btnBorder} border-2 ${btnHover} 
                ${textColorHover} ${btnBorderHover}`}>
            {btnLabel}
        </button>
    )
}