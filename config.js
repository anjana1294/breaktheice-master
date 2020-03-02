import {Platform} from 'react-native';

let backendUrl;

if(Platform.OS === 'android'){
backendUrl = "http://profile.appsimity.com/breakice/webservices.php";
}else if(Platform.OS === 'ios'){
backendUrl = "http://profile.appsimity.com/breakice/webservices.php";
}

const config = {
backend_url : backendUrl
}

export default config;