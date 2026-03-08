const url = "https://exp.host/--/api/v2/push/send";

export function sendExpoPushNotification({expoTokenList,title,description}:{expoTokenList:string[],title:string,description:string}){   
    expoTokenList.forEach(async expoToken => {
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
        } catch (error) {
            console.log(error,"Error while sending push notification!!");
        }  
    });
    
    
}   