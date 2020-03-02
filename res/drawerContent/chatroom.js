import React,{Component} from 'react';
import {ActivityIndicator,Modal,Platform,TextInput,StatusBar,Image,View,Text,TouchableOpacity,FlatList,AsyncStorage,StyleSheet} from 'react-native';
import{Container,Header,Left,Body,Icon,Content,Title, Right} from 'native-base';
import tic from '../icons/tic.png';
import Axios from 'axios';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Swipeout from 'react-native-swipeout';
import cross from '../icons/cross.png';
import sadImoji from '../icons/sad.png';
import FCM,{FCMEvent} from 'react-native-fcm';    
export default class Chatroom extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [
            ],
            token:null,
            search:false,
            searchedData:[
            ],
            chatdelete:false,
            activity:false,
        }
    }
    typedMessage =  (t) =>{
        console.log(this.state)
        this.setState({
            message:t
        })
    }
 
   componentWillMount(){
      
       AsyncStorage.getItem('@bti',(err,token) => {
           this.setState({
               activity:true
           })
           if(token){
               console.log(token);
           }
           Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
            params:{
                function:'friendList',
                token:token
            }
        })
        .then((res)=>{
            console.log(res)
            if(res.data.status){
                console.log(res.data)
                this.setState({
                    data:res.data.data,
                    token:token,
                    activity:false
                })
            }
        })
        .catch((err)=>{
            this.setState({
                activity:false
            })
        })
        FCM.on(FCMEvent.Notification,(notif)=>{
            if(notif){
                Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                    params:{
                        function:'friendList',
                        token:token
                    }
                })
                .then((res)=>{
                    console.log(res)
                    if(res.data.status){
                        console.log(res.data)
                        this.setState({
                            data:res.data.data,
                            token:token,
                        })
                    }
                })
                .catch((err)=>{
                })
            }
        })
       })
       
       
   }
   
   search = (data) =>{
    var search_data =[];
       this.setState({
           searchedData:[]
       })
       if((data===null)||(data==='')||(!data)){
           this.setState({
               search:false
           })
       }
       else{
           this.setState({
               search:true,
           })
           this.state.data.map((item)=>{
               if(((item.fname+" "+item.lname).toUpperCase().includes(data.toUpperCase()))){
                 search_data.push(item)
               }
           })
           this.setState({
               searchedData:search_data
           })
       }
   }
    render(){

        // console.log(this.state);
        return(
            <Container>
                <Header  style={{
                    backgroundColor:'rgb(255,13,119)'
                }}>
                 <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />
                    <Left style={{
                        flex:1
                    }}>
                        <Icon name='menu' onPress={()=>this.props.navigation.navigate('DrawerOpen')}
                            style={{
                                color:'white'
                        }} />
                    </Left>
                    <Body style={{
                        flex:1,
                        alignItems:'center'
                    }}>
                        <Title style={{
                            color:'white',
                        }}>
                            Chats
                        </Title>
                    </Body>
                    <Right sytle={{
                        flex:1,
                    }}>
                    </Right>
                </Header>
                <Content contentContainerStyle={{
                    flex:1,
                }}>
                {this.state.data?<View style={{
                        paddingVertical :Platform.OS==='ios'?8:2,
                        backgroundColor:'rgb(249,237,241)',
                        alignItems:'center',
                        justifyContent:'center',
                        flexDirection:'row'
                    }}>
                        <EvilIcons name='search' style={{
                            fontSize:25,
                            color:'rgb(255,13,119)',
                        }}/>
                        <TextInput placeholder='Search for messages or users' placeholderTextColor='rgb(255,13,119)' underlineColorAndroid='transparent' style={{
                            width:'50%',
                            color:'rgb(255,13,119)'
                        }} onChangeText={this.search}/>
                    </View>:
                    <View style={{
                        alignItems:'center',
                        flex:1,
                        justifyContent:'center',
                        
                    }}>
                        <Image source={sadImoji} style={{
                            height:100,
                            width:100
                        }}/>
                        <Text style={{
                            marginTop:20
                        }}>Sorry no user found</Text>
                    </View>}
                    
                    {!this.state.search?
                    <FlatList
                    data = {this.state.data}
                    renderItem = {
                        ({item})=>
                        <Swipeout right={[{
                            component:<View  style={{
                                alignItems:'center',
                                justifyContent:'center',
                                flex:1,
                                backgroundColor:'rgb(253,85,89)'
                            }}><Image source={cross} style={{
                                height:20,
                                width:20
                            }}
                            /></View>,
                            onPress:()=>{
                                // alert(JSON.stringify(this.state.token))
                                Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                                    params:{
                                        "function":"DeleteChatHistory",
                                        "user_id":item.user_id,
                                        "token":this.state.token
                                    }
                                })
                                .then((res)=>{
                                    alert(JSON.stringify(res.data.message))
                                })
                                .catch((err)=>{
                                    alert("Something went wrong")
                                })
                                Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                                    params:{
                                        "function":'friendList',
                                        "token":this.state.token
                                    }
                                })
                                .then((res)=>{
                                    console.log(res)
                                    if(res.data.status){
                                        console.log(res.data)
                                        this.setState({
                                            "data":res.data.data,
                                            "token":this.state.token,
                                            
                                        })
                                    }
                                })
                                .catch((err)=>{
                                    this.setState({
                                        activity:false
                                    })
                                })

                            }
                        }] }  >
                            <TouchableOpacity style={[styles.friends,{
                                backgroundColor:item.is_read==='Y'?'white':'pink'
                            }]} onPress={
                                ()=>{
                                    this.props.navigation.navigate('Chat',{
                                        user_id:item.user_id,
                                        name:item.fname + " " + item.lname
                                    })
                                }
                            }>
                                <Image source={{
                                    uri:item.pic
                                }} style={{
                                    height:50,
                                    width:50,
                                    borderRadius:25
                                }}/>
                                <View style={styles.friendsDetail}>
                                    <Text style={{
                                        color:'rgb(255,13,119)'
                                    }}>{item.fname+" "+item.lname}</Text>
                                    <Text style={{
                                        color:'black'
                                    }}>{item.last_message}</Text>
                                </View>
                                {
                                    !this.state.chatdelete?
                                    <View style={styles.gender} onPress={
                                        ()=>{
                                            this.setState({
                                                chatdelete:true
                                            })
                                        }
                                    }>
                                        <Image source ={tic} style={{
                                            height:25,
                                            width:25
                                        }}/>
                                        <Entypo name='star' style={{
                                            fontSize:25,
                                            color:'rgb(255,13,119)'
                                        }}/>
                                    </View>:
                                    <TouchableOpacity style={styles.gender} onPress={
                                        ()=>{
                                            this.setState({
                                                chatdelete:false
                                            })
                                        }
                                    }>
                                        <Entypo name='cross' style={{
                                            fontSize:25
                                        }}/>
                                        
                                    </TouchableOpacity>
                                }
                                
                            </TouchableOpacity>
                        </Swipeout>
                    }
                />:  <FlatList
                data = {this.state.searchedData}
                renderItem = {
                    ({item})=>
                    <Swipeout right={this.rightButton}>
                    <TouchableOpacity style={[styles.friends,{
                        backgroundColor:item.is_read==='Y'?'white':'pink'
                    }]} onPress={
                        ()=>{
                            this.props.navigation.navigate('Chat',{
                                user_id:item.user_id,
                                name:item.fname + " " + item.lname
                            })
                        }
                    }>
                        <Image source={{
                            uri:item.pic
                        }} style={{
                            height:50,
                            width:50,
                            borderRadius:25
                        }}/>
                        <View style={styles.friendsDetail}>
                            <Text style={{
                                color:'rgb(255,13,119)'
                            }}>{item.fname+" "+item.lname}</Text>
                            <Text style={{
                                color:'black'
                            }}>{item.last_message} </Text>
                        </View>
                        <View style={styles.gender}>
                            
                            <Image source ={tic} style={{
                                height:25,
                                width:25
                            }}/>
                            <Entypo name='star' style={{
                                            fontSize:25,
                                            color:'rgb(255,13,119)'
                                        }} 
                                        />
                        </View>
                    </TouchableOpacity>
                    </Swipeout>
                }
            />
                    }
                    
                </Content>
                {this.state.activity && (
                        <Modal transparent onRequestClose={()=>{}}>
                            <View style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                                <ActivityIndicator size='large' color='rgb(255,13,119)'/>
                            </View>
                        </Modal>
                    )}
            </Container>
            
        );
    }
}

const styles = StyleSheet.create({
    friends:{
        flexDirection:'row',
        padding:10,
        borderBottomWidth:0.5,
        alignItems:'center',
    },
    friendsDetail:{
        flexDirection:'column',
        justifyContent:'space-between',
        flex:5,
        paddingLeft:10,
    },
    gender:{
        flex:1,
        flexDirection:'column'
    }
})

