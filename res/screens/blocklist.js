import React,{Component} from 'react';
import {ActivityIndicator,Modal,Text,View, StyleSheet,TouchableOpacity,StatusBar,AsyncStorage,FlatList,Alert} from 'react-native';
import {Header, Right,Left,Body, Title} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import Axios from 'axios';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
export default class BlockList extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            token:null,
            activity:false
        }
    }

    componentWillMount(){
        this.setState({
            activity:true
        })
        AsyncStorage.getItem('@bti',(err,token)=>{
            if(token){
                Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                params:{
                    function:'blocksList',
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
            <View style={styles.container}>
                <Header style={styles.headerStyle}>
                <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />
                    <Left style={{
                        flex:1
                    }}>
                        <TouchableOpacity onPress={
                            () =>{
                                this.props.navigation.goBack();
                            }
                        } style={{
                            
                            width:40
                        }}>
                            <Ionicons name='ios-arrow-back' style={{
                                fontSize:responsiveFontSize(3.5),
                                color:'white'
                            }} />
                        </TouchableOpacity>
                    </Left>
                    <Body style={{
                        flex:1,
                        alignItems:'center'
                    }}>
                        <Title style={{
                            color:'white',
                            
                        }}>Blocklist</Title>
                    </Body>
                    <Right style={{
                        flex:1
                    }}/>
                </Header>
                <View style={{
                    flex:1
                }}>
                    <FlatList
                    data = {this.state.data}
                    renderItem = {
                        ({item})=>
                        <View style={styles.allBlockList}>
                            <TouchableOpacity
                                style={styles.blockListView}
                            >
                                <Text>{item.fname}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{
                                Alert.alert('Unblock','Are you Sure',[
                                    {text:'Yes',onPress:()=>{
                                        let bodyFormData = new FormData();
                                        bodyFormData.append('token',this.state.token);
                                        bodyFormData.append('to_user_id',item.id);
                                        Axios({
                                            url:'http://profile.appsimity.com/breakice/webservices.php?function=removeFromBlock',
                                            method:'post',
                                            data:bodyFormData
                                        })
                                        .then((res)=>{
                                           if(res.data.status){
                                            Axios.get('http://profile.appsimity.com/breakice/webservices.php',{
                                                params:{
                                                    'function':'blocksList',
                                                    'token':this.state.token
                                                }
                                            })
                                            .then((res)=>{
                                                if(res.data.status){
                                                    this.setState({
                                                        data:res.data.data,
                                                    })
                                                }
                                            })
                                           }
                                        })
                                    }},
                                    {text:'No'}
                                ])
                            }}>
                                <Text>Unblock</Text>
                            </TouchableOpacity>
                        </View>
                    } 
                    />
                </View>
                {this.state.activity && (
                            <Modal transparent onRequestClose={()=>{}}>
                                <View style={{flex:1, justifyContent:'center',alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)'}}>
                                    <ActivityIndicator size='large' color='rgb(255,13,119)'/>
                                </View>
                            </Modal>
                        )}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    headerStyle:{
        backgroundColor:'rgb(255,13,119)'
    },
    allBlockList:{
        backgroundColor:'grey',
        borderBottomWidth:0.5,
        paddingVertical:10,
        flexDirection:'row',
        flex:1,
        justifyContent:'space-between',
        alignItems:'center'
    }
})