import { createContext, useState } from "react";
import run from "../config/gemini"

export const Context = createContext()
const ContextProvider = (props) =>{
    const [input,setInput] = useState("") //输入框中的内容
    const [recentPrompt,setRencentPrompt] = useState("") //
    const [prevPrompts,setPrevPrompts] = useState([])
    const [showResult,setShowResult] = useState(false) 
    const [loading,setLoading] = useState(false) //加载特效的开关
    const [resultData,setResultData] = useState("") //
    const delayPara = (index,nextWord) =>{
        setTimeout(function(){
            setResultData(prev=>prev+nextWord)
        },75*index)
    }
    const newChat = () =>{
        setLoading(false)
        setShowResult(false)
    }
    const onSent = async (prompt)=>{
        setResultData("")
        setLoading(true)
        setShowResult(true)
        let response
        if(prompt!==undefined){
            response = await run(prompt)
            setRencentPrompt(prompt)
        }
        else{
            setPrevPrompts(prev=>[...prev,input])//侧栏的过去prompts记录
            setRencentPrompt(input)
            response = await run(input)
        }
      
       let responseArray = response.split("**")
       let newResponse;;
       for(let i=0;i<responseArray.length;i++)
       {
        if(i===0||i%2!==1){
            newResponse+= responseArray[i]
        }
        else{
            newResponse += "<b>"+responseArray[i] +"</b>"
        }
       }
       let newResponse2 = newResponse.split('*').join("</br>")
       let newResponseArray = newResponse2.split(" ")
       for(let i=0; i<newResponseArray.length;i++)
       {
            const nextWord = newResponseArray[i];
            delayPara(i,nextWord+" ")
       }
       setLoading(false)
       setInput("")
    }
 
    const contextValue = {
      prevPrompts,
      setPrevPrompts,
      onSent,
      setRencentPrompt,
      recentPrompt,
      showResult,
      loading,
      resultData,
      input,
      setInput,
      newChat
    }
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}
export default ContextProvider;