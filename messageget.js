function sendMessage() {
    const webhookUrl = 'https://discord.com/api/webhooks/1338124802850033724/5PXLMdSNlrOp_s4ubm1zUc4RmFpRQI4pA2GkqNeXC4I45x91gQgLfi-MoSOC1hQa1ueo'; // Replace with your webhook URL
    const messageContent1 = 'Hello, Discord! This is a hardcoded message.'; 




  let prefix2 ="";

    if (toggle.checked) {
        prefix = "* <@1053015370115588147>";
       prefix2 = "֎ "

    } else {
        prefix = "*";
        prefix2=""
    }
     
    const messageContent =prefix + document.getElementById('message3').value +  '*:' + prefix2 + document.getElementById('message1').value ;
    

    if (document.getElementById('message3').value !== "Username" && document.getElementById('message1').value !== "") {
        
        document.getElementById('message1').value = '';

       
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: messageContent
            })
        })
        .then(response => response.json())
        .then(data => {
     
        })
        .catch(error => {
            console.error('Error:', error);
        });

        playSound();
    } else {
        alert('Must set a custom username');
    }

  
}


document.getElementById('sendMessageBtn').addEventListener('click', sendMessage);
