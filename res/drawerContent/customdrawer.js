import React,{Component} from 'react';
import {Container,Header,Body} from 'native-base';
import {DrawerItems,NavigationActions} from 'react-navigation';
import {StatusBar,View,Text,TouchableOpacity,Image,AsyncStorage,ActivityIndicator,Modal} from 'react-native';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Axios from 'axios';
export default class CustomDrawer extends Component {
    constructor(props){
        super(props);
        this.state={
            name:null,
            image:'http://profile.appsimity.com/breakice/uploads/users/no_image.png',
            activity:false,
            notification:null,
            token:null
        }
    }
    componentDidMount(){
        console.log(this.state);
        AsyncStorage.getItem("@bti",(err,result)=>{
            if(result){
                if(this.state.name===null){
                    Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                        params:{
                            function:'getProfile',
                            token:result
                        }
                    })
                    .then((res)=>{
                        if(res.data.status){
                            this.setState({
                                name:res.data.data.fname+" "+res.data.data.lname,
                                image:res.data.data.pic,
                                token:result
                            })
                        } else{
                            console.log(res.data);
                        }
                    })
                    .catch((err)=>{
                       setTimeout(()=> alert(err),10)
                    })
                }
            }
        })
        console.log(this.state);
    }

    logout = ()=>{
        AsyncStorage.getItem("@bti",(err,token)=>{
            if(token){
                console.log(token);
                this.setState({
                    activity:true
                })
                Axios.get("http://profile.appsimity.com/breakice/webservices.php",{
                    params:{
                        function:'logout',
                        token:token
                    }
                })
                .then((res)=>{
                    console.log(res.data);
                    this.setState({
                        activity:false
                    })
                 if(res.data.status){
                    AsyncStorage.removeItem("@bti",()=>{
                            const resetAction = NavigationActions.reset({
                                index:0,
                                actions:[
                                    NavigationActions.navigate({routeName:'login'})
                                ]
                            })
                            this.props.navigation.dispatch(resetAction);
                        })
                    }
                })
                .catch((res)=>{
                    this.setState({
                        activity:false
                    })
                    setTimeout(()=>{
                        alert("Network issue")
                    },10)
                })
            }
        })
        // AsyncStorage.removeItem("@bti",()=>{
        //     const resetAction = NavigationActions.reset({
        //         index:0,
        //         actions:[
        //             NavigationActions.navigate({routeName:'login'})
        //         ]
        //     })
        //     this.props.navigation.dispatch(resetAction);
        // })
    }

  render() {
    return (
        <Container>
            <Header style={{height:responsiveHeight(15),
                    backgroundColor:'rgb(255,13,119)'}}>
                     <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />
                <Body>
                {this.state.activity && (
                <Modal transparent onRequestClose={()=>{}}>
                    <View style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                        <ActivityIndicator size='large' color='rgb(255,13,119)'/>
                    </View>
                </Modal>
            )}
                    <View style={{
                        flex:1,
                        flexDirection:'row',
                        alignItems:'center',
                        justifyContent:'space-between'
                    }}>
                        <View>
                            <Text style={{
                                color:'white',
                                fontWeight:'bold'
                            }}>Welcome </Text>
                            <Text style={{
                                fontWeight:'bold',
                                color:'white'
                            }}>{this.state.name}</Text>
                        </View>
                        <TouchableOpacity style={{marginLeft:'20%'}} onPress={()=>{
                            this.props.navigation.navigate('DrawerClose');
                            this.props.navigation.navigate('UserProfile');
                        }}>
                            <Image source={{
                                uri:this.state.image
                            }} style={{
                                height:50,
                                width:50,
                                borderRadius:25
                            }}/>
                        </TouchableOpacity>
                    </View> 
                </Body>
            </Header>
            <View style={{
                flex:1,
                justifyContent:'space-between'
            }}>
                <View>
                    <View style={{
                        position:'absolute',
                        marginTop:'20%',
                        marginLeft:'60%',
                        marginRight:'29%',
                        alignItems:'center',
                        borderRadius:20,
                        left:0,
                        right:0
                    }}>
                        <Text style={{
                            textAlign:'center',
                            padding:10,
                            color:'rgb(255,13,119)',
                            fontWeight:'bold'
                        }}>{this.state.notification}</Text>
                    </View>
                    <DrawerItems {...this.props} onItemPress = {
                        ({route,focused}) =>{
                            this.props.onItemPress({route,focused})
                            if(route.key==='Chatroom'){
                                // console.log("Chatroom")
                            }
                            else{
                                Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                                    params:{
                                        "function":'totalUnreadMessages',
                                        "token":this.state.token
                                    }
                                })
                                .then((res)=>{
                                    console.log(res.data)
                                    if(res.data.status){
                                        this.setState({
                                            notification:res.data.total_unread_messages
                                        })
                                    }
                                    else{
                                        this.setState({
                                            notification:null
                                        })
                                    }
                                })
                            }
                        }
                    }/>
                </View>
                <View style={{
                    borderTopWidth:1,
                    borderTopColor:'grey',
                    marginLeft:'2%',
                    marginRight:'2%',
                }}>
                    <TouchableOpacity onPress= { this.logout
                            }  style={{
                                flexDirection:'row',
                                marginBottom:'2%',
                                marginTop:'2%'
                            }}>
                        <SimpleLineIcons name="logout" size={25} style={{
                            marginLeft:'2%'
                        }}/>
                        <Text style={{
                            fontWeight:'bold',
                            paddingLeft:'15%'
                        }}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
    </Container>
    )
  }
};