import React, { Component } from 'react';
import {StackNavigator,DrawerNavigator} from 'react-navigation';
import Login from './res/screens/login';
import LoginStep2 from './res/screens/loginstep2';
import LoginStep3 from './res/screens/loginstep3';
import LoginStep4 from './res/screens/loginstep4';
import Signup from './res/screens/singup';
import SignupOtp from './res/screens/signupOtp';
import Profile from './res/screens/profile';
import CustomDrawer from './res/drawerContent/customdrawer';
import HomeScreen from './res/screens/homeScreen';
import Notifications from './res/drawerContent/notifications';
import Chatroom from './res/drawerContent/chatroom';
import Myfavorite from './res/drawerContent/myfavorite';
import TAC from './res/drawerContent/tac';
import FAQ from './res/drawerContent/faq';
import Setting from './res/drawerContent/setting';
import { Image } from 'react-native';
import Terms from './res/screens/tandc';
import UserProfile from './res/screens/userProfile';
import EditProfile from './res/screens/editprofile';
import Chat from './res/drawerContent/chats';
import FCM,{FCMEvent} from 'react-native-fcm';
import blockList from './res/screens/blocklist';
import ChatroomNotify from './res/chatroomcomponent';
import {Root} from 'native-base'
console.disableYellowBox = true;


const Drawer = DrawerNavigator({
    HomeScreen:{
        screen:HomeScreen,
        navigationOptions:{
            title:'Home',
            drawerIcon:(
                <Image source={require('./res/icons/home.png')} style={{
                    height:25,
                    width:25
                }}/>
            )
        }
    },
    // Notifications:{
    //     screen:Notifications,
    //     navigationOptions:{
    //         title:'Notifications',
    //         drawerIcon:(
    //            <Image source={require('./res/icons/notification.png')} style={{
    //                height:25,
    //                width:25
    //            }}
    //            />
    //         )
    //     }
    // },
    Chatroom:{
        screen:Chatroom,
        navigationOptions:{
            title:'Chats',
            drawerIcon:(
               <Image source={require('./res/icons/speech-bubble.png')} style={{
                   height:25,
                   width:25
               }}/>
            ),
            drawerLabel:
                <ChatroomNotify  />
        }
    },
    Myfavorite:{
        screen:Myfavorite,
        navigationOptions:{
            title:'My Favorites',
            drawerIcon:(
                <Image source={require('./res/icons/favorites-button.png')} style={{
                    height:25,
                    width:25,
                }}/>
            )
        },
    },
    TAC:{
        screen:TAC,
        navigationOptions:{
            title:'Terms and Conditions',
            drawerIcon:(
                <Image source={require('./res/icons/note.png')} style={{
                    height:25,
                    width:25
                }}/>
            )
        }
    },
    FAQ:{
        screen:FAQ,
        navigationOptions:{
            title:"FAQ's",
            drawerIcon:(
                <Image source={require('./res/icons/info.png') } style={{
                    height:25,
                    width:25
                }}/>
            ),
        }
    },
    Setting:{
        screen:Setting,
        navigationOptions:{
            title:"Settings",
            drawerIcon:(
               <Image source={require('./res/icons/sett.png')} style={{
                   height:25,
                   width:25
               }}/>
            )
        }
    }
},{
    initialRouteName:'HomeScreen',
    contentComponent:props=><CustomDrawer {...props}/>,
    drawerOpenRoute:'DrawerOpen',
    drawerCloseRoute:'DrawerClose',
    drawerToggleRoute:'DrawerToggle',
    contentOptions:{
        activeTintColor: null
    }
})

const RootStack = StackNavigator({
  Drawer:{
      screen:Drawer,
      navigationOptions:{
          gesturesEnabled:false
      }
  },
  login:{
    screen:Login,
    navigationOptions:{
      gesturesEnabled: false
    }
  },
  loginStep2:{
    screen:LoginStep2,
    navigationOptions:{
      gesturesEnabled: false
    }
  },
  loginStep3:{
    screen:LoginStep3,
    navigationOptions:{
      gesturesEnabled: false
    }
  },
  loginStep4:{
    screen:LoginStep4,
    navigationOptions:{
      gesturesEnabled: false
    }
  },
  Signup:{
    screen:Signup,
    navigationOptions:{
      gesturesEnabled: false
    }
  },
  Notifications:{
      screen:Notifications,
      navigationOptions:{
          gesturesEnabled: false
      }
  },
  SignupOtp:{
    screen:SignupOtp,
    navigationOptions:{
      gesturesEnabled: false
    }
  },
  Profile:{
    screen:Profile,
    navigationOptions:{
      gesturesEnabled: false
    }
  },
  Terms:{
      screen:Terms,
      navigationOptions:{
          gesturesEnabled: false
      }
  },
  UserProfile:{
      screen:UserProfile,
      navigationOptions:{
          gesturesEnabled:false
      }
  },
  EditProfile:{
      screen:EditProfile,
      navigationOptions:{
          gesturesEnabled: false
      }
  },
  Chat:{
      screen:Chat,
      navigationOptions:{
          gesturesEnabled: false
      }
  },
  blockList:{
      screen:blockList,
      navigationOptions:{
          gesturesEnabled: false
      }
  }
}
,{
  initialRouteName:'login',
  headerMode:'none',
  navigationOptions: {
    headerVisible: false,
}
}
);

export default class App extends Component {
    constructor(props){
    super(props);
}


componentDidMount(){
// FCM.requestPermissions();

// FCM.getFCMToken().then((token) => {
//     console.log("TOKEN",token);
// });
FCM.requestPermissions();
    FCM.getFCMToken().then(token => {
      console.log("TOKEN (getFCMToken)", token);
    });
    
    // This method get all notification from server side.
    // FCM.getInitialNotification().then(notif => {
    //  alert( JSON.stringify(notif))
    // });
    
    // This method give received notifications to mobile to display.
    // this.notificationUnsubscribe = FCM.on(FCMEvent.Notification, notif => {
    //   alert(JSON.stringify(notif));

    //   if (notif && notif.local_notification) {
    //     return;
    //   }
    //   this.sendRemote(notif);
    // });
    
    // this method call when FCM token is update(FCM token update any time so will get updated token from this method)

}
sendRemote(notif) {
    console.log('send');
    FCM.presentLocalNotification({
      title: notif.title,
      body: notif.body,
      priority: "high",
      click_action: notif.click_action,
      show_in_foreground: true,
      local: true,
    });
  }

componentWillUnmount(){
    // this.refreshUnsubscribe();
    // this.notificationUnsubscribe();z
}
  render() {
    return (
      <Root>
        <RootStack/>
      </Root>
    );
  }
}