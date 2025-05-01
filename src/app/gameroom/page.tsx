"use client";

import { AlignJustify, User, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import Axios from "../services/Axios";

export default function GameRoom() {
    const [startGame, setStartGame] = useState(false);
    const [randomLetters, setRandomLetters] = useState(["A", "A", "A", "A", "A", "A", "A", "A", "A"]);
    const [inputError, setInputError] = useState("")
    const [inputValue, setInputValue] = useState("")
    const [timer, setTimer] = useState(20)
    const [isTimer, setIsTimer] = useState(false)
    const [timeInterval, setTimeInterval] = useState<any>()

    const getRandomWords = async () => {
        try {
            setStartGame(true);
            const response: { data: { result: string[] }} = await Axios.post("/generateWords", {
                body: JSON.stringify({
                    language: "english",
                }),
            })

            setRandomLetters(response.data.result);
            startTimer()
        } catch (err) {
            console.log(err);
        }
    }

    const startTimer = () => setTimeInterval(
        setInterval(() => {
            if (isTimer === false) {
                setIsTimer(true)
            }
            setTimer((prevTimer) => prevTimer - 1)
        }, 1000)
    );

    const checkMoreLetters = (value: string): boolean => {
        const lastValue = value[value.length - 1]
        const randomList = randomLetters.filter(eachLetter => eachLetter === lastValue)
        const valueList = value.split("").filter(eachLetter => eachLetter === lastValue)

        if (valueList.length > randomList.length) {
            return true
        }
    
        return false
    }

    const handleInput = (inputEvent: ChangeEvent<HTMLInputElement>) => {
        const value = inputEvent.target.value
        const lastValue = value[value.length - 1]

        if (lastValue === undefined) {
            return ""
        }
        
        if (value.length > randomLetters.length) {
            setInputError(`The maximum amount of letters is "9"`)
            inputEvent.target.value = value.slice(0, value.length - 1)
        } else if (!randomLetters.includes(lastValue)) {
            setInputError(`"${lastValue}" dosen't exists in the letters above`)
            inputEvent.target.value = value.slice(0, value.length - 1)
        } else if (checkMoreLetters(value)) {
            setInputError(`You have reached the maximum amount of "${lastValue}" in the letters above`)
            inputEvent.target.value = value.slice(0, value.length - 1)
        } else {
            setInputError("")
            setInputValue(inputEvent.target.value)
        }
    }

    const submitValue = async () => {
        try {
            setTimer(45)
            setIsTimer(false)
            clearInterval(timeInterval)
            
            const { data } = await Axios.post("/checkWord", {
                body: JSON.stringify({
                    word: inputValue,
                    language: "English"
                })
            })

            console.log(data.body)
        } catch (err) {

        }
    }

    useEffect(() => {
        if (timer === 0) {
            setTimer(45)
            setIsTimer(false)
            clearInterval(timeInterval)
        }
    }, [timer])

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-[#f1f1f1]">
            {!startGame && 
                <div className="absolute z-3 top-0 left-0 w-[100%] h-[100%] bg-[#00000099] flex justify-center items-center">
                    <div className="absolute w-[600px] bg-white rounded-2xl overflow-hidden">
                        <div className="relative h-[250px] overflow-hidden">
                            <Image 
                                src="https://images.unsplash.com/photo-1629194891750-cd24c0b9596f?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Word Studio"
                                width={500}
                                height={500}
                                className="w-[100%]"
                            />
                            <div className="absolute top-9 right-9 cursor-pointer" onClick={() => setStartGame(true)}>
                                <X size={"30"} />
                            </div>
                        </div>

                        <div className="p-10">
                            <h1 className="text-2xl font-bold">Game Rules</h1>

                            <ul>
                                <li className="my-5 mx-3">
                                    <span className="font-bold">1.</span> Choose your preferred language at the bottom left or we'll roll with English by default! Don't worry, you can change it anytime.
                                </li>
                                <li className="my-5 mx-3">
                                    <span className="font-bold">2.</span> You'll get 9 random letters. Your mission? Craft the longest word you can to claim victory! The longer the word, the higher your score — so think big.
                                </li>
                            </ul>

                            <div className="flex items-center justify-between mt-10">
                                <div className="flex items-center gap-3">
                                    <span>Your language: </span>
                                    <div className="py-2 px-4 rounded-xl bg-[#F5F5F5] border-[1px] border-[#a1a1a1]">
                                        <select name="" id="">
                                            <option value="english">English</option>
                                            <option value="spanish">Spanish</option>
                                            <option value="german">German</option>
                                            <option value="french">French</option>
                                            <option value="italian">Italian</option>
                                        </select>
                                    </div>
                                </div>
                                <button 
                                    className="bg-blue-500 text-white py-3 px-5 cursor-pointer rounded-xl"
                                    onClick={getRandomWords}
                                >
                                    Start Game
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <div className="">
                {/* history */}
                {/* game page */}
                <div className="relative h-screen w-screen">
                    <div className="flex justify-between items-center py-2 px-5">
                        <div className="flex-1">
                            <AlignJustify />
                        </div>

                        <div className="flex-1 flex justify-center items-center">
                            <p className="py-2 px-4 text-center rounded-sm bg-[#000] text-sm text-white max-w-[fit-content]">
                                WORD S T U D I O.
                            </p>
                        </div>

                        <div className="flex-1 flex items-center justify-end gap-15">
                            <div className="bg-[#b7094c] text-white text-sm py-2 px-6 rounded-sm flex items-center gap-3">
                                <span>English</span>
                            </div>  
                            <div className="flex items-center gap-2">
                                <User />
                                <span>userie46340</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center border-t-[1px] border-b-[1px] border-[#a1a1a1]">
                        {randomLetters.map((letter, index) => 
                            <div className="flex-1 py-3 border-[#a1a1a1] border-r-[1px]" key={index}>
                                <h1 className="text-[14vw] text-center leading-none uppercase">{letter}</h1>
                            </div>
                        )}
                    </div>
                
                    <div className="relative border-b-[1px] text-center h-[70px] border-[#a1a1a1]">
                        <span className={`
                            absolute z-2 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] 
                            text-3xl ${timer <= 9 ? "text-white" : "text-black"}
                        `}>{timer}s</span>
                        <div className={`
                            absolute left-0 top-0 h-[100%] w-[0%] bg-[#000] 
                            ${isTimer ? "animate-[counterWidth_20s_ease-in-out_1]" : ""}
                        `}></div>
                    </div>

                    {/* footer */}
                    <div className="absolute w-[100%] left-0 bottom-0">
                        <div className="text-center mb-[30px]">
                            <span className="text-red-500 text-2xl">{inputError}</span>
                        </div>

                        <div className="w-[60vw] mx-auto py-1 px-1 pl-2 min-w-sm mb-1">
                            <input
                                type="text"
                                className="p-2 outline-none w-[85%] placeholder:text-gray-400 placeholder:italic text-[30px] text-center"
                                placeholder="Write down your word here!!"
                                onChange={handleInput}
                            />
                            <button
                                onClick={() => inputValue.length > 3 && submitValue()}
                                className="w-[15%] bg-[#b7094c] py-3 text-white rounded-xl outline-none text-[18px]"
                            >
                                Submit
                            </button>
                        </div>

                        {/* score board */}
                        <div className="border-t-[1px] border-[#a1a1a1]">
                            <div className="flex justify-around items-center gap-50 w-[50%] mx-auto">
                                <div className="flex flex-col text-center">
                                    <div className="text-7xl">0</div>
                                    <div className="text-[18px]">Your score</div>
                                </div>
                                <div className="w-[200px] h-[4px] bg-[#000000]" />
                                <div className="flex flex-col text-center">
                                    <div className="text-7xl">0</div>
                                    <div className="text-[18px]">AI score</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
