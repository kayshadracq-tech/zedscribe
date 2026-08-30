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
    recognition.maxAlternatives = 1;

    let listening = false;
    let finalTranscript = "";

    startButton.addEventListener("click", () => {

        if (listening) return;

        listening = true;
        startButton.textContent = "🔴 Listening...";

        try {
            recognition.start();
        } catch (error) {
            console.log("Start error:", error);
        }
    });

    recognition.onresult = (event) => {

        let interimTranscript = "";

        /*
         * Only process results that changed.
         * resultIndex tells us where the changed
         * results begin.
         */
        for (let i = event.resultIndex; i < event.results.length; i++) {

            const result = event.results[i];
            const text = result[0].transcript;

            if (result.isFinal) {
                finalTranscript += text + " ";
            } else {
                interimTranscript += text;
            }
        }

        /*
         * Final text stays permanent.
         * Interim text is displayed temporarily.
         */
        transcriptBox.textContent =
            finalTranscript + interimTranscript;
    };

    recognition.onend = () => {

        if (listening) {

            setTimeout(() => {

                try {
                    recognition.start();
                } catch (error) {
                    console.log("Restart error:", error);
                }

            }, 100);
        }
    };

    recognition.onerror = (event) => {

        console.log("Speech recognition error:", event.error);

        if (event.error === "not-allowed") {
            listening = false;
            startButton.textContent = "🎙️ Start Listening";
        }
    };

    clearButton.addEventListener("click", () => {

        finalTranscript = "";

        transcriptBox.innerHTML =
            '<span class="placeholder">Your words will appear here...</span>';
    });
}
