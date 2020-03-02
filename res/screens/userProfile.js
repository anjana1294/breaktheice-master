import React, { Component } from 'react';
import {ScrollView,StatusBar,View,Text,StyleSheet,Image,TouchableOpacity,AsyncStorage,Modal,ActivityIndicator,Dimensions} from 'react-native';
import {responsiveFontSize,responsiveHeight,responsiveWidth} from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Header,Left, Body, Title, Right } from 'native-base';
import Axios from 'axios';
import editProfile from '../icons/editprofile.png';
import Lightbox from 'react-native-lightbox';
export default class UserProfile extends Component{
    constructor(props){
        super(props);
        this.state={
            activity:true,
            name:null,
            age:null,
            country:null,
            gender:'male',
            image:'https://www.google.co.in/imgres?imgurl=http%3A%2F%2Fwww.socialmediasearch.co.uk%2Fwp-content%2Fuploads%2F2014%2F12%2Fs5.jpg&imgrefurl=http%3A%2F%2Fwww.socialmediasearch.co.uk%2F2014%2F12%2Flinkedin-profile-pictures%2F&docid=FrlanzR6-oOD3M&tbnid=UTzTjd73W80GiM%3A&vet=10ahUKEwiItN_SmbrbAhWCro8KHe4hAisQMwgwKAAwAA..i&w=450&h=500&bih=571&biw=1200&q=no%20image%20profile%20picture&ved=0ahUKEwiItN_SmbrbAhWCro8KHe4hAisQMwgwKAAwAA&iact=mrc&uact=8',
            fname:null,
            lname:null,
            email:null,
            phone_number:null,
            hobbies:null,
            description:null,
            dob:null,
            country_id:null,
            phone_number:null
        }
    }
    static navigationOptions={
        header:null
    }
    
    componentDidMount(){
        AsyncStorage.getItem("@bti",(err,result)=>{
            console.log(result);
            if(result){
                if(this.state.name===null){
                this.setState({
                    activity:true,
                })
                Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                    params:{
                        function:'getProfile',
                        token:result
                    }
                })
                .then((res)=>{
                    if(res.data.status){
                        this.setState({
                            fname:res.data.data.fname,
                            name:res.data.data.fname + " " + res.data.data.lname,
                            gender:res.data.data.gender,
                            country:res.data.data.country,
                            age:res.data.data.age,
                            activity:false,
                            image:res.data.data.pic,
                            lname:res.data.data.lname,
                            email:res.data.data.email,
                            phone_number:res.data.data.phone_number,
                            description:res.data.data.description,
                            hobbies:res.data.data.hobbies,
                            dob:res.data.data.dob,
                            country_id:res.data.data.country_id,
                            phone_number:res.data.data.phone_number
                        })                       
                    }
                    console.log(res.data.data);
                })
                .catch((err)=>{
                    this.setState({
                        activity:false
                    })
                })
            }
            }
        })
       
    }
    openChat = () =>{
        this.props.navigation.navigate("Chatroom",{
            name:this.state.name
        })
    } 
    openFavorite = () => {
        this.props.navigation.navigate("Myfavorite",{
            name:this.state.name
        })
    }
    openEditProfile = () =>{
        this.props.navigation.navigate("EditProfile",{
            fname:this.state.fname,
            lname:this.state.lname,
            country:this.state.country,
            name:this.state.name,
            gender:this.state.gender,
            email:this.state.email,
            image:this.state.image,
            phone_number:this.state.phone_number,
            dob:this.state.dob,
            description:this.state.description,
            hobbies:this.state.hobbies,
            country_id:this.state.country_id,
            phone_number:this.state.phone_number
        });
    }
    render(){
        let {height,width} = Dimensions.get('window');
        return(
            <View style={styles.container}>
                <Header style={{
                    backgroundColor:'rgb(253,0,90)',
                }}>
                      <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />
                    <View style={{
                        alignItems:"center",
                        flexDirection:"row"
                    }}>
                        <TouchableOpacity onPress={()=>this.props.navigation.goBack()} style={{
                            // backgroundColor:'white',
                            width:40
                        }}>
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
                        {/* <Entypo name="dots-three-vertical" style={{
                            fontSize:responsiveFontSize(2.5),
                            color:'white'
                        }}/> */}
                    </Right>
                </Header>
                <ScrollView >
                    <View style={styles.image}>
                   {/*
                    <PhotoView
                    source={{uri: this.state.image}}
                    minimumZoomScale={ 1}
                    maximumZoomScale={3}
                    androidScaleType="center"
                    onLoad={() => console.log("Image loaded!")}
                    style={{width: 400, height: 300}} />
                  
                */} 
                <Lightbox >
                <Image
                  style={{ height: 300 }}
                  source={{ uri: this.state.image }}
                />
              </Lightbox>
                    </View>
                    <View style={styles.content}>
                        <View style={styles.userStatus}>
                            <View style={styles.name}>
                                <Text style={{
                                        color:'black',
                                        fontSize:responsiveFontSize(3)
                                    }}>{this.state.name}</Text>
                                <TouchableOpacity onPress={this.openEditProfile}>
                                    <Image source={editProfile} style={{
                                        height:50,
                                        width:50,
                                        resizeMode:'stretch',
                                    }}/>
                                </TouchableOpacity>
                               
                            </View>        
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
                                    <Ionicons name='ios-male' size={20} />
                                }
                               
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
                                color:'black',
                            }}>Description</Text>
                            <Text style={{
                                textAlign:'justify'
                            }}>{this.state.description}</Text>
                        </View>
                        <View style={styles.Hobbies}>
                            <Text style={{
                                color:'black',
                                textAlign:'justify'
                            }}>Hobbies</Text>
                            <Text>{this.state.hobbies}</Text>
                            
                        </View>
                        <View style={{
                            flex:1
                        }}></View>
                        
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
    name:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    container:{
        flex:1
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
        flex:1
    },
    content:{
        flex:6,
        margin: 10,
        justifyContent:'space-between'
    },
    userStatus:{
        marginTop: '5%',
        marginBottom: '2%',
    },
    Hobbies:{
        paddingVertical: '4%',
        justifyContent:'space-between'
    },
    icons:{
        flexDirection:'row',
        justifyContent:'space-between',
    },
    Description:{
        paddingVertical: '4%',
        justifyContent:'space-between'
    }
})