const url = "https://exp.host/--/api/v2/push/send";

export function sendExpoPushNotification({expoTokenList,title,description}:{expoTokenList:string[],title:string,description:string}){   
    
    console.log(expoTokenList,title,description,"____________in sendExpoPushNotification")
    
    expoTokenList.forEach(async expoToken => {
         console.log(expoToken,title,description,"____________in sendExpoPushNotification forEach")
        try {
                await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        to: expoToken,
                        title: title,
                        body: description,
                        sound: "default"
                    })
                });

                console.log(url,expoToken,title,description,"______inside send push notification utils");
        } catch (error) {
            console.log(error,"Error while sending push notification!!");
        }  
    });
    
    
}   