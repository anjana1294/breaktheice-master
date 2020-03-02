// +18623242939
import Axios from 'axios';
import React, {Component } from 'react';
import { Left,Body,Header,Title, Right } from 'native-base';
import Entypo from 'react-native-vector-icons/Entypo';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { StatusBar,Keyboard,TouchableWithoutFeedback,Modal,ActivityIndicator,View,Text,StyleSheet,Dimensions,Image,TextInput,TouchableOpacity,BackHandler,Platform } from 'react-native';
import {NavigationActions} from 'react-navigation';
import {Dropdown} from 'react-native-material-dropdown';

export default class Signup extends Component {
    constructor(props){
        super(props);
        this.state = {
            male:{
                image:require('../icons/maleon.png'),
            },
            female:{
                image:require('../icons/fmoff.png'),
            },
            gender:'male',
            email:'',
            fname:'',
            lname:'',
            phone_number:'',
            country:'',
            activity:false,
            apihit:true,
            CountryData:1,
            isdCode:'+1',
            isdApi:true,
            country_id:0
        }
    }
    static navigationOptions={
        header:null
    }
    componentWillMount(){
        if(this.props.navigation.state.params){
            this.setState({
                gender:this.props.navigation.state.params.gender,
                email:this.props.navigation.state.params.email,
                fname:this.props.navigation.state.params.fname,
                lname:this.props.navigation.state.params.lname,
                phone_number:this.props.navigation.state.params.phone_number,
                country:this.props.navigation.state.params.country  
            })
            return false
        }
    }
    email = (t)=>{
        this.setState({
            email:t
        })
    }
    fname = (t) => {
        this.setState({
            fname:t
        })
    }

    lname = (t) => {
        this.setState({
            lname:t
        })
    }

    phone_number = (t) => {
        this.setState({
            phone_number:t
        })
    }
    // country = (t) => {
    //     this.setState({
    //         country:t
    //     })
    // }
    selectMale = () => {
        this.setState({
            male:{
                image:require('../icons/maleon.png')
            },
            female:{
                image:require('../icons/fmoff.png')
            },
            gender:'male'
        })
    }

    selectFemale = ()=>{
        this.setState({
            male:{
                image:require('../icons/maleoff.png')
            },
            female:{
                image:require('../icons/fmon.png')
            },
            gender:'female'
        })
    }

   
    signUp = () =>{
        var regex = /^[a-zA-Z ]{2,30}$/;
        if(!regex.test(this.state.fname)){
            alert("Enter valid first name");
            return false;
        }

        
        if(!regex.test(this.state.lname)){
            alert("Enter valid last name");
            return false
        }

        emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!emailregex.test(this.state.email)){
            alert("Enter valid email address");
            return false
        }

