import React,{Component} from 'react';
import {TouchableOpacity,Text,View,AsyncStorage} from 'react-native';
import Axios from 'axios';
export default class Favorite extends Component{

    constructor(props){
        super(props);
        this.state={
            count:0,
            token:null
        }
    }
   
// componentWillUpdate(){
//  console.log("Hy");
//  console.log(this.state)
//  AsyncStorage.getItem('@bti',(err,result) =>
//         {
//             if(result){
//                 Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
//                     params:{
//                         function:'totalUnreadMessages',
//                         token:result
//                     }
//                 })
//                 .then((res)=>{
//                     console.log(res.data)
//                     if(res.data.status){
//                         if(this.state.count!==res.data.total_unread_messages){
//                             this.setState({
//                                 count:res.data.total_unread_messages,
//                                 token:result
//                             })
//                         }
//                     }
                    
//                 })
//             }
//         }
//     )

// }

// updateChatNotification =() =>{
//     Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
//                     params:{
//                         function:'totalUnreadMessages',
//                         token:this.state.token
//                     }
//                 })
//                 .then((res)=>{
//                     if(res.data.status){
//                         this.setState({
//                             count:res.data.total_unread_messages,
//                         })
//                     }
//                     else{
//                         this.setState({
//                             count:null
//                         })
//                     }
//                 })
// }


componentDidMount(){
    console.log("Bye Bye")
    AsyncStorage.getItem('@bti',(err,result) =>
        {
            if(result){
                Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                    params:{
                        function:'totalUnreadMessages',
                        token:result
                    }
                })
                .then((res)=>{
                    if(res.data.status){
                        this.setState({
                            count:res.data.total_unread_messages,
                            token:result
                        })
                    }
                    else{
                        // this.setState({
                        //     count:0
                        // })
                    }
                })
            }
        }
    )
}
    render(){
        // setTimeout(()=>{
        //     this.setState({
        //         count:this.state.count+1
        //     }),
        //     5000000
        // })
        return(
        <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            alignItems:'center',
            marginLeft:'5%',
            paddingVertical:10
        }}>
            <Text style={{
                color:'black',
                fontWeight:"500"
            }}>Chatroom</Text>
            </View>
        );
    }
}