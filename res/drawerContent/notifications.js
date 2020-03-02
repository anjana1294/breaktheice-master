import React,{Component} from 'react';
import {StatusBar,View,Text,FlatList,AsyncStorage,TouchableOpacity,Modal,ActivityIndicator,TouchableWithoutFeedback,Platform} from 'react-native';
import Axios from 'axios';
import {Header,Body,Icon,Left,Content,Container,Title,Right} from 'native-base';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
export default class Notification extends Component{
    constructor(props){
        super(props);
        this.state = {
            data:null,
            NotificationData:null,
            token:null,
            activity:false,
            rightDot:false
        }
    }
    componentDidMount(){
        this.setState({
            activity:true
        })
        AsyncStorage.getItem("@bti",(err,token)=>{
            Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                params:{
                    function:'notifications',
                    token:token
                }
            })
            .then((res)=>{
                // alert(JSON.stringify(res.data))
                // alert(res.data.status)
                if(res.data.status){
                    this.setState({
                        data:res.data.data,
                        token:token,
                        activity:false
                    })
                }
                else{
                    this.setState({
                        activity:false,
                        token:token
                    })
                }
            })
            .catch((err)=>{
                this.setState({
                    activity:false
                })
            })
        })
    }
    render(){
        return(
            <Container style={{
                backgroundColor:'rgb(255,255,255)',
                flex:1
            }}>
                <Header  style={{
                    backgroundColor:'rgb(255,13,119)'
                }}>
                 <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />
                    <Left style={{
                        flex:1
                    }}>
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()} style={{
                            width:40,
                            // backgroundColor:'white'
                        }}>
                            <Ionicons name='ios-arrow-back' 
                            style={{
                                color:'white',
                                fontSize:responsiveFontSize(3.5)
                            }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{
                        alignItems:'center',
                        flex:1
                    }}>
                            <Title style={{
                                color:'white'
                            }}>
                                Notifications
                            </Title>
                    </Body>
                    <Right style={{
                        flex:1
                    }}>
                            <TouchableOpacity onPress={
                                ()=>{
                                    this.setState({
                                        rightDot:!this.state.rightDot
                                    })
                                }
                            }>
                                <Entypo name='dots-three-vertical' style={{
                                    color:'white',
                                    fontSize:responsiveFontSize(2.5)
                                }}/>
                            </TouchableOpacity>
                    </Right>
                </Header>
                    {this.state.rightDot?
                            <Modal
                                transparent={true}
                                animationType='fade'
                                onRequestClose = {
                                    ()=>
                                        this.setState({
                                            rightDot:false
                                        })
                                    
                                }> 
                                 <TouchableWithoutFeedback onPress={()=>
                                        this.setState({
                                            rightDot:false
                                        })
                                    }>
                                    <View style={{
                                    flex:1,
                                    flexDirection:'row-reverse',
                                    marginTop:Platform.OS==='ios'?'22%':'13%'
                                    }}>
                                    
                                        <TouchableOpacity style={{
                                            backgroundColor:'red',
                                            height:30,
                                            justifyContent:'center',
                                            backgroundColor:'grey'
                                        }} onPress={
                                            ()=>{
                                                    this.setState({
                                                        rightDot:false
                                                    })
                                                    Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                                                        params:{
                                                            'function':'clearNotifications',
                                                            'token':this.state.token
                                                        }
                                                    })
                                                    .then((res)=>{
                                                        Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                                                        params:{
                                                            'function':'notifications',
                                                            'token':this.state.token
                                                        }
                                                    })
                                                    .then((res)=>{
                                                        if(res.data.status){
                                                            this.setState({
                                                                'data':res.data.data,
                                                                'token':this.state.token
                                                            })
                                                        }
                                                    })
                                                    })
                                                    
                                                }
                                        }>
                                            <Text>
                                                Clear Notifications
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableWithoutFeedback>
                            </Modal>:null
                    }
                    <View style={{
                        flexDirection:'column-reverse'
                    }}>
                    <FlatList
                    data = {this.state.data}
                    inverted={true}
                    renderItem={({item})=>
                        <TouchableOpacity onPress={
                            ()=>{
                                this.setState({
                                    activity:true
                                })
                                Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                                   params:{
                                       "function":"viewProfile",
                                       "user_id":item.user_id,
                                       "token":this.state.token
                                   }
                                })
                                .then((res)=>{
                                    this.setState({
                                        activity:false
                                    })
                                    // alert(JSON.stringify(res.data))
                                    if(res.data.status){
                                        this.props.navigation.navigate('Profile',{
                                            name:res.data.data.fname+' '+res.data.data.lname,
                                            age:res.data.data.age,
                                            country:res.data.data.country,
                                            gender:res.data.data.gender,
                                            user_id:item.user_id,
                                            image:res.data.data.pic
                                        })
                                    }
                                })
                                .catch((err)=> {
                                    this.setState({
                                        activity:false
                                    })
                                    setTimeout(()=>alert('Network issue'),10)
                                })
                            }
                        }
                        style={{
                            borderBottomWidth:0.2,
                            padding:10,
                            backgroundColor:'rgb(255,255,255)'
                        }}>
                            <View style={{
                                flexDirection:'row',
                                justifyContent:'space-between'
                            }}>
                                <Text style={{
                                    color:'rgb(255,13,119)'
                                }}>{item.fname}</Text>
                                <Text>{item.created}</Text>
                            </View>
                            
                            <Text>{item.message}</Text>
                        </TouchableOpacity>
                    }
                    />
                        {this.state.activity && (
                                <Modal transparent onRequestClose={()=>{}}>
                                    <View style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                                        {/* <View style={{
                                            backgroundColor:'white',
                                            // height:80,
                                            // width:80,
                                            justifyContent:'center'
                                        }}> */}
                                            <ActivityIndicator size='large' color='rgb(255,13,119)'/>
                                        {/* </View> */}
                                    </View>
                                </Modal>
                            )}
                    </View>
            </Container>
        );
    }
}