const socket = io();
const outputYou = document.querySelector('.yourOut');
const outputBot = document.querySelector('.botOut');

const SpeechRecognition =  window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'eu-US';
recognition.interimResults = false;
recognition.maxAlternatives = 2;
document.querySelector('button').addEventListener('click', () => {
    recognition.start();
});
recognition.addEventListener('speechstart', () => {
    console.log('Speech detected');
})
recognition.addEventListener('result', (e) => {
    console.log('result detected');
    let last = e.results.length-1;
    let text = e.results[last][0].transcript;
    outputYou.textContent = text;
    console.log('Confidence: ' + e.results[0][0].confidence);
        socket.emit('chat message', text);

});
recognition.addEventListener('speechend', () => {
    recognition.stop();
});
recognition.addEventListener('error', (e) => {
    outputBot.textContent = "Error: " + e.error;
});
function synthVoice (text){
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
}
socket.on('bot reply', function(replyText){
    synthVoice(replyText);

    if(replyText == '') replyText = '(Not in mood to answer...)';
    outputBot.textContent = replyText;
})