        phoneregex = /^(?:[0-9] ?){6,14}[0-9]$/;
        if(!phoneregex.test(this.state.phone_number)){
            alert("Enter valid phone number");
            return false
        }
        if((this.state.email=='')||(this.state.fname=='')||
        (this.state.country=='')||(this.state.phone_number=='')||
        (this.state.lname=='')){
            alert("Please enter the missing fields");
            return false
        }
        var bodyFormData = new FormData();
        bodyFormData.append('email',this.state.email);
        bodyFormData.append('phone_number',this.state.phone_number);
        bodyFormData.append('fname',this.state.fname);
        bodyFormData.append('lname',this.state.lname);
        bodyFormData.append('gender',this.state.gender);
        bodyFormData.append('country',this.state.country);
        // bodyFormData.append('country_code',this.state.isdCode);
        bodyFormData.append('country_id',this.state.country_id)
        this.setState({activity:true});
        Axios({
            method:'post',
            url:'http://profile.appsimity.com/breakice/webservices.php?function=signup',
            data:bodyFormData
        })
        .then((res) => {
            // this will return true means user doesnt exits
            if(res.data.status){
                this.setState({
                    activity:false,
                    isdApi:false
                })
                this.props.navigation.navigate('SignupOtp',{
                    email:this.state.email,
                    phone_number:this.state.phone_number,
                    fname:this.state.fname,
                    lname:this.state.lname,
                    gender:this.state.gender,
                    country:this.state.country,
                })
            }
            else{
                // this will return false means user does exists
                this.setState({activity:false})
                setTimeout(()=>alert(res.data.message),10)
            }
        })
        .catch((err)=>{
            this.setState({activity:false})
            setTimeout(()=>alert("Something went wrong"),10)
        })
    }
  render()
   {
       console.log(this.state);
       if(this.state.apihit){ 
        //    console.log("OKOK")
            Axios.get('http://profile.appsimity.com/breakice/webservices.php?function=getCountries')
            .then((res)=>{
                if(res.data.status){
                    this.setState({
                        apihit:false,
                        CountryData:res.data.data
                    })
                }
            })
            // console.log(this.state);
        }
        // console.log(this.state);
      var country_name = [];
      var country_id = [];

      for(var i=0;i<this.state.CountryData.length;i++){
       country_name.push({value:this.state.CountryData[i].name,id:i});
 
      } 
        // console.log(country_name);
    //     if(this.state.isdApi){
    //     Axios.get('http://profile.appsimity.com/breakice/webservices.php?function=getCountrydetail',{
    //         params:{
    //             name:this.state.country
    //         }
    //     })
    //     .then((res)=>{
    //         if(res.data.status){
    //             this.setState({
    //                 isdCode:'+'+res.data.data.phonecode,
    //             })
    //         }
    //     })
    // }
      const img= '../icons/male.png';
      const resetAction = NavigationActions.reset({
        index:0,
        actions:[
            NavigationActions.navigate({routeName:'login'})
        ]
    })
      let {height,width} = Dimensions.get('window');
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} acessible={false}>
        <View style={styles.container}>
       
            {this.state.activity && (
                <Modal transparent onRequestClose={()=>{}}>
                    <View style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                        <ActivityIndicator size='large'   color='rgb(255,13,119)'/>
                    </View>
                </Modal>
            )}
            <Image source={require('../image/02_login-background.jpg')} style={{
                // resizeMode:Platform.OS==='ios'?'repeat':'stretch',
                position:'absolute',
                height:height,
                width:width
            }}/>
                <Header style={{
                    backgroundColor:'rgb(253,0,90)'
                }}>
                     <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />
                    <Left style={{
                        flex:1
                    }}><Entypo name='chevron-thin-left' size={25} style={{
                        color:'white'
                    }} onPress={()=>{
                        this.props.navigation.dispatch(resetAction);
                    }}/></Left>
                    <Body style={{
                        flex:1,
                        alignItems:'center'
                    }}>
                        <Title style={{
                            color:'white',
                        }}>
                            Sign Up
                        </Title>
                    </Body>
                    <Right style={{
                        flex:1
                    }}/>
                </Header>
            <View style={styles.main}>
                <View style={styles.signupContent}>
                    <View style={styles.form}>
                        <View style={styles.name}>
                            <View style={styles.firstName}>
                                <Text style={{color:'rgb(208,105,140)',fontWeight:'bold',fontSize:responsiveFontSize(1.5)}}>FIRST NAME*</Text>
                                <TextInput placeholder='Enter your first name' underlineColorAndroid='transparent'
                                autoCorrect={false} onChangeText={this.fname} value={this.state.fname}/>
                            </View>
                            <View style={styles.lastName}>
                                <Text style={{color:'rgb(208,105,140)',fontWeight:'bold',fontSize:responsiveFontSize(1.5)}}>LAST NAME*</Text>
                                <TextInput placeholder='Enter your last name' underlineColorAndroid='transparent'
                                autoCorrect={false} onChangeText={this.lname} value={this.state.lname}/>
                            </View>
                        </View>
                        <View style={styles.email}>
                            <Text style={{color:'rgb(208,105,140)',fontWeight:'bold',fontSize:responsiveFontSize(1.5)}}>E-MAIL ADDRESS*</Text>
                            <TextInput placeholder='Enter your email address' underlineColorAndroid='transparent'
                            autoCorrect={false} onChangeText={this.email} value={this.state.email}/>
                        </View>
                       
                        <View style={styles.country}>
                            <Text style={{color:'rgb(208,105,140)',fontWeight:'bold',fontSize:responsiveFontSize(1.5),marginTop:'3%'}}>COUNTRY*</Text>
                               <Dropdown data={country_name}  dropdownMargins={{min:4,max:6}} onChangeText={(key,t)=>{
                                   console.log(t+1);
                                this.setState({
                                    country:key,
                                    country_id:t+1
                                }) 
                                Axios.get('http://profile.appsimity.com/breakice/webservices.php?function=getCountrydetail',{
                                    params:{
                                        name:this.state.country
                                    }
                                })
                                .then((res)=>{
                                    if(res.data.status){
                                        this.setState({
                                            isdCode:'+'+res.data.data.phonecode,
                                        })
                                    }
                                })
                            }} style={{
                              
                            }} dropdownOffset={{
                                top:12,
                                left:3
                            }}/>
                            
                        </View>
                        <View style={styles.phone_number}>
                            <Text style={{color:'rgb(208,105,140)',fontWeight:'bold',
                                fontSize:responsiveFontSize(1.5)
                            }}>PHONE NUMBER*</Text>
                            <View style={{flexDirection:'row',
                                alignItems:'center',
                             }}>
                             <Text style={{marginRight:'3%'}}>{this.state.isdCode}</Text>
                             <View style={{width:'100%',height:'100%'}}>
                                <TextInput placeholder='Enter your phone number' underlineColorAndroid='transparent'
                                autoCorrect={false} onChangeText={this.phone_number} value={this.state.phone_number} maxLength={15}
                                keyboardType={'numeric'}
                                />
                            </View>    
                             </View>
                        </View>
                    </View>
                    <View style={styles.gender}>
                        <View style={styles.genderImage}>
                            <Text style={{textAlign:'center',color:'rgb(208,105,140)',fontWeight:'bold'}}>--Choose your gender--</Text>
                            <View style={{
                                flexDirection:'row',
                                justifyContent:'center',
                                marginTop:10
                            }}>
                                <TouchableOpacity onPress={this.selectMale}>
                                    <Image source={this.state.male.image} style={{
                                        width:100,
                                        height:100
                                    }}/>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.selectFemale}>
                                    <Image source={this.state.female.image} style={{
                                        width:100,
                                        height:100
                                    }}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.buttonView}>
                            <TouchableOpacity onPress={this.signUp} style={{
                                borderWidth:2,
                                borderRadius:20,
                                paddingLeft:90,
                                paddingRight:90,
                                paddingTop:10,
                                paddingBottom:10,
                                borderColor:'rgb(208,105,140)'
                            }}>
                                <Text style={{
                                    color:'rgb(208,105,140)'
                                }}>Continue</Text>
                            </TouchableOpacity>
                            <View>
                                <Text>By creating an account you agree to our</Text>
                                <TouchableOpacity onPress={()=>{
                                    this.props.navigation.navigate('Terms')
                                }}>
                                    <Text style={{
                                        color:'rgb(255,78,128)',
                                        textAlign:'center'
                                    }}>terms and conditions</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
        </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    main:{
        flex:1,
    },
    signupContent:{
        flex:1,
        margin: 18,
        padding: 10,
        borderRadius: 5,
        backgroundColor:'white'
    },
    form:{
        flex:6,
        justifyContent:'space-around'
    },
    gender:{
        flex:6,
        marginTop: '2%',
    },
    name:{
        flex:1,
        flexDirection:'row',
        borderBottomWidth:0.5,
        borderBottomColor: 'grey',
    },
    lastName:{
        flex:1,
        justifyContent:Platform.OS==='ios'?'space-around':null,
        paddingLeft:10
    
    },
    firstName:{
        flex:1,
        borderRightWidth: 0.5,
        borderRightColor:'grey',
        justifyContent:Platform.OS==='ios'?'space-around':null
    },
    email:{
        flex:1,
        borderBottomWidth:0.5,
        borderBottomColor:'grey',
        justifyContent:Platform.OS==='ios'?'space-evenly':null
    },
    phone_number:{
        flex:1,
        borderBottomWidth:0.5,
        borderBottomColor:'grey',
        justifyContent:Platform.OS==='ios'?'space-evenly':null
    },
    country:{
        flex:1,
        borderBottomWidth:Platform.OS==='ios'?0:0,
        justifyContent:Platform.OS==='ios'?'space-evenly':null,
    },
    genderImage:{
        flex:6,
        margin: 10,
        // backgroundColor:'red'
    },
    buttonView:{
        flex:4,
        // backgroundColor:'purple',
        justifyContent:'space-around',
        alignItems: 'center',
    }
})