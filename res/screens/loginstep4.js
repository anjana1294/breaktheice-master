import {responsiveFontSize,responsiveHeight, responsiveWidth} from 'react-native-responsive-dimensions';
import React ,{Component} from 'react';
import Dash from 'react-native-dash';
import {StatusBar,BackHandler,PermissionsAndroid,Text,TouchableOpacity,View,StyleSheet,Image, Dimensions,TextInput,KeyboardAvoidingView,Platform} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {NavigationActions } from 'react-navigation';
export default class LoginStep4 extends Component{
    constructor(props){
        super(props);
        this.state = {
            email:'email'
        }
    }


    async requestLocation(){
        try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              {
                'title': 'Location Permission',
                'message': 'You can use location'
              }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                // this.props.navigation.navigate('Drawer')
                this.props.navigation.dispatch(
                    NavigationActions.reset({
                        index:0,
                        actions:[
                            NavigationActions.navigate({
                                routeName:"Drawer"
                            })
                        ]
                    })
                )
            } else {
             this.requestLocation();
            }
          } catch (err) {
            console.warn(err)
          }
       }
    static navigationOptions = {
        header:null
    }
    openHome =()=>{
        if(Platform.OS==='ios'){
            this.props.navigation.navigate('Drawer');
        }
        else{
            this.requestLocation()
        }
        
    }
    
   

    componentWillUnmount(){
        // BackHandler.removeEventListener('hardBackPress');
        // return true
    }
    
    render()
    {
        let {height,width} = Dimensions.get('window');
        // alert(height+''+width);
        return(
            <View style={styles.container}  >
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
                        <Image source={require('../image/slicing/step4-top.png')}
                        style={{
                            marginTop:Platform.OS==='ios'?'2%':0,
                            height:height*(.14),
                            width:'50%',
                            resizeMode:'stretch'
                        }}
                        />
                    </View>

                </View>
                <View style={styles.middlebar}>
                        <View style={styles.locationView}>
                            <Image source={require('../image/slicing/loc.png')}
                            style={{
                                resizeMode:'stretch',
                                marginTop:'5%',
                                height:responsiveHeight(15),
                                width:responsiveWidth(25),
                                marginHorizontal:'34%'
                            }}
                            />
                            <Text style={{
                                marginTop:'2%',
                                marginHorizontal:'10%',
                                textAlign:'center',
                                color:'black',
                                fontSize:responsiveFontSize(2)
                            }}>Needs your location to continue</Text>
                           
                            <View style={{
                                flexDirection:'row',
                                alignItems:'center',
                                justifyContent:'center'
                            }}>
                                
                            <TouchableOpacity onPress={()=>{
                                this.props.navigation.navigate('login')
                            }}>
                                <Entypo name='chevron-small-left' size={35} style={{
                                    color:'rgb(255,78,128)',
                                    marginRight:'4%',
                                    marginTop:'20%'
                                }}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.openHome}>
                                <Image source ={require('../image/slicing/location.jpg')}
                                resizeMode='stretch'
                                style={{
                                    marginTop:'5%',
                                    marginRight:'5%',
                                    height:responsiveHeight(8),
                                    width:responsiveWidth(70)
                                }}
                                />
                            </TouchableOpacity>

                            </View>
                            
                            
                            
                                {/*
                                    <TouchableOpacity 
                                onPress = {this.openHome}
                                style={{
                                    borderColor:'rgb(255,78,128)',
                                    borderWidth:2,
                                    borderRadius:50,
                                    marginRight:'10%'
                                }}>
                                    <Text style={{
                                        color:'rgb(255,78,128)',
                                        textAlign:'center',
                                        paddingTop:'6%',
                                        paddingBottom:'6%',
                                        paddingLeft:'20%',
                                        paddingRight:'20%'
                                    }}>Select City Manually </Text>
                                </TouchableOpacity>
                                */}
                                
                        </View>
                </View>
                <View style={styles.footer}>
                <View style={{
                    justifyContent:'center',
                  flexDirection:'row-reverse',
               
                }}>
                 <Image source={require('../image/slicing/bti.png')}
                 style={{
                     height:height*(13.2/100),
                     width:'50%',
                     resizeMode:'stretch',
                     marginBottom:'20%',
                     marginTop:'5%',
                     alignItems:'center'
                 }}
                 />
                  <View style ={{
                      position:'absolute',
                      marginTop:Platform.OS=='ios'?'36%':'32%',
                      marginRight:'5%',
                  }}>
                    <Image source={require('../image/slicing/dots4.png')}
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
        backgroundColor: 'white'
    },
    topbar:{
        flex:2,
    },
    middlebar:{
        flex:7,
        justifyContent:'space-between'
    },
    footer:{
        flex:2,
        justifyContent:'space-around'
    },
    locationView:{
        backgroundColor:'white',
        flex:1,
        margin: '3%',
        borderRadius: 5,
        overflow:'hidden',
        justifyContent:'space-evenly'
    },
    loginData:{
        flex:5,
        padding:10,
        justifyContent:'space-around',
    }
})
