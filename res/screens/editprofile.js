// Dont forget to uncomment the country_id 
// update phone_number is required
import React,{Component} from 'react';
import {ActivityIndicator,Modal,KeyboardAvoidingView,PermissionsAndroid,StatusBar,View,StyleSheet,Text,Image,TextInput,TouchableOpacity,Platform,ScrollView,FlatList,TouchableWithoutFeedback,Keyboard,AsyncStorage} from 'react-native';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Picker,Icon } from 'native-base';
import Axios from 'axios';
import PhotoUploader from 'react-native-photo-upload';
import Datepicker from 'react-native-datepicker';
import {NavigationActions} from 'react-navigation';
export default class EditProfile extends Component{
    constructor(props){
        super(props);
        this.state = {
            sex:'male',
            fname:this.props.navigation.state.params?this.props.navigation.state.params.fname:"John",
            // fnameEdit:null,
            lname:this.props.navigation.state.params?this.props.navigation.state.params.lname:"lname",
            // lnameEdit:null,
            country:this.props.navigation.state.params?this.props.navigation.state.params.country:"U.S.A",
            // countryEdit:null,
            name:this.props.navigation.state.params?this.props.navigation.state.params.name:"John",
            isd_code:null,
            // isd_codeEdit:null,
            email:this.props.navigation.state.params?this.props.navigation.state.params.email:'',
            // emailEdit:null,
            // email:this.props.navigation.state.params?this.props.navigation.state.params.email:"dummy@gmail.com",
            image:this.props.navigation.state.params.image,
            imageEdit:null,
            countryData:1,
            datareceive:false,
            phoneNumberResponse:'',
            iconResponse:false?'check':'x',
            token:null,
            emailResponse:'',
            colorEmail:'green',
            colorPhone:null,
            // phone_number:this.props.navigation.state.params?this.props.navigation.state.params.phone_number:'',
            phone_number:this.props.navigation.state.params?this.props.navigation.state.params.phone_number:"",
            emailDone:true,
            phoneDone:true,
            otpField:false,
            otp:null,
            hobbies:this.props.navigation.state.params?this.props.navigation.state.params.hobbies:"",
            description:this.props.navigation.state.params?this.props.navigation.state.params.description:"",
            changePhoneNumber:false,
            // descriptionEdit:null,
            // hobbiesEdit:null,
            dob:this.props.navigation.state.params?this.props.navigation.state.params.dob:"",
            country_id:this.props.navigation.state.params?this.props.navigation.state.params.country_id:"",
            activity:false
        }
    }
     async  requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              'title': 'Cool Photo App Camera Permission',
              'message': 'Cool Photo App needs access to your camera ' +
                         'so you can take awesome pictures.'
            }
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the camera")
          } else {
            console.log("Camera permission denied")
          }
        } catch (err) {
          console.warn(err)
        }
      }
    componentDidMount(){
        console.log(this.state)
        this.requestCameraPermission();
            AsyncStorage.getItem("@bti",(err,token) => {
                if(token){
                    this.setState({
                        token:token
                    })
                }
            } )
            Axios.get('http://profile.appsimity.com/breakice/webservices.php?function=getCountries')
            .then((res)=>{
                if(res.data.status){
                    console.log(res.data)
                    this.setState({
                        countryData:res.data.data,
                        datareceive:true
                    })
                }
            })
            Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                params:{
                    function:'getCountryPhoneCode',
                    id:this.state.country_id
                }
            }
        )
        .then((res)=>{
            this.setState({
                isd_code:"+"+res.data.data.phonecode
            })
        })
    }
    OTP = (otp) =>{
        this.setState({
            otp:otp
        },()=>{
            if(this.state.otp.length===4){
                this.setState({
                    activity:true
                })
                Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                    params:{
                        function:"changePhoneNumber",
                        phone_number:this.state.phone_number,
                        token:this.state.token,
                        otp:this.state.otp
                    }
                })
                .then((res)=>{
                    if(res.data.status){
                        this.setState({
                            phoneNumberResponse:"You can own this Phone no.",
                            otpField:false,
                            activity:false
                        })
                        setTimeout(()=> alert("You have successfully changed your number"),10)
                    }
                    else{
                        this.setState({
                            activity:false
                        })
                        setTimeout(()=>alert("Sorry you enter wrong otp"),10)
                    }
                })
                .catch((err)=>{
                    this.setState({
                        activity:false
                    })
                })
            }
        }
    )
        
    }
    selectedCountry = (value) => {
        console.log(value);
        Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
            params:{
                function:'getCountryPhoneCode',
                id:value,
            }
        }
    )
    .then((res)=>{
        this.setState({
            // country_id:value,
            isd_code:"+"+res.data.data.phonecode,
            country_id:value
        })
    })
        
    }
    update = () =>{
        var regex = /^[a-zA-Z ]{2,30}$/;
        if((!regex.test(this.state.fnameEdit))){
            alert("Enter valid first name");
            return false;
        }
        if(!regex.test(this.state.lname)||(!regex.test(this.state.lnameEdit))){
            alert("Enter valid last name");
            return false
        }
        emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(!emailregex.test(this.state.email)||(!regex.test(this.state.emailEdit))){
            alert("Enter valid email address");
            return false
        }
        // phoneregex = /^(?:[0-9] ?){6,14}[0-9]$/;
        // if(!phoneregex.test(this.state.phone_number)){
        //     alert("Enter valid phone number with country code");
        //     return false
        // }
        
        // if(!this.state.otpField){
        // var bodyFormData =  new FormData();
        // bodyFormData.append('phone_number',this.state.isd_code+this.state.phone_number);
        // bodyFormData.append('token',this.state.token);
        //     Axios({
        //         url:'http://profile.appsimity.com/breakice/webservices.php?function=sendotp',
        //         method:'post',
        //         data:bodyFormData
        //     })
        //     .then((res)=>{
        //         console.log(res);
        //         if(res.data.status){
        //             this.setState({
        //                 otpField:true
        //             })
        //         }
        //     })
        // }
            this.setState({
                activity:true
            })
            var bodyFormData1 = new FormData();
                bodyFormData1.append('fname',this.state.fname);
                bodyFormData1.append('lname',this.state.lname);
                bodyFormData1.append('description',this.state.description);
                // bodyFormData1.append('isd_code',this.state.isd_code);
                bodyFormData1.append('email',this.state.email);
                bodyFormData1.append('hobbies',this.state.hobbies)
                bodyFormData1.append('token',this.state.token); 
                bodyFormData1.append('dob',this.state.dob);
                bodyFormData1.append('country_id',this.state.country_id)
            if(this.state.imageEdit!==null){
                bodyFormData1.append('image',this.state.imageEdit)
            }
            Axios({
                url:'http://profile.appsimity.com/breakice/webservices.php?function=verifyupdateprofile',
                method:'post',
                data:bodyFormData1
            })
            .then((res)=>{
                console.log(res.data);
                if (res.data.status)
                {
                    AsyncStorage.removeItem("@bti");
                    AsyncStorage.setItem("@bti",res.data.token);
                   this.props.navigation.dispatch( NavigationActions.reset({
                    index:0,
                    actions:[
                        NavigationActions.navigate({
                            routeName:'Drawer'
                        })
                    ]
                }))
                    this.setState({
                        activity:false
                    })
                }
                else{
                    this.setState({
                        activity:false
                    })
                    setTimeout(()=>alert("Sorry"),10)
                }
            })
            .catch((res)=>{
                this.setState({
                    activity:false
                })
            })

    }

    description = (desc) =>{
        this.setState({
            description:desc
        })
    }

    phone_number = (phone) =>{
        var phoneregex = /^(?:[0-9] ?){9,15}[0-9]$/;
        if(!phoneregex.test(phone)){
            this.setState({
                phoneNumberResponse:'Phone Number is not valid',
                phone_number:phone,
                colorPhone:'red',
                phoneDone:false,
                otpField:false
            })
            return false
        }

        var bodyFormData = new FormData();
        bodyFormData.append('token',this.state.token);
        bodyFormData.append('phone_number',this.state.isd_code+phone);
       
        Axios({
            url:'http://profile.appsimity.com/breakice/webservices.php?function=checkphonenumber',
            method:'post',
            data:bodyFormData
        }).
        then((res)=>{
            console.log(res.data)
            if(res.data.status){
                this.setState({
                    phoneNumberResponse:res.data.message,
                    colorPhone:'green',
                    phoneDone:true,
                    otpField:true
                })
                Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                    params:{
                        "function":"sendotpChangePhoneNumber",
                        "token":this.state.token
                    }
                })
                .then((res)=>{
                    this.setState({
                        phoneNumberResponse:"Otp has sent to your previous number,Please enter"
                    })
                })
                .catch((err)=>{
                    alert(err)
                })
            }
            if(!res.data.status){
                this.setState({
                    phoneNumberResponse:res.data.message,
                    colorPhone:'red',
                    phoneDone:false,
                    otpField:false
                })
            }
        })
        this.setState({
            phone_number:phone,
            phoneNumberResponse:null
          })
 
    }

    fname = (fname) =>{
        this.setState({
            fname:fname
        })
    }

    lname = (lname) =>{
        this.setState({
            lname:lname
        })
    }

    country = (country) => {
        this.setState({
            country:country
        })
    }

    email = (email) => {
        var emailregex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if((email ==='')||(email ===' ')){
            this.setState({
                email:null
            })
            return false
        }
       this.setState({
           email:email
       })
        if(emailregex.test(this.state.email)){
            let bodyFormData = new FormData();
            bodyFormData.append('email',email);
            bodyFormData.append('token',this.state.token);
            Axios({
                url:'http://profile.appsimity.com/breakice/webservices.php?function=checkemail',
                method:'post', 
                data:bodyFormData
            })
            .then((res)=>{
                if(res.data.status){
                    this.setState({
                        email:email,
                        emailResponse:res.data.message,
                        colorEmail:"green",
                        emailDone:true
                    })
                }
                if(!res.data.status){
                    this.setState({
                        email:email,
                        emailResponse:res.data.message,
                        colorEmail:"red",
                        emailDone:false
                    })
                }
            })
        }    
        else{
            this.setState({
                email:email,
                emailResponse:'invalid',
                colorEmail:'red',
                emailDone:false
            })
        }
    }
    hobbies = (hobbies) =>{
        this.setState({
            hobbies:hobbies
        })
    }
    render(){
        console.log(this.state);
        return(
            <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':null} keyboardVerticalOffset={
                Platform.select({
                   ios: () => 10,
                   android: () => null
                })()
              } style={{
               flex:1
              }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} acessible={false}>
                <ScrollView contentContainerStyle={Platform.OS==='ios'?styles.container:null}>
                    <View style={styles.headerStyle}>
                    <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />                                                                        
                        <View style={styles.headerContent}>
                            <View style={styles.headerEditProfileBackButton}>
                                <TouchableOpacity  onPress={()=>{
                                    this.props.navigation.goBack();
                                }}>
                                <Ionicons name='ios-arrow-back'
                                style={{
                                color:'white',
                                fontSize:30,
                                }}/>
                                </TouchableOpacity>
                                <Text style={{
                                    color:'white',
                                    paddingLeft:10,
                                    fontWeight:'bold',
                                    fontSize:20
                                }}>Edit Profile</Text>
                            </View>
                            <View style={styles.headerProfile}>
                            <PhotoUploader onPhotoSelect={
                                (image)=>{
                                    this.setState({
                                        imageEdit:image
                                    })
                                }
                            }
                            onTapCustomButton ={
                                () => alert("hello")
                            }
                            quality={100}
                            >
                                <Image source={{
                                    uri:this.state.image
                                }} style={{
                                    height:100,
                                    width:100,
                                    borderRadius:50
                                }}/> 
                            </PhotoUploader>
                                <Text style={{
                                    marginTop:5,
                                    color:'white',
                                    fontSize:20,
                                }}>{this.state.name}</Text> 
                            </View>
                        </View>
                    </View>
                    <View style={styles.mainContent}>
                    {this.state.activity && (
                            <Modal transparent onRequestClose={()=>{}}>
                                <View style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                                    <ActivityIndicator size='large' color='rgb(255,13,119)'/>
                                </View>
                            </Modal>
                        )}
                        <View style={styles.inputMainContent}>
                            <View style={styles.Name}>
                                <View style={styles.fname}>
                                    <TextInput placeholder='First Name' underlineColorAndroid='transparent' onChangeText={this.fname} value={this.state.fname}/>
                                </View>
                                <View style={styles.lname}>
                                    <TextInput placeholder='Last Name' underlineColorAndroid='transparent' onChangeText={this.lname} value={this.state.lname}/>
                                </View>
                            </View>
                            <View style={styles.email}>
                                <TextInput placeholder='email' underlineColorAndroid='transparent' onChangeText={this.email} value={this.state.email}/>
                            </View>
                            {this.state.email!==null?<Text style={{
                                color:this.state.colorEmail
                            }}>{this.state.emailResponse}</Text>:null}
                            <View style={styles.Dob}>
                                <Text style={{
                                    marginBottom:5
                                }}>d.o.b</Text>
                                <Datepicker
                                confirmBtnText={'Done'}
                                cancelBtnText = {'Cancel'}
                                date = {this.state.dob}
                                onDateChange = {
                                    (date) =>{
                                        this.setState({
                                            dob:date
                                        })
                                    }
                                }
                                />
                            </View>
                            <View style={styles.country}>
                                <Picker
                                    mode='dropdown'
                                    placeholder='Select Your Country'
                                    iosHeader = "Select Your country"
                                    style={{
                                        backgroundColor:'white',
                                        width:'100%',
                                    
                                    }}
                                iosIcon={<Icon name="ios-arrow-down-outline" />}
                                onValueChange = {this.selectedCountry}
                                selectedValue={
                                    this.state.country_id
                                }
                                > 
                                {(this.state.datareceive)?this.state.countryData.map((curr,i)=>
                                    <Picker.Item label={curr.name} value={curr.id}/>
                                    ):null
                                }
                                </Picker>
                            </View>
                            <View style={styles.HobbiesContainer}>
                                <Text>Hobbies</Text>
                                <View  style={styles.hobbies}>
                                    <TextInput  placeholder='Your hobbies' editable={true} multiline
                                    maxLength={150}
                                    underlineColorAndroid='transparent'
                                    value={this.state.hobbies}
                                    onChangeText = {this.hobbies}
                                    />
                                </View>
                            </View>
                            <View style={styles.descriptionContainer}>
                                <Text>Description</Text>
                                <View style={styles.description}>
                                    <TextInput
                                        multiline editable maxLength={150}
                                        placeholder='Describe Yourself'
                                        value={this.state.description}
                                        underlineColorAndroid='transparent'
                                        onChangeText={this.description}
                                    />
                                </View>
                            </View>
                            <View style={styles.phoneNumber}>
                                {this.state.isd_code?<Text>{this.state.isd_code}</Text>:null}
                                <TextInput style={{
                                    width:100
                                }}placeholder='phone number' underlineColorAndroid='transparent' onChangeText={this.phone_number} value={this.state.phone_number} 
                                // editable={false}  
                                keyboardType='numeric'
                                />
                            </View>
                            {this.state.isd_code==null?<Text style={{
                                color:'red'
                            }}>Please Select Country to enter phone number</Text>:null}
                            {this.state.phoneNumberResponse?<Text style={{
                                textAlign:'center',
                                color:this.state.colorPhone
                            }}>{this.state.phoneNumberResponse}</Text>:null}
                            {this.state.otpField?
                                <View style={styles.Otp}>
                                    <TextInput placeholder='enter otp'
                                    maxLength={4}
                                    underlineColorAndroid='transparent'
                                    onChangeText={this.OTP}
                                     style={{
                                        color:'white',
                                        textAlign:'center'
                                    }} placeholderTextColor='white'/>
                                </View>
                                :null
                            }
                        </View>
                        {this.state.email!==null&&(this.state.emailResponse==='You can own this email.'||this.state.emailResponse==='')&&(this.state.phoneNumberResponse===''||this.state.phoneNumberResponse==='You can own this Phone no.')?
                        <View style={styles.uploadProfileSubmitButton} >
                        <TouchableOpacity onPress={this.update}  
                        style={{
                            borderWidth:2,
                            paddingHorizontal:60,
                            paddingVertical:20,
                            borderRadius:30,
                            borderColor:'rgb(241,22,98)'
                        }}>
                            <Text style={{
                                color:'rgb(241,22,98)'
                            }}>Update Profile</Text>
                        </TouchableOpacity>
                        </View>
                        :null
                        }
                        
                        <View style={{
                            marginBottom:20
                        }}/>
                    </View>
                </ScrollView>
                
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        )
    }
} 

