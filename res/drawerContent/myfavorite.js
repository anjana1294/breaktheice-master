import React,{Component} from 'react';
import {ActivityIndicator,Modal,StatusBar,View,Text,TouchableOpacity,AsyncStorage,FlatList,Image} from 'react-native';
import {Header,Container,Icon,Left,Body,Content,Title, Right} from 'native-base';
import Axios from 'axios';
import Entypo from 'react-native-vector-icons/Entypo';
import imoji from '../image/slicing/loc.png';
export default class Myfavorite extends Component{
    constructor(props){
        super(props);
        this.state = {
            name:this.props.navigation.state.params?this.props.navigation.state.params.name:"",
            count:0,
            token:null,
            data:[],
            activity:false
        }
    }
    componentWillMount(){
        AsyncStorage.getItem("@bti",(err,token)=>{
            this.setState({
                activity:true
            })
            if(token){
                Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                    params:{
                        function:'favouritesList',
                        token:token
                    }
                 })
                 .then((res)=>{
                     if(res.data.status){
                         this.setState({
                             data:res.data.data,
                             token:token,
                             activity:false
                         })
                     }
                 })
                 .catch((err)=>{
                     this.setState({
                         activity:false
                     })
                 })
            }
        })
        
    }
    render(){
        return(
            <Container contentContainerStyle={{
                flex:1
            }}>
                <Header  style={{
                    backgroundColor:'rgb(255,13,119)'
                }}>
                     <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />
                    <Left style={{
                        flex:1
                    }}>
                        <Icon name='menu' onPress={()=>this.props.navigation.navigate('DrawerOpen')} style={{
                            color:'white'
                        }}/>
                    </Left>
                <Body style={{
                    flex:1,
                    alignItems:'center'
                }}>
                        <Title style={{
                            color:'white',
                        }}>My favorites</Title>
                </Body>
                <Right style={{
                    flex:1
                }}/>
                </Header>
                <Content contentContainerStyle={{
                    flex:1
                }}>
                {!this.state.data?
                    <View style={{
                        flex:1,
                        justifyContent:'center',
                        alignItems:'center',
                        // backgroundColor:'red'
                    }}>
                        <Image source ={imoji} style={{
                            height:100,
                            width:100,
                        }}/>
                        <Text style={{
                            marginTop:20
                        }}>I added no favorites </Text>
                    </View>: null
                }
                    <FlatList
                    scrollEnabled={false}
                        data = {this.state.data}
                        renderItem = {
                            ({item}) =>
                            <View style={{
                                flexDirection:'row',
                                alignItems:'center',
                                justifyContent:'space-between',
                                backgroundColor:'white'
                            }}>
                                <TouchableOpacity style={{
                                    flexDirection:'column'
                                }}
                                    onPress={
                                        () => {
                                            Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                                                params:{
                                                    "function":'viewProfile',
                                                    "user_id":item.id,
                                                    "token":this.state.token
                                                }
                                            })
                                            .then((res)=>{
                                                if(res.data.status){
                                                    this.props.navigation.navigate('Profile',{
                                                        name:res.data.data.fname,
                                                        age:res.data.data.age,
                                                        country:res.data.data.country,
                                                        gender:res.data.data.gender,
                                                        user_id:item.id,
                                                        image:res.data.data.pic
                                                    })
                                                }
                                            })
                                        }
                                    }
                               >
                                    <Text style={{
                                        padding:10,
                                        color:'rgb(255,13,119)'
                                    }}>
                                        {item.fname+" "+item.lname}
                                    </Text>
                                    <Image source={{
                                        uri:item.pic
                                    }} style={{
                                        height:50,
                                        width:50,
                                        borderRadius:25,
                                        marginLeft:'10%'
                                    }}/>
                                </TouchableOpacity>
                                <TouchableOpacity
                                style={{
                                    backgroundColor:'white',
                                    width:60,
                                    alignItems:'center'
                                }} 
                                onPress={
                                    () => {
                                        let bodyFormData = new FormData();
                                        bodyFormData.append('to_user_id',item.id);
                                        bodyFormData.append('token',this.state.token);
                                        Axios({
                                            url:'http://profile.appsimity.com/breakice/webservices.php?function=removeFromFavourite',
                                            method:'post',
                                            data:bodyFormData                                            
                                        })
                                        .then((res)=>{
                                            alert('Added user removed from list');
                                            AsyncStorage.getItem("@bti",(err,token)=>{
                                                if(token){
                                                    Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                                                        params:{
                                                            "function":'favouritesList',
                                                            "token":token
                                                        }
                                                        
                                                     })
                                                     .then((res)=>{
                                                      
                                                         if(res.data.status){
                                                             this.setState({
                                                                 data:res.data.data,
                                                                 token:token
                                                             })
                                                         }
                                                     })
                                                }
                                            })
                                        })
                                    }
                                }>
                                    <Entypo name='cross' style={{
                                        fontSize:35,
                                        color:'red'
                                    }}/>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                </Content>
                {this.state.activity && (
                        <Modal transparent onRequestClose={()=>{}}>
                            <View style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                                <ActivityIndicator size='large' color='rgb(255,13,119)'/>
                            </View>
                        </Modal>
                    )}
            </Container>
        );
    }
}