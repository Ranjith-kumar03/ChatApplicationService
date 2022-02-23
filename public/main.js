const socket = io()
const totalCli = document.getElementById("clients-total")
const messageContainer = document.getElementById("message-container")
const nameInput = document.getElementById("name-input")
const messageForm = document.getElementById("message-form")
const messageInput = document.getElementById("message-input")
const messagetone = new Audio('/messageVanu.mp3')
const sendTone = new Audio('/sendCheythachu.mp3')
const connectionAddress = document.getElementById("connectionAddress")




messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //e.stopPropagation()
    sendMessage()
})
socket.on("connectionDetails", (connectionDetails) => {
    console.log(connectionDetails.ClientTotal)
    console.log(connectionDetails.IpAddress)
    totalCli.innerText = `Total Clients : ${connectionDetails.ClientTotal}`
    connectionAddress.innerText = `Please Use this address to chat with me from PC Laptop or IPad - ${connectionDetails.IpAddress}`
})

function sendMessage() {
    if(messageInput.value==="") return
    console.log(messageInput.value)
    sendTone.play();
    const dataObject = {
        name: nameInput.value,
        message: messageInput.value,
        date: new Date()
    }
    socket.emit("message", dataObject)
    addMessageToUi(true, dataObject);
    scrollToBottom()
    messageInput.value = ''
}

socket.on("chat-Message", (dataObject) => {
    
    console.log(dataObject)
    addMessageToUi(false, dataObject);
})

function addMessageToUi(isOwnMessage, dataObject) {
   clearFeedBack()
    const element = `<li class="${isOwnMessage ? 'message-right' : 'message-left'}">
 <p class="message">
     ${dataObject.message}
 <span> ${dataObject.name}  ${moment(dataObject.date).fromNow()}</span>
 </p>
</li>`

    messageContainer.innerHTML += element;
    scrollToBottom()
    if(!isOwnMessage){ messagetone.play();}
    
}

function scrollToBottom()
{
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
}

messageInput.addEventListener('focus',(e)=>{
socket.emit('feedback',{
    feedback:`${nameInput.value} is typing a message`
})
})

messageInput.addEventListener('keypress',(e)=>{
    socket.emit('feedback',{
        feedback:`${nameInput.value} is typing a message`
    }) 
})

messageInput.addEventListener('blur',(e)=>{
    socket.emit('feedback',{
        feedback:``
    }) 
})


socket.on("chat-feedback", (data) => {
    clearFeedBack()
    const element = `<li class="message-feedback">
    <p class="feedback" id="feedback">
        ${data.feedback}
    </p>
</li>`
messageContainer.innerHTML += element;

})

function clearFeedBack()
{
    document.querySelectorAll('li.message-feedback').forEach((element)=>{
        element.parentNode.removeChild(element)
    })
}