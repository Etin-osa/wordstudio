'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
    const router = useRouter()
    const [inputValue, setInputValue] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const submitValue = () => {
        console.log("Clicked!!!!!!!")
        if (inputValue.length > 6) {
            router.push(`/gameroom?id=${inputValue}`)
        } else {
            setErrorMessage("ID must be at least 7 characters long.")
        }
    }

    return (
        <div className="w-screen h-screen font-[family-name:var(--font-geist-sans)] bg-[url('https://images.unsplash.com/photo-1666891827442-136490fc4140?q=80&w=1968&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-no-repeat bg-center bg-fixed flex justify-center items-center flex-col">
            <div className="py-2 px-4 text-center rounded-sm bg-[#000] text-sm text-white mb-15">
                WORD S T U D I O.
            </div>
            
            <h1 className="text-5xl font-bold pb-2">Ready to Play?</h1>
            <h1 className="text-5xl font-bold">Create Your Unique ID to Jump In!</h1>

            <div className="w-100 mt-15 py-1 px-1 pl-2 rounded-xl bg-white shadow-md">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => {
                        if (errorMessage.length > 0) {
                            setErrorMessage("")
                        }
                        setInputValue(e.target.value)
                    }}
                    className="p-2 outline-none w-[75%] placeholder:text-gray-500 placeholder:italic"
                    placeholder="Enter your unique ID"
                />
                <button
                    onClick={submitValue}
                    className="w-[25%] bg-[#b7094c] text-white py-[9px] rounded-xl outline-none"
                >
                    Submit
                </button>
            </div>

            {errorMessage && (
                <div className="mt-2 text-red-500 text-sm">{errorMessage}</div>
            )}
        </div>
    );
}
