// +16107588391
import {responsiveFontSize, responsiveHeight,  responsiveWidth} from 'react-native-responsive-dimensions';
import React , {Component} from 'react';
import Axios from 'axios';
import { StatusBar,Keyboard,Text,TouchableWithoutFeedback, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator,  Dimensions, TextInput,  Platform,  Modal, BackHandler} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
export default class LoginStep2 extends Component{
    constructor(props){
        super(props);
        this.state ={
            phone_number:'', 
            isd_code:this.props.navigation.state.params.country_code, 
            email:'', 
            activity:false
        }
    }

    static navigationOptions = {
        header:null
    }

    // componentDidMount(){
    //     BackHandler.addEventListener('hardwareBackPress', () => {
    //         this.props.navigation.goBack();
    //     })
    // }
    // componentWillUnmount(){
    //     BackHandler.removeEventListener('hardwareBackPress', () => {
    //         return true;
    //     });
    // }

    setISD = (isd) => {
        this.setState({
            isd_code:isd
        }
    )
    }
    setPhoneNumber = (pho) => {
        this.setState({
            phone_number:pho
        },  console.log(pho)
    )
    }
    moveToStep2 = () => {
        this.props.navigation.navigate('loginStep2')
    }
    openStep3 = () => {
        // this.props.navigation.navigate('loginStep3');
        if((this.state.phone_number==='')){
            alert('Please Enter Your Phone Number');
            return false
        }
        this.setState({
            activity:true
        })
        Axios.get('http://profile.appsimity.com/breakice/webservices.php', {
            params:{
                function:'login', 
                email:this.props.navigation.state.params.email, 
                phone_number:this.state.phone_number
            } 
        })
        .then((res) => {
            if((res.data.status)){
                this.setState({
                    activity:false
                })
                this.props.navigation.navigate('loginStep3',{
                    email:this.props.navigation.state.params.email, 
                    phone_number:this.state.phone_number
                });
            }
            else{
                this.setState({
                    activity:false
                })
                setTimeout(() =>  alert("You have Enter Invalid Phone Number,Check Your Number and ISD Code"),  10);
                
            }
        })
        .catch((err) => {
            this.setState({
                activity:false
            })
            setTimeout(() => 
                alert("Network issues"), 10
            );
        })
    }
    render()
    {
        console.log(this.props.navigation.state.params.country_code);
        console.log(this.state);
        let {height, width} = Dimensions.get('window');
        // alert(height+''+width);
        return(
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} acessible={false}>
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
                            <Image source={require('../image/slicing/step2-top.png')}
                            style={{
                                height:height*(.14), 
                                width:'50%', 
                                resizeMode:'stretch', 
                                marginTop:Platform.OS==='ios'?'2%':0
                            }}
                            />
                        </View>

                    </View>
                    <View style={styles.middlebar}>
                        {this.state.activity && (
                            <Modal transparent onRequestClose={() => {}}>
                                <View style={{flex:1,  justifyContent:'center', alignItems:'center',  backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
                                    <ActivityIndicator size='large' color='rgb(255,13,119)'/>
                                </View>
                            </Modal>
                        )}
                        <View style={styles.VerificationScreen}>
                            <Image source={require('../image/slicing/verify.png')} style={{
                                height:responsiveHeight(15), 
                                marginTop:'5%', 
                                width:responsiveWidth(25), 
                                marginHorizontal:'33%', 
                                resizeMode:'stretch'
                            }}/>
                            <View style={{
                                marginTop:'2%', 
                            }}>
                                <Text style={{
                                    textAlign:'center', 
                                    color:'black', 
                                    fontSize:responsiveFontSize(3), 
                                    marginBottom:'1%'
                                }}>Verify your mobile number</Text>
                                <Text style={{
                                    color:'grey', 
                                    marginTop:'4%', 
                                    marginBottom:'2%', 
                                    marginLeft:'4%', 
                                    marginRight:'4%', 
                                    fontSize:responsiveFontSize(1.6)
                                }}>Please enter your phone number.
                                You will recieve a text message with your verification code.
                                </Text>
                            </View>
                            <View style={{
                                // backgroundColor:'red', 
                                height:responsiveHeight(5.5), 
                                marginHorizontal:'5%', 
                            }}>
                                <View style={{
                                    flex:1, 
                                    flexDirection:'row', 
                                }}>
                                    <View style={{
                                        width:'20%', 
                                        borderBottomWidth:1, 
                                        borderRightWidth:1, 
                                        borderBottomColor:'grey', 
                                        borderRightColor:'grey', 
                                        justifyContent: 'center',
                                    }}>
                                    <Text style={{fontSize:responsiveFontSize(1.4),textAlign:'center'}}>{this.state.isd_code}</Text>
                                    </View>
                                    <View style={{
                                        width:'80%', 
                                        borderBottomWidth:1, 
                                        borderBottomColor:'grey', 
                                        justifyContent:'center'
                                    }}>
                                        <TextInput value={this.state.phone_number} onChangeText={this.setPhoneNumber} placeholder='Your Phone Number' underlineColorAndroid='transparent' style={{
                                            fontSize:responsiveFontSize(1.4),
                                            marginLeft:'2%',
                                        }} maxLength={15} keyboardType='numeric'  />
                                
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                height:responsiveHeight(12), 
                        
                                flexDirection:'row', 
                                justifyContent:'flex-start', 
                                alignItems:'center', 
                                marginHorizontal:'15%', 
                            }}>
                                <TouchableOpacity onPress={() => {
                                    this.props.navigation.goBack();
                                }}>
                                    <Entypo name='chevron-small-left' size={30} style={{
                                        color:'rgb(255, 78, 128)', 
                                        marginRight:'4%'
                                    }}/>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                onPress = {this.openStep3}
                                style={{
                                    marginBottom:'10%', 
                                    marginTop:'10%', 
                                    borderColor:'rgb(255, 78, 128)', 
                                    borderWidth:2, 
                                    borderRadius:50, 
                                    marginRight:'10%'
                                }}>
                                    <Text style={{
                                        color:'rgb(255, 78, 128)', 
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
                    <Image source={require('../image/slicing/step3.png')}
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
                        marginTop:Platform.OS=='ios'?'36%':'32%', 
                        marginRight:'25%'
                    }}>
                        <Image source={require('../image/slicing/dots2.png')}
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
    VerificationScreen:{
        backgroundColor:'white', 
        flex:1, 
        margin: '3%', 
        borderRadius: 5, 
        justifyContent:'space-around', 
        overflow:'hidden', 
    }, 
    loginData:{
        flex:5, 
        padding:10, 
        justifyContent:'space-around', 
    }
})
