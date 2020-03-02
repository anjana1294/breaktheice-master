import {responsiveFontSize,responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import React ,{Component} from 'react';
import {StatusBar,AsyncStorage,ActivityIndicator,Modal,Text,TouchableOpacity,View,Keyboard,StyleSheet,Image, Dimensions,TextInput,KeyboardAvoidingView,Platform,TouchableWithoutFeedback} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import CodeInput from 'react-native-confirmation-code-input';
import Axios from 'axios';
export default class SignupOtp extends Component{
    constructor(props){
        super(props);
        this.state ={
            otp:'',
            activity:false
        }
    }

    static navigationOptions = {
        header:null
    }
    changeNumber = ()=>{
        this.props.navigation.navigate('Signup',{
            email:this.props.navigation.state.params.email,
            fname:this.props.navigation.state.params.fname,
            lname:this.props.navigation.state.params.lname,
            gender:this.props.navigation.state.params.gender,
            phone_number:'',
            country:this.props.navigation.state.params.country
        });
    }

    changeOTP = () =>{
        this.setState({
            activity:true
        })
        var otpForm = new FormData();
        otpForm.append('email',this.props.navigation.state.params.email);
        otpForm.append('phone_number',this.props.navigation.state.params.phone_number); 
        Axios({
            url:'http://profile.appsimity.com/breakice/webservices.php?function=resendOTPSignup',
            method:'post',
            data:otpForm
        }).then((res)=>{
            this.setState({
                activity:false
            })
            setTimeout(()=>alert(res.data.message),10)
        })
        .catch((err)=>{
            this.setState({
                activity:false
            })
            setTimeout(()=>alert("Network issue"),10)
        })
    }

    putOtp = (ot) =>{
        this.setState({
            otp:ot
        })
    }
    openStep4 = () =>{
        // this.props.navigation.navigate('loginStep4');
        this.setState({
            activity:true
        })
        if(this.state.otp ===''){
            this.setState({
                activity:false
            })
            setTimeout(()=>alert('please enter the OTP'),10)
            return false
        }
        
        bodyformdata = new FormData();
        bodyformdata.append('email',this.props.navigation.state.params.email);
        bodyformdata.append('phone_number',this.props.navigation.state.params.phone_number);
        bodyformdata.append('fname',this.props.navigation.state.params.fname);
        bodyformdata.append('lname',this.props.navigation.state.params.lname);
        bodyformdata.append('gender',this.props.navigation.state.params.gender);
        bodyformdata.append('country',this.props.navigation.state.params.country);
        bodyformdata.append('otp',this.state.otp);
        Axios({
            method:'post',
            url:'http://profile.appsimity.com/breakice/webservices.php?function=signup',
            data:bodyformdata
        }).then((res)=>{
            console.log(res)
            if(res.data.status){
                this.setState({
                    activity:false
                })
                AsyncStorage.setItem("@bti",res.data.token,()=>{
                    this.props.navigation.navigate('loginStep4');
                })
            }
            else{
                this.setState({
                    activity:false
                })
               setTimeout(()=>alert('Sorry wrong OTP'),10)
            }
        }    
        )
        .catch((err)=>{
            this.setState({
                activity:false
            })
            setTimeout(()=> alert('Sorry wrong OTP'),10)
        }
        )
    }
    render()
    {
        console.log(this.props.navigation.state.params);
        let {height,width} = Dimensions.get('window');
        // alert(height+''+width);
        return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} acessible={false}>
            
            <View style={styles.container}  >
            <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />
                {this.state.activity && (
                    <Modal transparent onRequestClose={()=>{}}>
                        <View style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                            <ActivityIndicator size='large' />
                        </View>
                    </Modal>
                )}
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
                        <Image source={require('../image/slicing/step3-top.png')}
                        style={{
                            height:height*(.14),
                            marginTop:Platform.OS==='ios'?'2%':0,
                            width:'50%',
                            resizeMode:'stretch'
                        }}
                        />
                    </View>

                </View>
                <View style={styles.middlebar}>
                {this.state.activity && (
                    <Modal transparent onRequestClose={()=>{}}>
                        <View style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                            <ActivityIndicator size='large' color='rgb(255,13,119)' />
                        </View>
                    </Modal>
                )}
                        <View style={styles.OtpScreen}>
                            <Image source={require('../image/slicing/otp.png')} style={{
                                height:responsiveHeight(15),
                                marginTop:'5%',
                                width:responsiveWidth(30),
                                marginHorizontal:'33%',
                                resizeMode:'stretch'
                            }}/>
                            <Text style={{
                                color:'black',
                                textAlign:'center',
                                fontSize:responsiveFontSize(3.5)
                            }}>OTP</Text>
                            <Text style={{
                                textAlign:'center',
                                marginHorizontal:'10%',
                                color:'grey',
                                fontSize:responsiveFontSize(1.8)
                            }}>
                                Please enter OTP that has been sent to your 
                                mobile number.
                            </Text>
                           {/* <CodeInput
                            containerStyle={{
                            }}
                            ref="otp"
                            onFulfill={this.data}
                            className='border-b'
                            codeLength={4}
                            size={18}
                            cellBorderWidth={1}
                            inactiveColor='black'
                            activeColor='black'
                            inputPosition='center'
                            autoFocus='true'
                        />*/}
                            <View style={{
                                height:responsiveHeight(5),
                                // borderBottomWidth:1,
                                marginLeft:'30%',
                                marginRight:'30%',

                            }}>
                                <TextInput onChangeText={this.putOtp} 
                                underlineColorAndroid='transparent'
                                style={{
                                    borderBottomWidth:1,
                                    fontSize:responsiveFontSize(1.2),
                                    textAlign:'center'
                                }} maxLength={4} keyboardType={Platform.OS==='ios'?'number-pad':'numeric'}
                                />
                                <Text style={{
                                    marginTop:'2%',
                                    color:'black',
                                    textAlign:'center',
                                    fontSize:responsiveFontSize(1.7)
                                }}>Didn't recieve OTP?</Text>
                            </View>
                           <View style={{
                               marginTop:'5%',
                               justifyContent:'space-evenly',
                               flexDirection:'row',
                               marginHorizontal:'10%'
                           }}>
                                <TouchableOpacity onPress={this.changeOTP}
                                style={{
                                    borderRadius:5,
                                    width:responsiveWidth(35),
                                    height:responsiveHeight(5),
                                    backgroundColor:'rgb(196,196,196)'
                                }}
                                >
                                    <Text style={{
                                        textAlign:'center',
                                        padding:'5%'
                                    }}>
                                        Resend OTP
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    borderRadius:5,
                                    width:responsiveWidth(35),
                                    height:responsiveHeight(5),
                                    backgroundColor:'rgb(255,0,98)'
                                }}
                                onPress={this.changeNumber}
                                >
                                    <Text style={{
                                        color:'white',
                                        textAlign:'center',
                                        padding:'5%'
                                    }}>
                                        Change Number
                                    </Text>
                                </TouchableOpacity>
                           </View>
                           <View style={{
                            height:responsiveHeight(12),
                    
                            flexDirection:'row',
                            justifyContent:'flex-start',
                            alignItems:'center',
                            marginHorizontal:'15%'
                        }}>
                            <TouchableOpacity onPress={()=>{
                                this.props.navigation.navigate('Signup')
                            }}>
                                <Entypo name='chevron-small-left' size={30} style={{
                                    color:'rgb(255,78,128)',
                                    marginRight:'4%'
                                }}/>
                            </TouchableOpacity>
                            <TouchableOpacity 
                            onPress = {this.openStep4}
                            style={{
                                borderColor:'rgb(255,78,128)',
                                borderWidth:2,
                                borderRadius:50,
                                marginRight:'10%'
                            }}>
                                <Text style={{
                                    color:'rgb(255,78,128)',
                                    paddingTop:'6%',
                                    paddingBottom:'6%',
                                    paddingLeft:'30%',
                                    paddingRight:'30%'
                                }}>Continue </Text>
                            </TouchableOpacity>
                        </View>

                        </View>
                </View>
                <View style={styles.footer}>
                    <View style={{
                        justifyContent:'space-between',
                    flexDirection:'row-reverse',
                
                    }}>
                        <Image source={require('../image/slicing/step4.png')}
                        style={{
                            height:height*(13.2/100),
                            width:'50%',
                            resizeMode:'stretch',
                            marginBottom:'20%',
                            marginTop:'5%'
                        }}
                        />
                        <View style ={{
                            position:'absolute',
                            marginTop:'32%',
                            marginRight:'25%'
                        }}>
                            <Image source={require('../image/slicing/dots3.png')}
                            style={{
                                height:10,
                                width:80
                            }}
                            />
                    </View>
                    </View>
                </View>
            </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: 'white'
    },
    topbar:{
        flex:2,
    },
    middlebar:{
        flex:7,
        justifyContent:'space-around'
    },
    footer:{
        flex:2,
        justifyContent:'space-around'
    },
    OtpScreen:{
        backgroundColor:'white',
        flex:1,
        margin: '3%',
        borderRadius: 5,
        overflow:'hidden',
        justifyContent:'space-around'
    },
    loginData:{
        flex:5,
        padding:10,
        justifyContent:'space-around',
    }
})



