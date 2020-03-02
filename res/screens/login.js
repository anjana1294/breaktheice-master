import React ,{Component} from 'react';
import Axios from 'axios';
import {StatusBar,Modal,AsyncStorage,Text,TouchableOpacity,View,StyleSheet,Image, Dimensions,TextInput,KeyboardAvoidingView,Platform,ActivityIndicator} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import config from '../../config';
import {NavigationActions} from 'react-navigation';
import FCM,{FCMEvent} from 'react-native-fcm';
export default class Login extends Component{
    constructor(props){
        super(props);
        this.state ={
            email:'',
            activity: false,
            validation:'',
            validationColor:'black'
        }
    }
 
componentWillMount(){
    // FCM.getInitialNotification()
    // .then(notif=>{
    //     console.log(notif);
    //     if(notif.opened_from_tray){
    //         this.props.navigation.navigate('Drawer');
    //     }
    //     return;
    // })
    AsyncStorage.getItem("@bti",(err,result)=>{
        console.log(result);
        if(result){
            this.props.navigation.dispatch(
                NavigationActions.reset({
                    index:0,
                    actions:[
                        NavigationActions.navigate({
                            routeName:'Drawer'
                        })
                    ]
                })
            )
            // this.props.navigation.navigate('Drawer');
        }
    });
}

    static navigationOptions = {
        header:null
    }
    text = (t) =>{
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(t)){
            this.setState({
                validation:'Valid E-mail',
                validationColor:'green'
            })
        }else{
            this.setState({
                validation:'Invalid E-mail',
                validationColor:'red'
            })
        }
        this.setState({
            email:t
        });
    }
    signUp =()=>{
        this.props.navigation.navigate('Signup');
    }
   
    moveToStep2 = ()=>{
        if(this.state.email===''){
            alert('Please enter email');
            return false
        }
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(this.state.email)){
            return alert("Invalid email");
        };
        this.setState({
            activity: true,
        })
        Axios.get(config.backend_url,{
            params:{
                function:'login',
                email:this.state.email
            }
        })
        .then((resp)=>{
            console.log(resp.data)
            console.log(this.state.email)
            this.setState({
                activity:false
            })
                if(resp.data.status){
                    this.props.navigation.navigate('loginStep2',{
                        email:this.state.email,
                        country_code:resp.data.country_code
                    });
                }
                else{
                    this.setState({
                        activity:false
                    })
                    // setTimeout(() => alert(resp.data.message), 10);
                    setTimeout(()=>alert("You are not registered,Please Sign up."),10);
                }          
        })
        .catch((err)=>{
            this.setState({activity: false});
            setTimeout(()=>{
                alert("Network issues");
            },10)
        })      
    }
    
    render()
    {
        let {height,width} = Dimensions.get('window');
        // alert(height+''+width);
        return(
            <View style={styles.container} >
                  <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />
                <Image source={require('../image/02_login-background.jpg')} style={{
                    // resizeMode:Platform.OS==='ios'?'repeat':'stretch',
                    position:'absolute',
                    height:height,
                    width:width
                }}/>
                <View style={styles.topbar}>
                    <View style={{
                        marginVertical:'10%',
                        flexDirection:'row'
                    }}>
                        <Image source={require('../image/slicing/step1.png')}
                        style={{
                            height:Platform.OS==='ios'?height*.14:height*.14,
                            width:'50%',
                            resizeMode:'stretch',
                            marginTop:Platform.OS==='ios'?'2%':0
                        }}
                        />
                    </View>
                </View>
                <View style={styles.middlebar}>
                    <View style={styles.loginScreen}>
                
                        <View style={styles.loginData}>
                            <Text style={{
                                    textAlign:'center',
                                    marginHorizontal:'4%',
                                    fontSize:responsiveFontSize(4.8),
                                    marginTop:'10%',
                                    marginBottom:'5%',
                                    color:'rgb(255,78,128)',
                                    fontFamily:Platform.OS==='ios'?'HandyCheera':'Handycheera-by-Situjuh-Nazara'
                            }}>Breaking  the  Ice</Text>
                            <Text style={{
                                marginTop:'5%',
                                marginBottom:'10%',
                                color:'black',
                                fontSize:responsiveFontSize(2.5),
                                textAlign:'center',
                            }}> Hi! Welcome to Breaking the Ice</Text>
                           
                            <Text style={{
                                color:this.state.validationColor
                            }}>{this.state.validation}</Text>
                            <View style={{
                                borderBottomColor:'grey',
                                flexDirection:'row',
                                borderBottomColor:'grey',
                                borderBottomWidth: 1,
                                justifyContent:'flex-start',
                                alignItems:'center'
                            }}>
                                 <Ionicons name='ios-mail-outline'
                                    style={{fontSize: 25,
                                    }}
                                /> 
                              
                                <TextInput underlineColorAndroid='transparent'
                                autoCorrect={false}
                                onChangeText={this.text}
                                    style={{
                                        width: 500,
                                        paddingTop:10,
                                        marginLeft:'5%'
                                    }}
                                placeholder='Please tell us your email address'
                                value={this.state.email}
                                />
                             
                            </View>
                            <TouchableOpacity  style={{
                                marginVertical:30,
                                backgroundColor:'white',
                                justifyContent:'center',
                                marginHorizontal:30,
                                padding:20,
                                borderWidth:2,
                                borderColor:'rgb(255,78,128)',
                                borderRadius:50,
                                flexDirection:'row',
                            }} onPress={()=>{this.moveToStep2()}} 
                            >
                                <Text style={{
                                    color:'rgb(255,78,128)',
                                }}>Continue</Text>
                                <MaterialCommunityIcons name="login-variant" style={{fontSize: 20,marginLeft:'3%'}} color={'rgb(255,78,128)'}/>
                            </TouchableOpacity>
                            <View style={{flexDirection:'row',justifyContent:'center'}}>
                                <Text style={{
                                    textAlign:'center',
                                    marginBottom:'4%'
                                }}
                                >Don't have an account?</Text>
                                <TouchableOpacity onPress={this.signUp}>
                                    <Text
                                    style={{
                                        color:'rgb(255,78,128)'
                                    }}
                                    > Sign up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.footer}>
                        {this.state.activity && (
                            <Modal transparent onRequestClose={()=>{}}>
                                <View style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                                    <ActivityIndicator size='large' color='rgb(255,13,119)'/>
                                </View>
                            </Modal>
                        )}
                            <View style={{
                                overflow:'visible',
                                justifyContent:'space-between',
                              flexDirection:'row-reverse',
                      
                            }}>
                             <Image source={require('../image/slicing/step2.png')}
                             style={{
                                 height:height*.14,
                                 width:'50%',
                                 resizeMode:'stretch',
                                 marginBottom:'20%',
                                 marginTop:'5%'
                             }}
                             />
                              <View style ={{
                                  position:'absolute',
                                  marginTop:Platform.OS==='ios'?'36%':'32%',
                                  marginRight:'25%'
                              }}>
                                <Image source={require('../image/slicing/dots1.png')}
                                style={{
                                    height:10,
                                    width:80
                                }}
                                />
                              </View>
                            </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    topbar:{
        flex:2,
    },
    middlebar:{
        flex:6,
        overflow: 'hidden',
    },
    footer:{
        flex:2,
        justifyContent:'space-around',
        overflow:'hidden'
    },
    loginScreen:{
        backgroundColor:'white',
        flex:1,
        marginHorizontal: 15,
        borderRadius: 5,
        justifyContent:'space-around'
    },
    loginData:{
        flex:5,
        padding:10,
        justifyContent:'space-around',
    }
})