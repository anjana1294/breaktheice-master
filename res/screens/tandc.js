import React, { Component } from 'react';
import {StatusBar,View,Text,StyleSheet,FlatList,Modal,ActivityIndicator} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { Header,Left,Right,Body,Title} from 'native-base';
import Axios from 'axios';
export default class TermsandC extends Component {
    constructor(props){
        super(props);
        this.state = {
            tac:[
            ],
            activity:false
        }
    }
    componentDidMount(){
        this.setState({
            activity:true
        })
        Axios.get('http://profile.appsimity.com/breakice/webservices.php?function=tncs')
        .then((res) => {
            if(res.data.status){
                this.setState({
                    tac:res.data.data,
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
  render() {
    return (
        <View style={styles.container}>
        <Header  style={{
            backgroundColor:'rgb(255,13,119)',
        }}>
              <StatusBar backgroundColor='rgb(255,13,119)' barStyle="light-content" />
            <Left style={{
                flex:1
            }}>
                <Feather name='arrow-left' 
                onPress={()=>{this.props.navigation.goBack()}}
                style={{
                    fontSize:responsiveFontSize(3),
                    color:'white'
                }}/>
            </Left>
           <Body style={{
               flex:1,
               alignItems:'center'
           }}>
                <Title style={{
                    color:'white',
                }}>T&C</Title>
           </Body>
           <Right style={{
               flex:1
           }}/>
        </Header>     
            <View style={styles.container}>
            <FlatList
                        data={this.state.tac}
                        renderItem ={
                            ({item})=>
                            <View style={{
                                margin:20,
                                flex:1,
                            }}>
                                <Text style={{
                                    color:'black',
                                    marginBottom:10
                                }}>
                                    {item.title}
                                </Text>
                                <Text style={{
                                    color:'grey'
                                }}>
                                    {item.para}
                                </Text>
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
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
    },
 
    content:{
        flexDirection:'column-reverse',
        flex:11,
        marginHorizontal: '4%',
        marginVertical: '4%',
       justifyContent: 'space-evenly',
    }
})