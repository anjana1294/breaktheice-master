import React,{Component} from 'react';
import {KeyboardAvoidingView,PermissionsAndroid,StatusBar,Platform,Image,View,Text,TouchableOpacity,FlatList,TextInput,AsyncStorage} from 'react-native';
import{Header,Left,Title, Right, Content,Footer} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import singleTick from '../icons/tic.png';
import Axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FCM,{FCMEvent} from 'react-native-fcm';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
// import Sound from 'react-native-sound';
// Sound.setCategory('Playback');
export default class Chat extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [
                
            ],
            message:null,
            name:this.props.navigation.state.params?this.props.navigation.state.params.name:"arjun",
            user_id:this.props.navigation.state.params?this.props.navigation.state.params.user_id:null,
            token:'',
            fcm:null,
            color:'',
            textColor:'',
            image:'',
            page:1,
            refreshing:false,
            bottomfocus:true
        }
    }
    makeChatRequest = ()=>{
        Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
            params:{
                function:'chatHistory',
                token:this.state.token,
                currentpage:this.state.page+1,
                user_id:this.state.user_id
            }
        })
        .then((res)=>{
         if(res.data.status){
             res.data.data.map((curr)=>{
                 if(curr.to_user_id===this.state.user_id){
                     this.setState({
                         data:[{key:curr.msg,color:'rgb(241,22,99)',date:curr.created,textColor:'white',image:singleTick,direction:'flex-end'},...this.state.data],
                         refreshing:false,
                         bottomfocus:false
                     })
                 }
                 else{
                     this.setState({
                         data:[{key:curr.msg,color:'rgb(255,215,228)',date:curr.created, image:null,textColor:'rgb(241,22,99)',direction:'flex-start'},...this.state.data],
                         refreshing:false,
                         bottomfocus:false
                     })
                 }
             })
             console.log(this.state.data);
         }
     })
     .catch((err)=>{
         console.log(err)
         this.setState({
             refreshing:false
         })
     })
 
    }
   handlerefresh = () =>{
       this.setState({
           refreshing:true,
           page:this.state.page+1,
           bottomfocus:false
       },this.makeChatRequest());
   }

  
 

    componentDidMount(){
        // var breakice = new Sound('glass.mp3',Sound.MAIN_BUNDLE,(err)=>{
        //     if(err){
        //         console.log(err)
        //     }
        // })
        AsyncStorage.getItem("@bti",(err,result)=>{
            if(result){
                this.setState({
                    token:result
                })
                Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                    params:{
                        function:'chatHistory',
                        token:result,
                        user_id:this.state.user_id,
                        currentpage:this.state.page
                    }
                })
                .then((res)=>{
                    if(res.data.status){
                        res.data.data.map((curr)=>{
                            if(curr.to_user_id===this.state.user_id){
                                this.setState({
                                    data:[{key:curr.msg,color:'rgb(241,22,99)',date:curr.created,textColor:'white',image:singleTick,direction:'flex-end'},...this.state.data]
                                }
                            )
                          
                            }
                            else{
                                this.setState({
                                    data:[{key:curr.msg,color:'rgb(255,215,228)',date:curr.created, image:null,textColor:'rgb(241,22,99)',direction:'flex-start'},...this.state.data]
                                }
                            )
                           
                            }
                            
                        })
                        console.log(JSON.stringify(this.state.data));
                    }
                })
            }
            
        })
        // FCM.getInitialNotification()
        //     .then((notif)=>{
        //     })
        
        FCM.on(FCMEvent.Notification,(notif)=>{
            
            // breakice.play((success)=>{
            //     if(success){
            //       console.log("it did play")
            //     }
            //     else{
            //         console.log("it didnt")
            //     }
            // })
            // alert(JSON.stringify(notif));
            let date = new Date()
            if(this.state.data.length===20){
                this.setState({
                    data:this.state.data.slice(10)
                })
            }
            {((Platform.OS==='android')&&(notif.user_id))?
            this.setState({
                data:[...this.state.data,{key:notif.fcm.body,color:'rgb(255,215,228)',date:date, image:null,textColor:'rgb(241,22,99)'}]
            }):null
            }
            {((Platform.OS==='ios')&&(notif.user_id))?
            this.setState({
                data:[...this.state.data,{key:notif.aps.alert.body,color:'rgb(255,215,228)',date:date, image:null,textColor:'rgb(241,22,99)'}]
            }):null
            }

        })
    }
    
    typedMessage =  (t) =>{
        console.log(this.state)
        this.setState({
            message:t,
            bottomfocus:true
        })
    }
    
    viewProfile = ()=>{
        Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
            params:{
                "function":"viewProfile",
                "token":this.state.token,
                "user_id":this.state.user_id
            }
         })
         .then((res)=>{
             this.props.navigation.navigate('Profile',{
                 name:res.data.data.fname+" "+res.data.data.lname,
                 age:res.data.data.age,
                 country:res.data.data.country,
                 gender:res.data.data.gender,
                 user_id:this.state.user_id,
                 image:res.data.data.pic
             })
         })
         .catch((err)=>{
             setTimeout(()=>alert(err),10)
            
         })

    }

    render(){
        // let breakice = new Sound('glass.mp3',Sound.MAIN_BUNDLE,(err)=>{
        //     if(err){
        //         console.log(err)
        //     }
        // })
        return(
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':null} keyboardVerticalOffset={
                Platform.select({
                   ios: () => 0,
                   android: () => null
                })()
              } style={{
                  flex:1
              }}>
              
            <View style={{
                flex:1
            }}>
                <Header  style={{
                    backgroundColor:'rgb(255,13,119)',
                }}>
                     <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />
                    <Left style={{
                        flexDirection:'row',
                        flex:1,
                        alignItems:'center'
                    }}>
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()} style={{
                            // backgroundColor:'white',
                            width:40
                        }}>
                            <Ionicons name='ios-arrow-back' 
                            style={{
                                color:'white',
                                fontSize:responsiveFontSize(3.5)
                            }} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            // backgroundColor:'white',
                            width:300,
                            alignItems:'flex-start'                            
                        }} onPress={this.viewProfile}>
                            <Title style={{
                                    color:'white',
                                    marginLeft:20,
                                    fontSize:20
                                }}>
                            {this.state.name}
                            </Title>
                        </TouchableOpacity>
                    </Left>
                    <Right/>
                </Header>
                <View style={{
                    flex:1,
                }}>
                       <FlatList
                      ref={'flatlist'}
                    //   onEndReached ={
                    //       ()=>{
                    //           alert("Hello")
                    //       }
                    //   }
                    // renderScrollComponent={props => <InvertedScroll {...props} inverted />}
                      refreshing={
                          this.state.refreshing
                      }
                      onRefresh={
                          this.handlerefresh
                      }

                    //   onEndReached ={
                    //       this.handlerefresh
                    //   }
                    //   onEndReachedThreshold={10}
                    //    refreshing
                    //    inverted
                       keyExtractor={
                           item=>item.created
                       }
                       ref={ref => this.flatList = ref}
                    onContentSizeChange={() => 
                        this.state.bottomfocus?
                        this.flatList.scrollToEnd({animated: true}):null}
                onLayout={() => this.state.bottomfocus?this.flatList.scrollToEnd({animated: true}):null}

                      
                    //   inverted={true}
                    //    style = {{
                    //        flexDirection:'column-reverse',
                    //        flex:1
                    //    }}
                       data = {
                           this.state.data
                       }
                    //    inverted
                        renderItem ={
                            ({item})=>
                                <View style={{
                                    // backgroundColor:'black',
                                    flex:1,
                                    flexDirection:'column-reverse'
                                    // justifyContent:'flex-end',
                                }}>
                                    <View style={{
                                        borderColor:'grey',
                                        marginVertical:5,
                                        marginHorizontal:10,
                                        flexDirection:'row',
                                        justifyContent:'space-between',
                                        alignItems:'center',
                                        flex:1,
                                        justifyContent:item.direction,
                                        // backgroundColor:'black',
                                         
                                    }}>
                                        <View style={{
                                            borderWidth:1,
                                            backgroundColor:item.color,
                                            borderRadius:20,
                                            maxWidth:250,
                                            flexDirection:'row',
                                            alignItems:'center'
                                        }}>
                                            <Text style={{
                                                color:item.textColor,
                                                padding:20,
                                                textAlign:'left',
                                            }}> {item.key}</Text>
                                        </View>
                                        </View>
                                        <View style={{
                                             borderColor:'grey',
                                            //  marginVertical:5,
                                             marginHorizontal:10,
                                             flexDirection:'row',
                                             justifyContent:'space-between',
                                             alignItems:'center',
                                             flex:1,
                                             justifyContent:item.direction,
                                            //  backgroundColor:'black',

                                        }}>
                                        <Image source ={item.image}
                                            style={{
                                                height:25,
                                                width:25
                                            }}
                                            />
                                        </View>
                                     </View>
                                   
                                 }
                       />
                       
                </View>
                <Footer style={{
                        //    flexDirection:'row',
                        //    borderTopWidth:1,
                           borderColor:'grey',
                        //    justifyContent:'space-around',
                           alignItems:'center',
                           backgroundColor:'white'
                        //    height:'10%'
                       }}>
                                 <TextInput underlineColorAndroid='transparent' placeholder='Type Message' style={{
                                    //  margin:Platform.OS==='android'?null:null,
                                     height:Platform.OS==='ios'?'100%':'100%',
                                     marginBottom:Platform.OS=='ios'?null:null,
                                     marginRight:'5%',
                                     width:'65%',
                                 }}
                                 multiline={true}
                                 onFocus ={
                                     () => this.setState({
                                         bottomfocus:true
                                     })
                                 }
                                  onChangeText={
                                     this.typedMessage
                                 } value={this.state.message}/>
                                 <TouchableOpacity onPress={()=>
                                 {
                                    let date = new Date();
                                    
                                        this.setState({
                                           data:[...this.state.data,{key:this.state.message,date:date,color:'rgb(241,22,99)',textColor:'white',image:null,direction: 'flex-end'}],
                                           message:null,
                                       })
                                    
                                    Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                                         params:{
                                            "function":"sendMsg",
                                            "user_id":this.state.user_id,
                                            "token":this.state.token,
                                            "msg":this.state.message
                                         }
                                     })
                                     .then((res)=>{
                                        if(this.state.data.length===20){
                                            this.setState({
                                                data:this.state.data.slice(10)
                                            })
                                        }
                                        if(this.state.data.length>50){
                                           this.setState({
                                               data:this.state.data.slice(40)
                                           })
                                       }
                                        //  let image;
                                        //  alert(JSON.stringify(this.state.data[this.state.data.length-1]dsqasd))
                                        //  this.setState({
                                        //      data:this.state.data[this.state.data.length-1].image=singleTick
                                        //  })
                                        // alert(this.state.data.length)
                                        // this.setState({
                                        //     data:this.state.data[this.state.length-1].image=singleTick
                                        // })
                                        let data = this.state.data;
                                        data[this.state.data.length-1].image = singleTick;
                                        // alert(JSON.stringify(data[this.state.data.length-1]))
                                        this.forceUpdate()
                                     })
                                     .catch((err)=>{
                                         alert(err)
                                         let data = this.state.data;
                                         data.pop();
                                         this.forceUpdate()
                                     })
                                 }
                                     
                                     
                                 }>
                                 {(this.state.message!==null)&&(<MaterialIcons name='send' style={{
                                    fontSize:25,
                                    color:'grey',
                                    wdith:100,
                                    marginRight:'10%'
                                }}/>)}
                            </TouchableOpacity>
                       </Footer>
            </View>
            </KeyboardAvoidingView>
        )
    }
}