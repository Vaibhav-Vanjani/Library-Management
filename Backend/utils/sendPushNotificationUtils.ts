export async function sendExpoPushNotification({
  expoTokenList,
  title,
  description
}: {
  expoTokenList: string[];
  title: string;
  description: string;
}) {

  const url = "https://exp.host/--/api/v2/push/send";

  for (const expoToken of expoTokenList) {
    console.log(expoToken, title, description, "for loop");

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          to: expoToken,
          title,
          body: description,
          sound: "default"
        })
      });

      const data = await res.json();
      console.log("expo response:", data);

      console.log(
        url,
        expoToken,
        title,
        description,
        "inside send push notification utils",
        data
      );

    } catch (error) {
      console.log("Error while sending push notification!!", error);
    }
  }
}