const styles =  StyleSheet.create({
    container:{
        // flex:1,
        // justifyContent:'space-between',
    },
    headerStyle:{
        height:responsiveHeight(35),
        backgroundColor:'rgb(241,22,98)',
    },
    mainContent:{
        // flex:2,
        backgroundColor:'white',
        justifyContent:'space-between',
        flex:1
    },
    headerContent:{
        margin:15,
        flex:1,
        // backgroundColor:"white"
    },
    headerEditProfileBackButton:{
        flex:1,
        // backgroundColor:'blue',
        margin:Platform.OS==='ios'?10:null,
        flexDirection:'row',
        alignItems:'center',
        padding:Platform.OS==='ios'?5:null
        // backgroundColor:'white'
    },
    headerProfile:{
        flex:3,
        // backgroundColor:"purple",
        justifyContent:'space-between',
        alignItems:'center'
    },
    inputMainContent:{
        margin:15,
        // backgroundColor:'pink',
        
        // justifyContent:'space-around',
        // backgroundColor:'red',
    },
    uploadProfileSubmitButton:{
        flex:1
    },
    Name:{
        flexDirection:'row',
        marginVertical:10
    },
    lname:{
        flex:1,
        borderBottomWidth:1,
        padding:5,
        borderBottomColor:'grey'
    },
    Otp:{
        padding:5,
        borderWidth:1,
        marginHorizontal: '35%',
        backgroundColor:'rgb(241,22,98)',
        marginVertical:10
    },
    fname:{
        flex:1,
        borderBottomWidth:1,
        borderRightWidth:1,
        padding:5,
        borderBottomColor:'grey',
        borderRightColor:'grey'
    },
    email:{
        padding:5,
        borderBottomColor:'grey',
        borderBottomWidth:1
    },
    Dob:{
        paddingVertical:10,
        borderBottomColor:'grey',
        borderBottomWidth:1,
    },
    phoneNumber:{
        padding:5,
        borderBottomColor:'grey',
        borderBottomWidth:1,
        flexDirection:'row',
        alignItems: 'center'
    },
    country:{
        padding:5,
        borderBottomColor:'grey',
        borderBottomWidth:1
    },
    gender:{
        flexDirection:'row',
        marginVertical:5,
        alignItems:'center'
      
    },
    uploadProfileSubmitButton:{
        alignItems:'center',
        flex:1
    },
    phoneNumberResponse:{
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-evenly'
    },
    HobbiesContainer:{
        justifyContent:'space-between',
        marginVertical:10,
    },
    hobbies:{
        height:100,
        // backgroundColor:'grey',
        borderWidth:1,
        marginVertical:10,
        borderColor:'grey'
    },
    descriptionContainer:{
        justifyContent:'space-between',
        marginVertical:5
    },
    description:{
        height:100,
        // backgroundColor:'grey',
        marginVertical:5,
        borderWidth:1,
        borderColor:'grey'
    }
})