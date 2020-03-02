import React,{Component} from 'react';
import {Text,StyleSheet,StatusBar,View,Image,AsyncStorage,BackHandler,TouchableOpacity,Modal,ActivityIndicator,Platform} from 'react-native';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import Axios from 'axios';
import{Header,Icon,Left, Right, Body,Title, Toast} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Geolocation from 'react-native-geolocation-service';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FCM,{FCMEvent} from 'react-native-fcm';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
Mapbox.setAccessToken('pk.eyJ1IjoiYXJqdW5zaW5naDE4IiwiYSI6ImNqZnYzanNvMjFuaXkycW55ZnluZWwzeHEifQ._QFddivq2yAvoJT79A9P5w');
export default class Home extends Component{
    constructor(props){
        super(props);
        this.state={
            latitude:null,
            longitude:null,
            error:null,
            curnav:true, //this will check that user location is used or not
            addresses:[],//this will store the manual search location in it
            array:0,
            searchbarVisibile:true,
            nearbyLocation:0,
            token:'',
            activity:false,
            watchId:null,
            myImage:'https://www.google.co.in/imgres?imgurl=http%3A%2F%2Fwww.socialmediasearch.co.uk%2Fwp-content%2Fuploads%2F2014%2F12%2Fs5.jpg&imgrefurl=http%3A%2F%2Fwww.socialmediasearch.co.uk%2F2014%2F12%2Flinkedin-profile-pictures%2F&docid=FrlanzR6-oOD3M&tbnid=UTzTjd73W80GiM%3A&vet=10ahUKEwiItN_SmbrbAhWCro8KHe4hAisQMwgwKAAwAA..i&w=450&h=500&bih=571&biw=1200&q=no%20image%20profile%20picture&ved=0ahUKEwiItN_SmbrbAhWCro8KHe4hAisQMwgwKAAwAA&iact=mrc&uact=8',
            myName:'',
            myGender:'',
            location:true,
            notification:null
        }
    }


callGetProfile = async(result) => 
{

   let data =await Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                    params:{
                        function:'getProfile',
                        token:result,
                    }
                })

                try {
                    if(data.data.status){
                        this.setState({
                            myImage:data.data.data.pic,
                            myGender:data.data.data.gender,
                            myName:data.data.data.fname+" "+data.data.data.lname,
                        })
                    }
                }
                catch(error){

                }
}

updateLatLog = async(bodyForm) => {

    let response = await Axios({
        url:'http://profile.appsimity.com/breakice/webservices.php?function=updateLongitudeLatitude',
        method:'post',
        data: bodyForm
    })
    try {
        console.log("lat log updated",response.data)
    }
    catch(error){
        console.log(error)
    }
}

getNearByUser = async() => {
    let res =  await Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
        params:{
            "function":"nearBy",
            "token":this.state.token,
            "log":this.state.latitude,
            "lat":this.state.longitude,
        }
    })

    try {
        if(res.data.data){
            console.log(res.data.data);
            this.setState({
                nearbyLocation:res.data.data
            })
            Toast.show({
             text:'Lets break the Ice.',
             type:'success',
             position:'bottom',
             buttonText:'Okay'
         })
         }
         else{
             Toast.show({
                 text:res.data.message,
                 type:'danger',
                 position:'bottom'
             })
         }
    }
    catch(error){
        console.log(error)
    }
    
}

