const startButton = document.querySelector(".start-btn");
const clearButton = document.querySelector(".clear-btn");
const transcriptBox = document.querySelector(".transcript");

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    startButton.disabled = true;
    startButton.textContent = "Speech recognition not supported";
} else {

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    startButton.addEventListener("click", () => {
        recognition.start();
        startButton.textContent = "🔴 Listening...";
    });

    recognition.onresult = (event) => {

        let text = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
        }

        transcriptBox.textContent = text;
    };

    recognition.onend = () => {
        startButton.textContent = "🎙️ Start Listening";
    };
}

clearButton.addEventListener("click", () => {

    transcriptBox.innerHTML =
        '<span class="placeholder">Your words will appear here...</span>';

});
