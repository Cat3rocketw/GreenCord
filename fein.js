
const storedText = localStorage.getItem('userText');


if (storedText) {
    document.getElementById('message3').value = storedText;
}


document.getElementById('message3').addEventListener('input', function () {
    const textValue = this.value;
   
    localStorage.setItem('userText', textValue);
});
