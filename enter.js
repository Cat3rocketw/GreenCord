
const textarea = document.getElementById('message1');


textarea.addEventListener('keydown', function (event) {

  if (event.key === 'Enter') {
  
    event.preventDefault();
    sendMessage();

    handleEnterKeyPress();
  }
});


function handleEnterKeyPress() {
   
  const message = textarea.value; 
  document.getElementById('output').textContent = `You entered: ${message}`; 
  textarea.value = ''; 
}

document.addEventListener("DOMContentLoaded", function() {
    function clearTextarea() {
        document.getElementById("message1").value = "";
    }

    document.querySelector("button").onclick = clearTextarea;
});

sendMessage();