componentWillMount() {
  
    FCM.on(FCMEvent.Notification, (notif)=>{
        {(Platform.OS==='ios')&&(notif.title==='New Request received')?
        this.setState({
            notification:1
        }):null}
        {(Platform.OS==='android')&&(notif.title==='New Request received')?
        this.setState({
            notification:1
        }):null}
  
       
    })
            AsyncStorage.getItem("@bti",(err,result)=>{
                if(result){
                    bodyForm.append('token',result);
                    token = result;
                    console.log(token)
                    this.callGetProfile(result)
                    
                }
            })
            var bodyForm = new FormData();
             Geolocation.getCurrentPosition(
            (position) => {
                bodyForm.append('longitude',position.coords.longitude);
                bodyForm.append('latitude',position.coords.latitude);

                this.updateLatLog(bodyForm)

                this.setState({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                error: null,
                token:token
                }, ()=> this.getNearByUser())
            },
            (error) => {
                this.setState({ error: error.message })
                },
            {enableHighAccuracy: false, timeout:  35000 ,maximumAge:10000 }
            // maximumAge: 1000
            );
        
        
}

 componentWillUnmount(){
     BackHandler.removeEventListener('hardwareBackPress');
     Geolocation.clearWatch(this.watchId)
 }
 scanAreaAgain = async() =>{
     this.setState({latitude:null,longitude:null},()=>this.componentWillMount())
 }
  
    render(){

        console.log(this.state);
        return(
                <View style={{flex: 1}}>
                    <Header style={{
                        backgroundColor:'rgb(255,13,119)'
                    }}>
                          <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />
                        <Left style={{
                            flex:1
                        }}>
                            <Icon name='menu' onPress={()=>this.props.navigation.navigate('DrawerOpen')} style={{
                                color:'white'
                            }} />
                        </Left>
                        <Body style={{
                            flex:1,
                            alignItems:'center'
                        }}>
                            <Title style={{
                                color:'white',
                                alignItems:'center',
                            }}>Home</Title>
                        </Body>
                        <Right style={{
                            flex:1,
                            flexDirection:'row',
                            alignItems:'center'
                        }}>
                            <TouchableOpacity onPress={
                                ()=> this.scanAreaAgain()
                            }>
                                <MaterialCommunityIcons name='reload' style={{
                                    color:'white',
                                    fontSize:30,
                                }}
                                />
                            </TouchableOpacity>
                             <TouchableOpacity onPress={()=>{
                                 this.setState({
                                     notification:null
                                 })
                                this.props.navigation.navigate('Notifications');
                            }}>
                                <Ionicons name='ios-notifications' style={{
                                    fontSize:30,
                                    color:'white'
                                }}/>
                                {this.state.notification?
                                <View style={{
                                    position:'absolute',
                                    backgroundColor:'rgb(255,13,119)',
                                    height:10,
                                    width:10,
                                    borderRadius:5,
                                    marginTop:5,
                                    marginLeft:5
                                }}/>:null}
                                
                                <Text style={{
                                    position:'absolute',
                                    color:'red',
                                    margin:'30%',
                                }}>{this.state.notification}</Text> 
                            </TouchableOpacity>
                        </Right>
                    </Header>
                    {this.state.latitude === null && this.state.longitude === null?
                        <View style={{
                            flex:1,
                            justifyContent:'center',
                            alignItems:'center'
                        }}>
                            <Image source={require('../icons/maploader.gif')} style={{
                                height:50,
                                width:50
                            }}/>
                        </View>
                        :
                        <View style={{flex:1}}>
                    
                            <Mapbox.MapView
                                                        // showUserLocation={true}
                            styleURL={Mapbox.StyleURL.Street}
                            zoomLevel={18}
                            centerCoordinate={[this.state.longitude, this.state.latitude]}
                            style={{flex:1}}
                            zoomEnabled
                          
                            >
                             <Mapbox.PointAnnotation
                                key='pointAnnotation'
                                id='pointAnnotation'
                                coordinate={[this.state.longitude, this.state.latitude]}>

                                <TouchableOpacity style={[styles.annotationContainer,{
                                    backgroundColor:'#2189F2'
                                }]} >
                                <Image source ={{
                                    uri:this.state.myImage
                                }} style={{
                                    height:20,
                                    width:20
                                }} style={[styles.annotationFill,]}/>
                                
                                </TouchableOpacity>
                                <Mapbox.Callout title={this.state.myName}  />
                            </Mapbox.PointAnnotation>
                                {(this.state.nearbyLocation!=0)&&(
                                    this.state.nearbyLocation.map((curr,next)=>
                                    <Mapbox.PointAnnotation
                                key={next+""}
                                id={next+""}
                                coordinate={[curr.features[0].geometry.coordinates[0], curr.features[0].geometry.coordinates[1]]}>

                                <TouchableOpacity style={[styles.annotationContainer,{backgroundColor:curr.features[0].properties.gender==='male'?'orange':'pink'}]} onPress={
                                        ()=>{
                                            this.setState({
                                                activity:true
                                            })
                                            Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                                               params:{
                                                   "function":"viewProfile",
                                                   "token":this.state.token,
                                                   "user_id":curr.features[0].properties.id
                                               }
                                            })
                                            .then((res)=>{
                                                this.setState({
                                                    activity:false
                                                })
                                                this.props.navigation.navigate('Profile',{
                                                    name:res.data.data.fname+" "+res.data.data.lname,
                                                    age:res.data.data.age,
                                                    country:res.data.data.country,
                                                    gender:res.data.data.gender,
                                                    user_id:curr.features[0].properties.id,
                                                    image:res.data.data.pic
                                                })
                                            })
                                            .catch((err)=>{
                                                setTimeout(()=>alert(err),10)
                                            })
                                        }
                                        }>
                                <Image source ={{
                                    uri:curr.features[0].properties.image
                                }} style={{
                                    height:20,
                                    width:20
                                }} style={styles.annotationFill}/>
                                
                                </TouchableOpacity>
                                <Mapbox.Callout title={curr.features[0].properties.fname+" "+curr.features[0].properties.lname}  />
                            </Mapbox.PointAnnotation>
                                )
                                )}
                            </Mapbox.MapView>

                        </View>
                    }   
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
    container: {
      flex: 1,
    },
    annotationContainer: {
      width: 45,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25,
      borderBottomLeftRadius:1,
      borderBottomRightRadius:30,
    },
    annotationFill: {
      width: 50,
      height: 50,
      borderRadius: 20,
      transform: [{ scale: 0.7 }],
    }
  });
