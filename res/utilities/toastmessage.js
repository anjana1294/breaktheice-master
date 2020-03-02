import { Toast } from "native-base";

warningMessage = (message) => {
    Toast.show({
        text: message,
        buttonText: "Okay",
        // type: "warning",
      })
}

successMessage = (message) => {
    Toast.show({
        text: message,
        buttonText: "Okay",
        type: "success"
      })
}

dangerMessage = (message) => {
    Toast.show({
        text:message,
        buttonText:"Okay",
        // type:"danger"
    })
}

export default {
    warningMessage,
    successMessage,
    dangerMessage
}