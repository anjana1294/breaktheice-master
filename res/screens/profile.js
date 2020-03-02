import React, { Component } from 'react';
import {TextInput,ScrollView,ActivityIndicator,StatusBar,Alert,View,Text,StyleSheet,Image,TouchableOpacity,AsyncStorage,Modal,TouchableWithoutFeedback} from 'react-native';
import {responsiveFontSize,responsiveHeight,responsiveWidth} from 'react-native-responsive-dimensions';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Header,Left, Body, Title, Right } from 'native-base';
import Axios from 'axios';
import ResponsiveImage from 'react-native-responsive-image';
// import PhotoView from 'react-native-photo-view'
import Lightbox from 'react-native-lightbox';
export default class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            name:this.props.navigation.state.params?this.props.navigation.state.params.name:'John DOE',
            age:this.props.navigation.state.params?this.props.navigation.state.params.age:'40',
            country:this.props.navigation.state.params?this.props.navigation.state.params.country:'U.S.A',
            gender:this.props.navigation.state.params?this.props.navigation.state.params.gender:'male',
            image:this.props.navigation.state.params.image,
            request:false,
            token:null,
            lets_chat:false,
            blockOrAbuse:false,
            friend:false,
            promptVisible:false,
            activity:false,
            hobbies:null,
            description:null,
            age:null,
            reportAbusePrompt:false,
            reportAbusetext:""
        }
    }

    componentDidMount(){
        AsyncStorage.getItem("@bti",(err,result)=>{
            if(result){
                this.setState({
                    token:result
                })
                Axios.get("http://profile.appsimity.com/breakice/webservices.php",{
                    params:{
                     function:"viewProfile",
                     token:result,
                     user_id:this.props.navigation.state.params.user_id   
                    }
                })
                .then((res) => {
                    if(res.data.data.is_friend===true){
                        this.setState({
                            request:false,
                            lets_chat:true,
                            friend:true,
                            description:res.data.data.description,
                            hobbies:res.data.data.hobbies,
                            age:res.data.data.age
                        })
                    }
                    if(res.data.data.is_friend === 'pending'){
                        this.setState({
                            request:true,
                            lets_chat:false,
                            description:res.data.data.description,
                            hobbies:res.data.data.hobbies,
                            age:res.data.data.age
                        })
                    }
                    if(res.data.data.is_friend === 'request_already_sent'){
                        // yet to be done,some changes to be made
                       this.setState({
                           request:false,
                           lets_chat:true,
                           description:res.data.data.description,
                           hobbies:res.data.data.hobbies,
                           age:res.data.data.age
                       })
                    }
                    if(res.data.data.is_friend===false){
                        this.setState({
                            request:false,
                            lets_chat:true,
                            description:res.data.data.description,
                            hobbies:res.data.data.hobbies,
                            age:res.data.data.age
                        })
                    }
                })
            }
        })
    }
    goback(){
        return this.props.navigation.goBack();
    }
    openChat = () =>{
        this.setState({
            blockOrAbuse:false
        })
        AsyncStorage.getItem("@bti",(err,result)=>{
            if(result){
                Axios.get("http://profile.appsimity.com/breakice/webservices.php",{
                    params:{
                        function:"viewProfile",
                        token:result,
                        user_id:this.props.navigation.state.params.user_id
                    }
                })
                .then((res)=>{
                    if(!res.data.data.is_friend){
                        let bodyFormData = new FormData()
                        bodyFormData.append('token',result);
                        bodyFormData.append('user_id',this.props.navigation.state.params.user_id)
                        Axios({
                            url:"http://profile.appsimity.com/breakice/webservices.php?function=sendFriendRequest",
                            method:'post',
                            data:bodyFormData
                        })
                        .then((res)=>{
                            alert(res.data.message);
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                    }
                    if(res.data.data.is_friend===true){
                        this.props.navigation.navigate("Chat",{
                            user_id:this.props.navigation.state.params.user_id,
                            name:this.props.navigation.state.params.name   
                        });
                    }
                    if(res.data.data.is_friend === 'request_already_sent'){
                        alert("Your request is in pending")
                    }
                    // if(res.data.data.is_friend === 'pending'){}
                    
                })
                .catch((err)=>{
                    alert(err);
                })
            }
        })
  
    }

    openFavorite = () => {
        var bodyFormData = new FormData();
        bodyFormData.append('token',this.state.token);
        bodyFormData.append('to_user_id',this.props.navigation.state.params.user_id);
        Axios({
            url:'http://profile.appsimity.com/breakice/webservices.php?function=addToFavourite',
            method:'post',
            data:bodyFormData
        })
        .then((res)=>{
            alert(res.data.message)
        })
    }

    requestAccepted = () =>{
        Axios.get('http://profile.appsimity.com/breakice/webservices.php?function=sendFriendRequest',{
            params:{
                function:'responseToRequest',
                user_id:this.props.navigation.state.params.user_id,
                request_action:'accept',
                token:this.state.token
            }
        })
        .then((res)=>{
            setTimeout(()=>{
                alert("You have accpted the request")
            },10)
            this.setState({
                request:false
            })
        })
        .catch((err)=>{
            setTimeout(()=>{
                alert("network error")
            },10)
        })
    }

    requestRejected = () =>{
        Axios.get('http://profile.appsimity.com/breakice/webservices.php?function=sendFriendRequest',{
            params:{
                function:'responseToRequest',
                user_id:this.props.navigation.state.params.user_id,
                request_action:'reject',
                token:this.state.token
            }
        })
        .then((res)=>{
            setTimeout(()=>{
                alert("You have rejected the request")
            },10)
            this.setState({
                request:false
            })
        })
        .catch((err)=>{
            setTimeout(()=>{
                alert("network error")
            },10)
        })
    }
    
    render(){
        return(
                <View style={[styles.container,{
                    opacity:this.state.blockOrAbuse||this.state.reportAbusePrompt?0.6:null
                }
                ]}>
                    <Header style={{
                        backgroundColor:'rgb(253,0,90)',
                    }}>
                          <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />
                        <View style={{
                            alignItems:"center",
                            flexDirection:"row"
                        }}>
                            <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
                                <Ionicons name='ios-arrow-back' style={{
                                    fontSize:responsiveFontSize(3.5),
                                    color:"white",
                                    marginLeft:"5%"
                                }} />
                            </TouchableOpacity>
                            <Text style={{
                                color:"white",
                                fontSize:responsiveFontSize(2.8),
                                marginLeft:"5%"
                            }}>{this.state.name}</Text>
                        </View>
                        <Right>
                            <TouchableOpacity onPress={
                                ()=>{
                                    this.setState({
                                        blockOrAbuse:true
                                    })
                                }
                            }>
                                <Entypo name="dots-three-vertical" style={{
                                    fontSize:responsiveFontSize(2.5),
                                    color:'white'
                                }}/>
                            </TouchableOpacity>

                        </Right>   
                    </Header>
                    {this.state.reportAbusePrompt?
                    <Modal animationType='fade'
                    transparent ={true}
                    onRequestClose = {
                        () => {
                            this.setState({
                                reportAbusePrompt:false
                            })
                        }
                    }
                    >
                    <TouchableWithoutFeedback onPress={
                            ()=>
                                this.setState({
                                reportAbusePrompt:false
                            })
                    
                        } accessible={false}>
                        <View style={{
                            flex:1,
                            justifyContent:'center',
                            alignItems:'center',
                            
                        }}>
                            <View style={{
                                backgroundColor:'white',
                                height:150,
                                width:250,
                                justifyContent:'space-between',
                            }}>
                                <Text style={{
                                    textAlign:'center',
                                    fontSize:18,
                                    fontWeight:'bold'
                                }}>Type your message</Text>
                                <View style={{
                                    flex:1,
                                    alignItems:'center',
                                    // justifyContent:'center',
                                    height:50,
                                    marginHorizontal:10,
                                    backgroundColor:'grey'
                                }}>
                                    <TextInput
                                    style={{
                                        height:'100%',
                                        width:'100%'
                                    }}
                                    placeholder='enter your report'
                                    multiline
                                    onChangeText = {
                                        (t) => {
                                            this.setState({
                                                reportAbusetext:t
                                            })
                                        }
                                    }
                                    />
                                </View>
                                <View style={{
                                    flexDirection:'row',
                                    justifyContent:'space-around'
                                }}>
                                    <TouchableOpacity onPress={
                                        //here i need to implement the report abuse api
                                        () => {
                                            this.setState({
                                                reportAbusePrompt:false
                                            })
                                            Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                                                params:{
                                                    "function":'reportAbuse',
                                                    "token":this.state.token,
                                                    "user_id":this.props.navigation.state.params.user_id,
                                                    "reason":this.state.reportAbusetext
                                                }
                                            })
                                            .then((res)=>{
                                                alert(res.data.message)
                                            })
                                            .catch((err)=>{
                                                // alert(JSON.stringify(err))
                                            })
                                        }
                                    }>
                                        <Text style={{
                                            fontSize:18,
                                            fontWeight:'bold'
                                        }}>Submit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={
                                        () => {
                                            this.setState({
                                                reportAbusePrompt:false
                                            })
                                        }
                                    }>
                                        <Text style={{
                                            fontWeight:'bold',
                                            fontSize:18
                                            
                                        }}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                        </View>   
                    </TouchableWithoutFeedback>
                    </Modal>
                    :
                    null
                    }
                    {this.state.blockOrAbuse?
                    <Modal
                    animationType='fade'
                    transparent={true}
                    onRequestClose={
                        ()=>{
                            this.setState({
                                blockOrAbuse:false
                            })
                        }
                    }
                    >
                        <TouchableWithoutFeedback onPress={
                            ()=>
                                this.setState({
                                blockOrAbuse:false
                            })
                    
                        } accessible={false}>
                        <View style={{
                            flex:1,
                            justifyContent:'center',
                            alignItems:'center',
                            
                        }}>
                            <View style={{
                                borderWidth:0.5,
                                borderColor:'grey',
                                backgroundColor:'rgb(255,0,90)',
                                paddingVertical:5,
                                borderColor:'white'
                            }}>
                                <TouchableOpacity onPress={
                                    ()=>{
                                        this.setState({
                                            blockOrAbuse:false,
                                            reportAbusePrompt:true
                                        })
                                    }
                                } 
                                style={{
                                    // borderBottomWidth:0.3,
                                    borderColor:'grey'
                                }}>
                                    <Text style={{
                                        paddingRight:100,
                                        paddingLeft:20,
                                        paddingVertical:10,
                                        color:'white',
                                        fontSize:18,
                                        fontWeight:'bold'
                                      
                                    }}>Report Abuse</Text>
                                </TouchableOpacity>
                                
                                {this.state.friend?
                                <View>
                                <TouchableOpacity onPress={
                                    ()=>{
                                        this.setState({
                                            blockOrAbuse:false
                                        })
                                        setTimeout(() =>{
                                            Alert.alert('Block','Are You Sure?',[
                                                {text:'yes',onPress:()=>{
                                                    let bodyFormData = new FormData();
                                                    bodyFormData.append('token',this.state.token);
                                                    bodyFormData.append('to_user_id',this.props.navigation.state.params.user_id);
                                                    this.setState({
                                                        activity:true
                                                    })
                                                    Axios({
                                                        url:'http://profile.appsimity.com/breakice/webservices.php?function=addToBlock',
                                                        method:'post',
                                                        data:bodyFormData
                                                    })
                                                    .then((res)=>{
                                                        this.setState({
                                                            activity:false
                                                        })
                                                        setTimeout(()=>this.props.navigation.navigate('Drawer'),10)
                                                    })
                                                    .catch((res)=>{
                                                        this.setState({
                                                            activity:false
                                                        })
                                                        setTimeout(()=>alert("Network issues"),10)
                                                    })
                                                }},
                                                {text:'No'}
                                            ])
                                        },10)
                                    }
                                } 
                                style={{
                                    // borderBottomWidth:0.3,
                                    borderColor:'grey'
                                }}>
                                    <Text style={{
                                        paddingRight:100,
                                        paddingLeft:20,
                                        paddingVertical:10,
                                        color:'white',
                                        fontSize:18,
                                        fontWeight:'bold'
                                    }}>Block</Text>
                                </TouchableOpacity>
                                 <TouchableOpacity onPress={
                                    ()=>{
                                        this.setState({
                                            blockOrAbuse:false
                                        })
                                        setTimeout(()=>{
                                            Alert.alert('Unfriend','Are you Sure',[
                                                {text:'Yes',onPress:()=>{
                                                    let bodyFormData = new FormData();
                                                    bodyFormData.append('token',this.state.token);
                                                    bodyFormData.append('user_id',this.props.navigation.state.params.user_id);
                                                    Axios({
                                                        url:'http://profile.appsimity.com/breakice/webservices.php?function=unfriend',
                                                        data:bodyFormData,
                                                        method:'post'
                                                    })
                                                    .then((res)=>{
                                                        if(res.data.status){
                                                            alert("User unfriend successfully")
                                                        }
                                                    })
                                                }},
                                                {text:'No'}
                                            ])
                                        },10)
                                    }
                                } 
                                style={{
                                    // borderBottomWidth:0.3,
                                    borderColor:'grey'
                                }}>
                                    <Text style={{
                                        paddingLeft:20,
                                        paddingRight:100,
                                        paddingVertical:10,
                                        color:'white',
                                        fontSize:18,
                                        fontWeight:'bold'
                                    }}>Unfriend</Text>
                                </TouchableOpacity>
                                </View>:null
                                }
                               
                                <TouchableOpacity onPress={
                                    this.openChat
                                }>
                                    <Text style={{
                                        paddingLeft:20,
                                        paddingRight:100,
                                        paddingVertical:10,
                                        color:'white',
                                        fontSize:18,
                                        fontWeight:'bold'
                                    }}>
                                        Send Message
                                    </Text>
                                    
                                </TouchableOpacity>
                            </View>
                        </View>
                        </TouchableWithoutFeedback>
                    </Modal>:null
                    }
                    <ScrollView>
                    <View style={styles.mainContent}>
                        <View style={styles.image}>
                        <Lightbox>
                        <Image
                          style={{ height: 300 }}
                          source={{ uri: this.state.image }}
                        />
                      </Lightbox>
                        </View>
                        <View style={styles.content}>
                            <View style={styles.userStatus}>
                                <Text style={{
                                    color:'black',
                                    fontSize:responsiveFontSize(3)
                                }}>{this.state.name}</Text>
                                {/* <Text style={{
                                    color:'green'
                                }}>Online</Text> */}
                            </View>
                            <View style={styles.userAge}>
                                <Text style={{
                                    marginBottom:'2%',
                                    color:'black'
                                }}>{this.state.age} years old,{this.state.country} </Text>
                                <View style={{
                                    borderBottomWidth:1,
                                    borderColor:'grey'
                                }}></View>
                                <View style={{
                                        marginVertical:'2%',
                                        flexDirection:'row'
                                }}>
                                    {
                                    this.state.gender==='female'?
                                    <Ionicons name='ios-female' size={20} />:
                                    <Ionicons name='ios-male' size={20} /> }
                               
                                    <Text style={{
                                        marginLeft:'3%'
                                    }}>{this.state.gender}</Text>
                                </View>
                                <View style={{
                                    borderBottomWidth:1,
                                    borderColor:'grey'
                                }}></View>
                            </View>
                            <View style={styles.Description}>
                                <Text style={{
                                    color:'black'
                                }}>Description</Text>
                                <Text style={{
                                    textAlign:'justify'
                                }}>{this.state.description}</Text>
                            </View>
                            <View style={styles.Hobbies}>
                                <Text style={{
                                    color:'black',
                                    textAlign:'justify'
                                }}> Hobbies</Text>
                                <Text>{this.state.hobbies}</Text>
                            </View>
                            {(this.state.lets_chat)&&(
                                <View style={styles.icons}>
                                <TouchableOpacity style={{
                                    backgroundColor:'rgb(254,0,90)',
                                    width:'45%',
                                    paddingVertical:'2%',
                                    flexDirection:'row',
                                    justifyContent:'center'
                                }} onPress={this.openChat}>
                                    <Ionicons name='ios-chatbubbles-outline' size={20} style={{
                                        color:'white',
                                        marginRight:'4%'
                                    }}/>
                                    <Text style={{
                                        color:'white'
                                    }}>Let's Chat</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    backgroundColor:'rgb(254,0,90)',
                                    width:'45%',
                                    paddingVertical:'2%',
                                    flexDirection:'row',
                                    justifyContent:'center',
                                }} onPress={this.openFavorite}>
                                    <EvilIcons name='star' size={20} style={{
                                        color:'white',
                                        marginRight:'4%'
                                    }}/>
                                    <Text style={{
                                        color:'white'
                                    }}>Add to favorite</Text>
                                </TouchableOpacity>
                            </View>
                            )}
                            {(this.state.request)&&(
                                <View style={styles.icons}>
                                <TouchableOpacity style={{
                                    backgroundColor:'rgb(53,178,88)',
                                    width:'45%',
                                    paddingVertical:'2%',
                                    flexDirection:'row',
                                    justifyContent:'center'
                                }} onPress={this.requestAccepted}>
                                    <EvilIcons name='check' size={20} style={{
                                        color:'white',
                                        marginRight:'4%'
                                    }}/>
                                    <Text style={{
                                        color:'white'
                                    }}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    backgroundColor:'rgb(255,85,74)',
                                    width:'45%',
                                    paddingVertical:'2%',
                                    flexDirection:'row',
                                    justifyContent:'center',
                                }} onPress={this.requestRejected}>
                                <Feather name='x-circle' size={20} style={{
                                    color:'white',
                                    marginRight:'4%'
                                }}/>
                                    <Text style={{
                                        color:'white',
                                    }}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                            )}
                        </View>
                    </View>
                    </ScrollView>
                    {this.state.activity && (
                            <Modal transparent onRequestClose={()=>{}}>
                                <View style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                                    <ActivityIndicator size='large' color='rgb(255,13,119)'/>
                                </View>
                            </Modal>
                        )}
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    header:{
        flex:1,
        backgroundColor:'rgb(254,0,90)',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    mainContent:{
        flex:10,
        backgroundColor:'white',
        justifyContent:'space-between'
    },
    nameInHeader:{
       flexDirection:'row',
       marginLeft: '5%',
    },
    image:{
        flex:4,
    },
    content:{
        flex:6,
        margin: 10,
        justifyContent:'space-evenly'
    },
    userStatus:{
        marginTop: '5%',
        marginBottom: '2%',
    },
    Hobbies:{
        paddingVertical: '4%',
        justifyContent:'space-between',
    },
    icons:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
    Description:{
        paddingVertical: '4%',
        justifyContent:'space-between',
    }
})